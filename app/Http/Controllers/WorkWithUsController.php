<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WorkWithUS;


class WorkWithUsController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve all ContactUs records from the database
        $contactUsRecords = WorkWithUS::all();

        // Return the data as a JSON response
        return response()->json($contactUsRecords);
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
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|email|max:50',
            'mobile' => 'required|string|max:13',
            'queries' => 'nullable|string|max:255',
        ]);

        // Create a new ContactUs entry and store it in the database
        $contactUs = WorkWithUS::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'mobile' => $validatedData['mobile'],
            'queries' => $validatedData['queries'],
        ]);

        // Return a success response with the created resource
        return response()->json(['message' => 'Contact data stored successfully', 'data' => $contactUs], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(WorkWithUS $contactUs)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkWithUS $contactUs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkWithUS $contactUs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkWithUS $contactUs)
    {
        //
    }
}
