<?php
 
// namespace App\Http\Controllers;
 
// use Illuminate\Http\Request;
// use Razorpay\Api\Api;
 
// class RazorpayController extends Controller
// {
//     protected $api;
 
//     public function __construct()
//     {
//         $this->api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
//     }
 
//     // Create Order
//     public function createOrder(Request $request)
//     {
//         $amount = $request->amount;
//         $currency = $request->currency;
 
//         try {
//             $orderData = [
//                 'receipt' => 'order_rcptid_' . rand(1000, 9999),
//                 'amount' => $amount * 100, // Convert to paise
//                 'currency' => $currency,
//                 'payment_capture' => 1,
//             ];
 
//             $order = $this->api->order->create($orderData);
 
//             \Log::info('Order Created: ', $order->toArray());
 
//             return response()->json([
//                 'success' => true,
//                 'order' => $order->toArray(),
//             ], 201);
//         } catch (\Exception $e) {
//             \Log::error('Order Creation Failed: ' . $e->getMessage());
 
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Failed to create order. ' . $e->getMessage(),
//             ], 500);
//         }
//     }
 
//     // Verify Payment
//     public function verifyPayment(Request $request)
//     {
//         $request->validate([
//             'razorpay_order_id' => 'required',
//             'razorpay_payment_id' => 'required',
//             'razorpay_signature' => 'required',
//         ]);
 
//         try {
//             $attributes = [
//                 'razorpay_order_id' => $request->razorpay_order_id,
//                 'razorpay_payment_id' => $request->razorpay_payment_id,
//                 'razorpay_signature' => $request->razorpay_signature,
//             ];
 
//             $this->api->utility->verifyPaymentSignature($attributes);
 
//             return response()->json(['success' => true, 'message' => 'Payment verified successfully']);
//         } catch (\Exception $e) {
//             return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
//         }
//     }
 
//     // Create Plan
// //     public function createPlan(Request $request)
// //     {
// //         $request->validate([
// //             'period' => 'required|string', // 'daily', 'weekly', 'monthly', or 'yearly'
// //             'interval' => 'required|integer', // e.g., 1 (every month)
// //             'amount' => 'required|numeric',
// //             'currency' => 'required|string',
// //             'description' => 'required|string',
// //         ]);
 
// //         try {
// //             $planData = [
// //                 'period' => $request->period,
// //                 'interval' => $request->interval,
// //                 'item' => [
// //                     'name' => 'Subscription Plan',
// //                     'amount' => $request->amount * 100, // Convert to paise
// //                     'currency' => $request->currency,
// //                     'description' => $request->description,
// //                 ],
// //             ];
 
// //             $plan = $this->api->plan->create($planData);
 
// //             return response()->json([
// //                 'success' => true,
// //                 'plan' => $plan->toArray(),
// //             ], 201);
// //         } catch (\Exception $e) {
// //             \Log::error('Plan Creation Failed: ' . $e->getMessage());
 
// //             return response()->json([
// //                 'success' => false,
// //                 'message' => 'Failed to create plan. ' . $e->getMessage(),
// //             ], 500);
// //         }
// //     }
 
// //     // Create Subscription
// //     public function createSubscription(Request $request)
// // {
// //     // Validate input data
// //     $request->validate([
// //         'plan_id' => 'required|string', // Plan ID created earlier
// //         'customer_email' => 'required|email', // Customer email
// //         'customer_contact' => 'required|string', // Customer contact number
// //     ]);
 
// //     try {
// //         // Prepare subscription data
// //         $subscriptionData = [
// //             'plan_id' => $request->plan_id,
// //             'total_count' => null, // Leave null for an infinite subscription
// //             'quantity' => 1, // Number of units for the plan
// //             'customer_notify' => 1, // Notify customer on subscription creation
// //             'addons' => [],
// //             'notes' => [
// //                 'note_key' => 'note_value', // Custom notes
// //             ],
// //         ];
 
// //         // Create a customer (if not already created)
// //         $customer = $this->api->customer->create([
// //             'email' => $request->customer_email,
// //             'contact' => $request->customer_contact,
// //         ]);
 
// //         // Add customer ID to the subscription data
// //         $subscriptionData['customer_id'] = $customer->id;
 
// //         // Create the subscription
// //         $subscription = $this->api->subscription->create($subscriptionData);
 
// //         return response()->json([
// //             'success' => true,
// //             'subscription' => $subscription->toArray(),
// //         ], 201);
// //     } catch (\Exception $e) {
// //         \Log::error('Subscription Creation Failed: ' . $e->getMessage());
 
// //         return response()->json([
// //             'success' => false,
// //             'message' => 'Failed to create subscription. ' . $e->getMessage(),
// //         ], 500);
// //     }
// // }


// }





 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;

use Razorpay\Api\Api;
 
class RazorpayController extends Controller

{

    protected $api;
 
    public function __construct()

    {

        $this->api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

    }
 
    // Create Order

    public function createOrder(Request $request)

    {

        $amount = $request->amount;

        $currency = $request->currency;
 
        try {

            $orderData = [

                'receipt' => 'order_rcptid_' . rand(1000, 9999),

                'amount' => $amount * 100, // Convert to paise

                'currency' => $currency,

                'payment_capture' => 1,

            ];
 
            $order = $this->api->order->create($orderData);
 
            \Log::info('Order Created: ', $order->toArray());
 
            return response()->json([

                'success' => true,

                'order' => $order->toArray(),

            ], 201);

        } catch (\Exception $e) {

            \Log::error('Order Creation Failed: ' . $e->getMessage());
 
            return response()->json([

                'success' => false,

                'message' => 'Failed to create order. ' . $e->getMessage(),

            ], 500);

        }

    }
 
    // Verify Payment

    public function verifyPayment(Request $request)

    {

        $request->validate([

            'razorpay_order_id' => 'required',

            'razorpay_payment_id' => 'required',

            'razorpay_signature' => 'required',

        ]);
 
        try {

            $attributes = [

                'razorpay_order_id' => $request->razorpay_order_id,

                'razorpay_payment_id' => $request->razorpay_payment_id,

                'razorpay_signature' => $request->razorpay_signature,

            ];
 
            $this->api->utility->verifyPaymentSignature($attributes);
 
            return response()->json(['success' => true, 'message' => 'Payment verified successfully']);

        } catch (\Exception $e) {

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);

        }

    }
 
    // Create Plan
public function createPlan(Request $request)
{
    // $request->validate([
    //     'period' => 'string', // 'daily', 'weekly', 'monthly', or 'yearly'
    //     'interval' => 'integer', // e.g., 1 (every month)
    //     'amount' => 'numeric',
    //     'currency' => 'string',
    //     'description' => 'string'
    // ]);


    $request->validate([
        'name' => 'required | string',
        'period' => 'required | string', // 'daily', 'weekly', 'monthly', or 'yearly'
        'interval' => 'required |integer', // e.g., 1 (every month)
        'amount' => 'required |numeric',
        'currency' => 'required |string',
        // 'description' => 'string'
    ]);

 
    try {
        $planData = [
            'period' => $request->period,                   //$request->period  'monthly'
            'interval' => 1,                  //    $request->interval
            'item' => [
                'name' =>  $request->name,                           // 'test plan 1',   $request->name
                'amount' =>$request->amount * 100, // Convert to paise                   $request->amount
                'currency' => 'INR',
                // 'description' => $request->description,
            ],
        ];
 
        $plan = $this->api->plan->create($planData);
        $subscription = $this->api->subscription->create([      
               'plan_id' => $plan->id,       
                 'total_count' =>12,      
                    'customer_notify' => 1,     ]);     
        return response()->json([
            'success' => true,
            'sid' => $subscription->id, 
        ], 201);
    } catch (\Exception $e) {
        \Log::error('Plan Creation Failed: ' . $e->getMessage());
 
        return response()->json([
            'success' => false,
            'message' => 'Failed to create plan. ' . $e->getMessage(),
        ], 500);
    }
}
 
// Create Subscription
public function createSubscription(Request $request)
{
    $request->validate([
        'plan_id' => 'required|string',
        'customer_email' => 'required|email',
        'customer_contact' => 'required|string',
        'total_count' => 'nullable|integer', // Optional: Only for limited subscriptions
    ]);
 
    try {
        // Create a customer
        $customer = $this->api->customer->create([
            'name' => 'Customer Name',
            'email' => $request->customer_email,
            'contact' => $request->customer_contact,
        ]);
 
        // Create a subscription
        $subscriptionData = [
            'plan_id' => $request->plan_id,
            'customer_id' => $customer->id,
            'customer_notify' => 1, // Notify the customer
        ];
 
        // Only add `total_count` if it is provided
        if ($request->has('total_count')) {
            $subscriptionData['total_count'] = $request->total_count;
        }
 
        $subscription = $this->api->subscription->create($subscriptionData);
 
        return response()->json([
            'success' => true,
            'subscription' => $subscription->toArray(),
        ], 201);
    } catch (\Exception $e) {
        \Log::error('Subscription Creation Failed: ' . $e->getMessage());
 
        return response()->json([
            'success' => false,
            'message' => 'Failed to create subscription. ' . $e->getMessage(),
        ], 500);
    }
}

}

 