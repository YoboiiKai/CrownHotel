<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Public API routes for Welcome page
Route::prefix('api')->group(function () {
    // Public routes that don't require authentication
    Route::get('rooms', [\App\Http\Controllers\PublicController::class, 'rooms']);
});

// Debug route to check rooms in database
Route::get('/debug/rooms', function() {
    $rooms = \App\Models\SuperAdmin\Room::all();
    return response()->json([
        'count' => $rooms->count(),
        'rooms' => $rooms
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // User Management Routes
    // Admin Routes
    Route::apiResource('/api/admins', \App\Http\Controllers\Admin\AdminController::class);
    
    // Feedback Routes
    Route::get('/api/feedback', [\App\Http\Controllers\API\FeedbackController::class, 'index']);
    Route::post('/api/feedback', [\App\Http\Controllers\API\FeedbackController::class, 'store']);
    Route::delete('/api/feedback/{id}', [\App\Http\Controllers\API\FeedbackController::class, 'destroy']);
    Route::put('/api/admins/{id}/activate', [\App\Http\Controllers\Admin\AdminController::class, 'activate'])->name('admin.activate');
    Route::put('/api/admins/{id}/deactivate', [\App\Http\Controllers\Admin\AdminController::class, 'deactivate'])->name('admin.deactivate');
    
    // Employee Routes
    Route::apiResource('/api/employees', \App\Http\Controllers\Employee\EmployeeController::class);
    Route::put('/api/employees/{id}/activate', [\App\Http\Controllers\Employee\EmployeeController::class, 'activate'])->name('employee.activate');
    Route::put('/api/employees/{id}/deactivate', [\App\Http\Controllers\Employee\EmployeeController::class, 'deactivate'])->name('employee.deactivate');
    
    // Client Routes
    Route::apiResource('/api/clients', \App\Http\Controllers\Client\ClientController::class);
    Route::put('/api/clients/{id}/activate', [\App\Http\Controllers\Client\ClientController::class, 'activate'])->name('client.activate');
    Route::put('/api/clients/{id}/deactivate', [\App\Http\Controllers\Client\ClientController::class, 'deactivate'])->name('client.deactivate');
    
    // Attendance Management Routes
    Route::apiResource('/api/attendance', \App\Http\Controllers\SuperAdmin\AttendanceController::class);
    Route::put('/api/attendance/{id}/status', [\App\Http\Controllers\SuperAdmin\AttendanceController::class, 'updateStatus'])->name('attendance.status');
    Route::get('/api/attendance/by-date/{date}', [\App\Http\Controllers\SuperAdmin\AttendanceController::class, 'getByDate'])->name('attendance.byDate');
    Route::get('/api/attendance/employee/{id}', [\App\Http\Controllers\SuperAdmin\AttendanceController::class, 'getByEmployee'])->name('attendance.byEmployee');
    
    // SuperAdmin Room Management Routes
    Route::prefix('api/superadmin')->group(function () {
        // Specific routes must come before resource routes to avoid conflicts
        Route::get('rooms/with-bookings', [\App\Http\Controllers\SuperAdmin\RoomController::class, 'roomsWithBookings']);
        Route::put('rooms/{id}/status', [\App\Http\Controllers\SuperAdmin\RoomController::class, 'updateStatus']);
        Route::apiResource('rooms', \App\Http\Controllers\SuperAdmin\RoomController::class);
    });
    
    // Client API Routes
    Route::prefix('api/client')->group(function () {
        // Client Room Routes
        Route::get('rooms', [\App\Http\Controllers\Client\RoomController::class, 'index']);
        Route::get('rooms/{id}', [\App\Http\Controllers\Client\RoomController::class, 'show']);
        Route::post('rooms/check-availability', [\App\Http\Controllers\Client\RoomController::class, 'checkAvailability']);
        
        // Client Booking Routes
        Route::post('bookings', [\App\Http\Controllers\Client\BookingController::class, 'store']);
        Route::get('bookings', [\App\Http\Controllers\Client\BookingController::class, 'index']);
        Route::get('bookings/{id}', [\App\Http\Controllers\Client\BookingController::class, 'show']);
    });
    // Route moved to SuperAdmin routes group
    
    // Booking Management Routes
    Route::post('/api/client-bookings', [\App\Http\Controllers\SuperAdmin\BookingController::class, 'createClientBooking'])->name('bookings.createClient');
    Route::get('/api/calendar-bookings', [\App\Http\Controllers\SuperAdmin\BookingController::class, 'getCalendarBookings'])->name('bookings.calendar');
    Route::apiResource('/api/bookings', \App\Http\Controllers\SuperAdmin\BookingController::class);
    
    // Event Management Routes
    Route::apiResource('/api/events', \App\Http\Controllers\SuperAdmin\EventController::class);
    Route::get('/api/calendar-events', [\App\Http\Controllers\SuperAdmin\EventController::class, 'getCalendarEvents'])->name('events.calendar');
    Route::put('/api/events/{id}/status', [\App\Http\Controllers\SuperAdmin\EventController::class, 'updateStatus'])->name('events.status');
    Route::post('/api/events/{id}/payment-status', [\App\Http\Controllers\SuperAdmin\EventController::class, 'updatePaymentStatus'])->name('events.payment-status');
    
    //Restaurant Routes
    // Menu Management Routes
    Route::apiResource('/api/menu', \App\Http\Controllers\SuperAdmin\MenuController::class);
    Route::put('/api/menu/{id}/status', [\App\Http\Controllers\SuperAdmin\MenuController::class, 'updateStatus'])->name('menu.status');
    
    // Order Management Routes
    Route::apiResource('/api/orders', \App\Http\Controllers\SuperAdmin\OrderController::class);
    Route::put('/api/orders/{id}/status', [\App\Http\Controllers\SuperAdmin\OrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('/api/orders-stats', [\App\Http\Controllers\SuperAdmin\OrderController::class, 'getStats'])->name('orders.stats');
    
    // Task Management Routes (Housekeeping)
    Route::apiResource('/api/tasks', \App\Http\Controllers\SuperAdmin\TaskController::class);
    Route::put('/api/tasks/{id}/status', [\App\Http\Controllers\SuperAdmin\TaskController::class, 'updateStatus'])->name('tasks.status');
    Route::get('/api/task-employees', [\App\Http\Controllers\SuperAdmin\TaskController::class, 'getEmployees'])->name('tasks.employees');
    
    // Booking Management Routes
    Route::apiResource('/api/bookings', \App\Http\Controllers\SuperAdmin\BookingController::class);
    Route::post('/api/bookings/{id}/status', [\App\Http\Controllers\SuperAdmin\BookingController::class, 'updateStatus'])->name('bookings.status');
    Route::post('/api/bookings/{id}/payment-status', [\App\Http\Controllers\SuperAdmin\BookingController::class, 'updatePaymentStatus'])->name('bookings.payment-status');
    Route::get('/api/calendar-bookings', [\App\Http\Controllers\SuperAdmin\BookingController::class, 'getCalendarBookings'])->name('bookings.calendar');
    
    // Client Booking Routes
    Route::get('/api/client/bookings', [\App\Http\Controllers\Client\BookingController::class, 'getClientBookings'])->name('client.bookings');
    
    // Inventory Management Routes
    Route::apiResource('/api/inventory', \App\Http\Controllers\SuperAdmin\InventoryController::class);
    Route::put('/api/inventory/{id}/stock', [\App\Http\Controllers\SuperAdmin\InventoryController::class, 'updateStock'])->name('inventory.stock');
    Route::get('/api/inventory/low-stock', [\App\Http\Controllers\SuperAdmin\InventoryController::class, 'getLowStock'])->name('inventory.lowstock');
});

//-------------------------------------------------(Super Admin)-------------------------------------------------//
Route::middleware('auth', 'verified')->group(function () {
    
    // User Management Routes
    Route::get('/SuperAdmin/admin', fn () => Inertia::render('SuperAdmin/Admin'))->name('superadmin.admin');
    Route::get('/SuperAdmin/employee', fn () => Inertia::render('SuperAdmin/Employee'))->name('superadmin.employee');
    Route::get('/SuperAdmin/client', fn () => Inertia::render('SuperAdmin/Client'))->name('superadmin.client');
    Route::get('/SuperAdmin/suppliers', fn () => Inertia::render('SuperAdmin/Suppliers'))->name('superadmin.suppliers');
    
    // Attendance Management
    Route::get('/SuperAdmin/attendance', fn () => Inertia::render('SuperAdmin/Attendance'))->name('superadmin.attendance');
    Route::get('/SuperAdmin/attendance/schedule', fn () => Inertia::render('SuperAdmin/EmployeeSchedule'))->name('superadmin.attendance.schedule');
    
    // Room Management
    Route::get('/SuperAdmin/rooms', fn () => Inertia::render('SuperAdmin/Rooms'))->name('superadmin.rooms');
    Route::get('/SuperAdmin/bookings', fn () => Inertia::render('SuperAdmin/Bookings'))->name('superadmin.bookings');
    Route::get('/SuperAdmin/bookingcalendar', fn () => Inertia::render('SuperAdmin/BookingCalendar'))->name('superadmin.bookingcalendar');
    
    // Event/Reservation Management
    Route::get('/SuperAdmin/reservationcalendar', fn () => Inertia::render('SuperAdmin/ReservationCalendar'))->name('superadmin.reservationcalendar');
    Route::get('/SuperAdmin/eventsres', fn () => Inertia::render('SuperAdmin/EventRes'))->name('superadmin.eventsres');
    
    // Restaurant Management
    Route::get('/SuperAdmin/menu', fn () => Inertia::render('SuperAdmin/Menu'))->name('superadmin.menu');
    Route::get('/SuperAdmin/posmenu', fn () => Inertia::render('SuperAdmin/PosMenu'))->name('superadmin.posmenu');
    Route::get('/SuperAdmin/orders', fn () => Inertia::render('SuperAdmin/Orders'))->name('superadmin.orders');
    
    // Housekeeping/Task Management
    Route::get('/SuperAdmin/task', fn () => Inertia::render('SuperAdmin/Task'))->name('superadmin.task');
    
    // Inventory Management
    Route::get('/SuperAdmin/inventory', fn () => Inertia::render('SuperAdmin/Inventory'))->name('superadmin.inventory');
    Route::get('/SuperAdmin/purchaseorders', fn () => Inertia::render('SuperAdmin/PurchaseOrders'))->name('superadmin.purchaseorders');
    
    // Reports
    Route::get('/SuperAdmin/reports', fn () => Inertia::render('SuperAdmin/Reports'))->name('superadmin.reports');
    
    // Feedback
    Route::get('/SuperAdmin/feedback', fn () => Inertia::render('SuperAdmin/Feedback'))->name('superadmin.feedback');
    
    // Settings
    Route::get('/SuperAdmin/settings', fn () => Inertia::render('SuperAdmin/Settings'))->name('superadmin.settings');
});

//----------------------------------------------------(Admin)----------------------------------------------------//
Route::middleware('auth', 'verified')->group(function () {
    
    // User Management Routes
    Route::get('/Admin/AdminEmployee', fn () => Inertia::render('Admin/AdminEmployee'))->name('admin.employee');
    Route::get('/Admin/AdminClient', fn () => Inertia::render('Admin/AdminClient'))->name('admin.client');
    
    // Attendance Management
    Route::get('/Admin/AdminAttendanceSchedule', fn () => Inertia::render('Admin/AdminAttendanceSchedule'))->name('admin.attendance.schedule');
    Route::get('/Admin/AdminAttendanceMark', fn () => Inertia::render('Admin/AdminAttendanceMark'))->name('admin.attendance.mark');
    
    // Room Management
    Route::get('/Admin/AdminRooms', fn () => Inertia::render('Admin/AdminRooms'))->name('admin.rooms');
    Route::get('/Admin/Bookings', fn () => Inertia::render('Admin/Bookings'))->name('admin.bookings');
    Route::get('/Admin/BookingCalendar', fn () => Inertia::render('Admin/BookingCalendar'))->name('admin.bookingcalendar');
    
    // Event/Reservation Management
    Route::get('/Admin/AdminReservationCalendar', fn () => Inertia::render('Admin/AdminReservationCalendar'))->name('admin.reservationcalendar');
    Route::get('/Admin/AdminEventReservation', fn () => Inertia::render('Admin/AdminEventReservation'))->name('admin.eventreservation');
    
    // Restaurant Management
    Route::get('/Admin/AdminMenu', fn () => Inertia::render('Admin/AdminMenu'))->name('admin.menu');
    Route::get('/Admin/AdminPosMenu', fn () => Inertia::render('Admin/AdminPosMenu'))->name('admin.posmenu');
    Route::get('/Admin/AdminOrders', fn () => Inertia::render('Admin/AdminOrders'))->name('admin.orders');
    
    // Housekeeping/Task Management
    Route::get('/Admin/AdminTask', fn () => Inertia::render('Admin/AdminTask'))->name('admin.task');
    
    // Inventory Management
    Route::get('/Admin/AdminInventory', fn () => Inertia::render('Admin/AdminInventory'))->name('admin.inventory');
    Route::get('/Admin/AdminPurchaseOrders', fn () => Inertia::render('Admin/AdminPurchaseOrders'))->name('admin.purchaseorders');
    
    // Reports
    Route::get('/Admin/Reports', fn () => Inertia::render('Admin/Reports'))->name('admin.reports');
    
    // Feedback
    Route::get('/Admin/Feedback', fn () => Inertia::render('Admin/Feedback'))->name('admin.feedback');
    
    // Settings
    Route::get('/Admin/Settings', fn () => Inertia::render('Admin/Settings'))->name('admin.settings');
});

//--------------------------------------------------(Employee)---------------------------------------------------//
Route::middleware('auth', 'verified')->group (function (){
    Route::get('/employee/tasklist', fn () => Inertia::render('Employee/TaskList'))->name('employee.tasklist');
});








//----------------------------------------------------(Client)--------------------------------------------------//
Route::middleware('auth', 'verified')->group (function (){
    Route::get('/client/bookinghistory', fn () => Inertia::render('Client/BookingHistory'))->name('client.bookinghistory');
    Route::get('/client/rooms', fn () => Inertia::render('Client/Rooms'))->name('client.rooms');
    Route::get('/client/feedback', fn () => Inertia::render('Client/Feedback'))->name('client.feedback');
    Route::get('/client/menu', fn () => Inertia::render('Client/Menu'))->name('client.menu');
    Route::get('/client/orders', fn () => Inertia::render('Client/Orders'))->name('client.orders');
    Route::get('/client/reservation', fn () => Inertia::render('Client/Reservation'))->name('client.reservation');
});



//----------------------------------------------------(Kitchen)--------------------------------------------------//

require __DIR__.'/auth.php';
