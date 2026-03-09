<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ config('app.name') }}</title>
<link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />
 
    <!-- Include Razorpay Checkout Script -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 
    <!-- Vite Scripts for React -->
    @viteReactRefresh
    @vite('resources/react/index.js')
</head>
<body>
<div id="root"></div> <!-- React app will mount here -->
</body>
</html>