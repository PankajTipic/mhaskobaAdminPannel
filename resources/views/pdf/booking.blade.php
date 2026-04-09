<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body{
font-family: DejaVu Sans;
}

table{
width:100%;
border-collapse: collapse;
margin-top:20px;
}

table,th,td{
border:1px solid #000;
padding:8px;
}

.title{
text-align:center;
font-size:22px;
font-weight:bold;
margin-bottom:10px;
}

.terms{
margin-top:30px;
font-size:12px;
}
</style>
</head>
<body>

<div class="title">
Yadnya Booking Confirmation
</div>

<h4>Booking Details</h4>

<p><strong>Email:</strong> {{ $booking->user_email }}</p>
<p><strong>Date:</strong> {{ $booking->yadnya_date }}</p>
<p><strong>Total Person:</strong> {{ $booking->total_person }}</p>
<p><strong>Total Amount:</strong> ₹{{ $booking->total_amount }}</p>
<p><strong>Payment ID:</strong> {{ $booking->payment_id }}</p>

<h4>Person Details</h4>

<table>
<tr>
<th>#</th>
<th>Name</th>
<th>Email</th>
<th>Age</th>
</tr>

@foreach($persons as $index => $p)
<tr>
<td>{{ $index+1 }}</td>
<td>{{ $p->name }}</td>
<td>{{ $p->email }}</td>
<td>{{ $p->age }}</td>
</tr>
@endforeach

</table>

<div class="terms">
<h4>Terms & Conditions</h4>

<ul>
<li>All bookings are non-refundable.</li>
<li>Please carry valid ID proof.</li>
<li>Reporting time before 30 minutes.</li>
<li>Follow temple rules.</li>
<li>Payment once done cannot be cancelled.</li>
</ul>

</div>

</body>
</html>