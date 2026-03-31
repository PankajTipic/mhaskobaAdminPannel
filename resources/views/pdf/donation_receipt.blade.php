<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donation Receipt - Shrinath Mhaskoba Mandir</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .temple-name { 
            font-size: 26px; 
            font-weight: bold; 
            color: #b91c1c; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 25px 0; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #fee2e2; 
        }
        .footer { 
            margin-top: 50px; 
            text-align: center; 
            font-size: 13px; 
            color: #666; 
        }
        .thankyou { 
            font-size: 19px; 
            font-weight: bold; 
            color: #166534; 
            margin: 40px 0; 
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <!-- <h1 class="temple-name">🙏 श्रीनाथ म्हस्कोबा मंदिर, कोडीत 🙏</h1> -->
        <h1 class="temple-name">Shrinath Mhaskoba Mandir, Kodit</h1>
        <p><strong>Official Donation Receipt</strong></p>
    </div>

    <table>
        <tr>
            <th colspan="2" style="text-align:center; background:#fee2e2; font-size:18px;">
                Transaction Details
            </th>
        </tr>
        <tr><td><strong>Transaction ID</strong></td><td>{{ $transaction_id }}</td></tr>
        <tr><td><strong>Order ID</strong></td><td>{{ $order_id ?? 'N/A' }}</td></tr>
        <tr><td><strong>Date & Time</strong></td><td>{{ $payment_date }}</td></tr>
        <tr><td><strong>Donor Name</strong></td><td>{{ $name }}</td></tr>
        <tr><td><strong>Phone Number</strong></td><td>{{ $phone }}</td></tr>
        <tr><td><strong>Email</strong></td><td>{{ $email ?? 'N/A' }}</td></tr>
        <tr><td><strong>Purpose / Seva</strong></td><td>{{ $purpose ?? 'General Donation' }}</td></tr>
        <tr><td><strong>Amount Paid</strong></td><td><strong>₹{{ number_format($amount, 2) }}</strong></td></tr>
        <tr><td><strong>Payment Method</strong></td><td>{{ $method ?? 'Razorpay' }}</td></tr>
        <tr><td><strong>Status</strong></td><td style="color:green; font-weight:bold;">SUCCESS</td></tr>
    </table>

    <div class="thankyou">
        
        Thank you for your generous contribution!
    </div>

    <div class="footer">
        <p>This is a computer-generated receipt. No signature required.</p>
        <p>For any queries: koditnathmhaskoba63@gmail.com</p>
        <p>Website: https://shrinathmhaskobakodit.org</p>
    </div>
</body>
</html>