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
    ];

    protected $casts = [
        'price' => 'float',
        'capacity' => 'integer',
        'amenities' => 'json',
        'additionalImages' => 'json',
    ];
}
