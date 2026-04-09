<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use App\Models\BookingUser;

use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Carbon\Carbon; 


class AuthController extends Controller
{
    function register(Request $request){
        $fields = $request->validate([
            'name' => 'required|string',
            'mobile' => 'required|string|unique:users',
            'type' => 'required',
            'email' => 'nullable|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name'=> $fields['name'],
            'email'=> $fields['email'],
            'mobile'=> $fields['mobile'],
            'type'=> $fields['type'],
            'password'=> bcrypt($fields['password'])
        ]);

        $token = $user->createToken('webapp')->plainTextToken;
        $response = [
            'user'=> $user,
            'token'=> $token
        ];
        return response($response,201);
    }

    function login(Request $request){
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        //Check if email exists
        $user = User::where('email',$fields['email'])->first();

        //Check password
        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response([
                'message'=>'Please provide valid credentials'
            ],401);
        }

        if($user->blocked == 1){
            return response([
                'message'=>'User not allowed. Kindly contact admin.'
            ],401);
        }

        $token = $user->createToken('webapp')->plainTextToken;
        $response = [
            'user'=> $user,
            'token'=> $token
        ];
        return response($response,201);
    }

    function mobileLogin(Request $request){
        $fields = $request->validate([
            'mobile' => 'required|string',
            'password' => 'required|string'
        ]);

        //Check if mobile no exists
        $user = User::where('mobile',$fields['mobile'])->first();

        //Check password
        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response([
                'message'=>'Please provide valid credentials'
            ],401);
        }

        if($user->blocked == 1){
            return response([
                'message'=>'Kindly contact admin'
            ],401);
        }

        $token = $user->createToken('mobileLoginToken')->plainTextToken;
        $response = [
            'user'=> $user,
            'token'=> $token
        ];
        return response($response,201);
    }

    function logout(Request $request){
        auth()->user()->tokens()->delete();
        return ['message'=>'Logged out'];
    }

    function changePassword(Request $request){
        $fields = $request->validate([
            'mobile' => 'required|string',
            'password' => 'required|string',
            'new_password' => 'required|string',
        ]);

        //Check if email exists
        $user = User::where('mobile',$fields['mobile'])->first();

        //Check password
        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response([
                'message'=>'Please provide valid credentials'
            ],401);
        }else{
            $user->password =  bcrypt($fields['new_password']);
            $user->save();
            auth()->user()->tokens()->delete();
        }

        $token = $user->createToken('webapp')->plainTextToken;
        $response = [
            'user'=> $user,
            'token'=> $token
        ];
        return response($response,200);
    }

    public function allUsers(Request $request)
    {
        if($request->customers == 'true'){
            return User::where('type',10)->paginate(50);
        }
        return User::where('type','<',10)->paginate(50);
    }
    public function update(Request $request)
    {
        $obj = User::find($request->id);
        $obj->update($request->all());
        return $obj;
    }

    function registerUser(Request $request){
        $fields = $request->validate([
            'name' => 'required|string',
            'mobile' => 'required|string|unique:users,mobile',
            'type' => 'required',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name'=> $fields['name'],
            'email'=> $fields['email'],
            'mobile'=> $fields['mobile'],
            'type'=> $fields['type'],
            'password'=> bcrypt($fields['password'])
        ]);
        return response($user,201);
    }










public function sendOtp(Request $request)
{
    $request->validate(['email' => 'required|email']);
    $otp = rand(100000, 999999);

    $user = BookingUser::updateOrCreate(
        ['email' => $request->email],
        ['otp' => $otp, 'is_verified' => false, 'otp_expires_at' => Carbon::now()->addMinutes(10)]
    );

    Mail::to($request->email)->send(new OtpMail($otp));

    return response()->json(['message' => 'OTP sent successfully']);
}

public function verifyOtp(Request $request)
{
    $request->validate(['email' => 'required|email', 'otp' => 'required|digits:6']);

    $user = BookingUser::where('email', $request->email)
                ->where('otp', $request->otp)
                ->where('otp_expires_at', '>', Carbon::now())
                ->first();

    if (!$user) return response()->json(['error' => 'Invalid or expired OTP'], 400);

    $user->update(['is_verified' => true, 'otp' => null]);

    $token = $user->createToken('yadnya-booking')->plainTextToken;

    return response()->json(['token' => $token, 'message' => 'Login successful']);
}



}
