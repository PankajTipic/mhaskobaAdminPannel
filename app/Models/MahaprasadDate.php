<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MahaprasadDate extends Model
{
    use HasFactory;

    protected $fillable = ['event_date', 'max_limit', 'booked_count', 'type', 'status', 'event_details'];

    public function bookings()
    {
        return $this->hasMany(MahaprasadBooking::class);
    }
}