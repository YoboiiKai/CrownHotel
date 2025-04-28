<?php

namespace App\Http\Controllers\Employee;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $employees = User::where('role', 'employee')->get();
        return response()->json($employees);
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
        //
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phonenumber' => 'required|string|max:20',
                'address' => 'required|string',
                'department' => 'required|string',
                'job_title' => 'required|string',
                'salary' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['role'] = 'employee';
            $validatedData['status'] = 'active'; // Set default status to active
        
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Employee'), $imageName);
                $validatedData['image'] = 'Employee/' . $imageName; // Store path with folder name
            }
        
            $employee = User::create($validatedData);
        
            return response()->json([
                'success' => true, 
                'employee' => $employee,
                'message' => 'Employee created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the employee: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        try {
            $employee = User::findOrFail($id);
            return response()->json($employee);
        } catch (\Exception $e) {
            Log::error('Error fetching employee data: ' . $e->getMessage());
            return response()->json(['error' => 'Employee not found'], 404);
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
            'department' => 'required|string',
            'job_title' => 'required|string',
            'salary' => 'required|string',
            'address' => 'required|string',
            'password' => 'nullable|string|min:8|confirmed',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $employee = User::findOrFail($id);

        // Update employee fields
        $employee->name = $validatedData['name'];
        $employee->email = $validatedData['email'];
        $employee->phonenumber = $validatedData['phonenumber'];
        $employee->department = $validatedData['department'];
        $employee->job_title = $validatedData['job_title'];
        $employee->salary = $validatedData['salary'];
        $employee->address = $validatedData['address'];

        // Update password if provided
        if ($request->filled('password')) {
            $employee->password = Hash::make($validatedData['password']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($employee->image && file_exists(public_path($employee->image))) {
                unlink(public_path($employee->image));
            }

            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('Employee'), $imageName);
            $employee->image = 'Employee/' . $imageName; // Store path with folder name
        }

        $employee->save();

        return response()->json([
            'success' => true, 
            'employee' => $employee,
            'message' => 'Employee updated successfully'
        ], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        Log::error('Error updating employee: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while updating the employee: ' . $e->getMessage()
        ], 500);
    }
}
    public function updateStatus(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'status' => 'required|in:active,inactive'
            ]);

            $employee = User::findOrFail($id);
            $employee->status = $validatedData['status'];
            $employee->save();

            return response()->json([
                'success' => true, 
                'employee' => $employee,
                'message' => 'Employee status updated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating employee status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the employee status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $employee = User::findOrFail($id);
            
            // Delete image if exists
            if ($employee->image && file_exists(public_path($employee->image))) {
                unlink(public_path($employee->image));
            }
            
            $employee->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the employee: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Activate the specified employee.
     */
    public function activate(string $id)
    {
        try {
            $employee = User::findOrFail($id);
            $employee->status = 'active';
            $employee->save();

            return response()->json([
                'success' => true, 
                'employee' => $employee,
                'message' => 'Employee activated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error activating employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while activating the employee: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate the specified employee.
     */
    public function deactivate(string $id)
    {
        try {
            $employee = User::findOrFail($id);
            $employee->status = 'inactive';
            $employee->save();

            return response()->json([
                'success' => true, 
                'employee' => $employee,
                'message' => 'Employee deactivated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deactivating employee: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deactivating the employee: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import multiple employees from array data
     */
    public function import(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'employees' => 'required|array',
                'employees.*.name' => 'required|string|max:255',
                'employees.*.email' => 'required|email|unique:users,email',
                'employees.*.phonenumber' => 'required|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $employees = $request->employees;
            $imported = 0;
            $errors = [];

            // Begin transaction
            \DB::beginTransaction();

            foreach ($employees as $index => $employeeData) {
                try {
                    // Check for duplicates
                    $existingEmail = User::where('email', $employeeData['email'])->exists();

                    if ($existingEmail) {
                        $errors[] = "Row " . ($index + 1) . ": Email already exists.";
                        continue;
                    }

                    // Create the employee
                    User::create([
                        'name' => $employeeData['name'],
                        'email' => $employeeData['email'],
                        'phonenumber' => $employeeData['phonenumber'],
                        'password' => Hash::make('password123'), // Default password
                        'role' => 'employee',
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
                'total' => count($employees),
                'errors' => $errors
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error importing employees: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while importing employees: ' . $e->getMessage()
            ], 500);
        }
    }
}
