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

//-------------------------------------------------(Super Admin)-------------------------------------------------//
Route::middleware('auth', 'verified')->group(function () {
    Route::get('/SuperAdmin/employee', fn () => Inertia::render('SuperAdmin/Employee'))->name('superadmin.employee');
    Route::get('/SuperAdmin/admin', fn () => Inertia::render('SuperAdmin/Admin'))->name('superadmin.admin');
    Route::get('/SuperAdmin/client', fn () => Inertia::render('SuperAdmin/Client'))->name('superadmin.client');
    Route::get('/SuperAdmin/rooms', fn () => Inertia::render('SuperAdmin/Rooms'))->name('superadmin.rooms');
    Route::get('/SuperAdmin/bookings', fn () => Inertia::render('SuperAdmin/Bookings'))->name('superadmin.bookings');
    Route::get('/SuperAdmin/menu', fn () => Inertia::render('SuperAdmin/Menu'))->name('superadmin.menu');
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






  



//--------------------------------------------------(Employee)---------------------------------------------------//










//----------------------------------------------------(Client)--------------------------------------------------//
Route::get('/client/bookinghistory', fn () => Inertia::render('Client/BookingHistory'))->name('client.bookinghistory');
Route::get('/client/rooms', fn () => Inertia::render('Client/Rooms'))->name('client.rooms');
Route::get('/client/feedback', fn () => Inertia::render('Client/Feedback'))->name('client.feedback');
Route::get('/client/menu', fn () => Inertia::render('Client/Menu'))->name('client.menu');
Route::get('/client/orders', fn () => Inertia::render('Client/Orders'))->name('client.orders');
Route::get('/client/reservation', fn () => Inertia::render('Client/Reservation'))->name('client.reservation');
require __DIR__.'/auth.php';
