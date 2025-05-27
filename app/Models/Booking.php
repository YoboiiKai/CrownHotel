<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'client_id',
        'roomNumber',
        'roomType',
        'check_in_date',
        'check_out_date',
        'adults',
        'children',
        'extra_beds',
        'extra_bed_rate',
        'amount',
        'total_amount',
        'special_requests',
        'booking_reference',
        'payment_method',
        'payment_status',
        'payment_transaction_id',
        'terms_accepted',
        'image',
        'status',
    ];
    
    // Method removed to fix duplicate declaration
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'adults' => 'integer',
        'children' => 'integer',
        'extra_beds' => 'integer',
        'extra_bed_rate' => 'decimal:2',
        'amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'terms_accepted' => 'boolean',
    ];
    
    /**
     * Get the client that owns the booking.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }
    
    /**
     * Get the room that belongs to the booking.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(\App\Models\SuperAdmin\Room::class, 'roomNumber', 'roomNumber');
    }
    
    /**
     * Generate a unique booking reference.
     *
     * @return string
     */
    public static function generateBookingReference(): string
    {
        $prefix = 'HDS-';
        $uniqueId = strtoupper(substr(uniqid(), -6));
        $timestamp = date('Ymd');
        
        return $prefix . $timestamp . '-' . $uniqueId;
    }
}
