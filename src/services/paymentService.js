import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (you'll need to add your Stripe publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

class PaymentService {
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
          metadata
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Payment Intent Error:', error);
      throw error;
    }
  }

  async processPayment(clientSecret, paymentMethod) {
    try {
      const stripe = await stripePromise;
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Payment Processing Error:', error);
      throw error;
    }
  }

  async createCheckoutSession(items, successUrl, cancelUrl) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          success_url: successUrl,
          cancel_url: cancelUrl
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout Session Error:', error);
      throw error;
    }
  }

  // Razorpay integration (alternative payment method)
  async processRazorpayPayment(amount, currency = 'INR', orderId) {
    return new Promise((resolve, reject) => {
      const options = {
        key: 'your_razorpay_key_here',
        amount: amount * 100,
        currency,
        name: 'Design Platform',
        description: 'Premium Design Purchase',
        order_id: orderId,
        handler: function (response) {
          resolve(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6366f1'
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          reject(response.error);
        });
        rzp.open();
      } else {
        reject(new Error('Razorpay not loaded'));
      }
    });
  }
}

export default new PaymentService();