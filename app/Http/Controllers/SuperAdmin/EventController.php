<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\SuperAdmin\Event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // Start with a base query
        $query = Event::query();
        
        // Apply filters if provided
        if ($request->has('month') && $request->has('year')) {
            $month = $request->input('month');
            $year = $request->input('year');
            
            // Filter events for the specified month and year
            $query->whereMonth('date', $month)
                  ->whereYear('date', $year);
        }
        
        if ($request->has('event_type') && $request->input('event_type') !== 'all') {
            $query->where('event_type', $request->input('event_type'));
        }
        
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                  ->orWhere('event_type', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%");
            });
        }
        
        // Get the events
        $events = $query->latest()->get();
        
        // Transform snake_case to camelCase for frontend compatibility
        $transformedEvents = $events->map(function ($event) {
            return [
                'id' => $event->id,
                'clientName' => $event->client_name,
                'eventType' => $event->event_type,
                'date' => $event->date,
                'startTime' => $event->start_time,
                'endTime' => $event->end_time,
                'venue' => $event->venue,
                'guestCount' => $event->guest_count,
                'status' => $event->status,
                'contactNumber' => $event->contact_number,
                'email' => $event->email,
                'specialRequests' => $event->special_requests,
                'packageType' => $event->package_type,
                'totalAmount' => $event->total_amount,
                'depositPaid' => $event->deposit_paid,
                'depositAmount' => $event->deposit_amount,
                'paymentStatus' => $event->payment_status,
                'fullyPaid' => $event->fully_paid,
                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at
            ];
        });
        
        return response()->json($transformedEvents);
    }
    
    /**
     * Get events specifically formatted for the calendar view
     */
    public function getCalendarEvents(Request $request)
    {
        try {
            // Start with a base query
            $query = Event::query();
            
            // Apply month/year filter if provided
            if ($request->has('month') && $request->has('year')) {
                $month = $request->input('month');
                $year = $request->input('year');
                
                // Filter events for the specified month and year
                $query->whereMonth('date', $month)
                      ->whereYear('date', $year);
            } else {
                // Default to current month if no specific month/year provided
                $currentMonth = date('m');
                $currentYear = date('Y');
                $query->whereMonth('date', $currentMonth)
                      ->whereYear('date', $currentYear);
            }
            
            // Get the events
            $events = $query->get();
            
            // Transform and group events by date for calendar display
            $calendarEvents = [];
            
            foreach ($events as $event) {
                $date = $event->date->format('Y-m-d');
                
                if (!isset($calendarEvents[$date])) {
                    $calendarEvents[$date] = [];
                }
                
                $calendarEvents[$date][] = [
                    'id' => $event->id,
                    'clientName' => $event->client_name,
                    'eventType' => $event->event_type,
                    'date' => $event->date->format('Y-m-d'),
                    'startTime' => $event->start_time,
                    'endTime' => $event->end_time,
                    'venue' => $event->venue,
                    'status' => $event->status,
                    'paymentStatus' => $event->payment_status,
                    'totalAmount' => $event->total_amount,
                ];
            }
            
            return response()->json([
                'success' => true,
                'events' => $calendarEvents
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error fetching calendar events: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch calendar events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'clientName' => 'required|string|max:255',
                'eventType' => 'required|string|max:255',
                'date' => 'required|date',
                'startTime' => 'required|string',
                'endTime' => 'required|string',
                'venue' => 'required|string|max:255',
                'guestCount' => 'required|integer|min:1',
                'contactNumber' => 'required|string|max:20',
                'email' => 'required|string|email|max:255',
                'specialRequests' => 'nullable|string',
                'packageType' => 'required|string|max:255',
                'totalAmount' => 'required|numeric|min:0',
                'depositAmount' => 'required|numeric|min:0',
                // Optional fields for payment status updates
                'depositPaid' => 'sometimes|boolean',
                'fullyPaid' => 'sometimes|boolean',
                'status' => 'sometimes|string|in:pending,confirmed,cancelled,completed',
            ]);
        
            $event = new Event();
            $event->client_name = $validatedData['clientName'];
            $event->event_type = $validatedData['eventType'];
            $event->date = $validatedData['date'];
            $event->start_time = $validatedData['startTime'];
            $event->end_time = $validatedData['endTime'];
            $event->venue = $validatedData['venue'];
            $event->guest_count = $validatedData['guestCount'];
            $event->contact_number = $validatedData['contactNumber'];
            $event->email = $validatedData['email'];
            $event->special_requests = $validatedData['specialRequests'] ?? null;
            $event->package_type = $validatedData['packageType'];
            $event->total_amount = $validatedData['totalAmount'];
            $event->deposit_amount = $validatedData['depositAmount'];
            
            // Set status and payment fields only if they are provided
            if (isset($validatedData['status'])) {
                $event->status = $validatedData['status'];
            } else if ($event->status === null) {
                // Default status for new events
                $event->status = 'pending';
            }
            
            if (isset($validatedData['depositPaid'])) {
                $event->deposit_paid = $validatedData['depositPaid'];
            }
            
            if (isset($validatedData['fullyPaid'])) {
                $event->fully_paid = $validatedData['fullyPaid'];
            }
            

            
            $event->save();
            
            // Transform snake_case to camelCase for frontend compatibility
            $transformedEvent = [
                'id' => $event->id,
                'clientName' => $event->client_name,
                'eventType' => $event->event_type,
                'date' => $event->date,
                'startTime' => $event->start_time,
                'endTime' => $event->end_time,
                'venue' => $event->venue,
                'guestCount' => $event->guest_count,
                'status' => $event->status,
                'contactNumber' => $event->contact_number,
                'email' => $event->email,
                'specialRequests' => $event->special_requests,
                'packageType' => $event->package_type,
                'totalAmount' => $event->total_amount,
                'depositPaid' => $event->deposit_paid,
                'depositAmount' => $event->deposit_amount,

                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at
            ];
        
            return response()->json([
                'success' => true, 
                'message' => 'Event created successfully',
                'event' => $transformedEvent
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the event: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $event = Event::findOrFail($id);
            
            // Transform snake_case to camelCase for frontend compatibility
            $transformedEvent = [
                'id' => $event->id,
                'clientName' => $event->client_name,
                'eventType' => $event->event_type,
                'date' => $event->date,
                'startTime' => $event->start_time,
                'endTime' => $event->end_time,
                'venue' => $event->venue,
                'guestCount' => $event->guest_count,
                'status' => $event->status,
                'contactNumber' => $event->contact_number,
                'email' => $event->email,
                'specialRequests' => $event->special_requests,
                'packageType' => $event->package_type,
                'totalAmount' => $event->total_amount,
                'depositPaid' => $event->deposit_paid,
                'depositAmount' => $event->deposit_amount,

                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at
            ];
            
            return response()->json($transformedEvent);
        } catch (\Exception $e) {
            Log::error('Error fetching event data: ' . $e->getMessage());
            return response()->json(['error' => 'Event not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $event = Event::findOrFail($id);
            
            $validatedData = $request->validate([
                'clientName' => 'required|string|max:255',
                'eventType' => 'required|string|max:255',
                'date' => 'required|date',
                'startTime' => 'required|string',
                'endTime' => 'required|string',
                'venue' => 'required|string|max:255',
                'guestCount' => 'required|integer|min:1',
                'contactNumber' => 'required|string|max:20',
                'email' => 'required|string|email|max:255',
                'specialRequests' => 'nullable|string',
                'packageType' => 'required|string|max:255',
                'totalAmount' => 'required|numeric|min:0',
                'depositAmount' => 'required|numeric|min:0',
                // Optional fields for payment status updates
                'depositPaid' => 'sometimes|boolean',
                'fullyPaid' => 'sometimes|boolean',
                'status' => 'sometimes|string|in:pending,confirmed,cancelled,completed',
            ]);
            
            $event->client_name = $validatedData['clientName'];
            $event->event_type = $validatedData['eventType'];
            $event->date = $validatedData['date'];
            $event->start_time = $validatedData['startTime'];
            $event->end_time = $validatedData['endTime'];
            $event->venue = $validatedData['venue'];
            $event->guest_count = $validatedData['guestCount'];
            $event->contact_number = $validatedData['contactNumber'];
            $event->email = $validatedData['email'];
            $event->special_requests = $validatedData['specialRequests'] ?? null;
            $event->package_type = $validatedData['packageType'];
            $event->total_amount = $validatedData['totalAmount'];
            $event->deposit_amount = $validatedData['depositAmount'];
            
            // Set status and payment fields only if they are provided
            if (isset($validatedData['status'])) {
                $event->status = $validatedData['status'];
            } else if ($event->status === null) {
                // Default status for new events
                $event->status = 'pending';
            }
            
            if (isset($validatedData['depositPaid'])) {
                $event->deposit_paid = $validatedData['depositPaid'];
            }
            
            if (isset($validatedData['fullyPaid'])) {
                $event->fully_paid = $validatedData['fullyPaid'];
            }
            

            
            $event->save();
            
            // Transform snake_case to camelCase for frontend compatibility
            $transformedEvent = [
                'id' => $event->id,
                'clientName' => $event->client_name,
                'eventType' => $event->event_type,
                'date' => $event->date,
                'startTime' => $event->start_time,
                'endTime' => $event->end_time,
                'venue' => $event->venue,
                'guestCount' => $event->guest_count,
                'status' => $event->status,
                'contactNumber' => $event->contact_number,
                'email' => $event->email,
                'specialRequests' => $event->special_requests,
                'packageType' => $event->package_type,
                'totalAmount' => $event->total_amount,
                'depositPaid' => $event->deposit_paid,
                'depositAmount' => $event->deposit_amount,

                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at
            ];
            
            return response()->json([
                'success' => true, 
                'message' => 'Event updated successfully',
                'event' => $transformedEvent
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the event: ' . $e->getMessage()
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
                'status' => 'required|in:pending,confirmed,cancelled,completed'
            ]);

            $event = Event::findOrFail($id);
            $event->status = $validatedData['status'];
            $event->save();

            return response()->json([
                'success' => true, 
                'event' => $event,
                'message' => 'Event status updated successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating event status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the event status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the payment status of an event.
     */
    public function updatePaymentStatus(Request $request, string $id)
    {
        try {
            // Validate the request
            $validatedData = $request->validate([
                'status' => 'required|string|in:unpaid,deposit_paid,fully_paid'
            ]);
            
            // Find the event
            $event = Event::findOrFail($id);
            
            // Get the payment status from the request
            $status = $validatedData['status'];
            
            // Update the payment_status field
            $event->payment_status = $status;
            
            // Save the changes
            $event->save();
            
            // Return a success response with the updated event
            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully',
                'event' => $event
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error setting payment status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating payment status',
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
            $event = Event::findOrFail($id);
            $event->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the event: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm the specified event.
     */
    public function confirm(string $id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->status = 'confirmed';
            $event->save();

            return response()->json([
                'success' => true, 
                'event' => $event,
                'message' => 'Event confirmed successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error confirming event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while confirming the event: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel the specified event.
     */
    public function cancel(string $id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->status = 'cancelled';
            $event->save();

            return response()->json([
                'success' => true, 
                'event' => $event,
                'message' => 'Event cancelled successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error cancelling event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while cancelling the event: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import multiple events from array data
     */
    public function import(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'events' => 'required|array',
                'events.*.clientName' => 'required|string|max:255',
                'events.*.eventType' => 'required|string|max:255',
                'events.*.date' => 'required|date',
                'events.*.startTime' => 'required|string',
                'events.*.endTime' => 'required|string',
                'events.*.venue' => 'required|string|max:255',
                'events.*.guestCount' => 'required|integer|min:1',
                'events.*.contactNumber' => 'required|string|max:20',
                'events.*.email' => 'required|email',
                'events.*.packageType' => 'required|string|max:255',
                'events.*.totalAmount' => 'required|numeric|min:0',
                'events.*.depositAmount' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $events = $request->events;
            $imported = 0;
            $errors = [];

            // Begin transaction
            \DB::beginTransaction();

            foreach ($events as $index => $eventData) {
                try {
                    // Create the event
                    Event::create([
                        'client_name' => $eventData['clientName'],
                        'event_type' => $eventData['eventType'],
                        'date' => $eventData['date'],
                        'start_time' => $eventData['startTime'],
                        'end_time' => $eventData['endTime'],
                        'venue' => $eventData['venue'],
                        'guest_count' => $eventData['guestCount'],
                        'status' => 'pending',
                        'contact_number' => $eventData['contactNumber'],
                        'email' => $eventData['email'],
                        'special_requests' => $eventData['specialRequests'] ?? null,
                        'package_type' => $eventData['packageType'],
                        'total_amount' => $eventData['totalAmount'],
                        'deposit_paid' => false,
                        'deposit_amount' => $eventData['depositAmount']
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
                'total' => count($events),
                'errors' => $errors
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('Error importing events: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while importing events: ' . $e->getMessage()
            ], 500);
        }
    }
}
