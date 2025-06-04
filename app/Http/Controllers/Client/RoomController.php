<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\SuperAdmin\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoomController extends Controller
{
    /**
     * Display a listing of available rooms for clients.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Get all rooms for clients, regardless of status
            $rooms = Room::all();
            
            // Log the number of rooms found
            Log::info('Fetched ' . $rooms->count() . ' rooms for client');
            
            // Return the rooms as JSON
            return response()->json($rooms);
        } catch (\Exception $e) {
            Log::error('Error fetching rooms for client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching rooms'
            ], 500);
        }
    }

    /**
     * Display the specified room.
     * 
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $room = Room::findOrFail($id);
            
            // Return the room as JSON
            return response()->json($room);
        } catch (\Exception $e) {
            Log::error('Error fetching room details for client: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching room details'
            ], 500);
        }
    }

    /**
     * Check room availability for specific dates.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAvailability(Request $request)
    {
        try {
            $request->validate([
                'check_in_date' => 'required|date',
                'check_out_date' => 'required|date|after:check_in_date',
                'room_id' => 'nullable|exists:rooms,id'
            ]);

            $checkInDate = $request->check_in_date;
            $checkOutDate = $request->check_out_date;
            
            // If room_id is provided, check availability for that specific room
            if ($request->has('room_id')) {
                $room = Room::findOrFail($request->room_id);
                
                // Check if the room is available for the specified dates
                $isAvailable = $room->isAvailableForDates($checkInDate, $checkOutDate);
                
                return response()->json([
                    'success' => true,
                    'available' => $isAvailable
                ]);
            }
            
            // Otherwise, get all available rooms for the specified dates
            $availableRooms = Room::where('status', 'available')
                ->whereDoesntHave('bookings', function($query) use ($checkInDate, $checkOutDate) {
                    $query->where(function($q) use ($checkInDate, $checkOutDate) {
                        // Check for overlapping bookings
                        $q->where(function($q) use ($checkInDate, $checkOutDate) {
                            $q->where('check_in_date', '<=', $checkOutDate)
                              ->where('check_out_date', '>=', $checkInDate);
                        });
                    });
                })
                ->get();
            
            return response()->json([
                'success' => true,
                'available_rooms' => $availableRooms
            ]);
        } catch (\Exception $e) {
            Log::error('Error checking room availability: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while checking room availability'
            ], 500);
        }
    }
}
