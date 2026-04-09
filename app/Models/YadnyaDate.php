<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YadnyaDate extends Model {
    protected $table = 'yadnya_dates';
    protected $fillable = ['yadnya_id', 'event_date'];
}