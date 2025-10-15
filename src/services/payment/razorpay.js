import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';

// Razorpay payment service
class RazorpayService {
  constructor() {
    this.keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
    this.keySecret = process.env.REACT_APP_RAZORPAY_KEY_SECRET;
    
    if (!this.keyId) {
      console.error('Razorpay Key ID not found in environment variables');
    }
    
    this.isRazorpayLoaded = false;
    this.loadRazorpayScript();
  }

  // Load Razorpay script dynamically
  async loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        this.isRazorpayLoaded = true;
        resolve(true);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.getElementById('razorpay-checkout-js');
      if (existingScript) {
        existingScript.onload = () => {
          this.isRazorpayLoaded = true;
          resolve(true);
        };
        existingScript.onerror = () => reject(new Error('Failed to load Razorpay script'));
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isRazorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      
      document.body.appendChild(script);
    });
  }

  // Wait for Razorpay to be loaded
  async ensureRazorpayLoaded() {
    if (this.isRazorpayLoaded && window.Razorpay) {
      return true;
    }
    return this.loadRazorpayScript();
  }

  // Create payment order
  async createOrder(orderData) {
    try {
      // In a real application, this would be a backend API call
      // For now, we'll simulate order creation
      const order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(orderData.amount * 100), // Convert to paise
        currency: orderData.currency || BUSINESS_CONSTANTS.CURRENCY.code,
        receipt: orderData.receipt || `receipt_${Date.now()}`,
        status: 'created',
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000)
      };

      return {
        success: true,
        data: order
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process payment
  async processPayment(paymentOptions) {
    try {
      await this.ensureRazorpayLoaded();

      if (!window.Razorpay) {
        throw new Error('Razorpay not loaded');
      }

      return new Promise((resolve, reject) => {
        const options = {
          key: this.keyId,
          amount: Math.round(paymentOptions.amount * 100), // Convert to paise
          currency: paymentOptions.currency || BUSINESS_CONSTANTS.CURRENCY.code,
          name: paymentOptions.name || BUSINESS_CONSTANTS.CONTACT_INFO.companyName || 'Nutrition Shop',
          description: paymentOptions.description || 'Order Payment',
          image: paymentOptions.image || '/logo192.png',
          order_id: paymentOptions.order_id,
          
          // Customer details
          prefill: {
            name: paymentOptions.customer?.name || '',
            email: paymentOptions.customer?.email || '',
            contact: paymentOptions.customer?.phone || ''
          },

          // Notes
          notes: {
            order_id: paymentOptions.order_id,
            customer_id: paymentOptions.customer?.id || '',
            ...paymentOptions.notes
          },

          // Theme
          theme: {
            color: paymentOptions.theme?.color || '#2E7D32'
          },

          // Payment method preferences
          method: {
            netbanking: true,
            card: true,
            wallet: true,
            upi: true,
            paylater: true
          },

          // Success handler
          handler: (response) => {
            const paymentResult = {
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              method: response.method || 'unknown'
            };
            resolve(paymentResult);
          },

          // Modal settings
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'Payment cancelled by user',
                cancelled: true
              });
            },
            // Escape key and overlay click handling
            escape: true,
            backdropclose: false
          },

          // Retry settings
          retry: {
            enabled: true,
            max_count: 3
          },

          // Timeout
          timeout: 300, // 5 minutes

          // Error handler
          error: (error) => {
            reject({
              success: false,
              error: error.description || error.reason || 'Payment failed',
              code: error.code,
              source: error.source,
              step: error.step,
              metadata: error.metadata
            });
          }
        };

        // Create Razorpay instance and open checkout
        const razorpayInstance = new window.Razorpay(options);
        
        // Handle checkout failure
        razorpayInstance.on('payment.failed', (response) => {
          reject({
            success: false,
            error: response.error.description || 'Payment failed',
            code: response.error.code,
            source: response.error.source,
            step: response.error.step,
            reason: response.error.reason,
            paymentId: response.error.metadata?.payment_id
          });
        });

        // Open checkout
        razorpayInstance.open();
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to process payment'
      };
    }
  }

  // Verify payment signature (should be done on backend)
  verifyPaymentSignature(orderId, paymentId, signature) {
    // Note: In production, this verification MUST be done on the backend
    // This is just for demonstration purposes
    try {
      const crypto = require('crypto');
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(body.toString())
        .digest('hex');
      
      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  // Capture payment (for authorized payments)
  async capturePayment(paymentId, amount, currency = BUSINESS_CONSTANTS.CURRENCY.code) {
    try {
      // This would typically be a backend API call
      const captureData = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency
      };

      // Simulate API call
      const response = await this.makeAPICall(`/payments/${paymentId}/capture`, {
        method: 'POST',
        body: captureData
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error capturing payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount = null, notes = {}) {
    try {
      const refundData = {
        ...(amount && { amount: Math.round(amount * 100) }), // Convert to paise if amount provided
        notes: {
          reason: 'Customer request',
          ...notes
        }
      };

      // This would typically be a backend API call
      const response = await this.makeAPICall(`/payments/${paymentId}/refund`, {
        method: 'POST',
        body: refundData
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error refunding payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      // This would typically be a backend API call
      const response = await this.makeAPICall(`/payments/${paymentId}`, {
        method: 'GET'
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    try {
      // This would typically be a backend API call
      const response = await this.makeAPICall(`/orders/${orderId}`, {
        method: 'GET'
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create subscription (for recurring payments)
  async createSubscription(subscriptionData) {
    try {
      // This would typically be a backend API call
      const response = await this.makeAPICall('/subscriptions', {
        method: 'POST',
        body: subscriptionData
      });

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle webhooks (backend implementation)
  handleWebhook(payload, signature) {
    try {
      // Verify webhook signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new Error('Invalid webhook signature');
      }

      const event = JSON.parse(payload);
      
      // Handle different webhook events
      switch (event.event) {
        case 'payment.captured':
          return this.handlePaymentCaptured(event.payload);
        case 'payment.failed':
          return this.handlePaymentFailed(event.payload);
        case 'order.paid':
          return this.handleOrderPaid(event.payload);
        case 'refund.created':
          return this.handleRefundCreated(event.payload);
        default:
          console.log('Unhandled webhook event:', event.event);
          return { success: true };
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      return { success: false, error: error.message };
    }
  }

  // Webhook event handlers
  async handlePaymentCaptured(payload) {
    // Update order status, send confirmation email, etc.
    console.log('Payment captured:', payload);
    return { success: true };
  }

  async handlePaymentFailed(payload) {
    // Handle failed payment, notify customer, etc.
    console.log('Payment failed:', payload);
    return { success: true };
  }

  async handleOrderPaid(payload) {
    // Order fully paid, update inventory, send confirmation, etc.
    console.log('Order paid:', payload);
    return { success: true };
  }

  async handleRefundCreated(payload) {
    // Handle refund, update order status, notify customer, etc.
    console.log('Refund created:', payload);
    return { success: true };
  }

  // Utility method for API calls (would be implemented on backend)
  async makeAPICall(endpoint, options = {}) {
    // This is a placeholder for backend API calls
    // In production, these calls would be made from your backend server
    throw new Error('API calls should be implemented on the backend');
  }

  // Validate payment amount
  validateAmount(amount) {
    const minAmount = 1; // Minimum 1 rupee
    const maxAmount = 500000; // Maximum 5 lakh rupees
    
    if (amount < minAmount) {
      return {
        valid: false,
        error: `Minimum payment amount is ${BUSINESS_CONSTANTS.CURRENCY.symbol}${minAmount}`
      };
    }
    
    if (amount > maxAmount) {
      return {
        valid: false,
        error: `Maximum payment amount is ${BUSINESS_CONSTANTS.CURRENCY.symbol}${maxAmount}`
      };
    }
    
    return { valid: true };
  }

  // Format amount for display
  formatAmount(amount) {
    return `${BUSINESS_CONSTANTS.CURRENCY.symbol}${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }

  // Get supported payment methods
  getSupportedMethods() {
    return [
      { id: 'card', name: 'Credit/Debit Card', icon: 'credit_card' },
      { id: 'netbanking', name: 'Net Banking', icon: 'account_balance' },
      { id: 'wallet', name: 'Wallets', icon: 'account_balance_wallet' },
      { id: 'upi', name: 'UPI', icon: 'smartphone' },
      { id: 'paylater', name: 'Pay Later', icon: 'schedule' }
    ];
  }

  // Check if Razorpay is available
  isAvailable() {
    return this.isRazorpayLoaded && window.Razorpay && this.keyId;
  }
}

// Create and export singleton instance
const razorpayService = new RazorpayService();
export default razorpayService;