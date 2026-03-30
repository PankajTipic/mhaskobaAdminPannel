<?php

namespace App\Http\Controllers;

use App\Models\ContactUs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactUsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     // Retrieve all ContactUs records from the database
    //     $contactUsRecords = ContactUs::all();

    //     // Return the data as a JSON response
    //     return response()->json($contactUsRecords);
    // }


public function index(Request $request)
{
    $query = ContactUs::query()->latest();

    // Status filter
    if ($request->status === 'read') {
        $query->where('is_read', 1);
    }

    if ($request->status === 'unread') {
        $query->where('is_read', 0);
    }

    // Search filter
    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%$search%")
              ->orWhere('email', 'like', "%$search%")
              ->orWhere('phone', 'like', "%$search%")
              ->orWhere('subject', 'like', "%$search%")
              ->orWhere('message', 'like', "%$search%");
        });
    }

    $contacts = $query->paginate($request->get('per_page', 15));

    return response()->json($contacts);
}


// New endpoint – mark as read/unread
public function markRead(ContactUs $contactUs)
{
    $contactUs->markAsRead();
    return response()->json(['success' => true, 'message' => 'Marked as read']);
}

public function markUnread(ContactUs $contactUs)
{
    $contactUs->markAsUnread();
    return response()->json(['success' => true, 'message' => 'Marked as unread']);
}




    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
   

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:80',
            'email'   => 'required|email|max:100',
            'phone'   => 'required|string|max:15',      // allow +91 etc.
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $contact = ContactUs::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'phone'   => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'आमच्याशी संपर्क साधल्याबद्दल धन्यवाद! लवकरच उत्तर देऊ.',
            'data'    => $contact
        ], 201);
    }
   

    /**
     * Display the specified resource.
     */
    public function show(ContactUs $contactUs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactUs $contactUs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactUs $contactUs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactUs $contactUs)
    {
        //
    }
}

