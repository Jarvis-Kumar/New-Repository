import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import paymentService from '../../services/paymentService';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

const PaymentForm = ({ preset, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'stripe') {
        // Create payment intent
        const clientSecret = await paymentService.createPaymentIntent(
          preset.price,
          'usd',
          {
            presetId: preset.id,
            presetTitle: preset.title,
            authorId: preset.author.id
          }
        );

        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Customer Name',
            },
          }
        });

        if (error) {
          throw error;
        }

        if (paymentIntent.status === 'succeeded') {
          toast.success('Payment successful! Design unlocked.');
          onSuccess(paymentIntent);
        }
      } else if (paymentMethod === 'razorpay') {
        // Handle Razorpay payment
        const response = await paymentService.processRazorpayPayment(
          preset.price,
          'USD',
          `order_${Date.now()}`
        );
        
        toast.success('Payment successful! Design unlocked.');
        onSuccess(response);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9ca3af',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`p-3 border rounded-lg transition-colors ${
              paymentMethod === 'stripe'
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
          >
            <CreditCard className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Credit Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('razorpay')}
            className={`p-3 border rounded-lg transition-colors ${
              paymentMethod === 'razorpay'
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-gray-600 text-gray-400 hover:border-gray-500'
            }`}
          >
            <Shield className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Razorpay</span>
          </button>
        </div>
      </div>

      {/* Card Details (Stripe) */}
      {paymentMethod === 'stripe' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Details
          </label>
          <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>{preset.title}</span>
            <span>${preset.price}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Processing Fee</span>
            <span>$0.00</span>
          </div>
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="flex justify-between text-white font-semibold">
              <span>Total</span>
              <span>${preset.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay ${preset.price}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ preset, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('payment'); // payment, processing, success, error

  const handleSuccess = (paymentResult) => {
    setStep('success');
    setTimeout(() => {
      onSuccess(paymentResult);
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    onClose();
    setStep('payment');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {step === 'payment' && 'Complete Purchase'}
                {step === 'processing' && 'Processing Payment'}
                {step === 'success' && 'Payment Successful'}
                {step === 'error' && 'Payment Failed'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            {step === 'payment' && (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  preset={preset}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            )}

            {step === 'processing' && (
              <div className="text-center py-8">
                <Loader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Processing your payment...
                </h4>
                <p className="text-gray-400">
                  Please don't close this window
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Payment Successful!
                </h4>
                <p className="text-gray-400 mb-4">
                  Your design has been unlocked and is ready for download.
                </p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-sm">
                    You will be redirected to the download page shortly...
                  </p>
                </div>
              </div>
            )}

            {step === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Payment Failed
                </h4>
                <p className="text-gray-400 mb-4">
                  There was an issue processing your payment. Please try again.
                </p>
                <button
                  onClick={() => setStep('payment')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;