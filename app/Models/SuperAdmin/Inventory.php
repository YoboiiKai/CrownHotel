<?php

namespace App\Models\SuperAdmin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'itemName',
        'itemCode',
        'category',
        'quantity',
        'unit',
        'minStockLevel',
        'price',
        'supplier',
        'location',
        'description',
        'image',
        'lastRestocked'
    ];

    protected $casts = [
        'quantity' => 'float',
        'minStockLevel' => 'float',
        'price' => 'float',
        'lastRestocked' => 'datetime'
    ];
}
