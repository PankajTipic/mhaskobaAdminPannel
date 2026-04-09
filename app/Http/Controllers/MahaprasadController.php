<?php

namespace App\Http\Controllers;

use App\Models\MahaprasadDate;
use App\Models\MahaprasadBooking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MahaprasadController extends Controller
{
    // Get all upcoming dates
    public function index()
    {
        $dates = MahaprasadDate::where('event_date', '>=', Carbon::today())
            ->orderBy('event_date')
            ->get();

        return response()->json($dates);
    }

    // Get remaining slots for a date
    public function getSlots($id)
    {
        $date = MahaprasadDate::findOrFail($id);
        $remaining = $date->max_limit - $date->booked_count;

        return response()->json([
            'remaining' => max(0, $remaining),
            'max_limit' => $date->max_limit,
            'booked_count' => $date->booked_count,
            'is_open' => $date->status === 'open' && $remaining > 0
        ]);
    }

    // Book Mahaprasad (1 slot per booking)
    public function book(Request $request)
    {
        $request->validate([
            'mahaprasad_date_id' => 'required|exists:mahaprasad_dates,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:15',
        ]);

        $date = MahaprasadDate::findOrFail($request->mahaprasad_date_id);

        if ($date->status === 'closed' || $date->booked_count >= $date->max_limit) {
            return response()->json(['error' => 'All slots are booked for this date'], 400);
        }

        $booking = MahaprasadBooking::create([
            'mahaprasad_date_id' => $request->mahaprasad_date_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            // 'status' => 'confirmed'
            'status' => 'pending'
        ]);

        $date->increment('booked_count');

        // Auto close if full
        if ($date->booked_count >= $date->max_limit) {
            $date->update(['status' => 'closed']);
        }

        return response()->json([
            'message' => 'Booking submitted. Waiting for admin confirmation',
            'booking' => $booking,
            'remaining_slots' => $date->max_limit - $date->booked_count
        ]);
    }


//     public function book(Request $request)
// {
//     $user = $request->user();

//     $booking = MahaprasadBooking::create([
//         'mahaprasad_date_id' => $request->mahaprasad_date_id,
//         'name' => $request->name,
//         'phone' => $request->phone,
//         'email' => $user->email,
//         'status' => 'confirmed'
//     ]);

//     return response()->json([
//         'message' => 'Booking successful'
//     ]);
// }







    // ==================== ADMIN METHODS ====================

// Get all dates with booking stats for Admin
public function adminDates()
{
    $dates = MahaprasadDate::withCount('bookings')
        ->orderBy('event_date')
        ->get();

    return response()->json($dates);
}

// Create new Sunday or Special Event
// public function createDate(Request $request)
// {
//     $request->validate([
//         'event_date' => 'required|date|unique:mahaprasad_dates,event_date',
//         'max_limit' => 'integer|min:1',
//         'type' => 'in:sunday,event'
//     ]);

//     $date = MahaprasadDate::create([
//         'event_date' => $request->event_date,
//         'max_limit' => $request->max_limit ?? 10,
//         'type' => $request->type ?? 'sunday',
//         'status' => 'open'
//     ]);

//     return response()->json([
//         'message' => 'Date created successfully',
//         'date' => $date
//     ]);
// }

public function createDate(Request $request)
{
    $request->validate([
        'event_date' => 'required|date|unique:mahaprasad_dates,event_date',
        'max_limit' => 'integer|min:1',
        'type' => 'required|in:sunday,event',
        'event_details' => 'nullable|string|max:500'
    ]);

    $date = MahaprasadDate::create([
        'event_date' => $request->event_date,
        'max_limit' => $request->max_limit ?? 10,
        'type' => $request->type,
        'event_details' => $request->event_details,
        'status' => 'open'
    ]);

    return response()->json([
        'message' => 'Date created successfully',
        'date' => $date
    ]);
}




// Get all bookings for a specific date
public function dateBookings($id)
{
    $date = MahaprasadDate::with('bookings')->findOrFail($id);

    return response()->json([
        'date' => $date->event_date,
        'max_limit' => $date->max_limit,
        'booked_count' => $date->bookings_count,
        'remaining' => $date->max_limit - $date->bookings_count,
        'bookings' => $date->bookings
    ]);
}

// Shift a booking to another date
public function shiftBooking(Request $request, $bookingId)
{
    $request->validate([
        'new_date_id' => 'required|exists:mahaprasad_dates,id'
    ]);

    $booking = MahaprasadBooking::findOrFail($bookingId);
    $oldDate = $booking->date;
    $newDate = MahaprasadDate::findOrFail($request->new_date_id);

    if ($newDate->booked_count >= $newDate->max_limit) {
        return response()->json(['error' => 'Target date is full'], 400);
    }

    $booking->update([
        'mahaprasad_date_id' => $newDate->id,
        'status' => 'shifted',
        'shifted_to_date_id' => $newDate->id
    ]);

    $oldDate->decrement('booked_count');
    $newDate->increment('booked_count');

    return response()->json(['message' => 'Booking shifted successfully']);
}

// Cancel a booking
// public function cancelBooking($bookingId)
// {
//     $booking = MahaprasadBooking::findOrFail($bookingId);
//     $date = $booking->date;

//     $booking->update(['status' => 'cancelled']);
//     $date->decrement('booked_count');

//     // Re-open date if it was closed
//     if ($date->status === 'closed' && $date->booked_count < $date->max_limit) {
//         $date->update(['status' => 'open']);
//     }

//     return response()->json(['message' => 'Booking cancelled successfully']);
// }





// Auto Generate All Sundays of Current Month
public function generateCurrentMonthSundays()
{
    $start = Carbon::now()->startOfMonth();
    $end = Carbon::now()->endOfMonth();

    $generated = [];

    $date = $start->copy()->next(Carbon::SUNDAY);

    while ($date->lte($end)) {
        if (!MahaprasadDate::where('event_date', $date->toDateString())->exists()) {
            MahaprasadDate::create([
                'event_date' => $date->toDateString(),
                'max_limit'  => 10,
                'type'       => 'sunday',
                'status'     => 'open'
            ]);
            $generated[] = $date->toDateString();
        }
        $date->addWeek();
    }

    return response()->json([
        'message' => 'Sundays generated successfully for current month',
        'sundays' => $generated
    ]);
}

// Get all available dates for shifting (used in modal)
public function availableDatesForShift()
{
    $dates = MahaprasadDate::where('event_date', '>=', Carbon::today())
        ->where('status', 'open')
        ->orderBy('event_date')
        ->get(['id', 'event_date', 'type']);

    return response()->json($dates);
}









/**
 * Get User's Own Bookings
 */
// public function myBookings(Request $request)
// {
//     $userEmail = $request->query('email');

//     if (!$userEmail) {
//         return response()->json(['error' => 'Email is required'], 400);
//     }

//     $bookings = MahaprasadBooking::where('email', $userEmail)
//         ->with([
//             'date',                    // Current booking date
//             'shiftedTo'                // Date it was shifted to (if shifted)
//         ])
//         ->orderBy('created_at', 'desc')
//         ->get();

//     // Optional: Add some useful computed fields for frontend
//     $bookings = $bookings->map(function ($booking) {
//         return [
//             'id' => $booking->id,
//             'name' => $booking->name,
//             'email' => $booking->email,
//             'phone' => $booking->phone,
//             'status' => $booking->status,
//             'created_at' => $booking->created_at,

//             // Current Date Info
//             'date' => $booking->date ? [
//                 'event_date' => $booking->date->event_date,
//                 'type' => $booking->date->type,
//                 'event_details' => $booking->date->event_details,
//             ] : null,

//             // Shifted Date Info (only if shifted)
//             'shiftedTo' => $booking->shiftedTo ? [
//                 'event_date' => $booking->shiftedTo->event_date,
//                 'type' => $booking->shiftedTo->type,
//                 'event_details' => $booking->shiftedTo->event_details,
//             ] : null,
//         ];
//     });

//     return response()->json($bookings);
// }



public function myBookings(Request $request)
{
    $user = $request->user();

    $bookings = MahaprasadBooking::with('date','shiftedTo')
        ->where('email', $user->email)
        ->latest()
        ->get();

    return response()->json($bookings);
}




public function confirmBooking($id)
{
    $booking = MahaprasadBooking::findOrFail($id);
    $booking->status = 'confirmed';
    $booking->save();

    return response()->json(['message' => 'Confirmed']);
}

public function pendingBooking($id)
{
    $booking = MahaprasadBooking::findOrFail($id);
    $booking->status = 'pending';
    $booking->save();

    return response()->json(['message' => 'Pending']);
}

public function cancelBooking($id)
{
    $booking = MahaprasadBooking::findOrFail($id);
    $booking->status = 'cancelled';
    $booking->save();

    return response()->json(['message' => 'Cancelled']);
}



}