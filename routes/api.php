<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ProductController; 
use App\Http\Controllers\FileUpload;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\WorkWithUsController;
use App\Http\Controllers\RazorpayController;
use App\Http\Controllers\PaymentController;

use App\Http\Controllers\RazorpayPaymentController;
 
Route::post('/create-order', [RazorpayController::class, 'createOrder']);
// Route::post('/razorpay/create-plan', [RazorpayController::class, 'createPlan']);
Route::post('/verify-payment', [RazorpayController::class, 'verifyPayment']);
Route::post('/razorpay/create-plan', [RazorpayController::class, 'createPlan']);
// Route::post('/razorpay/create-subscription', [RazorpayController::class, 'createSubscription']);
Route::post('/create-subscription', [RazorpayController::class, 'createSubscription']);


Route::post('/razorpay-payments', [RazorpayPaymentController::class, 'store']);
Route::get('/razorpay-payments', [RazorpayPaymentController::class, 'show']);


Route::get('/payment/success', [PaymentController::class, 'success']);






//public API's
Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::post('/mobileLogin',[AuthController::class, 'mobileLogin']);
Route::get('/contact-us', [ContactUsController::class, 'index']);
Route::get('/donations', [DonationController::class, 'index']);
Route::post('/contact-usstore', [ContactUsController::class, 'store']);
Route::post('/donationsstore', [DonationController::class, 'store']);
Route::post('/uploadFile', [FileUpload::class, 'fileUpload'])->name('fileUpload');
Route::post('/workwithus', [WorkWithUsController::class, 'store']);
Route::get('/workwithus', [WorkWithUsController::class, 'index']);

Route::post('/contact-us/{contactUs}/read', [ContactUsController::class, 'markRead']);
Route::post('/contact-us/{contactUs}/unread', [ContactUsController::class, 'markUnread']);

Route::post('/donate/initiate', [DonationController::class, 'initiate']);
Route::post('/donate/verify',   [DonationController::class, 'verify']);


//Secured API's
Route::group(['middleware'=>['auth:sanctum']], function(){
    Route::post('/changePassword',[AuthController::class, 'changePassword']);
    Route::post('/logout',[AuthController::class, 'logout']);
    Route::post('/registerUser',[AuthController::class, 'registerUser']);
    Route::put('/appUsers',[AuthController::class, 'update']);
    Route::get('/appUsers',[AuthController::class, 'allUsers']);
    // Route::get('/getAllProductId',[ProductController::class, 'showById']);
    // Route::get('/getProductBy/{id}',[ProductController::class, 'show']);
    // Route::post('/createProductId', [ProductController::class, 'store']);
    // Route::resource('product',ProductController::class);
    // Route::post('/createFaq', [FaqController::class, 'create']);
    // Route::get('/faqs/product/{product_id}', [FaqController::class, 'getFaqsByProductId']);
    // Route::post('/createFaq', [FaqController::class, 'addFaq']);
    // Route::get('/faqs/user', [FaqController::class, 'getFaqsByLoginUser']);
    // Route::put('/faqs/{id}', [FaqController::class, 'updateFaq']);
    // Route::delete('/faqs/{id}', [FaqController::class, 'deleteFaq']);


    // Route::post('/newStock',[ProductController::class, 'newStock'])->name('newStock');
    // Route::get('/lowStock',[ProductController::class, 'lowStock'])->name('lowStock');
    // Route::post('/uploadFiles', [FileUpload::class, 'filesUpload'])->name('filesUpload');
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Admin-specific routes can be added here
    });
Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    // User-specific routes can be added here
});


//whatsapp api
Route::post('/whatsapp/receiveMessage', [WhatsAppController::class, 'receiveMessage']);
 
 
Route::post('/whatsapp/incomingMessage', [WhatsAppController::class, 'incomingMessage']);
 
Route::post('/webhook', [WhatsAppController::class, 'webhook']);
// Route::get('/webhook', [WhatsAppController::class, 'webhook']);
Route::get('/webhook', [WhatsAppController::class, 'verifyToken']);
 
 
Route::get('/sendurlbuttons/{phone}', [WhatsAppController::class, 'xyz']);
