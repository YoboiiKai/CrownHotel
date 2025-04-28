<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\SuperAdmin\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::all();
        return response()->json($menus);
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
                'menuname' => 'required|string|max:255',
                'price' => 'required|numeric|min:1',
                'category' => 'required|string|max:255',
                'preperationtime' => 'required|numeric|min:1',
                'description' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $validatedData['status'] = 'available';
        
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Menu'), $imageName);
                $validatedData['image'] = 'Menu/' . $imageName; // Store path with folder name
            }
        
            $menu = Menu::create($validatedData);
        
            return response()->json([
                'success' => true, 
                'menu' => $menu,
                'message' => 'Menu created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating menu: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the menu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
                'menuname' => 'required|string|max:255',
                'price' => 'required|numeric|min:1',
                'category' => 'required|string|max:255',
                'preperationtime' => 'required|numeric|min:1',
                'description' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $menu = Menu::findOrFail($id);
        
            $menu->menuname = $validatedData['menuname'];
            $menu->description = $validatedData['description'];
            $menu->price = $validatedData['price'];
            $menu->category = $validatedData['category'];
            $menu->preperationtime = $validatedData['preperationtime'];
        
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($menu->image && file_exists(public_path($menu->image))) {
                    unlink(public_path($menu->image));
                }
        
                // Upload new image
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Menu'), $imageName);
                $menu->image = 'Menu/' . $imageName;
            }
        
            $menu->save();
        
            return response()->json([
                'success' => true, 
                'menu' => $menu,
                'message' => 'Menu updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating menu: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the menu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $menu = Menu::findOrFail($id);
            
            // Delete associated image if exists
            if ($menu->image && file_exists(public_path($menu->image))) {
                unlink(public_path($menu->image));
            }
            
            $menu->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Menu deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting menu: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the menu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update menu item status (available/sold_out)
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:available,sold_out',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $menu = Menu::findOrFail($id);
            $menu->status = $request->status;
            $menu->save();

            return response()->json([
                'success' => true, 
                'menu' => $menu,
                'message' => 'Menu status updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating menu status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the menu status: ' . $e->getMessage()
            ], 500);
        }
    }
}
