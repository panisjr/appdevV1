<?php

// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return Users::all();
    }

    public function store(Request $request)
    {
        return Users::create($request->all());
    }

    public function show($id)
    {
        return Users::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $user = Users::findOrFail($id);
        $user->update($request->all());
        return $user;
    }

    public function destroy($id)
    {
        $user = Users::findOrFail($id);
        $user->delete();
        return response()->json(null, 204);
    }
}

