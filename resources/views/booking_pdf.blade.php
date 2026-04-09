<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Booking Confirmation</title>

<style>
body{
font-family: DejaVu Sans;
}
table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}
table, th, td{
border:1px solid #000;
padding:8px;
}
</style>

</head>
<body>

<h2>Yadnya Booking Confirmation</h2>

<p><strong>Email:</strong> {{ $booking->user_email }}</p>
<p><strong>Date:</strong> {{ $booking->yadnya_date }}</p>
<p><strong>Total Persons:</strong> {{ $booking->total_person }}</p>
<p><strong>Amount:</strong> ₹{{ $booking->total_amount }}</p>
<p><strong>Payment ID:</strong> {{ $booking->payment_id }}</p>

<h3>Person Details</h3>

<table>
<tr>
<th>Name</th>
<th>Email</th>
<th>Age</th>
</tr>

@foreach($persons as $person)
<tr>
<td>{{ $person->name }}</td>
<td>{{ $person->email }}</td>
<td>{{ $person->age }}</td>
</tr>
@endforeach

</table>

<h3>Terms & Conditions</h3>

<ul>
<li>All bookings are non-refundable.</li>
<li>Participants must arrive on time.</li>
<li>Valid ID required.</li>
<li>Follow temple rules.</li>
<li>Booking amount is final.</li>
</ul>

</body>
</html>