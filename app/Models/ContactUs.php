<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'contact_us';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        // 'name',
        // 'email',
        // 'mobile',
        // 'queries',

        'name',
        'email',
        'phone',     // ← changed from mobile
        'subject',   // ← added
        'message',
        'is_read', 'read_at',
    ];




    protected $casts = [
        'is_read'  => 'boolean',
        'read_at'  => 'datetime',
    ];

    // Optional helper
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function markAsUnread()
    {
        $this->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }
}
