<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MahaprasadBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahaprasad_date_id', 'name', 'email', 'phone', 
        'status', 'shifted_to_date_id'
    ];

    public function date()
    {
        return $this->belongsTo(MahaprasadDate::class, 'mahaprasad_date_id');
    }

    public function shiftedTo()
    {
        return $this->belongsTo(MahaprasadDate::class, 'shifted_to_date_id');
    }
}