<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Handle successful payment.
     */
    public function success(Request $request)
    {
        // Fetch payment details from the query string
        $transactionId = $request->query('transaction_id', 'txn_123456789'); // Example default
        $amountPaid = $request->query('amount', 500); // Example default amount
        $paymentDate = now()->format('d M Y, h:i A'); // Current date and time

        // Pass data to the view
        return view('payment.success', compact('transactionId', 'amountPaid', 'paymentDate'));
    }
}
