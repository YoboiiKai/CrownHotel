<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\SuperAdmin\Inventory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventoryItems = Inventory::all();
        return response()->json($inventoryItems);
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
                'itemName' => 'required|string|max:255',
                'itemCode' => 'required|string|max:50|unique:inventories',
                'category' => 'required|string|in:food,housekeeping,equipment,amenities,maintenance,office',
                'quantity' => 'required|numeric|min:0',
                'unit' => 'required|string|max:20',
                'minStockLevel' => 'required|numeric|min:0',
                'price' => 'required|numeric|min:0',
                'supplier' => 'nullable|string|max:255',
                'location' => 'nullable|string|in:kitchen,restaurant,bar,storage,housekeeping,maintenance,office',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            // Set lastRestocked to current time for new items
            $validatedData['lastRestocked'] = now();
        
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Inventory'), $imageName);
                $validatedData['image'] = 'Inventory/' . $imageName; // Store path with folder name
            }
        
            $inventory = Inventory::create($validatedData);
        
            return response()->json([
                'success' => true, 
                'inventory' => $inventory,
                'message' => 'Inventory item created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating inventory item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the inventory item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $inventory = Inventory::findOrFail($id);
            return response()->json([
                'success' => true,
                'inventory' => $inventory
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving inventory item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving the inventory item: ' . $e->getMessage()
            ], 500);
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
                'itemName' => 'required|string|max:255',
                'itemCode' => 'required|string|max:50|unique:inventories,itemCode,' . $id,
                'category' => 'required|string|in:food,housekeeping,equipment,amenities,maintenance,office',
                'quantity' => 'required|numeric|min:0',
                'unit' => 'required|string|max:20',
                'minStockLevel' => 'required|numeric|min:0',
                'price' => 'required|numeric|min:0',
                'supplier' => 'nullable|string|max:255',
                'location' => 'nullable|string|in:kitchen,restaurant,bar,storage,housekeeping,maintenance,office',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
        
            $inventory = Inventory::findOrFail($id);
        
            $inventory->itemName = $validatedData['itemName'];
            $inventory->itemCode = $validatedData['itemCode'];
            $inventory->category = $validatedData['category'];
            $inventory->quantity = $validatedData['quantity'];
            $inventory->unit = $validatedData['unit'];
            $inventory->minStockLevel = $validatedData['minStockLevel'];
            $inventory->price = $validatedData['price'];
            $inventory->supplier = $validatedData['supplier'];
            $inventory->location = $validatedData['location'];
            $inventory->description = $validatedData['description'];
        
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($inventory->image && file_exists(public_path($inventory->image))) {
                    unlink(public_path($inventory->image));
                }
        
                // Upload new image
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Inventory'), $imageName);
                $inventory->image = 'Inventory/' . $imageName;
            }
        
            $inventory->save();
        
            return response()->json([
                'success' => true, 
                'inventory' => $inventory,
                'message' => 'Inventory item updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating inventory item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the inventory item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $inventory = Inventory::findOrFail($id);
            
            // Delete associated image if exists
            if ($inventory->image && file_exists(public_path($inventory->image))) {
                unlink(public_path($inventory->image));
            }
            
            $inventory->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Inventory item deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting inventory item: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the inventory item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update inventory stock quantity
     */
    public function updateStock(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'quantity' => 'required|numeric|min:0',
                'isRestocked' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $inventory = Inventory::findOrFail($id);
            $inventory->quantity = $request->quantity;
            
            // Update lastRestocked timestamp if this is a restock operation
            if ($request->isRestocked) {
                $inventory->lastRestocked = now();
            }
            
            $inventory->save();

            return response()->json([
                'success' => true, 
                'inventory' => $inventory,
                'message' => 'Inventory stock updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating inventory stock: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the inventory stock: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get inventory items that are low in stock (below minimum stock level).
     */
    public function getLowStock()
    {
        try {
            $lowStockItems = Inventory::whereRaw('quantity < minStockLevel')->get();
            return response()->json([
                'success' => true,
                'inventory' => $lowStockItems
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving low stock items: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving low stock items: ' . $e->getMessage()
            ], 500);
        }
    }
}
