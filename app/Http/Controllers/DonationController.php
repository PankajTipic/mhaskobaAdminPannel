<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Razorpay\Api\Api;
// use Razorpay\Api\Errors\BadRequestError;
// use Illuminate\Support\Facades\Log;
// use App\Models\Donation;

// class DonationController extends Controller
// {
//     protected $razorpay;

//     public function __construct()
//     {
//         $keyId     = config('services.razorpay.key_id');
//         $keySecret = config('services.razorpay.key_secret');

//         // Safety check - prevent constructor from failing silently
//         if (empty($keyId) || empty($keySecret)) {
//             Log::critical('Razorpay keys are missing in configuration', [
//                 'key_id'     => $keyId ? 'set' : 'MISSING',
//                 'key_secret' => $keySecret ? 'set' : 'MISSING',
//             ]);
//             // You can throw exception here in development, or handle gracefully
//         }

//         $this->razorpay = new Api($keyId, $keySecret);
//     }

//     /**
//      * Create Razorpay Order
//      */
//     public function initiate(Request $request)
//     {
//         $validated = $request->validate([
//             'name'    => 'required|string|max:255',
//             'email'   => 'required|email|max:255',
//             'phone'   => 'required|string|max:15',
//             'amount'  => 'required|numeric|min:1',
//             'purpose' => 'required|string|max:50',
//             'message' => 'nullable|string|max:1000',
//         ]);

//         // Optional: extra validation for amount (Razorpay min 1 INR = 100 paise)
//         if ($validated['amount'] < 1) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'किमान दान रक्कम ₹1 असणे आवश्यक आहे.'
//             ], 422);
//         }

//         try {
//             $orderData = [
//                 'receipt'         => 'don_' . time() . '_' . substr(md5($validated['email']), 0, 8),
//                 'amount'          => (int) ($validated['amount'] * 100), // must be integer paise
//                 'currency'        => 'INR',
//                 'partial_payment' => false,
//                 'notes'           => [
//                     'donor_name'    => $validated['name'],
//                     'donor_email'   => $validated['email'],
//                     'donor_phone'   => $validated['phone'],
//                     'purpose'       => $validated['purpose'],
//                     'message'       => $validated['message'] ?? null,
//                 ]
//             ];

//             $razorpayOrder = $this->razorpay->order->create($orderData);

//             return response()->json([
//                 'success'     => true,
//                 'order_id'    => $razorpayOrder['id'],
//                 'amount'      => $razorpayOrder['amount'],      // in paise
//                 'amount_rupee'=> $validated['amount'],          // helper for frontend
//                 'key'         => config('services.razorpay.key_id'),
//                 'name'        => $validated['name'],
//                 'email'       => $validated['email'],
//                 'phone'       => $validated['phone'],
//                 'purpose'     => $validated['purpose'],
//             ]);

//         } catch (BadRequestError $e) {
//             // Most common: invalid keys, wrong amount, etc.
//             Log::error('Razorpay BadRequestError in order creation', [
//                 'message' => $e->getMessage(),
//                 'code'    => $e->getCode(),
//                 'data'    => $e->getData(),
//                 'input'   => $validated,
//             ]);

//             $errorMsg = $e->getMessage() ?: 'अवैध API की किंवा रक्कम';

//             return response()->json([
//                 'success' => false,
//                 'message' => 'तांत्रिक त्रुटी: ' . $errorMsg,
//                 'debug'   => app()->environment('local') ? $e->getData() : null,
//             ], 400);

//         } catch (\Exception $e) {
//             Log::error('Razorpay General Error in order creation', [
//                 'message' => $e->getMessage(),
//                 'trace'   => $e->getTraceAsString(),
//                 'input'   => $validated,
//             ]);

//             return response()->json([
//                 'success' => false,
//                 'message' => 'तांत्रिक त्रुटी: ' . ($e->getMessage() ?: 'कृपया पुन्हा प्रयत्न करा'),
//             ], 500);
//         }
//     }

//     /**
//      * Verify payment signature & save donation
//      */
//     public function verify(Request $request)
//     {
//         $data = $request->validate([
//             'razorpay_order_id'   => 'required|string',
//             'razorpay_payment_id' => 'required|string',
//             'razorpay_signature'  => 'required|string',
//             'name'                => 'nullable|string',
//             'email'               => 'nullable|email',
//             'phone'               => 'nullable|string',
//         ]);

//         $expectedSignature = hash_hmac(
//             'sha256',
//             $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'],
//             config('services.razorpay.key_secret')
//         );

//         if (!hash_equals($expectedSignature, $data['razorpay_signature'])) {
//             Log::warning('Razorpay signature verification failed', $data);

//             return response()->json([
//                 'success' => false,
//                 'message' => 'पेमेंट सत्यापन अयशस्वी - Signature mismatch'
//             ], 400);
//         }

//         // Signature valid → save donation
//         try {
//             Donation::create([
//                 'name'           => $data['name']           ?? 'Unknown',
//                 'email'          => $data['email']          ?? null,
//                 'phone'          => $data['phone']          ?? null,
//                 'amount'         => $request->input('amount', 0) / 100, // frontend should send amount again or fetch from order
//                 'purpose'        => $request->input('purpose', 'general'),
//                 'message'        => $request->input('message'),
//                 'transaction_id' => $data['razorpay_payment_id'],
//                 'order_id'       => $data['razorpay_order_id'],
//                 'status'         => 'success',
//                 'payment_method' => $request->input('method', 'unknown'),
//             ]);

//             return response()->json([
//                 'success' => true,
//                 'message' => 'दान यशस्वी! आपले मनापासून आभार.'
//             ]);

//         } catch (\Exception $e) {
//             Log::error('Failed to save donation after verification', [
//                 'error' => $e->getMessage(),
//                 'data'  => $data,
//             ]);

//             return response()->json([
//                 'success' => false,
//                 'message' => 'दान रेकॉर्ड करताना त्रुटी आली, पण पेमेंट यशस्वी झाले असू शकते. कृपया admin@yourdomain.com ला संपर्क साधा.'
//             ], 500);
//         }
//     }
// }















// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Razorpay\Api\Api;
// use Razorpay\Api\Errors\BadRequestError;
// use Illuminate\Support\Facades\Log;
// use App\Models\Donation;

// class DonationController extends Controller
// {
//     protected $razorpay;

//     public function __construct()
//     {
//         $keyId     = config('services.razorpay.key_id');
//         $keySecret = config('services.razorpay.key_secret');

//         // Safety check - prevent constructor from failing silently
//         if (empty($keyId) || empty($keySecret)) {
//             Log::critical('Razorpay keys are missing in configuration', [
//                 'key_id'     => $keyId ? 'set' : 'MISSING',
//                 'key_secret' => $keySecret ? 'set' : 'MISSING',
//             ]);
//             // In production you might want to throw an exception or handle differently
//         }

//         $this->razorpay = new Api($keyId, $keySecret);
//     }

//     /**
//      * Create Razorpay Order
//      */
//     public function initiate(Request $request)
//     {
//         $validated = $request->validate([
//             'name'    => 'required|string|max:255',
//             'email'   => 'required|email|max:255',
//             'phone'   => 'required|string|max:15',
//             'amount'  => 'required|numeric|min:1',
//             'purpose' => 'required|string|max:50',
//             'message' => 'nullable|string|max:1000',
//         ]);

//         // Extra validation: minimum amount (Razorpay requires at least 1 INR)
//         if ($validated['amount'] < 1) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'किमान दान रक्कम ₹1 असणे आवश्यक आहे.'
//             ], 422);
//         }

//         try {
//             $orderData = [
//                 'receipt'         => 'don_' . time() . '_' . substr(md5($validated['email'] ?? 'guest'), 0, 8),
//                 'amount'          => (int) ($validated['amount'] * 100), // convert to paise (integer required)
//                 'currency'        => 'INR',
//                 'partial_payment' => false,
//                 'notes'           => [
//                     'donor_name'    => $validated['name'],
//                     'donor_email'   => $validated['email'],
//                     'donor_phone'   => $validated['phone'],
//                     'purpose'       => $validated['purpose'],
//                     'message'       => $validated['message'] ?? null,
//                 ]
//             ];

//             $razorpayOrder = $this->razorpay->order->create($orderData);

//             return response()->json([
//                 'success'     => true,
//                 'order_id'    => $razorpayOrder['id'],
//                 'amount'      => $razorpayOrder['amount'],      // in paise
//                 'amount_rupee'=> $validated['amount'],          // helper for frontend
//                 'key'         => config('services.razorpay.key_id'),
//                 'name'        => $validated['name'],
//                 'email'       => $validated['email'],
//                 'phone'       => $validated['phone'],
//                 'purpose'     => $validated['purpose'],
//             ]);

//         } catch (BadRequestError $e) {
//             // Common Razorpay validation/auth errors
//             Log::error('Razorpay BadRequestError in order creation', [
//                 'message' => $e->getMessage(),
//                 'code'    => $e->getCode(),
//                 'data'    => $e->getData(),
//                 'input'   => $validated,
//             ]);

//             $errorMsg = $e->getMessage() ?: 'अवैध API की किंवा रक्कम';

//             return response()->json([
//                 'success' => false,
//                 'message' => 'तांत्रिक त्रुटी: ' . $errorMsg,
//                 'debug'   => app()->environment('local') ? $e->getData() : null,
//             ], 400);

//         } catch (\Exception $e) {
//             Log::error('Razorpay General Error in order creation', [
//                 'message' => $e->getMessage(),
//                 'trace'   => $e->getTraceAsString(),
//                 'input'   => $validated,
//             ]);

//             return response()->json([
//                 'success' => false,
//                 'message' => 'तांत्रिक त्रुटी: ' . ($e->getMessage() ?: 'कृपया पुन्हा प्रयत्न करा'),
//             ], 500);
//         }
//     }

//     /**
//      * Verify payment signature & save donation
//      */
//     public function verify(Request $request)
//     {
//         $data = $request->validate([
//             'razorpay_order_id'   => 'required|string',
//             'razorpay_payment_id' => 'required|string',
//             'razorpay_signature'  => 'required|string',
//             'name'                => 'nullable|string',
//             'email'               => 'nullable|email',
//             'phone'               => 'nullable|string',
//             'amount'              => 'nullable|numeric',     // in rupees
//             'purpose'             => 'nullable|string|max:50',
//             'message'             => 'nullable|string|max:1000',
//         ]);

//         // Verify Razorpay signature
//         $expectedSignature = hash_hmac(
//             'sha256',
//             $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'],
//             config('services.razorpay.key_secret')
//         );

//         if (!hash_equals($expectedSignature, $data['razorpay_signature'])) {
//             Log::warning('Razorpay signature verification failed', $data);

//             return response()->json([
//                 'success' => false,
//                 'message' => 'पेमेंट सत्यापन अयशस्वी - Signature mismatch'
//             ], 400);
//         }

//         // Signature is valid → try to save donation
//         try {
//             Donation::create([
//                 'name'           => $data['name']           ?? 'Anonymous',
//                 'email'          => $data['email']          ?? null,
//                 'phone'          => $data['phone']          ?? null,
//                 'amount'         => $data['amount'] , // convert to rupees
//                 'purpose'        => $data['purpose']        ?? 'general',
//                 'message'        => $data['message']        ?? null,
//                 'transaction_id' => $data['razorpay_payment_id'],
//                 'order_id'       => $data['razorpay_order_id'],
//                 'status'         => 'success',
//                 'payment_method' => $request->input('method', 'razorpay'),
//             ]);

//             return response()->json([
//                 'success' => true,
//                 'message' => 'दान यशस्वी! आपले मनापासून आभार.'
//             ]);
//         } catch (\Exception $e) {
//             // Log the failure but DO NOT fail the user response
//             // (payment already succeeded — DB issue is secondary)
//             Log::error('Donation save failed after successful payment', [
//                 'error'    => $e->getMessage(),
//                 'trace'    => $e->getTraceAsString(),
//                 'order_id' => $data['razorpay_order_id'] ?? 'unknown',
//                 'payment_id' => $data['razorpay_payment_id'] ?? 'unknown',
//             ]);

//             return response()->json([
//                 'success' => true,
//                 'message' => 'दान यशस्वी झाले! (आमच्या रेकॉर्डमध्ये थोडी त्रुटी आली - आम्ही लवकरच संपर्क करू.)'
//             ]);
//         }
//     }
// }


























namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\BadRequestError;
use Illuminate\Support\Facades\Log;
use App\Models\Donation;
use Barryvdh\DomPDF\Facade\Pdf;

class DonationController extends Controller
{
    protected $razorpay;

    public function __construct()
    {
        $keyId     = config('services.razorpay.key_id');
        $keySecret = config('services.razorpay.key_secret');

        if (empty($keyId) || empty($keySecret)) {
            Log::critical('Razorpay keys are missing in configuration');
        }

        $this->razorpay = new Api($keyId, $keySecret);
    }

    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'required|string|max:15',
            'amount'  => 'required|numeric|min:1',
            'purpose' => 'required|string|max:100',
            'message' => 'nullable|string|max:1000',
        ]);

        try {
            $orderData = [
                'receipt'         => 'don_' . time() . '_' . substr(md5($validated['email']), 0, 8),
                'amount'          => (int) ($validated['amount'] * 100),
                'currency'        => 'INR',
                'partial_payment' => false,
                'notes'           => [
                    'donor_name'  => $validated['name'],
                    'donor_email' => $validated['email'],
                    'donor_phone' => $validated['phone'],
                    'purpose'     => $validated['purpose'],
                    'message'     => $validated['message'] ?? null,
                ]
            ];

            $razorpayOrder = $this->razorpay->order->create($orderData);

            return response()->json([
                'success'      => true,
                'order_id'     => $razorpayOrder['id'],
                'amount'       => $razorpayOrder['amount'],
                'amount_rupee' => $validated['amount'],
                'key'          => config('services.razorpay.key_id'),
                'name'         => $validated['name'],
                'email'        => $validated['email'],
                'phone'        => $validated['phone'],
                'purpose'      => $validated['purpose'],
            ]);

        } catch (BadRequestError $e) {
            Log::error('Razorpay BadRequestError', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'तांत्रिक त्रुटी: ' . $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            Log::error('Razorpay Error in initiate', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'कृपया पुन्हा प्रयत्न करा.'
            ], 500);
        }
    }

    public function verify(Request $request)
    {
        $data = $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
            'name'                => 'required|string',
            'email'               => 'nullable|email',
            'phone'               => 'required|string',
            'amount'              => 'required|numeric',
            'purpose'             => 'nullable|string',
            'message'             => 'nullable|string',
        ]);

        // Verify Signature
        $expectedSignature = hash_hmac(
            'sha256',
            $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'],
            config('services.razorpay.key_secret')
        );

        if (!hash_equals($expectedSignature, $data['razorpay_signature'])) {
            Log::warning('Razorpay signature verification failed');
            return response()->json([
                'success' => false, 
                'message' => 'Invalid payment signature'
            ], 400);
        }

        // Save Donation
        try {
            Donation::create([
                'name'           => $data['name'],
                'email'          => $data['email'],
                'phone'          => $data['phone'],
                'amount'         => $data['amount'],
                'purpose'        => $data['purpose'] ?? 'general',
                'message'        => $data['message'],
                'transaction_id' => $data['razorpay_payment_id'],
                'order_id'       => $data['razorpay_order_id'],
                'status'         => 'success',
                'payment_method' => 'razorpay',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to save donation', ['error' => $e->getMessage()]);
        }

        // Generate PDF
        $pdfData = [
            'name'          => $data['name'],
            'phone'         => $data['phone'],
            'email'         => $data['email'] ?? 'N/A',
            'amount'        => $data['amount'],
            'purpose'       => $data['purpose'] ?? 'General Donation',
            'transaction_id'=> $data['razorpay_payment_id'],
            'order_id'      => $data['razorpay_order_id'],
            'payment_date'  => now()->format('d M Y, h:i A'),
            'method'        => 'Razorpay',
        ];

        $pdf = Pdf::loadView('pdf.donation_receipt', $pdfData);

        // Return PDF for download
        return $pdf->download('Donation_Receipt_' . $data['razorpay_payment_id'] . '.pdf');
    }
}