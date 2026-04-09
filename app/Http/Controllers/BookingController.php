<?php

namespace App\Http\Controllers;

use Razorpay\Api\Api;
use App\Models\Booking;
use App\Models\BookingPerson;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;



class BookingController extends Controller
{




public function createOrder(Request $request)
{
    $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

    $order = $api->order->create([
        'receipt' => 'yadnya_' . time(),
        'amount' => $request->total_amount * 100,   // paise
        'currency' => 'INR',
        'payment_capture' => 1
    ]);

    return response()->json(['order_id' => $order['id'], 'key' => env('RAZORPAY_KEY_ID')]);
}





// public function verifyPayment(Request $request)
// {
//     $booking = Booking::create([
//         'user_email' => $request->user_email,
//         'yadnya_id' => $request->yadnya_id,
//         'yadnya_date' => $request->yadnya_date,
//         'total_person' => $request->total_person,
//         'total_amount' => $request->total_amount,
//         'payment_id' => $request->razorpay_payment_id,
//         'status' => 'paid'
//     ]);

//     foreach ($request->persons as $person) {
//         BookingPerson::create([
//             'booking_id' => $booking->id,
//             'name' => $person['name'],
//             'email' => $person['email'],
//             'age' => $person['age']
//         ]);
//     }

//     return response()->json([
//         'booking_id' => $booking->id,
//         'message' => 'Booking confirmed!'
//     ]);
// }






public function verifyPayment(Request $request)
{
    // save booking
    $booking = Booking::create([
        'user_email' => $request->user_email,
        'yadnya_id' => $request->yadnya_id,
        'yadnya_date' => $request->yadnya_date,
        'total_person' => $request->total_person,
        'total_amount' => $request->total_amount,
        'payment_id' => $request->razorpay_payment_id,
        'status' => 'paid'
    ]);

    // save persons
    foreach ($request->persons as $person) {
        BookingPerson::create([
            'booking_id' => $booking->id,
            'name' => $person['name'],
            'email' => $person['email'],
            'age' => $person['age']
        ]);
    }

    $persons = BookingPerson::where('booking_id', $booking->id)->get();

    // generate pdf
    $pdf = Pdf::loadView('pdf.booking', [
        'booking' => $booking,
        'persons' => $persons
    ]);

    return $pdf->download('booking.pdf');
}


}