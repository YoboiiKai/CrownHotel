<?php

namespace App\Models\SuperAdmin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'roomNumber',
        'roomType',
        'price',
        'capacity',
        'status',
        'amenities',
        'description',
        'image',
        'additionalImages',
        'extraBedRate',
    ];

    protected $casts = [
        'price' => 'float',
        'capacity' => 'integer',
        'extraBedRate' => 'float',
        'amenities' => 'json',
        'additionalImages' => 'json',
    ];
    
    /**
     * Get the bookings for the room.
     */
    public function bookings()
    {
        return $this->hasMany(\App\Models\Booking::class, 'roomNumber', 'roomNumber');
    }
}
