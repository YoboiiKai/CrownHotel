<?php

namespace App\Models\SuperAdmin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'client_name',
        'event_type',
        'date',
        'start_time',
        'end_time',
        'venue',
        'guest_count',
        'status',
        'contact_number',
        'email',
        'special_requests',
        'package_type',
        'total_amount',
        'deposit_paid',
        'fully_paid',
        'deposit_amount',
        'payment_status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'guest_count' => 'integer',
        'total_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'deposit_paid' => 'boolean',
        'fully_paid' => 'boolean',
        'payment_status' => 'string',
    ];
}
