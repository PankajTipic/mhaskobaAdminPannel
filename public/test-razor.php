<?php

require __DIR__.'/../vendor/autoload.php';

$client = new GuzzleHttp\Client(['verify' => false]);

try {
    $res = $client->get('https://api.razorpay.com');
    echo "Success: " . $res->getStatusCode();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}