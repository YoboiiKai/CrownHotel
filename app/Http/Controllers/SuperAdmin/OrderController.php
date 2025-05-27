<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SuperAdmin\Order;
use App\Models\SuperAdmin\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = Order::query();
            
            // Apply filters if provided
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('room') && $request->room) {
                $query->where('roomNumber', 'like', '%' . $request->room . '%');
            }
            
            if ($request->has('date_from') && $request->date_from) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            
            if ($request->has('date_to') && $request->date_to) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
            
            // Order by created_at desc by default
            $orders = $query->orderBy('created_at', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $orders,
                'message' => 'Orders retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving orders: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'service_type' => 'required|in:room,table',
                'room_number' => 'required_if:service_type,room|nullable|string|max:50',
                'table_number' => 'required_if:service_type,table|nullable|string|max:50',
                'customerName' => 'nullable|string|max:100',
                'items' => 'required|array|min:1',
                'items.*.menu_id' => 'required|exists:menu,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'items.*.subtotal' => 'required|numeric|min:0',
                'subtotal' => 'required|numeric|min:0',
                'discount' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'is_senior_citizen' => 'required|boolean',
                'payment_method' => 'required|in:cash,card,mobile',
                'payment_status' => 'nullable|in:pending,processing,completed,failed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Start transaction
            DB::beginTransaction();

            // Validate each item and collect image paths
            $imageArray = [];
            foreach ($request->items as $index => $item) {
                $menu = Menu::find($item['menu_id']);
                if (!$menu) {
                    throw new \Exception("Menu item with ID {$item['menu_id']} not found");
                }
                
                // Store the image path for this menu item
                $imageArray[$index] = $menu->image ?? "Menu/{$item['menu_id']}.jpg";
            }
            
            // If images were provided in the request, use those instead
            if ($request->has('images')) {
                $imageArray = $request->images;
            }

            // Create order with multiple items and their images
            $order = Order::create([
                'service_type' => $request->service_type,
                'room_number' => $request->service_type === 'room' ? $request->room_number : null,
                'table_number' => $request->service_type === 'table' ? $request->table_number : null,
                'customerName' => $request->customerName ?? 'Guest',
                'items' => $request->items,
                'images' => $imageArray, // Save the collected image paths
                'subtotal' => $request->subtotal,
                'discount' => $request->discount,
                'total' => $request->total,
                'notes' => $request->notes,
                'is_senior_citizen' => $request->is_senior_citizen,
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_status ?? ($request->payment_method === 'cash' ? 'completed' : 'pending'),
                'status' => 'pending', // Default status
            ]);
            
            DB::commit();

            // Return success response with the created order
            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);
        } catch (ValidationException $e) {
            // Rollback transaction
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();
            
            Log::error('Error creating order: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        try {
            $order = Order::findOrFail($id);
            
            // Parse items JSON for frontend display if needed
            $order->items = json_decode($order->items);
            
            return response()->json([
                'success' => true,
                'data' => $order,
                'message' => 'Order retrieved successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error retrieving order: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            $order = Order::findOrFail($id);

            // Validate the request
            $validator = Validator::make($request->all(), [
                'status' => 'sometimes|required|string|in:pending,processing,completed,cancelled',
                'notes' => 'sometimes|nullable|string',
                'roomNumber' => 'sometimes|required|string|max:50',
                'customerName' => 'sometimes|nullable|string|max:100',
                'isSeniorCitizen' => 'sometimes|boolean',
                'subtotal' => 'sometimes|numeric|min:0',
                'discount' => 'sometimes|numeric|min:0',
                'total' => 'sometimes|numeric|min:0',
                'items' => 'sometimes|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Start transaction
            DB::beginTransaction();

            // Update order basic fields
            $order->update([
                'status' => $request->status ?? $order->status,
                'notes' => $request->notes ?? $order->notes,
                'roomNumber' => $request->roomNumber ?? $order->roomNumber,
                'customerName' => $request->customerName ?? $order->customerName,
                'isSeniorCitizen' => $request->has('isSeniorCitizen') ? $request->isSeniorCitizen : $order->isSeniorCitizen,
                'subtotal' => $request->has('subtotal') ? $request->subtotal : $order->subtotal,
                'discount' => $request->has('discount') ? $request->discount : $order->discount,
                'total' => $request->has('total') ? $request->total : $order->total,
            ]);

            // Update items and images if provided
            if ($request->has('items')) {
                $order->items = $request->items;
                
                // Update images for the new items
                $images = [];
                foreach ($request->items as $index => $item) {
                    $menu = Menu::find($item['menuItemId']);
                    if ($menu) {
                        // Store the image path for this menu item
                        $images[$index] = $menu->image ?? "Menu/{$item['menuItemId']}.jpg";
                    }
                }
                
                $order->images = $images;
                $order->save();
            }

            // Commit transaction
            DB::commit();

            // Return success response with fresh order data
            $order = $order->fresh();
            
            // Decode items for the response
            if (is_string($order->items)) {
                $order->items = json_decode($order->items);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order
            ]);
        } catch (ModelNotFoundException $e) {
            // Rollback transaction if active
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        } catch (\Exception $e) {
            // Rollback transaction if active
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            
            Log::error('Error updating order: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the status of an order.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:pending,processing,completed,cancelled',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $order = Order::findOrFail($id);
            $order->status = $request->status;
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order->fresh()
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error updating order status: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified resource from storage.
     * 
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        try {
            $order = Order::findOrFail($id);
            
            // Start transaction
            DB::beginTransaction();
            
            // Delete order (no need to delete order items separately)
            $order->delete();
            
            // Commit transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();
            
            Log::error('Error deleting order: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get order statistics.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats()
    {
        try {
            $stats = [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'processing_orders' => Order::where('status', 'processing')->count(),
                'completed_orders' => Order::where('status', 'completed')->count(),
                'cancelled_orders' => Order::where('status', 'cancelled')->count(),
                'today_orders' => Order::whereDate('created_at', now()->toDateString())->count(),
                'today_revenue' => Order::whereDate('created_at', now()->toDateString())
                    ->where('status', '!=', 'cancelled')
                    ->sum('total'),
                'recent_orders' => Order::orderBy('created_at', 'desc')
                    ->take(5)
                    ->get()
                    ->map(function($order) {
                        $order->items = json_decode($order->items);
                        return $order;
                    })
            ];
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Order statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving order statistics: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
