import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'core-js';
 
import App from './App';
import store from './store';
 
// Dynamically load the Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
 
loadRazorpayScript().then((loaded) => {
  if (!loaded) {
    console.error('Razorpay SDK failed to load.');
  }
});
 
// Rendering the main React application
createRoot(document.getElementById('root')).render(
<Provider store={store}>
<App />
</Provider>
);