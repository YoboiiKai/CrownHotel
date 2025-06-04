<?php

namespace App\Http\Controllers;

use App\Models\SuperAdmin\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PublicController extends Controller
{
    /**
     * Display a listing of available rooms for public access.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function rooms()
    {
        try {
            // Get all rooms for public display, regardless of status
            $rooms = Room::all();
            
            // Log the number of rooms found
            Log::info('Fetched ' . $rooms->count() . ' rooms for public display');
            
            // Return the rooms as JSON
            return response()->json($rooms);
        } catch (\Exception $e) {
            Log::error('Error fetching rooms for public display: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching rooms'
            ], 500);
        }
    }
}
