<?php

namespace App\Http\Controllers\Client;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $clients = User::where('role', 'client')->get();
        return response()->json($clients);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phonenumber' => 'required|string|max:20',
                'address' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['role'] = 'client'; // Set role to client
            $validatedData['status'] = 'active'; // Set default status to active

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Client'), $imageName);
                $validatedData['image'] = 'Client/' . $imageName; // Store path with folder name
            }

            $client = User::create($validatedData);

            return response()->json([
                'success' => true, 
                'client' => $client,
                'message' => 'Client created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the client: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $client = User::findOrFail($id);
            return response()->json($client);
        } catch (\Exception $e) {
            Log::error('Error fetching client data: ' . $e->getMessage());
            return response()->json(['error' => 'Client not found'], 404);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,'.$id,
                'phonenumber' => 'required|string|max:20',
                'address' => 'required|string',
                'password' => 'nullable|string|min:8|confirmed',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $client = User::findOrFail($id);

            // Update client fields
            $client->name = $validatedData['name'];
            $client->email = $validatedData['email'];
            $client->phonenumber = $validatedData['phonenumber'];
            $client->address = $validatedData['address'];

            // Update password if provided
            if ($request->filled('password')) {
                $client->password = Hash::make($validatedData['password']);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($client->image && file_exists(public_path($client->image))) {
                    unlink(public_path($client->image));
                }

                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Client'), $imageName);
                $client->image = 'Client/' . $imageName; // Store path with folder name
            }

            $client->save();

            return response()->json([
                'success' => true, 
                'client' => $client,
                'message' => 'Client updated successfully'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the client: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $client = User::findOrFail($id);
            
            // Delete image if exists
            if ($client->image && file_exists(public_path($client->image))) {
                unlink(public_path($client->image));
            }
            
            $client->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Client deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the client: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate the specified client.
     */
    public function activate(string $id)
    {
        try {
            $client = User::findOrFail($id);
            $client->status = 'active';
            $client->save();

            return response()->json([
                'success' => true, 
                'client' => $client,
                'message' => 'Client activated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error activating client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while activating the client: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate the specified client.
     */
    public function deactivate(string $id)
    {
        try {
            $client = User::findOrFail($id);
            $client->status = 'inactive';
            $client->save();

            return response()->json([
                'success' => true, 
                'client' => $client,
                'message' => 'Client deactivated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deactivating client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deactivating the client: ' . $e->getMessage()
            ], 500);
        }
    }
}
