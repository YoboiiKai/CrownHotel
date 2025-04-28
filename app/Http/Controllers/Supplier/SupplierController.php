<?php

namespace App\Http\Controllers\Supplier;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = User::where('role', 'supplier')->get();
        return response()->json($suppliers);
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
                'companyname' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['role'] = 'supplier';
            $validatedData['status'] = 'active'; // Set default status to active
        
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Supplier'), $imageName);
                $validatedData['image'] = 'Supplier/' . $imageName; // Store path with folder name
            }
        
            $supplier = User::create($validatedData);
        
            return response()->json([
                'success' => true, 
                'supplier' => $supplier,
                'message' => 'Supplier created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating supplier: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the supplier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $supplier = User::findOrFail($id);
            return response()->json($supplier);
        } catch (\Exception $e) {
            Log::error('Error fetching supplier data: ' . $e->getMessage());
            return response()->json(['error' => 'Supplier not found'], 404);
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
                'companyname' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $supplier = User::findOrFail($id);
        
            $supplier->name = $validatedData['name'];
            $supplier->email = $validatedData['email'];
            $supplier->phonenumber = $validatedData['phonenumber'];
            $supplier->companyname = $validatedData['companyname'];
            $supplier->category = $validatedData['category'];
            
            if (isset($validatedData['address'])) {
                $supplier->address = $validatedData['address'];
            }
        
            if ($request->filled('password')) {
                $supplier->password = Hash::make($validatedData['password']);
            }
        
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($supplier->image && file_exists(public_path($supplier->image))) {
                    unlink(public_path($supplier->image));
                }
        
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Supplier'), $imageName);
                $supplier->image = 'Supplier/' . $imageName;
            }
        
            $supplier->save();
        
            return response()->json([
                'success' => true, 
                'supplier' => $supplier,
                'message' => 'Supplier updated successfully'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating supplier: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the supplier: ' . $e->getMessage()
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
                'status' => 'required|string|in:active,inactive',
            ]);
        
            $supplier = User::findOrFail($id);
            $supplier->status = $validatedData['status'];
            $supplier->save();
        
            return response()->json([
                'success' => true, 
                'supplier' => $supplier,
                'message' => 'Supplier status updated successfully'
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating supplier status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the supplier status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $supplier = User::findOrFail($id);
        
            // Delete supplier image if exists
            if ($supplier->image && file_exists(public_path($supplier->image))) {
                unlink(public_path($supplier->image));
            }
        
            $supplier->delete();
        
            return response()->json([
                'success' => true,
                'message' => 'Supplier deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting supplier: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the supplier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate the specified supplier.
     */
    public function activate(string $id)
    {
        try {
            $supplier = User::findOrFail($id);
            $supplier->status = 'active';
            $supplier->save();

            return response()->json([
                'success' => true, 
                'supplier' => $supplier,
                'message' => 'Supplier activated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error activating supplier: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while activating the supplier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate the specified supplier.
     */
    public function deactivate(string $id)
    {
        try {
            $supplier = User::findOrFail($id);
            $supplier->status = 'inactive';
            $supplier->save();

            return response()->json([
                'success' => true, 
                'supplier' => $supplier,
                'message' => 'Supplier deactivated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deactivating supplier: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deactivating the supplier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import multiple suppliers from array data
     */
    public function import(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'suppliers' => 'required|array',
                'suppliers.*.name' => 'required|string|max:255',
                'suppliers.*.email' => 'required|email|unique:users,email',
                'suppliers.*.phonenumber' => 'required|string|max:20',
                'suppliers.*.companyname' => 'required|string|max:255',
                'suppliers.*.category' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $suppliers = $request->suppliers;
            $imported = 0;
            $errors = [];

            // Begin transaction
            \DB::beginTransaction();

            foreach ($suppliers as $index => $supplierData) {
                try {
                    // Check for duplicates
                    $existingEmail = User::where('email', $supplierData['email'])->exists();

                    if ($existingEmail) {
                        $errors[] = "Row " . ($index + 1) . ": Email already exists.";
                        continue;
                    }

                    // Create the supplier
                    User::create([
                        'name' => $supplierData['name'],
                        'email' => $supplierData['email'],
                        'phonenumber' => $supplierData['phonenumber'],
                        'companyname' => $supplierData['companyname'],
                        'category' => $supplierData['category'],
                        'address' => $supplierData['address'] ?? null,
                        'password' => Hash::make('password123'), // Default password
                        'role' => 'supplier',
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
                'total' => count($suppliers),
                'errors' => $errors
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error importing suppliers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while importing suppliers: ' . $e->getMessage()
            ], 500);
        }
    }
}
