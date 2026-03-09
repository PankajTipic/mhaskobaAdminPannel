<?php

namespace App\Http\Controllers;

use App\Models\RazorpayPayment;
use Illuminate\Http\Request;

class RazorpayPaymentController extends Controller
{
    /**
     * Display a listing of the payments.
     */
    public function index()
    {
        $payments = RazorpayPayment::all();
        return response()->json($payments);
    }

    /**
     * Store a newly created payment in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:15',
            'type' => 'required|string|max:50',
            'amount' => 'required|numeric',
            'transaction_id' => 'required|string|unique:razorpay_payments,transaction_id',
            'payment_id' => 'required|string|unique:razorpay_payments,payment_id',
            'order_id' => 'required|string',
            'status' => 'required|string|max:50',
            'currency' => 'nullable|string|max:10',
            'method' => 'nullable|string|max:50',
            'receipt' => 'nullable|string|max:255',
            'response' => 'nullable|json',
        ]);

        $payment = RazorpayPayment::create($request->all());
        return response()->json(['message' => 'Payment created successfully', 'payment' => $payment]);
    }

    /**
     * Display the specified payment.
     */
    public function show($id)
    {
        $payment = RazorpayPayment::findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Update the specified payment in storage.
     */
    public function update(Request $request, $id)
    {
        $payment = RazorpayPayment::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'mobile' => 'string|max:15',
            'type' => 'string|max:50',
            'amount' => 'numeric',
            'transaction_id' => 'string|unique:razorpay_payments,transaction_id,' . $id,
            'payment_id' => 'string|unique:razorpay_payments,payment_id,' . $id,
            'order_id' => 'string',
            'status' => 'string|max:50',
            'currency' => 'nullable|string|max:10',
            'method' => 'nullable|string|max:50',
            'receipt' => 'nullable|string|max:255',
            'response' => 'nullable|json',
        ]);

        $payment->update($request->all());
        return response()->json(['message' => 'Payment updated successfully', 'payment' => $payment]);
    }

    /**
     * Remove the specified payment from storage.
     */
    public function destroy($id)
    {
        $payment = RazorpayPayment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
