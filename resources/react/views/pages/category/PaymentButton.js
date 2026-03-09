import React, { useEffect } from 'react';
import { post } from '../../../util/api';
 
const PaymentButton = () => {
  // Load the Razorpay Checkout script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => console.log('Razorpay script loaded');
    document.body.appendChild(script);
 
    return () => {
      // Cleanup the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);
 
  const handlePayment = async () => {
    try {
      // Step 1: Call Laravel backend to create an order
      const data  = await post('/api/create-order', {
        amount: 500, // ₹500
        currency: 'INR',
      });
   
      // Log the response to see its structure
      console.log('Backend response:', data);
   
      if (data) {
        const options = {
          key: 'rzp_live_Ebk56hnBoIiRk8', // Razorpay Key ID
          amount: data.order.amount, // Amount in paise (e.g., ₹50000 for ₹500)
          currency: data.order.currency, // INR
          order_id: data.order.id, // Razorpay Order ID
          name: 'nlp',
          description: 'Test Transaction',
          handler: async (response) => {
            // Step 2: Verify payment on backend
            const verifyResponse = await post('/api/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
   
            if (verifyResponse.data.success) {
              alert('Payment Successful!');
            } else {
              alert('Payment Verification Failed!');
            }
          },
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc', // Customize the theme color
          },
        };
   
        const razorpay = new window.Razorpay(options);
        razorpay.open();
   
        razorpay.on('payment.failed', (response) => {
          console.error('Payment Failed:', response.error);
          alert('Payment Failed!');
        });
      } else {
        alert('Failed to create Razorpay order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };
 
  return <button onClick={handlePayment}>Pay Now</button>;
};
 
export default PaymentButton;