<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RazorpayPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'mobile',
        'type',
        'amount',
        'transaction_id',
        'receipt',
        'payment_id',
        'order_id',
        'status',
        'currency',
        'method',
        'response',
    ];

    protected $casts = [
        'response' => 'array', // Automatically decode JSON response field
    ];
}
