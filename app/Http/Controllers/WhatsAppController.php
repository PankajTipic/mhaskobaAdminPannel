<?php


// namespace App\Http\Controllers;

// use GuzzleHttp\Client;
// use Illuminate\Http\Request;
// use Razorpay\Api\Api as RazorpayApi;
// use Illuminate\Support\Facades\Log;

// class WhatsAppController extends Controller
// {
//     private $accessToken;
//     private $phoneNumberId;
//     private $verifyToken = 'my_secure_webhook_token_123';

//     public function __construct()
//     {
//         $this->accessToken   = env('WHATSAPP_ACCESS_TOKEN');
//         $this->phoneNumberId = env('WHATSAPP_PHONE_ID');

//         if (empty($this->accessToken) || empty($this->phoneNumberId)) {
//             throw new \Exception('WhatsApp configuration missing in .env file (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_ID)');
//         }
//     }

//     public function verifyToken(Request $request)
//     {
//         $mode        = $request->query('hub_mode');
//         $verifyToken = $request->query('hub_verify_token');
//         $challenge   = $request->query('hub_challenge');

//         if ($mode === 'subscribe' && $verifyToken === $this->verifyToken) {
//             return response($challenge, 200)->header('Content-Type', 'text/plain');
//         }

//         return response('Forbidden: Invalid verify token', 403);
//     }

//     public function webhook(Request $request)
//     {
//         if ($request->isMethod('get')) {
//             $hubChallenge   = $request->input('hub.challenge');
//             $hubVerifyToken = $request->input('hub.verify_token');

//             if ($hubVerifyToken === $this->verifyToken) {
//                 return response($hubChallenge, 200);
//             }

//             return response('Forbidden', 403);
//         }

//         return $this->receiveMessage($request);
//     }

//     private function receiveMessage(Request $request)
//     {
//         try {
//             Log::info('WhatsApp webhook received', ['payload' => $request->all()]);

//             $entry = $request->input('entry', []);
//             if (empty($entry)) {
//                 return response()->json(['error' => 'Invalid payload'], 400);
//             }

//             $messageData = $entry[0]['changes'][0]['value']['messages'][0] ?? null;
//             if (!$messageData) {
//                 return response()->json(['error' => 'No message found in payload'], 400);
//             }

//             $phoneNumber = $messageData['from'] ?? null;
//             if (!$phoneNumber) {
//                 return response()->json(['error' => 'Phone number is required'], 400);
//             }

//             $language = session('language', 'marathi');

//             $buttonReplyId = $messageData['interactive']['button_reply']['id'] ?? null;

//             if ($buttonReplyId) {
//                 if ($buttonReplyId === 'language_english') {
//                     session(['language' => 'english']);
//                     $language = 'english';
//                 } elseif ($buttonReplyId === 'language_marathi') {
//                     session(['language' => 'marathi']);
//                     $language = 'marathi';
//                 }

//                 return match ($buttonReplyId) {
//                     'language_english', 'language_marathi' => $this->sendDonationOptions($phoneNumber, $language),

//                     'donation_e_500'   => $this->sendDonationResponse($phoneNumber, 'english', 500),
//                     'donation_e_1000'  => $this->sendDonationResponse($phoneNumber, 'english', 1000),
//                     'donation_e_2000'  => $this->sendDonationResponse($phoneNumber, 'english', 2000),

//                     'donation_m_500'   => $this->sendDonationResponse($phoneNumber, 'marathi', 500),
//                     'donation_m_1000'  => $this->sendDonationResponse($phoneNumber, 'marathi', 1000),
//                     'donation_m_2000'  => $this->sendDonationResponse($phoneNumber, 'marathi', 2000),

//                     'donation_one_time_m'  => $this->xyz($phoneNumber, 'marathi'),
//                     'donation_one_time_e'  => $this->xyz($phoneNumber, 'english'),

//                     'donation_recurring_e' => $this->sendRecurringDonationAmountOptions($phoneNumber, 'english'),
//                     'donation_recurring_m' => $this->sendRecurringDonationAmountOptions($phoneNumber, 'marathi'),

//                     'donation_en_500'  => $this->handleRecurringDonationAmount($phoneNumber, 500, 'english'),
//                     'donation_en_1000' => $this->handleRecurringDonationAmount($phoneNumber, 1000, 'english'),
//                     'donation_en_2000' => $this->handleRecurringDonationAmount($phoneNumber, 2000, 'english'),

//                     'donation_mr_500'  => $this->handleRecurringDonationAmount($phoneNumber, 500, 'marathi'),
//                     'donation_mr_1000' => $this->handleRecurringDonationAmount($phoneNumber, 1000, 'marathi'),
//                     'donation_mr_2000' => $this->handleRecurringDonationAmount($phoneNumber, 2000, 'marathi'),

//                     default => $this->sendMessage(
//                         $phoneNumber,
//                         $language === 'marathi' ? 'अवैध बटण पर्याय' : 'Invalid button option'
//                     )
//                 };
//             }

//             $incomingMessage = $messageData['text']['body'] ?? null;
//             if ($incomingMessage) {
//                 return $this->sendLanguageButtons($phoneNumber);
//             }

//             return response()->json(['error' => 'No valid message or interaction'], 400);
//         } catch (\Exception $e) {
//             Log::error('WhatsApp receiveMessage error', [
//                 'message' => $e->getMessage(),
//                 'trace'   => $e->getTraceAsString()
//             ]);
//             return response()->json(['error' => 'Server error'], 500);
//         }
//     }

//     // ────────────────────────────────────────────────
//     //                  Message Sending Methods
//     // ────────────────────────────────────────────────

//     private function sendLanguageButtons($phoneNumber)
//     {
//         $client = new Client();

//         try {
//             $response = $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
//                 'headers' => [
//                     'Authorization' => 'Bearer ' . $this->accessToken,
//                     'Content-Type'  => 'application/json',
//                 ],
//                 'json' => [
//                     'messaging_product' => 'whatsapp',
//                     'to'                => $phoneNumber,
//                     'type'              => 'interactive',
//                     'interactive'       => [
//                         'type' => 'button',
//                         'body' => [
//                             'text' => 'नमस्कार! *श्रीनाथ म्हस्कोबा मंदिर, (कोडीत)* मध्ये आपले हार्दिक स्वागत आहे 🙏🏻 कृपया आपली भाषा निवडा.' . "\n\n" .
//                                       'Hello! Welcome to *Shrinath Mhaskoba Mandir, (Kodit)* 🙏🏻 Please choose your language.'
//                         ],
//                         'action' => [
//                             'buttons' => [
//                                 ['type' => 'reply', 'reply' => ['id' => 'language_english', 'title' => 'English']],
//                                 ['type' => 'reply', 'reply' => ['id' => 'language_marathi', 'title' => 'मराठी']],
//                             ]
//                         ]
//                     ]
//                 ]
//             ]);

//             return response()->json($response->getBody()->getContents(), $response->getStatusCode());
//         } catch (\Exception $e) {
//             Log::error('Failed to send language buttons', ['error' => $e->getMessage()]);
//             return response()->json(['error' => 'Failed to send message'], 500);
//         }
//     }

//     private function sendDonationOptions($phoneNumber, $language)
//     {
//         $client = new Client();

//         $messageText = $language === 'marathi'
//             ? 'देणगी साठी पर्याय निवडा: एकदा देणगी किंवा मासिक देणगी.'
//             : 'Choose your donation / seva option: One-Time or Recurring (Monthly).';

//         $buttons = $language === 'marathi'
//             ? [
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_one_time_m', 'title' => 'एकदाच दान']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_recurring_m', 'title' => 'मासिक सेवा']],
//             ]
//             : [
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_one_time_e', 'title' => 'One-Time Donation']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_recurring_e', 'title' => 'Monthly Seva']],
//             ];

//         try {
//             $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
//                 'headers' => [
//                     'Authorization' => 'Bearer ' . $this->accessToken,
//                     'Content-Type'  => 'application/json',
//                 ],
//                 'json' => [
//                     'messaging_product' => 'whatsapp',
//                     'to'                => $phoneNumber,
//                     'type'              => 'interactive',
//                     'interactive'       => [
//                         'type'  => 'button',
//                         'body'  => ['text' => $messageText],
//                         'action' => ['buttons' => $buttons]
//                     ]
//                 ]
//             ]);

//             return response()->json(['status' => 'sent']);
//         } catch (\Exception $e) {
//             Log::error('Failed to send donation options', ['error' => $e->getMessage()]);
//             return response()->json(['error' => 'Failed to send message'], 500);
//         }
//     }

//     private function xyz($phoneNumber, $language)
//     {
//         $client = new Client();

//         $messageText = $language === 'marathi'
//             ? "श्रीनाथ म्हस्कोबा मंदिराच्या सेवेत / उत्सवात / देखभालीत आपण सहभागी व्हाल का?\nकृपया खालील पैकी एक रक्कम निवडा.\nमंदिराबद्दल अधिक माहितीसाठी: https://shrinathmhaskobamandir.org/"
//             : "Would you like to contribute to the seva / utsav / maintenance of Shrinath Mhaskoba Mandir?\nPlease select one of the amounts below.\nMore info: https://shrinathmhaskobamandir.org/";

//         $buttons = $language === 'marathi'
//             ? [
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_m_500',  'title' => '५०० रुपये']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_m_1000', 'title' => '१००० रुपये']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_m_2000', 'title' => '२००० रुपये']],
//             ]
//             : [
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_e_500',  'title' => '₹500']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_e_1000', 'title' => '₹1000']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_e_2000', 'title' => '₹2000']],
//             ];

//         try {
//             $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
//                 'headers' => [
//                     'Authorization' => 'Bearer ' . $this->accessToken,
//                     'Content-Type'  => 'application/json',
//                 ],
//                 'json' => [
//                     'messaging_product' => 'whatsapp',
//                     'to'                => $phoneNumber,
//                     'type'              => 'interactive',
//                     'interactive'       => [
//                         'type'  => 'button',
//                         'body'  => ['text' => $messageText],
//                         'action' => ['buttons' => $buttons]
//                     ]
//                 ]
//             ]);

//             return response()->json(['status' => 'sent']);
//         } catch (\Exception $e) {
//             Log::error('Failed to send amount selection', ['error' => $e->getMessage()]);
//             return response()->json(['error' => 'Failed to send message'], 500);
//         }
//     }

//     // private function sendDonationResponse($phoneNumber, $language, $amount)
//     // {
//     //     $client = new Client();

//     //     try {
//     //         $response = $client->post('https://api.razorpay.com/v1/payment_links', [
//     //             'auth' => [env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET')],
//     //             'json' => [
//     //                 'amount'      => $amount * 100,
//     //                 'currency'    => 'INR',
//     //                 'description' => 'TEST Donation / Seva for Shrinath Mhaskoba Mandir (Test Mode)',
//     //                 'customer'    => [
//     //                     'name'    => 'Test Bhakt',
//     //                     'contact' => $phoneNumber,
//     //                 ],
//     //                 'notify'      => ['sms' => true, 'email' => true],
//     //                 'callback_url'    => url('/donation-success'),
//     //                 'callback_method' => 'get',
//     //             ],
//     //         ]);

//     //         $data = json_decode($response->getBody(), true);

//     //         if (empty($data['short_url'])) {
//     //             throw new \Exception('No short_url received from Razorpay');
//     //         }

//     //         $link = $data['short_url'];

//     //         $text = $language === 'marathi'
//     //             ? "श्रीनाथ म्हस्कोबा मंदिरासाठी आपल्या सेवेसाठी धन्यवाद! (TEST MODE)\nकृपया ₹{$amount} येथे दान/सेवा करा: {$link}"
//     //             : "Thank you for your seva/donation to Shrinath Mhaskoba Mandir! (TEST MODE)\nPlease donate ₹{$amount} here: {$link}";

//     //         return $this->sendMessage($phoneNumber, $text);
//     //     } catch (\Exception $e) {
//     //         Log::error('Razorpay one-time link failed (test mode)', ['error' => $e->getMessage()]);
//     //         return $this->sendMessage($phoneNumber, $language === 'marathi'
//     //             ? 'पेमेंट लिंक तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
//     //             : 'Error creating payment link. Please try again.'
//     //         );
//     //     }
//     // }
// private function sendDonationResponse($phoneNumber, $language, $amount)
// {
//     $client = new Client();

//     $keyId     = env('RAZORPAY_KEY_ID');
//     $keySecret = env('RAZORPAY_KEY_SECRET');

//     Log::info('[RZP DEBUG] Starting one-time donation attempt', [
//         'phone'         => $phoneNumber,
//         'amount_rs'     => $amount,
//         'amount_paise'  => (int)($amount * 100),
//         'key_id'        => $keyId ?: 'MISSING',
//         'secret_prefix' => $keySecret ? substr($keySecret, 0, 8) . '...' : 'MISSING',
//     ]);

//     if (empty($keyId) || empty($keySecret)) {
//         Log::critical('[RZP CRITICAL] Razorpay keys missing!');
//         return $this->sendMessage($phoneNumber, $language === 'marathi'
//             ? 'पेमेंट सेवा सध्या उपलब्ध नाही (कीज नाहीत). Admin ला संपर्क करा.'
//             : 'Payment service unavailable (keys missing). Contact admin.'
//         );
//     }

//     try {
//         $options = [
//             'auth'            => [$keyId, $keySecret],
//             'json'            => [
//                 'amount'      => (int)($amount * 100),
//                 'currency'    => 'INR',
//                 'description' => 'TEST Donation - Shrinath Mhaskoba Mandir',
//                 'customer'    => [
//                     'name'    => 'Test Donor',
//                     'contact' => $phoneNumber,
//                 ],
//                 'notify'      => ['sms' => true, 'email' => true],
//                 'callback_url'    => url('/donation-success?phone=' . urlencode($phoneNumber) . '&amount=' . $amount),
//                 'callback_method' => 'get',
//             ],
//             'timeout'         => 60,
//             'connect_timeout' => 30,
//             'http_errors'     => false, // Don't throw on 4xx/5xx
//         ];

//         // TEMP DEBUG: Disable SSL verification if local setup has cert issues
//         // REMOVE this line in production / after fixing certs
//         $options['verify'] = false;

//         $response = $client->post('https://api.razorpay.com/v1/payment_links', $options);

//         $status = $response->getStatusCode();
//         $body   = $response->getBody()->getContents();

//         Log::info('[RZP RESPONSE] Payment link API called', [
//             'status_code' => $status,
//             'body'        => $body,
//         ]);

//         if ($status < 200 || $status >= 300) {
//             throw new \Exception("Razorpay HTTP error - status {$status}");
//         }

//         $data = json_decode($body, true);

//         if (empty($data['short_url'])) {
//             throw new \Exception('No short_url in response');
//         }

//         $link = $data['short_url'];

//         $text = $language === 'marathi'
//             ? "धन्यवाद! (TEST MODE)\n₹{$amount} दानासाठी येथे क्लिक करा: {$link}"
//             : "Thank you! (TEST MODE)\nDonate ₹{$amount} here: {$link}";

//         return $this->sendMessage($phoneNumber, $text);

//     } catch (\GuzzleHttp\Exception\ConnectException $e) {
//         // Connection refused, timeout, DNS failure, SSL issues
//         Log::error('[RZP CONNECT ERROR] Cannot reach Razorpay API', [
//             'message' => $e->getMessage(),
//             'trace'   => $e->getTraceAsString(),
//         ]);

//         return $this->sendMessage($phoneNumber, $language === 'marathi'
//             ? 'सर्व्हरशी कनेक्शन होऊ शकले नाही. इंटरनेट तपासा किंवा नंतर प्रयत्न करा.'
//             : 'Cannot connect to payment server. Check internet and try later.'
//         );

//     } catch (\GuzzleHttp\Exception\RequestException $e) {
//         $status = $e->hasResponse() ? $e->getResponse()->getStatusCode() : null;
//         $errorBody = $e->hasResponse() ? (string)$e->getResponse()->getBody() : 'No response body';

//         Log::error('[RZP HTTP ERROR] Payment link failed', [
//             'status'      => $status,
//             'error_body'  => $errorBody,
//             'guzzle_msg'  => $e->getMessage(),
//             'keys_debug'  => substr($keySecret ?? '', 0, 8) . '...',
//         ]);

//         $userMsg = $language === 'marathi'
//             ? "पेमेंट लिंक तयार होऊ शकली नाही (त्रुटी: {$status}). Admin ला संपर्क करा."
//             : "Payment link creation failed (error: {$status}). Contact admin.";

//         return $this->sendMessage($phoneNumber, $userMsg);

//     } catch (\Exception $e) {
//         Log::error('[RZP GENERAL CRASH] sendDonationResponse failed', [
//             'message' => $e->getMessage(),
//             'file'    => $e->getFile(),
//             'line'    => $e->getLine(),
//             'trace'   => $e->getTraceAsString(),
//         ]);

//         return $this->sendMessage($phoneNumber, $language === 'marathi'
//             ? 'अज्ञात त्रुटी आली. कृपया admin ला संपर्क करा.'
//             : 'Unknown error. Please contact admin.'
//         );
//     }
// }

//     private function sendRecurringDonationAmountOptions($phoneNumber, $language)
//     {
//         $client = new Client();

//         $text = $language === 'marathi'
//             ? 'कृपया मासिक सेवा / दानाची रक्कम निवडा: ₹५००, ₹१००० किंवा ₹२०००. (TEST MODE)'
//             : 'Please select your monthly seva / donation amount: ₹500, ₹1000 or ₹2000. (TEST MODE)';

//         $buttons = $language === 'marathi'
//             ? [
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_mr_500',  'title' => '₹५००']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_mr_1000', 'title' => '₹१०००']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_mr_2000', 'title' => '₹२०००']],
//             ]
//             : [
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_en_500',  'title' => '₹500']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_en_1000', 'title' => '₹1000']],
//                 ['type' => 'reply', 'reply' => ['id' => 'donation_en_2000', 'title' => '₹2000']],
//             ];

//         try {
//             $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
//                 'headers' => [
//                     'Authorization' => 'Bearer ' . $this->accessToken,
//                     'Content-Type'  => 'application/json',
//                 ],
//                 'json' => [
//                     'messaging_product' => 'whatsapp',
//                     'to'                => $phoneNumber,
//                     'type'              => 'interactive',
//                     'interactive'       => [
//                         'type'  => 'button',
//                         'body'  => ['text' => $text],
//                         'action' => ['buttons' => $buttons]
//                     ]
//                 ]
//             ]);

//             return response()->json(['status' => 'sent']);
//         } catch (\Exception $e) {
//             Log::error('Failed to send recurring options', ['error' => $e->getMessage()]);
//             return response()->json(['error' => 'Failed to send message'], 500);
//         }
//     }

//     private function handleRecurringDonationAmount($phoneNumber, $donationAmount, $language)
//     {
//         try {
//             $amountInPaise = $donationAmount * 100;

//             $subscription = $this->createRazorpaySubscription($amountInPaise, 'monthly');

//             if (!$subscription || empty($subscription->id)) {
//                 throw new \Exception('Failed to create subscription');
//             }

//             $message = $language === 'marathi'
//                 ? 'श्रीनाथ म्हस्कोबा मंदिरासाठी आपली मासिक सेवा सुरू झाली आहे. (TEST MODE) पेमेंट पूर्ण करण्यासाठी खालील लिंक क्लिक करा.'
//                 : 'Your monthly seva for Shrinath Mhaskoba Mandir has been initiated. (TEST MODE) Click below to complete payment.';

//             $paymentLink = $this->generatePaymentLink($subscription->id, $amountInPaise);

//             if ($paymentLink) {
//                 $message .= "\n\n" . $paymentLink;
//                 Log::info('Recurring payment link generated (test)', ['link' => $paymentLink, 'sub_id' => $subscription->id]);
//             } else {
//                 $message .= "\n\n" . ($language === 'marathi'
//                     ? 'पेमेंट लिंक जनरेट करण्यात अडचण. नंतर प्रयत्न करा.'
//                     : 'Unable to generate payment link. Please try later.');
//             }

//             $this->sendMessage($phoneNumber, $message);

//             return response()->json(['status' => 'initiated', 'subscription_id' => $subscription->id ?? null]);
//         } catch (\Exception $e) {
//             Log::error('Recurring donation error (test mode)', ['error' => $e->getMessage()]);
//             $this->sendMessage($phoneNumber, $language === 'marathi'
//                 ? 'सबस्क्रिप्शन सुरू करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
//                 : 'Error starting subscription. Please try again.'
//             );
//             return response()->json(['error' => 'Subscription failed'], 500);
//         }
//     }

//     private function createRazorpaySubscription($amount, $interval)
//     {
//         $planId = $this->createRazorpayPlan($amount, 'INR', $interval);

//         if (!$planId) {
//             return null;
//         }

//         $api = new RazorpayApi(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

//         $data = [
//             'plan_id'         => $planId,
//             'total_count'     => 12,
//             'quantity'        => 1,
//             'customer_notify' => 1,
//         ];

//         $subscription = $api->subscription->create($data);

//         Log::info('Razorpay subscription created (test)', ['id' => $subscription->id]);

//         return $subscription;
//     }

//     private function createRazorpayPlan($amount, $currency = 'INR', $interval = 'monthly', $interval_count = 1)
//     {
//         $api = new RazorpayApi(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

//         $data = [
//             'period'   => $interval,
//             'interval' => $interval_count,
//             'item'     => [
//                 'name'     => 'TEST Monthly Seva - Shrinath Mhaskoba Mandir',
//                 'amount'   => $amount,
//                 'currency' => $currency,
//             ],
//         ];

//         $plan = $api->plan->create($data);

//         Log::info('Razorpay plan created (test)', ['id' => $plan->id]);

//         return $plan->id;
//     }

//     private function generatePaymentLink($subscriptionId, $amount)
//     {
//         $api = new RazorpayApi(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

//         try {
//             $linkData = [
//                 'amount'      => $amount,
//                 'currency'    => 'INR',
//                 'description' => 'TEST Monthly Seva for Shrinath Mhaskoba Mandir',
//                 'reference_id' => $subscriptionId,
//                 'callback_url'    => 'https://shrinathmhaskobamandir.org/',
//                 'callback_method' => 'get',
//                 'customer'    => [
//                     'email'   => 'test@temple.com',
//                     'contact' => '9999999999',
//                 ],
//                 'notify' => [
//                     'sms'   => true,
//                     'email' => true,
//                 ],
//             ];

//             $paymentLink = $api->paymentLink->create($linkData);

//             return $paymentLink->short_url ?? null;
//         } catch (\Exception $e) {
//             Log::error('Failed to generate recurring payment link (test)', ['error' => $e->getMessage()]);
//             return null;
//         }
//     }

//     private function sendMessage($phoneNumber, $text)
//     {
//         $client = new Client();

//         try {
//             $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
//                 'headers' => [
//                     'Authorization' => 'Bearer ' . $this->accessToken,
//                     'Content-Type'  => 'application/json',
//                 ],
//                 'json' => [
//                     'messaging_product' => 'whatsapp',
//                     'to'                => $phoneNumber,
//                     'type'              => 'text',
//                     'text'              => ['body' => $text]
//                 ]
//             ]);

//             return response()->json(['status' => 'sent']);
//         } catch (\Exception $e) {
//             Log::error('Failed to send text message', ['to' => $phoneNumber, 'error' => $e->getMessage()]);
//             return response()->json(['error' => 'Message send failed'], 500);
//         }
//     }

//     public function donationSuccess(Request $request)
//     {
//         $amount = $request->query('amount');
//         $phone  = $request->query('phone');

//         Log::info('Donation success callback received (test mode)', [
//             'amount' => $amount,
//             'phone'  => $phone
//         ]);

//         return redirect('https://shrinathmhaskobamandir.org/')
//             ->with('message', "श्रीनाथ म्हस्कोबा मंदिरासाठी ₹{$amount} च्या दान/सेवेसाठी धन्यवाद! (TEST MODE) / Thank you for your ₹{$amount} donation/seva! (TEST MODE)");
//     }
// }




















namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Razorpay\Api\Api as RazorpayApi;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WhatsAppController extends Controller
{
    private $accessToken;
    private $phoneNumberId;
    private $verifyToken = '    ';

    public function __construct()
    {
        $this->accessToken   = env('WHATSAPP_ACCESS_TOKEN');
        $this->phoneNumberId = env('WHATSAPP_PHONE_ID');

        if (empty($this->accessToken) || empty($this->phoneNumberId)) {
            throw new \Exception('WhatsApp configuration missing in .env file (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_ID)');
        }
    }

    public function verifyToken(Request $request)
    {
        $mode        = $request->query('hub_mode');
        $verifyToken = $request->query('hub_verify_token');
        $challenge   = $request->query('hub_challenge');

        if ($mode === 'subscribe' && $verifyToken === $this->verifyToken) {
            return response($challenge, 200)->header('Content-Type', 'text/plain');
        }

        return response('Forbidden: Invalid verify token', 403);
    }

    public function webhook(Request $request)
    {
        if ($request->isMethod('get')) {
            $hubChallenge   = $request->input('hub.challenge');
            $hubVerifyToken = $request->input('hub.verify_token');

            if ($hubVerifyToken === $this->verifyToken) {
                return response($hubChallenge, 200);
            }

            return response('Forbidden', 403);
        }

        return $this->receiveMessage($request);
    }

    private function receiveMessage(Request $request)
    {
        try {
            Log::info('WhatsApp webhook received', ['payload' => $request->all()]);

            $entry = $request->input('entry', []);
            if (empty($entry)) {
                return response()->json(['error' => 'Invalid payload'], 400);
            }

            $messageData = $entry[0]['changes'][0]['value']['messages'][0] ?? null;
            if (!$messageData) {
                return response()->json(['error' => 'No message found in payload'], 400);
            }

            $phoneNumber = $messageData['from'] ?? null;
            if (!$phoneNumber) {
                return response()->json(['error' => 'Phone number is required'], 400);
            }

            // ==================== IMPORTANT: Always read latest language from session ====================
            // $language = session('language', 'marathi');
            $language = Cache::get('wa_lang_' . $phoneNumber, 'marathi');

            $buttonReplyId = $messageData['interactive']['button_reply']['id'] ?? null;
            $listReplyId   = $messageData['interactive']['list_reply']['id'] ?? null;

            // Handle Button Reply (Language selection + Donation buttons)
            if ($buttonReplyId) {
                // if ($buttonReplyId === 'language_english') {
                //     session(['language' => 'english']);
                //     $language = 'english';
                // } elseif ($buttonReplyId === 'language_marathi') {
                //     session(['language' => 'marathi']);
                //     $language = 'marathi';
                // }

                if ($buttonReplyId === 'language_english') {
    Cache::put('wa_lang_' . $phoneNumber, 'english', now()->addDays(30));
    $language = 'english';
} elseif ($buttonReplyId === 'language_marathi') {
    Cache::put('wa_lang_' . $phoneNumber, 'marathi', now()->addDays(30));
    $language = 'marathi';
}

                return match ($buttonReplyId) {
                    'language_english', 'language_marathi' => $this->setLanguageAndSendMenu($phoneNumber, $language),

                    'donation_one_time_m'  => $this->xyz($phoneNumber, 'marathi'),
                    'donation_one_time_e'  => $this->xyz($phoneNumber, 'english'),

                    'donation_recurring_e' => $this->sendRecurringDonationAmountOptions($phoneNumber, 'english'),
                    'donation_recurring_m' => $this->sendRecurringDonationAmountOptions($phoneNumber, 'marathi'),

                    'donation_e_500'   => $this->sendDonationResponse($phoneNumber, 'english', 500),
                    'donation_e_1000'  => $this->sendDonationResponse($phoneNumber, 'english', 1000),
                    'donation_e_2000'  => $this->sendDonationResponse($phoneNumber, 'english', 2000),

                    'donation_m_500'   => $this->sendDonationResponse($phoneNumber, 'marathi', 500),
                    'donation_m_1000'  => $this->sendDonationResponse($phoneNumber, 'marathi', 1000),
                    'donation_m_2000'  => $this->sendDonationResponse($phoneNumber, 'marathi', 2000),

                    'donation_en_500'  => $this->handleRecurringDonationAmount($phoneNumber, 500, 'english'),
                    'donation_en_1000' => $this->handleRecurringDonationAmount($phoneNumber, 1000, 'english'),
                    'donation_en_2000' => $this->handleRecurringDonationAmount($phoneNumber, 2000, 'english'),

                    'donation_mr_500'  => $this->handleRecurringDonationAmount($phoneNumber, 500, 'marathi'),
                    'donation_mr_1000' => $this->handleRecurringDonationAmount($phoneNumber, 1000, 'marathi'),
                    'donation_mr_2000' => $this->handleRecurringDonationAmount($phoneNumber, 2000, 'marathi'),

                    default => $this->sendMessage(
                        $phoneNumber,
                        $language === 'marathi' ? 'अवैध बटण पर्याय' : 'Invalid button option'
                    )
                };
            }

            // Handle List Reply (Main Menu)
            if ($listReplyId) {
                // Re-read language from session for safety (list replies can sometimes lose session context)
                // $language = session('language', 'marathi');
                $language = Cache::get('wa_lang_' . $phoneNumber, 'marathi');

                return match ($listReplyId) {
                    'menu_donation' => $this->sendDonationOptions($phoneNumber, $language),
                    'menu_darshan'  => $this->sendTemporaryMessage($phoneNumber, $language, 'darshan'),
                    'menu_contact'  => $this->sendTemporaryMessage($phoneNumber, $language, 'contact'),
                    'menu_location' => $this->sendTemporaryMessage($phoneNumber, $language, 'location'),
                    default => $this->sendMessage(
                        $phoneNumber,
                        $language === 'marathi' ? 'अवैध मेनू पर्याय' : 'Invalid menu option'
                    )
                };
            }

            // First message → Show Language Buttons
            $incomingMessage = $messageData['text']['body'] ?? null;
            if ($incomingMessage) {
                return $this->sendLanguageButtons($phoneNumber);
            }

            return response()->json(['error' => 'No valid message or interaction'], 400);
        } catch (\Exception $e) {
            Log::error('WhatsApp receiveMessage error', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    // ==================== Language + Main Menu ====================

    private function setLanguageAndSendMenu($phoneNumber, $language)
    {
        $welcomeText = $language === 'marathi'
            ? "कृपया खालील पर्याय निवडा.\n\nअधिक माहितीसाठी: https://shrinathmhaskobakodit.org/"
            : "Please choose an option below.\n\nFor more information: https://shrinathmhaskobakodit.org/";

        return $this->sendMainMenu($phoneNumber, $language, $welcomeText);
    }

    private function sendMainMenu($phoneNumber, $language, $bodyText = null)
    {
        $client = new Client();

        $headerText = $language === 'marathi'
            ? "🙏🏻 जय श्रीनाथ म्हस्कोबा 🙏🏻"
            : "🙏🏻 Jay Shrinath Mhaskoba 🙏🏻";

        $bodyText = $bodyText ?? ($language === 'marathi'
            ? "कृपया खालील पर्याय निवडा"
            : "Please choose an option below");

        try {
            $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to'                => $phoneNumber,
                    'type'              => 'interactive',
                    'interactive'       => [
                        'type'   => 'list',
                        'header' => ['type' => 'text', 'text' => $headerText],
                        'body'   => ['text' => $bodyText],
                        'action' => [
                            'button'   => $language === 'marathi' ? 'पर्याय निवडा' : 'Choose Option',
                            'sections' => [
                                [
                                    'title' => $language === 'marathi' ? 'मंदिर सेवा' : 'Temple Services',
                                    'rows'  => [
                                        ['id' => 'menu_donation', 'title' => $language === 'marathi' ? 'दान / देणगी' : 'Donation / Daan'],
                                        ['id' => 'menu_darshan',  'title' => $language === 'marathi' ? 'दर्शन वेळ' : 'Darshan Timing'],
                                        ['id' => 'menu_contact',  'title' => $language === 'marathi' ? 'संपर्क करा' : 'Contact Us'],
                                        ['id' => 'menu_location', 'title' => $language === 'marathi' ? 'स्थान' : 'Location']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            return response()->json(['status' => 'menu_sent']);

        } catch (\Exception $e) {
            Log::error('Failed to send main menu', ['error' => $e->getMessage(), 'language' => $language]);

            $fallbackText = $language === 'marathi'
                ? "मेनू पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा."
                : "Failed to load menu. Please try again.";

            return $this->sendMessage($phoneNumber, $fallbackText);
        }
    }

    private function sendTemporaryMessage($phoneNumber, $language, $type)
    {
        $messages = [
            'darshan' => [
                'marathi' => "🛕 *दर्शन वेळा* 🛕\n\n" .
                             "📅 *सोमवार ते शनिवार* :\n" .
                             "🕔 सकाळी ५:०० ते रात्री १०:३० पर्यंत दर्शन खुले\n\n" .
                             "📅 *रविवार* :\n" .
                             "⛔ दुपारी १२:०० ते १:०० मंदिर बंद राहील\n" .
                             "✅ उर्वरित वेळेत दर्शन सुरू राहील\n\n" .
                             "🙏 भक्तांनी कृपया दर्शनासाठी वेळेचे पालन करावे.",
                             
                'english' => "🛕 *Darshan Timings* 🛕\n\n" .
                            "📅 *Monday to Saturday* :\n" .
                            "🕔 Temple open for Darshan from 5:00 AM to 10:30 PM\n\n" .
                            "📅 *Sunday* :\n" .
                            "⛔ Temple closed from 12:00 PM to 1:00 PM\n" .
                            "✅ Darshan available during the remaining hours\n\n" .
                            "🙏 Devotees are requested to follow the Darshan timings."
            ],




            // 'contact' => [
            //     'marathi' => "संपर्क:\nफोन: +91 XXXXX XXXXX\nईमेल: info@shrinathmhaskobakodit.org\n\nअधिक माहितीसाठी: https://shrinathmhaskobakodit.org/",
            //     'english' => "Contact Us:\nPhone: +91 XXXXX XXXXX\nEmail: info@shrinathmhaskobakodit.org\n\nFor more info: https://shrinathmhaskobakodit.org/"
            // ],


            'contact' => [
    'marathi' => "📞 *संपर्क माहिती* 📞\n\n" .
                 "श्रीनाथ म्हस्कोबा मंदिर, कोडीत\n" .
                 "आपल्या सेवेसाठी आम्ही सदैव उपलब्ध आहोत.\n\n" .
                 "📱 फोन : +९१ ८२७५१ ००२७३\n" .
                 "📱 फोन : +९१ ८२७५१ ००२३८\n" .
                 "📧 ईमेल : koditnathmhaskoba63@gmail.com\n" .
                 "🌐 वेबसाइट : https://shrinathmhaskobakodit.org/\n\n" .
                 "🙏 अधिक माहितीसाठी कृपया आमच्याशी संपर्क साधा.",

    'english' => "📞 *Contact Information* 📞\n\n" .
                 "Shrinath Mhaskoba Mandir, Kodit\n" .
                 "We are always happy to assist you.\n\n" .
                 "📱 Phone : +91 82751 00273\n" .
                 "📱 Phone : +91 82751 00238\n" .
                 "📧 Email : koditnathmhaskoba63@gmail.com\n" .
                 "🌐 Website : https://shrinathmhaskobakodit.org/\n\n" .
                 "🙏 Feel free to contact us for more information."
],



            // 'location' => [
            //     'marathi' => "स्थान: श्रीनाथ म्हस्कोबा मंदिर, कोडीत, महाराष्ट्र\n\nगूगल मॅप: https://maps.google.com/...",
            //     'english' => "Location: Shrinath Mhaskoba Mandir, Kodit, Maharashtra\n\nGoogle Map: https://maps.google.com/..."
            // ]


            'location' => [
    'marathi' => "📍 *मंदिराचे स्थान* 📍\n\n" .
                 "🛕 श्रीनाथ म्हस्कोबा मंदिर, कोडीत\n" .
                 "तालुका : पुरंदर, जिल्हा : पुणे, महाराष्ट्र\n\n" .
                 "🗺️ Google Map वर पाहण्यासाठी खालील लिंक वापरा:\n" .
                 "https://maps.app.goo.gl/vAxvZX6giuSPUoW2A\n\n" .
                 "🙏 मंदिराकडे येण्यासाठी वरील नकाशाचा वापर करा.",

    'english' => "📍 *Temple Location* 📍\n\n" .
                 "🛕 Shrinath Mhaskoba Mandir, Kodit\n" .
                 "Taluka: Purandar, District: Pune, Maharashtra\n\n" .
                 "🗺️ View on Google Maps using the link below:\n" .
                 "https://maps.app.goo.gl/vAxvZX6giuSPUoW2A\n\n" .
                 "🙏 Use the above map for easy navigation to the temple."
],


        ];

        $text = $messages[$type][$language] ?? ($language === 'marathi' ? 'माहिती लवकरच येईल.' : 'Information coming soon.');

        return $this->sendMessage($phoneNumber, $text);
    }

    private function sendLanguageButtons($phoneNumber)
    {
        $client = new Client();

        try {
            $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to'                => $phoneNumber,
                    'type'              => 'interactive',
                    'interactive'       => [
                        'type' => 'button',
                        'body' => [
                            'text' => "🙏🏻 *जय श्रीनाथ म्हस्कोबा* 🙏🏻\n\n" .
                                      "🛕 *श्रीनाथ म्हस्कोबा मंदिर, कोडीत* मध्ये आपले हार्दिक स्वागत आहे.\n" .
                                      "शांत, निसर्गरम्य वातावरणात वसलेले हे पवित्र तीर्थक्षेत्र भक्तांच्या श्रद्धेचे केंद्र आहे.\n" .
                                      "आपल्याला दर्शन, आरती वेळा, उत्सव, देणगी व इतर माहिती येथे मिळेल.\n\n" .
                                      "🛕 A warm welcome to *Shrinath Mhaskoba Mandir, Kodit*.\n" .
                                      "This sacred pilgrimage place is nestled in a peaceful and scenic environment and is a center of faith for devotees.\n" .
                                      "Here you can get information about Darshan timings, Aarti schedule, festivals, donations, and other temple services.\n\n" .
                                      "कृपया खालील पर्याय निवडा / Please choose one of the following options:"
                        ],
                        'action' => [
                            'buttons' => [
                                ['type' => 'reply', 'reply' => ['id' => 'language_english', 'title' => 'English']],
                                ['type' => 'reply', 'reply' => ['id' => 'language_marathi', 'title' => 'मराठी']],
                            ]
                        ]
                    ]
                ]
            ]);

            return response()->json(['status' => 'language_buttons_sent']);
        } catch (\Exception $e) {
            Log::error('Failed to send language buttons', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to send message'], 500);
        }
    }

    private function sendDonationOptions($phoneNumber, $language)
    {
        $client = new Client();

        $messageText = $language === 'marathi'
            ? 'देणगी साठी पर्याय निवडा: एकदा देणगी किंवा मासिक देणगी.'
            : 'Choose your donation / seva option: One-Time or Recurring (Monthly).';

        $buttons = $language === 'marathi'
            ? [
                ['type' => 'reply', 'reply' => ['id' => 'donation_one_time_m', 'title' => 'एकदाच दान']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_recurring_m', 'title' => 'मासिक सेवा']],
            ]
            : [
                ['type' => 'reply', 'reply' => ['id' => 'donation_one_time_e', 'title' => 'One-Time Donation']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_recurring_e', 'title' => 'Monthly Seva']],
            ];

        try {
            $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to'                => $phoneNumber,
                    'type'              => 'interactive',
                    'interactive'       => [
                        'type'  => 'button',
                        'body'  => ['text' => $messageText],
                        'action' => ['buttons' => $buttons]
                    ]
                ]
            ]);

            return response()->json(['status' => 'sent']);
        } catch (\Exception $e) {
            Log::error('Failed to send donation options', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to send message'], 500);
        }
    }

    private function xyz($phoneNumber, $language)
    {
        $client = new Client();

        $messageText = $language === 'marathi'
            ? "श्रीनाथ म्हस्कोबा मंदिराच्या सेवेत / उत्सवात / देखभालीत आपण सहभागी व्हाल का?\nकृपया खालील पैकी एक रक्कम निवडा.\nमंदिराबद्दल अधिक माहितीसाठी: https://shrinathmhaskobakodit.org/"
            : "Would you like to contribute to the seva / utsav / maintenance of Shrinath Mhaskoba Mandir?\nPlease select one of the amounts below.\nMore info: https://shrinathmhaskobakodit.org/";

        $buttons = $language === 'marathi'
            ? [
                ['type' => 'reply', 'reply' => ['id' => 'donation_m_500',  'title' => '५०० रुपये']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_m_1000', 'title' => '१००० रुपये']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_m_2000', 'title' => '२००० रुपये']],
            ]
            : [
                ['type' => 'reply', 'reply' => ['id' => 'donation_e_500',  'title' => '₹500']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_e_1000', 'title' => '₹1000']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_e_2000', 'title' => '₹2000']],
            ];

        try {
            $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to'                => $phoneNumber,
                    'type'              => 'interactive',
                    'interactive'       => [
                        'type'  => 'button',
                        'body'  => ['text' => $messageText],
                        'action' => ['buttons' => $buttons]
                    ]
                ]
            ]);

            return response()->json(['status' => 'sent']);
        } catch (\Exception $e) {
            Log::error('Failed to send amount selection', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to send message'], 500);
        }
    }

    // ==================== Razorpay Related Methods (Unchanged) ====================

    private function sendDonationResponse($phoneNumber, $language, $amount)
    {
        $client = new Client();
        $keyId     = env('RAZORPAY_KEY_ID');
        $keySecret = env('RAZORPAY_KEY_SECRET');

        if (empty($keyId) || empty($keySecret)) {
            return $this->sendMessage($phoneNumber, $language === 'marathi'
                ? 'पेमेंट सेवा सध्या उपलब्ध नाही (कीज नाहीत). Admin ला संपर्क करा.'
                : 'Payment service unavailable (keys missing). Contact admin.'
            );
        }

        try {
            $options = [
                'auth' => [$keyId, $keySecret],
                'json' => [
                    'amount'      => (int)($amount * 100),
                    'currency'    => 'INR',
                    'description' => 'TEST Donation - Shrinath Mhaskoba Mandir',
                    'customer'    => ['name' => 'Test Donor', 'contact' => $phoneNumber],
                    'notify'      => ['sms' => true, 'email' => true],
                    'callback_url'    => url('/donation-success?phone=' . urlencode($phoneNumber) . '&amount=' . $amount),
                    'callback_method' => 'get',
                ],
                'timeout'         => 60,
                'connect_timeout' => 30,
                'http_errors'     => false,
            ];

            $options['verify'] = false;

            $response = $client->post('https://api.razorpay.com/v1/payment_links', $options);
            $body = $response->getBody()->getContents();
            $data = json_decode($body, true);

            if (empty($data['short_url'])) {
                throw new \Exception('No short_url in response');
            }

            $link = $data['short_url'];
            $text = $language === 'marathi'
                ? "धन्यवाद! (TEST MODE)\n₹{$amount} दानासाठी येथे क्लिक करा: {$link}"
                : "Thank you! (TEST MODE)\nDonate ₹{$amount} here: {$link}";

            return $this->sendMessage($phoneNumber, $text);

        } catch (\Exception $e) {
            Log::error('[RZP ERROR]', ['message' => $e->getMessage()]);
            return $this->sendMessage($phoneNumber, $language === 'marathi'
                ? 'त्रुटी आली. कृपया admin ला संपर्क करा.'
                : 'Error occurred. Please contact admin.'
            );
        }
    }

    private function sendRecurringDonationAmountOptions($phoneNumber, $language)
    {
        $client = new Client();

        $text = $language === 'marathi'
            ? 'कृपया मासिक सेवा / दानाची रक्कम निवडा: ₹५००, ₹१००० किंवा ₹२०००. (TEST MODE)'
            : 'Please select your monthly seva / donation amount: ₹500, ₹1000 or ₹2000. (TEST MODE)';

        $buttons = $language === 'marathi'
            ? [
                ['type' => 'reply', 'reply' => ['id' => 'donation_mr_500',  'title' => '₹५००']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_mr_1000', 'title' => '₹१०००']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_mr_2000', 'title' => '₹२०००']],
            ]
            : [
                ['type' => 'reply', 'reply' => ['id' => 'donation_en_500',  'title' => '₹500']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_en_1000', 'title' => '₹1000']],
                ['type' => 'reply', 'reply' => ['id' => 'donation_en_2000', 'title' => '₹2000']],
            ];

        try {
            $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
                'headers' => ['Authorization' => 'Bearer ' . $this->accessToken, 'Content-Type' => 'application/json'],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to'   => $phoneNumber,
                    'type' => 'interactive',
                    'interactive' => [
                        'type'  => 'button',
                        'body'  => ['text' => $text],
                        'action' => ['buttons' => $buttons]
                    ]
                ]
            ]);

            return response()->json(['status' => 'sent']);
        } catch (\Exception $e) {
            Log::error('Failed to send recurring options', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to send message'], 500);
        }
    }

    private function handleRecurringDonationAmount($phoneNumber, $donationAmount, $language)
    {
        try {
            $amountInPaise = $donationAmount * 100;
            $subscription = $this->createRazorpaySubscription($amountInPaise, 'monthly');

            if (!$subscription || empty($subscription->id)) {
                throw new \Exception('Failed to create subscription');
            }

            $message = $language === 'marathi'
                ? 'श्रीनाथ म्हस्कोबा मंदिरासाठी आपली मासिक सेवा सुरू झाली आहे. (TEST MODE) पेमेंट पूर्ण करण्यासाठी खालील लिंक क्लिक करा.'
                : 'Your monthly seva for Shrinath Mhaskoba Mandir has been initiated. (TEST MODE) Click below to complete payment.';

            $paymentLink = $this->generatePaymentLink($subscription->id, $amountInPaise);

            if ($paymentLink) {
                $message .= "\n\n" . $paymentLink;
            } else {
                $message .= "\n\n" . ($language === 'marathi' ? 'पेमेंट लिंक जनरेट करण्यात अडचण.' : 'Unable to generate payment link.');
            }

            $this->sendMessage($phoneNumber, $message);
            return response()->json(['status' => 'initiated']);

        } catch (\Exception $e) {
            Log::error('Recurring donation error', ['error' => $e->getMessage()]);
            $this->sendMessage($phoneNumber, $language === 'marathi'
                ? 'सबस्क्रिप्शन सुरू करताना त्रुटी आली.'
                : 'Error starting subscription. Please try again.'
            );
            return response()->json(['error' => 'Subscription failed'], 500);
        }
    }

    private function createRazorpaySubscription($amount, $interval)
    {
        $planId = $this->createRazorpayPlan($amount, 'INR', $interval);
        if (!$planId) return null;

        $api = new RazorpayApi(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        $data = ['plan_id' => $planId, 'total_count' => 12, 'quantity' => 1, 'customer_notify' => 1];
        return $api->subscription->create($data);
    }

    private function createRazorpayPlan($amount, $currency = 'INR', $interval = 'monthly', $interval_count = 1)
    {
        $api = new RazorpayApi(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        $data = [
            'period' => $interval,
            'interval' => $interval_count,
            'item' => ['name' => 'TEST Monthly Seva - Shrinath Mhaskoba Mandir', 'amount' => $amount, 'currency' => $currency]
        ];
        $plan = $api->plan->create($data);
        return $plan->id;
    }

    private function generatePaymentLink($subscriptionId, $amount)
    {
        $api = new RazorpayApi(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        try {
            $linkData = [
                'amount' => $amount, 'currency' => 'INR',
                'description' => 'TEST Monthly Seva for Shrinath Mhaskoba Mandir',
                'reference_id' => $subscriptionId,
                'callback_url' => 'https://shrinathmhaskobakodit.org/',
                'callback_method' => 'get',
                'customer' => ['email' => 'test@temple.com', 'contact' => '9999999999'],
                'notify' => ['sms' => true, 'email' => true]
            ];
            $paymentLink = $api->paymentLink->create($linkData);
            return $paymentLink->short_url ?? null;
        } catch (\Exception $e) {
            Log::error('Failed to generate payment link', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private function sendMessage($phoneNumber, $text)
    {
        $client = new Client();
        try {
            $client->post("https://graph.facebook.com/v21.0/{$this->phoneNumberId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to'   => $phoneNumber,
                    'type' => 'text',
                    'text' => ['body' => $text]
                ]
            ]);
            return response()->json(['status' => 'sent']);
        } catch (\Exception $e) {
            Log::error('Failed to send text message', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Message send failed'], 500);
        }
    }

    public function donationSuccess(Request $request)
    {
        $amount = $request->query('amount');
        $phone  = $request->query('phone');

        Log::info('Donation success callback', ['amount' => $amount, 'phone' => $phone]);

        return redirect('https://shrinathmhaskobakodit.org/')
            ->with('message', "श्रीनाथ म्हस्कोबा मंदिरासाठी ₹{$amount} च्या दान/सेवेसाठी धन्यवाद! (TEST MODE) / Thank you for your ₹{$amount} donation/seva! (TEST MODE)");
    }
}



