<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_email',
        'yadnya_id',
        'yadnya_date',
        'total_person',
        'total_amount',
        'payment_id',
        'status'
    ];

    protected $casts = [
        'yadnya_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    // Relationship
    public function yadnya()
    {
        return $this->belongsTo(Yadnya::class);
    }
}