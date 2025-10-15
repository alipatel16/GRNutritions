import * as validators from '../helpers/validators';

// Checkout validation schema
export const checkoutSchema = {
  shippingAddress: {
    validators: [
      validators.required
    ],
    fieldName: 'Shipping Address'
  },
  billingAddress: {
    validators: [],
    fieldName: 'Billing Address'
  },
  sameAsShipping: {
    validators: [],
    fieldName: 'Billing Same as Shipping'
  },
  shippingMethod: {
    validators: [
      validators.required
    ],
    fieldName: 'Shipping Method'
  },
  paymentMethod: {
    validators: [
      validators.required
    ],
    fieldName: 'Payment Method'
  },
  specialInstructions: {
    validators: [
      validators.maxLength(500)
    ],
    fieldName: 'Special Instructions'
  }
};

// Order creation validation schema
export const orderCreationSchema = {
  userId: {
    validators: [
      validators.required
    ],
    fieldName: 'User ID'
  },
  items: {
    validators: [
      validators.required,
      (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return 'Order must contain at least one item';
        }
        return '';
      }
    ],
    fieldName: 'Order Items'
  },
  shippingAddress: {
    validators: [
      validators.required
    ],
    fieldName: 'Shipping Address'
  },
  paymentMethod: {
    validators: [
      validators.required
    ],
    fieldName: 'Payment Method'
  },
  totalAmount: {
    validators: [
      validators.required,
      validators.orderAmount
    ],
    fieldName: 'Total Amount'
  }
};

// Order item validation
export const orderItemSchema = {
  productId: {
    validators: [
      validators.required
    ],
    fieldName: 'Product ID'
  },
  productName: {
    validators: [
      validators.required
    ],
    fieldName: 'Product Name'
  },
  quantity: {
    validators: [
      validators.required,
      validators.orderQuantity
    ],
    fieldName: 'Quantity'
  },
  price: {
    validators: [
      validators.required,
      validators.positiveNumber
    ],
    fieldName: 'Price'
  }
};

// Order status update validation schema
export const orderStatusUpdateSchema = {
  orderId: {
    validators: [
      validators.required
    ],
    fieldName: 'Order ID'
  },
  status: {
    validators: [
      validators.required
    ],
    fieldName: 'Order Status'
  },
  notes: {
    validators: [
      validators.maxLength(500)
    ],
    fieldName: 'Status Update Notes'
  }
};

// Order cancellation validation schema
export const orderCancellationSchema = {
  orderId: {
    validators: [
      validators.required
    ],
    fieldName: 'Order ID'
  },
  reason: {
    validators: [
      validators.required,
      validators.minLength(10),
      validators.maxLength(500)
    ],
    fieldName: 'Cancellation Reason'
  }
};

// Order filter validation schema
export const orderFilterSchema = {
  status: {
    validators: [],
    fieldName: 'Order Status'
  },
  startDate: {
    validators: [],
    fieldName: 'Start Date'
  },
  endDate: {
    validators: [],
    fieldName: 'End Date'
  },
  minAmount: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Minimum Amount'
  },
  maxAmount: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Maximum Amount'
  },
  paymentStatus: {
    validators: [],
    fieldName: 'Payment Status'
  }
};

// Payment details validation schema
export const paymentDetailsSchema = {
  cardNumber: {
    validators: [
      validators.required,
      (value) => {
        const cleanedValue = value.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(cleanedValue)) {
          return 'Please enter a valid card number';
        }
        return '';
      }
    ],
    fieldName: 'Card Number'
  },
  cardholderName: {
    validators: [
      validators.required,
      validators.minLength(3),
      validators.maxLength(100)
    ],
    fieldName: 'Cardholder Name'
  },
  expiryDate: {
    validators: [
      validators.required,
      (value) => {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
          return 'Please enter a valid expiry date (MM/YY)';
        }
        // Check if card is not expired
        const [month, year] = value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiry < new Date()) {
          return 'Card has expired';
        }
        return '';
      }
    ],
    fieldName: 'Expiry Date'
  },
  cvv: {
    validators: [
      validators.required,
      (value) => {
        if (!/^\d{3,4}$/.test(value)) {
          return 'Please enter a valid CVV';
        }
        return '';
      }
    ],
    fieldName: 'CVV'
  }
};

// Shipping details validation schema
export const shippingDetailsSchema = {
  fullName: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(100)
    ],
    fieldName: 'Full Name'
  },
  phoneNumber: {
    validators: [
      validators.required,
      validators.phone
    ],
    fieldName: 'Phone Number'
  },
  email: {
    validators: [
      validators.required,
      validators.email
    ],
    fieldName: 'Email'
  },
  addressLine1: {
    validators: [
      validators.required,
      validators.minLength(5),
      validators.maxLength(200)
    ],
    fieldName: 'Address Line 1'
  },
  addressLine2: {
    validators: [
      validators.maxLength(200)
    ],
    fieldName: 'Address Line 2'
  },
  city: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ],
    fieldName: 'City'
  },
  state: {
    validators: [
      validators.required
    ],
    fieldName: 'State'
  },
  pincode: {
    validators: [
      validators.required,
      validators.pincode
    ],
    fieldName: 'Pincode'
  },
  country: {
    validators: [
      validators.required
    ],
    fieldName: 'Country'
  }
};

// Validate form with schema
export const validateWithSchema = (values, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];
    const value = values[fieldName];
    
    for (const validator of fieldSchema.validators) {
      const error = validator(value, values);
      if (error) {
        errors[fieldName] = error;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  checkoutSchema,
  orderCreationSchema,
  orderItemSchema,
  orderStatusUpdateSchema,
  orderCancellationSchema,
  orderFilterSchema,
  paymentDetailsSchema,
  shippingDetailsSchema,
  validateWithSchema
};