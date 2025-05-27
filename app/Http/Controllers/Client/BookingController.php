<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\SuperAdmin\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Get bookings for the currently authenticated client user
     */
    public function getClientBookings()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            // Get all bookings for this client
            $bookings = Booking::where('client_id', $user->id)
                ->with('room')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($booking) {
                    // Format the booking data for the frontend
                    return [
                        'id' => $booking->id,
                        'roomNumber' => $booking->room ? $booking->room->room_number : 'N/A',
                        'roomType' => $booking->room ? $booking->room->room_type : 'Standard Room',
                        'checkIn' => $booking->check_in_date,
                        'checkOut' => $booking->check_out_date,
                        'guests' => $booking->adults + ($booking->children ?? 0),
                        'adults' => $booking->adults,
                        'children' => $booking->children ?? 0,
                        'status' => $booking->status,
                        'totalAmount' => $booking->total_amount,
                        'paymentStatus' => $booking->payment_status,
                        'bookingDate' => $booking->created_at,
                        'specialRequests' => $booking->special_requests,
                        'amenities' => $booking->room && $booking->room->amenities ? 
                            json_decode($booking->room->amenities) : 
                            ['Free Wi-Fi', 'Breakfast']
                    ];
                });
            
            return response()->json($bookings);
            
        } catch (\Exception $e) {
            Log::error('Error fetching client bookings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching your booking history'
            ], 500);
        }
    }
    
    /**
     * Map database status values to frontend status values
     * 
     * @param string $status The database status value
     * @return string The frontend status value
     */
    private function mapStatusForFrontend($status)
    {
        // Convert status to lowercase for case-insensitive comparison
        $status = strtolower($status);
        
        // Map database status values to frontend status values
        switch ($status) {
            case 'confirm':
            case 'confirmed':
            case 'booked':
            case 'reserved':
            case 'pending':
                return 'upcoming';
                
            case 'checked_out':
            case 'checkedout':
            case 'checked-out':
            case 'complete':
            case 'completed':
            case 'done':
                return 'completed';
                
            case 'cancel':
            case 'cancelled':
            case 'canceled':
            case 'no_show':
            case 'no-show':
                return 'cancelled';
                
            default:
                // If we don't recognize the status, default to upcoming
                return 'upcoming';
        }
    }
    
    /**
     * Display a listing of bookings.
     */
    public function index()
    {
        try {
            $bookings = Booking::with(['client', 'room'])->get();
            return response()->json($bookings);
        } catch (\Exception $e) {
            Log::error('Error fetching bookings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching bookings'
            ], 500);
        }
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'room_number' => 'required|string',
                'room_type' => 'required|string',
                'check_in_date' => 'required|date',
                'check_out_date' => 'required|date|after:check_in_date',
                'adults' => 'required|integer|min:1',
                'children' => 'required|integer|min:0',
                'extra_beds' => 'required|integer|min:0|max:3',
                'extra_bed_rate' => 'required|numeric|min:0',
                'client_id' => 'required|exists:users,id',
                'payment_method' => 'required|string',
                'amount' => 'required|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'terms_accepted' => 'required|boolean',
                'payment_status' => 'required|string|in:pending,paid,partially_paid,cancelled',
                'booking_reference' => 'nullable|string',
                'status' => 'nullable|string|in:pending,confirmed,checked_in,checked_out,cancelled',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'special_requests' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            // Check if room exists
            $room = Room::where('roomNumber', $validatedData['room_number'])->first();
            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found',
                    'errors' => ['room_number' => ['The selected room does not exist']]
                ], 422);
            }

            // Check if the room is available for the selected dates
            $checkInDate = new \DateTime($validatedData['check_in_date']);
            $checkOutDate = new \DateTime($validatedData['check_out_date']);
            
            // Get all bookings for this room that might overlap with the requested dates
            $overlappingBookings = Booking::where('roomNumber', $room->roomNumber)
                ->where(function($query) use ($checkInDate, $checkOutDate) {
                    $query->where(function($q) use ($checkInDate, $checkOutDate) {
                        // Check-in date falls within an existing booking
                        $q->where('check_in_date', '<=', $checkInDate->format('Y-m-d'))
                          ->where('check_out_date', '>', $checkInDate->format('Y-m-d'));
                    })->orWhere(function($q) use ($checkInDate, $checkOutDate) {
                        // Check-out date falls within an existing booking
                        $q->where('check_in_date', '<', $checkOutDate->format('Y-m-d'))
                          ->where('check_out_date', '>=', $checkOutDate->format('Y-m-d'));
                    })->orWhere(function($q) use ($checkInDate, $checkOutDate) {
                        // Booking falls completely within the requested dates
                        $q->where('check_in_date', '>=', $checkInDate->format('Y-m-d'))
                          ->where('check_out_date', '<=', $checkOutDate->format('Y-m-d'));
                    });
                })
                ->count();
            
            if ($overlappingBookings > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room is not available for the selected dates',
                    'errors' => ['availability' => ['The room is already booked for the selected dates. Please choose different dates.']]
                ], 422);
            }

            // Check if client exists
            $client = User::find($validatedData['client_id']);
            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client not found',
                    'errors' => ['client_id' => ['The selected client does not exist']]
                ], 422);
            }

            // Prepare booking data with correct field mapping
            $bookingData = [
                'client_id' => $validatedData['client_id'],
                'roomNumber' => $validatedData['room_number'],
                'roomType' => $validatedData['room_type'],
                'check_in_date' => $validatedData['check_in_date'],
                'check_out_date' => $validatedData['check_out_date'],
                'adults' => $validatedData['adults'],
                'children' => $validatedData['children'],
                'extra_beds' => $validatedData['extra_beds'],
                'extra_bed_rate' => $validatedData['extra_bed_rate'],
                'amount' => $validatedData['amount'],
                'total_amount' => $validatedData['total_amount'],
                'special_requests' => $validatedData['special_requests'] ?? '',
                'payment_method' => $validatedData['payment_method'],
                'payment_status' => $validatedData['payment_status'],
                'terms_accepted' => $validatedData['terms_accepted'],
                'status' => $validatedData['status'] ?? 'confirmed',
            ];
            
            // Use provided booking reference or generate a new one
            if (isset($validatedData['booking_reference']) && !empty($validatedData['booking_reference'])) {
                $bookingData['booking_reference'] = $validatedData['booking_reference'];
            } else {
                $bookingData['booking_reference'] = Booking::generateBookingReference();
            }
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Bookings'), $imageName);
                $bookingData['image'] = 'Bookings/' . $imageName;
            }
            
            // Create booking
            $booking = Booking::create($bookingData);

            // Update room status to occupied (valid enum value)
            $room->status = 'occupied';
            $room->save();

            return response()->json([
                'success' => true,
                'booking' => $booking,
                'message' => 'Booking created successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating booking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified booking.
     */
    public function show(string $id)
    {
        try {
            $booking = Booking::with(['client', 'room'])->findOrFail($id);
            return response()->json($booking);
        } catch (\Exception $e) {
            Log::error('Error fetching booking data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }
    }

    /**
     * Update the specified booking in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $booking = Booking::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'room_number' => 'sometimes|required|string',
                'room_type' => 'sometimes|required|string',
                'check_in_date' => 'sometimes|required|date',
                'check_out_date' => 'sometimes|required|date|after:check_in_date',
                'adults' => 'sometimes|required|integer|min:1',
                'children' => 'sometimes|required|integer|min:0',
                'extra_beds' => 'sometimes|required|integer|min:0|max:3',
                'extra_bed_rate' => 'sometimes|required|numeric|min:0',
                'client_id' => 'sometimes|required|exists:users,id',
                'payment_method' => 'sometimes|required|string',
                'amount' => 'sometimes|required|numeric|min:0',
                'total_amount' => 'sometimes|required|numeric|min:0',
                'payment_status' => 'sometimes|required|string|in:pending,paid,partially_paid,cancelled',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'special_requests' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            // Update booking data
            if (isset($validatedData['room_number'])) {
                $booking->roomNumber = $validatedData['room_number'];
            }
            
            if (isset($validatedData['room_type'])) {
                $booking->roomType = $validatedData['room_type'];
            }
            
            if (isset($validatedData['check_in_date'])) {
                $booking->check_in_date = $validatedData['check_in_date'];
            }
            
            if (isset($validatedData['check_out_date'])) {
                $booking->check_out_date = $validatedData['check_out_date'];
            }
            
            if (isset($validatedData['adults'])) {
                $booking->adults = $validatedData['adults'];
            }
            
            if (isset($validatedData['children'])) {
                $booking->children = $validatedData['children'];
            }
            
            if (isset($validatedData['extra_beds'])) {
                $booking->extra_beds = $validatedData['extra_beds'];
            }
            
            if (isset($validatedData['extra_bed_rate'])) {
                $booking->extra_bed_rate = $validatedData['extra_bed_rate'];
            }
            
            if (isset($validatedData['client_id'])) {
                $booking->client_id = $validatedData['client_id'];
            }
            
            if (isset($validatedData['payment_method'])) {
                $booking->payment_method = $validatedData['payment_method'];
            }
            
            if (isset($validatedData['amount'])) {
                $booking->amount = $validatedData['amount'];
            }
            
            if (isset($validatedData['total_amount'])) {
                $booking->total_amount = $validatedData['total_amount'];
            }
            
            if (isset($validatedData['payment_status'])) {
                $booking->payment_status = $validatedData['payment_status'];
            }
            
            if (isset($validatedData['special_requests'])) {
                $booking->special_requests = $validatedData['special_requests'];
            }
            
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($booking->image && file_exists(public_path($booking->image))) {
                    unlink(public_path($booking->image));
                }
                
                $image = $request->file('image');
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Bookings'), $imageName);
                $booking->image = 'Bookings/' . $imageName;
            }
            
            $booking->save();
            
            return response()->json([
                'success' => true,
                'booking' => $booking,
                'message' => 'Booking updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating booking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the booking'
            ], 500);
        }
    }

    /**
     * Remove the specified booking from storage.
     */
    public function destroy(string $id)
    {
        try {
            $booking = Booking::findOrFail($id);
            
            // Get the room to update its status
            $room = Room::where('roomNumber', $booking->roomNumber)->first();
            
            // Delete the booking
            $booking->delete();
            
            // Update room status back to available if it exists
            if ($room) {
                $room->status = 'available';
                $room->save();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting booking: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the booking'
            ], 500);
        }
    }

    /**
     * Create a booking for a client
     */
    public function createClientBooking(Request $request)
    {
        // This method is similar to store but with specific client-focused logic
        return $this->store($request);
    }
}
