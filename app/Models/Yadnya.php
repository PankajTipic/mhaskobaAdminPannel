<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Yadnya extends Model {
    protected $table = 'yadnya';
    protected $fillable = ['title', 'description', 'price_per_person', 'status'];
    public function dates() { return $this->hasMany(YadnyaDate::class); }
}