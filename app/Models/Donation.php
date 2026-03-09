<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'amount',
        'purpose',
        'message',
        'transaction_id',
        'order_id',
        'status',
        'payment_method',
    ];

    // Optional: cast amount to float/decimal
    protected $casts = [
        'amount' => 'decimal:2',
    ];
}