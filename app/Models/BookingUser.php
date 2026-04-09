<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class BookingUser extends Model
{
    use HasApiTokens;

    protected $fillable = [
        'email',
        'otp',
        'otp_expires_at',
        'is_verified'
    ];
}