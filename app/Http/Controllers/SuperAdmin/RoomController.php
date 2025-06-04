<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\SuperAdmin\Room;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::all();
        return response()->json($rooms);
    }
    
    /**
     * Display a listing of rooms with their bookings.
     */
    public function roomsWithBookings()
    {
        try {
            $rooms = Room::with('bookings')->get();
            return response()->json($rooms);
        } catch (\Exception $e) {
            Log::error('Error fetching rooms with bookings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching rooms with bookings'
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'roomNumber' => 'required|string|max:50|unique:rooms',
                'roomType' => 'required|string|in:standard,deluxe,suite,executive,presidential',
                'price' => 'required|numeric|min:0',
                'capacity' => 'required|integer|min:1',
                'status' => 'required|string|in:available,occupied,maintenance',
                'amenities' => 'required|json',
                'description' => 'required|string',
                'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Handle main image upload (image1)
            if ($request->hasFile('image1')) {
                $mainImagePath = $request->file('image1')->store('rooms', 'public');
                $validatedData['image'] = $mainImagePath;
            }

            // Handle additional images upload
            $additionalImages = [];
            // Check for image2
            if ($request->hasFile('image2')) {
                $path = $request->file('image2')->store('rooms', 'public');
                $additionalImages[] = $path;
            }
            // Check for image3
            if ($request->hasFile('image3')) {
                $path = $request->file('image3')->store('rooms', 'public');
                $additionalImages[] = $path;
            }
            // Check for image4
            if ($request->hasFile('image4')) {
                $path = $request->file('image4')->store('rooms', 'public');
                $additionalImages[] = $path;
            }
            $validatedData['additionalImages'] = json_encode($additionalImages);

            // Create room
            $room = Room::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'data' => $room
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating room: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $room = Room::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $room
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving room: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Room not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $room = Room::findOrFail($id);

            $validatedData = $request->validate([
                'roomNumber' => 'sometimes|required|string|max:50|unique:rooms,roomNumber,' . $id,
                'roomType' => 'sometimes|required|string|in:standard,deluxe,suite,executive,presidential',
                'price' => 'sometimes|required|numeric|min:0',
                'capacity' => 'sometimes|required|integer|min:1',
                'status' => 'sometimes|required|string|in:available,occupied,maintenance',
                'amenities' => 'sometimes|required|json',
                'description' => 'sometimes|required|string',
                'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'existingImages' => 'nullable|array',
            ]);

            // Handle image uploads
            $additionalImages = json_decode($room->additionalImages ?? '[]', true);
            
            // Handle existing images
            if ($request->has('existingImages') || $request->has('existingImagesJson')) {
                // First try to get from array notation
                if ($request->has('existingImages') && is_array($request->existingImages)) {
                    $existingImagePaths = $request->existingImages;
                    Log::info('Using existingImages array directly', ['count' => count($existingImagePaths)]);
                } 
                // Then try JSON fallback
                elseif ($request->has('existingImagesJson')) {
                    $existingImagePaths = json_decode($request->existingImagesJson, true);
                    Log::info('Using existingImagesJson', ['decoded' => $existingImagePaths]);
                    
                    if ($existingImagePaths === null) {
                        Log::warning('Failed to decode existingImagesJson', ['raw' => $request->existingImagesJson]);
                        $existingImagePaths = [];
                    }
                }
                // Last resort - try to decode the existingImages as JSON
                else {
                    $existingImagePaths = json_decode($request->existingImages, true);
                    Log::info('Trying to decode existingImages as JSON', ['result' => $existingImagePaths]);
                    
                    // If decoding failed, treat it as a single item array
                    if ($existingImagePaths === null) {
                        Log::warning('Using existingImages as single item', ['value' => $request->existingImages]);
                        $existingImagePaths = [$request->existingImages];
                    }
                }
                
                // Keep only the images that are in the existingImages array
                $newAdditionalImages = [];
                foreach ($additionalImages as $path) {
                    if (in_array($path, $existingImagePaths)) {
                        $newAdditionalImages[] = $path;
                    } else {
                        // Delete the image from storage
                        if (Storage::disk('public')->exists($path)) {
                            Storage::disk('public')->delete($path);
                        }
                    }
                }
                $additionalImages = $newAdditionalImages;
            }
            
            // Handle new image uploads
            for ($i = 1; $i <= 4; $i++) {
                $imageKey = 'image' . $i;
                if ($request->hasFile($imageKey)) {
                    $path = $request->file($imageKey)->store('rooms', 'public');
                    $additionalImages[] = $path;
                }
            }
            
            // Update main image if provided
            if ($request->hasFile('image1')) {
                // Delete old image if exists
                if ($room->image && Storage::disk('public')->exists($room->image)) {
                    Storage::disk('public')->delete($room->image);
                }
                $mainImagePath = $request->file('image1')->store('rooms', 'public');
                $validatedData['image'] = $mainImagePath;
            }
            
            $validatedData['additionalImages'] = json_encode($additionalImages);

            // Handle image removals if specified
            if ($request->has('removeImages') && is_array($request->removeImages)) {
                $existingImages = json_decode($room->additionalImages ?? '[]', true);
                $updatedImages = [];
                
                foreach ($existingImages as $path) {
                    if (!in_array($path, $request->removeImages)) {
                        $updatedImages[] = $path;
                    } else {
                        // Delete the image from storage
                        if (Storage::disk('public')->exists($path)) {
                            Storage::disk('public')->delete($path);
                        }
                    }
                }
                
                $validatedData['additionalImages'] = json_encode($updatedImages);
            }

            // Update room
            $room->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Room updated successfully', 
                'data' => $room
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error updating room: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating room: ' . $e->getMessage());
            Log::error('Error trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update room',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Update the room status.
     */
    public function updateStatus(Request $request, string $id)
    {
        try {
            $room = Room::findOrFail($id);

            $validatedData = $request->validate([
                'status' => 'required|string|in:available,occupied,maintenance',
            ]);

            // Update room status
            $room->update([
                'status' => $validatedData['status']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Room status updated successfully',
                'data' => $room
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating room status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update room status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $room = Room::findOrFail($id);

            // Delete main image if exists
            if ($room->image && Storage::disk('public')->exists($room->image)) {
                Storage::disk('public')->delete($room->image);
            }

            // Delete additional images if exist
            $additionalImages = json_decode($room->additionalImages ?? '[]', true);
            foreach ($additionalImages as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }

            // Delete room
            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Room deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting room: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
