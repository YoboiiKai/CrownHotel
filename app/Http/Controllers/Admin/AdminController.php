<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admins = User::where('role', 'admin')->get();
        return response()->json($admins);
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
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['role'] = 'admin';
            $validatedData['status'] = 'active'; // Set default status to active
        
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Admin'), $imageName);
                $validatedData['image'] = 'Admin/' . $imageName; // Store path with folder name
            }
        
            $admin = User::create($validatedData);
        
            return response()->json([
                'success' => true, 
                'admin' => $admin,
                'message' => 'Admin created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the admin: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $admin = User::findOrFail($id);
            return response()->json($admin);
        } catch (\Exception $e) {
            Log::error('Error fetching admin data: ' . $e->getMessage());
            return response()->json(['error' => 'Admin not found'], 404);
        }
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
                'password' => 'nullable|string|min:8|confirmed',
                'phonenumber' => 'required|string|max:20',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $admin = User::findOrFail($id);
        
            $admin->name = $validatedData['name'];
            $admin->email = $validatedData['email'];
            $admin->phonenumber = $validatedData['phonenumber'];
        
            if ($request->filled('password')) {
                $admin->password = Hash::make($validatedData['password']);
            }
        
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($admin->image && file_exists(public_path($admin->image))) {
                    unlink(public_path($admin->image));
                }
                
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Admin'), $imageName); // Save to storage/app/public
                $admin->image = 'Admin/' . $imageName; // Store path with folder name
            }
        
            $admin->save();
        
            return response()->json([
                'success' => true, 
                'admin' => $admin,
                'message' => 'Admin updated successfully'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the admin: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'status' => 'required|in:active,inactive'
            ]);

            $admin = User::findOrFail($id);
            $admin->status = $validatedData['status'];
            $admin->save();

            return response()->json([
                'success' => true, 
                'admin' => $admin,
                'message' => 'Admin status updated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating admin status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the admin status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $admin = User::findOrFail($id);
            
            // Delete image if exists
            if ($admin->image && file_exists(public_path($admin->image))) {
                unlink(public_path($admin->image));
            }
            
            $admin->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Admin deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the admin: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate the specified admin.
     */
    public function activate(string $id)
    {
        try {
            $admin = User::findOrFail($id);
            $admin->status = 'active';
            $admin->save();

            return response()->json([
                'success' => true, 
                'admin' => $admin,
                'message' => 'Admin activated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error activating admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while activating the admin: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate the specified admin.
     */
    public function deactivate(string $id)
    {
        try {
            $admin = User::findOrFail($id);
            $admin->status = 'inactive';
            $admin->save();

            return response()->json([
                'success' => true, 
                'admin' => $admin,
                'message' => 'Admin deactivated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deactivating admin: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deactivating the admin: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import multiple admins from array data
     */
    public function import(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'admins' => 'required|array',
                'admins.*.name' => 'required|string|max:255',
                'admins.*.email' => 'required|email|unique:users,email',
                'admins.*.phonenumber' => 'required|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $admins = $request->admins;
            $imported = 0;
            $errors = [];

            // Begin transaction
            \DB::beginTransaction();

            foreach ($admins as $index => $adminData) {
                try {
                    // Check for duplicates
                    $existingEmail = User::where('email', $adminData['email'])->exists();

                    if ($existingEmail) {
                        $errors[] = "Row " . ($index + 1) . ": Email already exists.";
                        continue;
                    }

                    // Create the admin
                    User::create([
                        'name' => $adminData['name'],
                        'email' => $adminData['email'],
                        'phonenumber' => $adminData['phonenumber'],
                        'password' => Hash::make('password123'), // Default password
                        'role' => 'admin',
                        'status' => 'active'
                    ]);

                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Row " . ($index + 1) . ": " . $e->getMessage();
                }
            }

            // Commit if we have any successful imports
            if ($imported > 0) {
                \DB::commit();
            } else {
                \DB::rollBack();
            }

            return response()->json([
                'success' => true,
                'imported' => $imported,
                'total' => count($admins),
                'errors' => $errors
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error importing admins: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while importing admins: ' . $e->getMessage()
            ], 500);
        }
    }
}
