<?php

// namespace App\Http\Controllers\Admin;

// use App\Http\Controllers\Controller;
// use App\Models\Yadnya;
// use Illuminate\Http\Request;

// class YadnyaController extends Controller
// {
//     // Get All Yadnya (For Admin + Frontend)
//     public function index()
//     {
//         $yadnyas = Yadnya::with('dates')->latest()->get();
//         return response()->json($yadnyas);
//     }

//     // Store New Yadnya
//     public function store(Request $request)
//     {
//         $request->validate([
//             'title' => 'required|string|max:255',
//             'description' => 'nullable|string',
//             'price_per_person' => 'required|numeric|min:1',
//             'status' => 'required|in:active,inactive'
//         ]);

//         $yadnya = Yadnya::create($request->all());

//         return response()->json([
//             'message' => 'Yadnya created successfully',
//             'yadnya' => $yadnya
//         ], 201);
//     }

//     // Show Single Yadnya
//     public function show($id)
//     {
//         $yadnya = Yadnya::with('dates')->findOrFail($id);
//         return response()->json($yadnya);
//     }

//     // Update Yadnya
//     public function update(Request $request, $id)
//     {
//         $request->validate([
//             'title' => 'required|string|max:255',
//             'description' => 'nullable|string',
//             'price_per_person' => 'required|numeric|min:1',
//             'status' => 'required|in:active,inactive'
//         ]);

//         $yadnya = Yadnya::findOrFail($id);
//         $yadnya->update($request->all());

//         return response()->json([
//             'message' => 'Yadnya updated successfully',
//             'yadnya' => $yadnya
//         ]);
//     }

//     // Delete Yadnya
//     public function destroy($id)
//     {
//         $yadnya = Yadnya::findOrFail($id);
//         $yadnya->delete();

//         return response()->json([
//             'message' => 'Yadnya deleted successfully'
//         ]);
//     }

//     // Toggle Status (Active / Inactive)
//     public function toggleStatus($id)
//     {
//         $yadnya = Yadnya::findOrFail($id);
//         $yadnya->status = $yadnya->status === 'active' ? 'inactive' : 'active';
//         $yadnya->save();

//         return response()->json([
//             'message' => 'Status updated successfully',
//             'status' => $yadnya->status
//         ]);
//     }
// }





namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Yadnya;
use App\Models\YadnyaDate;
use App\Models\BookingPerson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class YadnyaController extends Controller
{
    public function index()
    {
        $yadnyas = Yadnya::with('dates')->latest()->get();
        return response()->json($yadnyas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_person' => 'required|numeric|min:1',
            'status' => 'required|in:active,inactive',
            'dates' => 'required|array|min:1',
            'dates.*' => 'required|date|after:today'
        ]);

        $yadnya = Yadnya::create($request->only(['title', 'description', 'price_per_person', 'status']));

        // Save multiple dates
        foreach ($request->dates as $date) {
            YadnyaDate::create([
                'yadnya_id' => $yadnya->id,
                'event_date' => $date
            ]);
        }

        return response()->json([
            'message' => 'Yadnya created successfully with dates',
            'yadnya' => $yadnya->load('dates')
        ], 201);
    }

    public function show($id)
    {
        $yadnya = Yadnya::with('dates')->findOrFail($id);
        return response()->json($yadnya);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_person' => 'required|numeric|min:1',
            'status' => 'required|in:active,inactive',
            'dates' => 'nullable|array',
            'dates.*' => 'date|after:today'
        ]);

        $yadnya = Yadnya::findOrFail($id);
        $yadnya->update($request->only(['title', 'description', 'price_per_person', 'status']));

        // Delete old dates and add new ones (if dates are sent)
        if ($request->has('dates')) {
            YadnyaDate::where('yadnya_id', $id)->delete();
            foreach ($request->dates as $date) {
                YadnyaDate::create([
                    'yadnya_id' => $id,
                    'event_date' => $date
                ]);
            }
        }

        return response()->json([
            'message' => 'Yadnya updated successfully',
            'yadnya' => $yadnya->load('dates')
        ]);
    }

    public function destroy($id)
    {
        $yadnya = Yadnya::findOrFail($id);
        $yadnya->delete();   // This will also delete dates due to cascadeOnDelete in migration
        return response()->json(['message' => 'Yadnya deleted successfully']);
    }

    public function getDates($id)
{
    $dates = DB::table('yadnya_dates')
        ->where('yadnya_id', $id)
        ->get();

    return response()->json($dates);
}

// public function getBookedPerson()
// {
//     $persons = BookingPerson::with([
//         'booking.yadnya'
//     ])->get();

//     return response()->json($persons);
// }

public function getBookedPerson()
{
    $data = BookingPerson::with('booking.yadnya')
        ->get()
        ->groupBy(function ($item) {
            return $item->booking->yadnya->title . '|' . $item->booking->yadnya_date;
        });

    return response()->json($data);
}

}