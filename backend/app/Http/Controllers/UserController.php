<?php

namespace App\Http\Controllers;

use App\Mail\Email;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Import Rule class for validation
use Illuminate\Support\Facades\Validator; // Import Validator class for validation
use App\Models\User;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\PasswordReset;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = new User();
    }

    public function getUsers()
    {
        return $this->user->all();
    }
    public function getTotalAccounts()
    {
        $totalAccounts =  User::count();
        $totalBooks = Book::count();
        return response()->json(['totalAccounts' => $totalAccounts, 'totalBooks' => $totalBooks]);
    }
    public function todayRegisteredUsersCount()
    {
        $today = Carbon::now()->toDateString();
        $count = User::whereDate('created_at', $today)->count();
        return response()->json(['count' => $count]);
    }
    public function todayRegisteredBooksCount()
    {
        $today = Carbon::now()->toDateString();
        $count = Book::whereDate('created_at', $today)->count();
        return response()->json(['count' => $count]);
    }
    public function store(Request $request)
    {
        // Check if an existing user with the provided email and deactivated status exists
        $existingDeactivatedUser = User::where('email', $request->email)->where('status', 'deactivated')->first();

        // Check if an existing user with the provided email and active status exists
        $existingActiveUser = User::where('email', $request->email)->where('status', 'active')->first();

        if ($existingActiveUser) {
            // If an active user with the provided email exists, return an error response
            return response()->json([
                'success' => false,
                'message' => 'A user with this email already exists and is active.',
            ], 422);
        }

        if ($existingDeactivatedUser) {
            // If a deactivated user with the provided email exists, create a new account using the same email
            $userData = $request->only(['firstname', 'middlename', 'lastname', 'email', 'contact', 'password', 'role']);

            // Create new user without validation
            $user = User::create($userData);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user,
            ]);
        }

        // If no deactivated user with the provided email exists and there's no active user, perform the regular validation

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|regex:/^[a-zA-Z\s\-\.]+$/|max:255',
            'middlename' => 'nullable|regex:/^[a-zA-Z\.]*$/|max:255',
            'lastname' => 'required|regex:/^[a-zA-Z\s\-\.]+$/|max:255',
            'email' => 'required|email|max:255|unique:users',
            'contact' => ['string', 'regex:/^09\d{9}$/', 'max:11'], // Regular expression for Philippine number starting with 09
            'password' => 'required|string|min:8',
            'confirm_password' => 'required|string|same:password',
            'role' => ['required', Rule::in(['Admin', 'Borrower', 'Librarian'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Only include fields that should be stored in the database
        $userData = $request->only(['firstname', 'middlename', 'lastname', 'email', 'contact', 'password', 'role']);

        // Create new user
        $user = User::create($userData);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user,
        ]);
    }
    public function show(string $id)
    {
        $user = $this->user->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function updateUser(Request $request, string $id)
    {
        $user = $this->user->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|regex:/^[a-zA-Z\s\-\.]+$/|max:255',
            'middlename' => 'nullable|regex:/^[a-zA-Z\.]*$/|max:255',
            'lastname' => 'required|regex:/^[a-zA-Z\s\-\.]+$/|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            ],
            'contact' => ['string', 'regex:/^09\d{9}$/', 'max:11'], // Regular expression for Philippine number starting with 09
            'role' => ['required', Rule::in(['Admin', 'Borrower', 'Librarian'])],
        ]);
        // Check if email already exists
        if (User::where('email', $request->email)->where('id', '!=', $id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already exists!',
            ], 422);
        }
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed!',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update only fillable fields
        $user->fill($request->only(['firstname', 'middlename', 'lastname', 'email', 'contact', 'role']));
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User Updated successfully',
            'data' => $user,
        ]);
    }

    public function deleteUser(string $id)
    {
        $user = $this->user->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User Deleted Successfully',
        ]);
    }
    public function deactivate(Request $request, string $id)
    {
        // Find the user by ID
        $user = $this->user->findOrFail($id);

        // Check if the user was found
        if ($user) {
            // Check if the user is being deactivated and there is an active user with the same email
            if ($user->status === "deactivated" && User::where('email', $user->email)->where('status', 'active')->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must delete the existing email with status of active first before reactivating the user.',
                ], 422);
            }

            // Toggle the user's status
            $user->status = $user->status === "active" ? "deactivated" : "active";

            // Save the updated user
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'User ' . ($user->status === "active" ? 'active' : 'deactivated') . ' successfully!',
                'data' => $user,
            ]);
        }

        // If the user was not found, return a 404 response
        return response()->json([
            'success' => false,
            'message' => 'User not found',
        ], 404);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
    
        // Fetch all users with the provided email
        $users = User::where('email', $credentials['email'])->get();
    
        // Check if any user with the email exists
        if ($users->isEmpty()) {
            $response['status'] = 0;
            $response['code'] = 404;
            $response['message'] = 'Email not found';
            return response()->json($response);
        }
    
        // Check if there's an active user
        $activeUser = $users->firstWhere('status', 'active');
    
        if (!$activeUser) {
            // If no active user found
            $response['status'] = 0;
            $response['code'] = 403; // Forbidden status code
            $response['message'] = 'Account has been deactivated!';
            return response()->json($response);
        }
    
        // Attempt login with the credentials
        try {
            if (!JWTAuth::attempt($credentials)) {
                $response['status'] = 0;
                $response['code'] = 401;
                $response['message'] = 'Email or Password is Incorrect';
                return response()->json($response);
            }
        } catch (JWTException $e) {
            $response['status'] = 0;
            $response['code'] = 500;
            $response['message'] = 'Could not create token';
            return response()->json($response);
        }
    
        $user = auth()->user();
        $token = JWTAuth::fromUser($user);
    
        $response['data'] = [
            'token' => $token,
            'role' => $user->role,
            'firstname' => $user->firstname,
            'status' => $user->status
        ];
        $response['status'] = 1;
        $response['code'] = 200;
        $response['message'] = 'Login Successfully';
        return response()->json($response);
    }
    
    

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $token = Str::random(60);

        // Save the token to the user record
        $user->reset_token = $token;
        $user->save();

        // Send email with reset link and user's name
        Mail::to($user->email)->send(new Email($user->name, $token));

        return response()->json(['message' => 'Password reset link sent'], 200);
    }
    public function resetPassword(Request $request, $token)
    {
        // Find the user by token (assuming you store the token in the database)
        $user = User::where('remember_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        // Update the user's password
        $user->password = Hash::make($request->input('newPassword'));
        $user->save();

        // Clear the reset token
        $user->reset_token = null;
        $user->save();

        return response()->json(['message' => 'Password reset successfully'], 200);
    }
}
