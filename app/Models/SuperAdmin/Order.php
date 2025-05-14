<?php

namespace App\Models\SuperAdmin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'roomNumber',
        'customerName',
        'items',
        'images',
        'subtotal',
        'discount',
        'total',
        'notes',
        'isSeniorCitizen',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'isSeniorCitizen' => 'boolean',
        'items' => 'array',
        'images' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the total number of items in the order
     *
     * @return int
     */
    public function getTotalItemsAttribute(): int
    {
        if (empty($this->items)) {
            return 0;
        }
        
        return collect($this->items)->sum('quantity');
    }

    /**
     * Get formatted status label
     *
     * @return string
     */
    public function getStatusLabelAttribute(): string
    {
        $statusLabels = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled'
        ];

        return $statusLabels[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Get status color class for UI
     *
     * @return string
     */
    public function getStatusColorAttribute(): string
    {
        $statusColors = [
            'pending' => 'amber',
            'processing' => 'blue',
            'completed' => 'green',
            'cancelled' => 'red'
        ];

        return $statusColors[$this->status] ?? 'gray';
    }

    /**
     * Get formatted date
     *
     * @return string
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('M d, Y h:i A');
    }

    /**
     * Get formatted total with currency symbol
     *
     * @return string
     */
    public function getFormattedTotalAttribute(): string
    {
        return '₱' . number_format($this->total, 2);
    }
}
