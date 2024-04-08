<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Import Rule class for validation
use Illuminate\Support\Facades\Validator; // Import Validator class for validation
use App\Models\Account;

class AccountsController extends Controller
{
    protected $account;

    public function __construct()
    {
        $this->account = new Account();
    }

    public function index()
    {
        return $this->account->all();
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:accounts,email|max:255',
            'contact' => ['nullable', 'string', 'regex:/^09\d{9}$/', 'max:11'], // Regular expression for Philippine number starting with 09
            'password' => 'required|string|min:8',
            'confirm_password' => 'sometimes|string|same:password',
            'role' => ['required', Rule::in(['admin', 'borrower', 'librarian'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Only include fields that should be stored in the database
        $accountData = $request->only(['name', 'email', 'contact', 'password', 'role']);
        $account = $this->account->create($accountData);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully',
            'data' => $account,
        ]);
    }
  
    public function show(string $id)
    {
        $account = $this->account->find($id);
        
        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $account,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $account = $this->account->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('accounts')->ignore($account->id),
            ],
            'contact' => ['nullable', 'string', 'regex:/^09\d{9}$/', 'max:11'], // Regular expression for Philippine number starting with 09
            'password' => 'sometimes|string|min:8',
            'confirm_password' => 'sometimes|string|same:password',
            'role' => ['required', Rule::in(['admin', 'borrower', 'librarian'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update only fillable fields
        $account->fill($request->only(['name', 'email', 'contact', 'password', 'role']));
        $account->save();

        return response()->json([
            'success' => true,
            'message' => 'Account updated successfully',
            'data' => $account,
        ]);
    }

    public function destroy(string $id)
    {
        $account = $this->account->find($id);
        
        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found',
            ], 404);
        }

        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully',
        ]);
    }
}
