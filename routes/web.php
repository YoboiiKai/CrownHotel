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

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin Management Routes
    Route::apiResource('/api/admins', \App\Http\Controllers\Admin\AdminController::class);
    Route::apiResource('/api/employees', \App\Http\Controllers\Employee\EmployeeController::class);
    Route::apiResource('/api/clients', \App\Http\Controllers\Client\ClientController::class);
    Route::apiResource('/api/suppliers', \App\Http\Controllers\Supplier\SupplierController::class);

    // Client Management Routes
    Route::put('/api/admins/{id}/activate', [\App\Http\Controllers\Admin\AdminController::class, 'activate'])->name('admin.activate');
    Route::put('/api/employees/{id}/activate', [\App\Http\Controllers\Employee\EmployeeController::class, 'activate'])->name('employee.activate');
    Route::put('/api/admins/{id}/deactivate', [\App\Http\Controllers\Admin\AdminController::class, 'deactivate'])->name('admin.deactivate');
    Route::put('/api/employees/{id}/deactivate', [\App\Http\Controllers\Employee\EmployeeController::class, 'deactivate'])->name('employee.deactivate');
    Route::put('/api/clients/{id}/deactivate', [\App\Http\Controllers\Client\ClientController::class, 'deactivate'])->name('client.deactivate');
    Route::put('/api/clients/{id}/activate', [\App\Http\Controllers\Client\ClientController::class, 'activate'])->name('client.activate');
    Route::put('/api/suppliers/{id}/activate', [\App\Http\Controllers\Supplier\SupplierController::class, 'activate'])->name('supplier.activate');
    Route::put('/api/suppliers/{id}/deactivate', [\App\Http\Controllers\Supplier\SupplierController::class, 'deactivate'])->name('supplier.deactivate');


    // Menu Management Routes
    Route::apiResource('/api/menu', \App\Http\Controllers\SuperAdmin\MenuController::class);
    Route::put('/api/menu/{id}/status', [\App\Http\Controllers\SuperAdmin\MenuController::class, 'updateStatus'])->name('menu.status');
    
    // Room Management Routes
    Route::apiResource('/api/superadmin/rooms', \App\Http\Controllers\SuperAdmin\RoomController::class);
    Route::put('/api/superadmin/rooms/{id}/status', [\App\Http\Controllers\SuperAdmin\RoomController::class, 'updateStatus'])->name('room.status');
    
    // Inventory Management Routes
    Route::apiResource('/api/inventory', \App\Http\Controllers\SuperAdmin\InventoryController::class);
    Route::put('/api/inventory/{id}/stock', [\App\Http\Controllers\SuperAdmin\InventoryController::class, 'updateStock'])->name('inventory.stock');
    Route::get('/api/inventory/low-stock', [\App\Http\Controllers\SuperAdmin\InventoryController::class, 'getLowStock'])->name('inventory.lowstock');
    
    // Event Management Routes
    Route::apiResource('/api/events', \App\Http\Controllers\SuperAdmin\EventController::class);
    Route::get('/api/calendar-events', [\App\Http\Controllers\SuperAdmin\EventController::class, 'getCalendarEvents'])->name('events.calendar');
    Route::put('/api/events/{id}/status', [\App\Http\Controllers\SuperAdmin\EventController::class, 'updateStatus'])->name('events.status');
    Route::post('/api/events/{id}/payment-status', [\App\Http\Controllers\SuperAdmin\EventController::class, 'updatePaymentStatus'])->name('events.payment-status');
    
    // Room Management Routes
    Route::apiResource('/api/rooms', \App\Http\Controllers\SuperAdmin\RoomController::class);
    
    // Order Management Routes
    Route::apiResource('/api/orders', \App\Http\Controllers\SuperAdmin\OrderController::class);
    Route::put('/api/orders/{id}/status', [\App\Http\Controllers\SuperAdmin\OrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('/api/orders-stats', [\App\Http\Controllers\SuperAdmin\OrderController::class, 'getStats'])->name('orders.stats');
    
    // Task Management Routes
    Route::apiResource('/api/tasks', \App\Http\Controllers\SuperAdmin\TaskController::class);
    Route::put('/api/tasks/{id}/status', [\App\Http\Controllers\SuperAdmin\TaskController::class, 'updateStatus'])->name('tasks.status');
    Route::get('/api/task-employees', [\App\Http\Controllers\SuperAdmin\TaskController::class, 'getEmployees'])->name('tasks.employees');

});

//-------------------------------------------------(Super Admin)-------------------------------------------------//
Route::middleware('auth', 'verified')->group(function () {
    Route::get('/SuperAdmin/employee', fn () => Inertia::render('SuperAdmin/Employee'))->name('superadmin.employee');
    Route::get('/SuperAdmin/admin', fn () => Inertia::render('SuperAdmin/Admin'))->name('superadmin.admin');
    Route::get('/SuperAdmin/client', fn () => Inertia::render('SuperAdmin/Client'))->name('superadmin.client');
    Route::get('/SuperAdmin/suppliers', fn () => Inertia::render('SuperAdmin/Suppliers'))->name('superadmin.suppliers');
    Route::get('/SuperAdmin/rooms', fn () => Inertia::render('SuperAdmin/Rooms'))->name('superadmin.rooms');
    Route::get('/SuperAdmin/bookings', fn () => Inertia::render('SuperAdmin/Bookings'))->name('superadmin.bookings');
    Route::get('/SuperAdmin/bookingcalendar', fn () => Inertia::render('SuperAdmin/BookingCalendar'))->name('superadmin.bookingcalendar');
    Route::get('/SuperAdmin/menu', fn () => Inertia::render('SuperAdmin/Menu'))->name('superadmin.menu');
    Route::get('/SuperAdmin/posmenu', fn () => Inertia::render('SuperAdmin/PosMenu'))->name('superadmin.posmenu');
    Route::get('/SuperAdmin/orders', fn () => Inertia::render('SuperAdmin/Orders'))->name('superadmin.orders');
    Route::get('/SuperAdmin/inventory', fn () => Inertia::render('SuperAdmin/Inventory'))->name('superadmin.inventory');
    Route::get('/SuperAdmin/eventsres', fn () => Inertia::render('SuperAdmin/EventRes'))->name('superadmin.eventsres');
    Route::get('/SuperAdmin/reservationcalendar', fn () => Inertia::render('SuperAdmin/ReservationCalendar'))->name('superadmin.reservationcalendar');
    Route::get('/SuperAdmin/purchaseorders', fn () => Inertia::render('SuperAdmin/PurchaseOrders'))->name('superadmin.purchaseorders');
    Route::get('/SuperAdmin/reports', fn () => Inertia::render('SuperAdmin/Reports'))->name('superadmin.reports');
    Route::get('/SuperAdmin/settings', fn () => Inertia::render('SuperAdmin/Settings'))->name('superadmin.settings');
    Route::get('/SuperAdmin/feedback', fn () => Inertia::render('SuperAdmin/Feedback'))->name('superadmin.feedback');
    Route::get('/SuperAdmin/task', fn () => Inertia::render('SuperAdmin/Task'))->name('superadmin.task');

    
});

//----------------------------------------------------(Admin)----------------------------------------------------//
Route::middleware('auth', 'verified')->group(function () {
    Route::get('/Admin/AdminClient', fn () => Inertia::render('Admin/AdminClient'))->name('admin.client');
    Route::get('/Admin/AdminEmployee', fn () => Inertia::render('Admin/AdminEmployee'))->name('admin.employee');
    Route::get('/Admin/AdminRooms', fn () => Inertia::render('Admin/AdminRooms'))->name('admin.rooms');
    Route::get('/Admin/Bookings', fn () => Inertia::render('Admin/Bookings'))->name('admin.bookings');
    Route::get('/Admin/BookingCalendar', fn () => Inertia::render('Admin/BookingCalendar'))->name('admin.bookingcalendar');
    Route::get('/Admin/AdminReservationCalendar', fn () => Inertia::render('Admin/AdminReservationCalendar'))->name('admin.reservationcalendar');
    Route::get('/Admin/AdminEventReservation', fn () => Inertia::render('Admin/AdminEventReservation'))->name('admin.eventreservation');
    Route::get('/Admin/AdminMenu', fn () => Inertia::render('Admin/AdminMenu'))->name('admin.menu');
    Route::get('/Admin/AdminPosMenu', fn () => Inertia::render('Admin/AdminPosMenu'))->name('admin.posmenu');
    Route::get('/Admin/AdminOrders', fn () => Inertia::render('Admin/AdminOrders'))->name('admin.orders');
    Route::get('/Admin/AdminTask', fn () => Inertia::render('Admin/AdminTask'))->name('admin.task');
    Route::get('/Admin/Feedback', fn () => Inertia::render('Admin/Feedback'))->name('admin.feedback');
    Route::get('/Admin/AdminInventory', fn () => Inertia::render('Admin/AdminInventory'))->name('admin.inventory');
    Route::get('/Admin/PurchaseOrders', fn () => Inertia::render('Admin/PurchaseOrders'))->name('admin.purchaseorders');
    Route::get('/Admin/Reports', fn () => Inertia::render('Admin/Reports'))->name('admin.reports');
    Route::get('/Admin/Settings', fn () => Inertia::render('Admin/Settings'))->name('admin.settings');
});

//--------------------------------------------------(Employee)---------------------------------------------------//
Route::get('/employee/tasklist', fn () => Inertia::render('Employee/TaskList'))->name('employee.tasklist');








//----------------------------------------------------(Client)--------------------------------------------------//
Route::get('/client/bookinghistory', fn () => Inertia::render('Client/BookingHistory'))->name('client.bookinghistory');
Route::get('/client/rooms', fn () => Inertia::render('Client/Rooms'))->name('client.rooms');
Route::get('/client/feedback', fn () => Inertia::render('Client/Feedback'))->name('client.feedback');
Route::get('/client/menu', fn () => Inertia::render('Client/Menu'))->name('client.menu');
Route::get('/client/orders', fn () => Inertia::render('Client/Orders'))->name('client.orders');
Route::get('/client/reservation', fn () => Inertia::render('Client/Reservation'))->name('client.reservation');
require __DIR__.'/auth.php';
