import { BUSINESS_CONSTANTS } from '../constants/orderStatus';

// Basic validation rules
export const required = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const minLength = (min) => (value, fieldName = 'This field') => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }
  return '';
};

export const maxLength = (max) => (value, fieldName = 'This field') => {
  if (value && value.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return '';
};

export const email = (value) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const phone = (value) => {
  if (value) {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    const cleanedPhone = value.replace(/\s/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      return 'Please enter a valid Indian phone number';
    }
  }
  return '';
};

export const password = (value) => {
  if (value) {
    if (value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
  }
  return '';
};

export const confirmPassword = (confirmValue, originalValue) => {
  if (confirmValue && confirmValue !== originalValue) {
    return 'Passwords do not match';
  }
  return '';
};

export const url = (value) => {
  if (value) {
    try {
      new URL(value);
    } catch {
      return 'Please enter a valid URL';
    }
  }
  return '';
};

export const number = (value, fieldName = 'This field') => {
  if (value && isNaN(Number(value))) {
    return `${fieldName} must be a valid number`;
  }
  return '';
};

export const positiveNumber = (value, fieldName = 'This field') => {
  const numberError = number(value, fieldName);
  if (numberError) return numberError;
  
  if (value && Number(value) <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return '';
};

export const min = (minValue) => (value, fieldName = 'This field') => {
  if (value && Number(value) < minValue) {
    return `${fieldName} must be at least ${minValue}`;
  }
  return '';
};

export const max = (maxValue) => (value, fieldName = 'This field') => {
  if (value && Number(value) > maxValue) {
    return `${fieldName} must not exceed ${maxValue}`;
  }
  return '';
};

export const range = (minValue, maxValue) => (value, fieldName = 'This field') => {
  if (value) {
    const numValue = Number(value);
    if (numValue < minValue || numValue > maxValue) {
      return `${fieldName} must be between ${minValue} and ${maxValue}`;
    }
  }
  return '';
};

export const pattern = (regex, message) => (value) => {
  if (value && !regex.test(value)) {
    return message;
  }
  return '';
};

export const alphanumeric = (value, fieldName = 'This field') => {
  if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
    return `${fieldName} can only contain letters and numbers`;
  }
  return '';
};

export const alphabetic = (value, fieldName = 'This field') => {
  if (value && !/^[a-zA-Z\s]+$/.test(value)) {
    return `${fieldName} can only contain letters and spaces`;
  }
  return '';
};

export const numeric = (value, fieldName = 'This field') => {
  if (value && !/^\d+$/.test(value)) {
    return `${fieldName} can only contain numbers`;
  }
  return '';
};

// Date validations
export const dateNotInPast = (value, fieldName = 'This field') => {
  if (value) {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return `${fieldName} cannot be in the past`;
    }
  }
  return '';
};

export const dateNotInFuture = (value, fieldName = 'This field') => {
  if (value) {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
      return `${fieldName} cannot be in the future`;
    }
  }
  return '';
};

export const age = (minAge) => (value, fieldName = 'Date of birth') => {
  if (value) {
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < minAge) {
      return `You must be at least ${minAge} years old`;
    }
  }
  return '';
};

// File validations
export const fileSize = (maxSizeInMB) => (file, fieldName = 'File') => {
  if (file && file.size > maxSizeInMB * 1024 * 1024) {
    return `${fieldName} size must not exceed ${maxSizeInMB}MB`;
  }
  return '';
};

export const fileType = (allowedTypes) => (file, fieldName = 'File') => {
  if (file && !allowedTypes.includes(file.type)) {
    const types = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return `${fieldName} must be of type: ${types}`;
  }
  return '';
};

export const imageFile = (file, fieldName = 'Image') => {
  if (file && !file.type.startsWith('image/')) {
    return `${fieldName} must be an image file`;
  }
  return '';
};

// Business-specific validations
export const productPrice = (value) => {
  const numberError = positiveNumber(value, 'Price');
  if (numberError) return numberError;
  
  if (value && Number(value) > 100000) {
    return 'Price cannot exceed ₹1,00,000';
  }
  return '';
};

export const productInventory = (value) => {
  const numberError = number(value, 'Inventory');
  if (numberError) return numberError;
  
  if (value && Number(value) < 0) {
    return 'Inventory cannot be negative';
  }
  
  if (value && Number(value) > 10000) {
    return 'Inventory cannot exceed 10,000 units';
  }
  return '';
};

export const orderQuantity = (value, maxQuantity) => {
  const numberError = positiveNumber(value, 'Quantity');
  if (numberError) return numberError;
  
  if (value && Number(value) > BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_QUANTITY_PER_ITEM) {
    return `Maximum quantity per item is ${BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_QUANTITY_PER_ITEM}`;
  }
  
  if (maxQuantity && value && Number(value) > maxQuantity) {
    return `Only ${maxQuantity} items available in stock`;
  }
  return '';
};

export const orderAmount = (value) => {
  const numberError = positiveNumber(value, 'Order amount');
  if (numberError) return numberError;
  
  if (value && Number(value) < BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT) {
    return `Minimum order amount is ₹${BUSINESS_CONSTANTS.ORDER_LIMITS.MIN_ORDER_AMOUNT}`;
  }
  
  if (value && Number(value) > BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_ORDER_AMOUNT) {
    return `Maximum order amount is ₹${BUSINESS_CONSTANTS.ORDER_LIMITS.MAX_ORDER_AMOUNT}`;
  }
  return '';
};

export const pincode = (value) => {
  if (value && !/^\d{6}$/.test(value)) {
    return 'Please enter a valid 6-digit pincode';
  }
  return '';
};

export const gstNumber = (value) => {
  if (value) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(value)) {
      return 'Please enter a valid GST number';
    }
  }
  return '';
};

export const panNumber = (value) => {
  if (value) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(value)) {
      return 'Please enter a valid PAN number';
    }
  }
  return '';
};

export const aadharNumber = (value) => {
  if (value) {
    const aadharRegex = /^\d{12}$/;
    const cleanedValue = value.replace(/\s/g, '');
    if (!aadharRegex.test(cleanedValue)) {
      return 'Please enter a valid 12-digit Aadhar number';
    }
  }
  return '';
};

// Rating validation
export const rating = (value) => {
  const numberError = number(value, 'Rating');
  if (numberError) return numberError;
  
  const numValue = Number(value);
  if (value && (numValue < 1 || numValue > 5)) {
    return 'Rating must be between 1 and 5';
  }
  return '';
};

// Review validation
export const reviewComment = (value) => {
  if (value && value.length > BUSINESS_CONSTANTS.REVIEW_SYSTEM.MAX_REVIEW_LENGTH) {
    return `Review cannot exceed ${BUSINESS_CONSTANTS.REVIEW_SYSTEM.MAX_REVIEW_LENGTH} characters`;
  }
  return '';
};

// Credit card validation (basic)
export const creditCard = (value) => {
  if (value) {
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      return 'Please enter a valid credit card number';
    }
    
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      return 'Please enter a valid credit card number';
    }
  }
  return '';
};

export const cvv = (value) => {
  if (value && !/^\d{3,4}$/.test(value)) {
    return 'CVV must be 3 or 4 digits';
  }
  return '';
};

export const expiryDate = (value) => {
  if (value) {
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);
    
    if (expMonth < 1 || expMonth > 12) {
      return 'Invalid month';
    }
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Card has expired';
    }
  }
  return '';
};

// Composite validators
export const createRequiredValidator = (fieldName) => (value) => required(value, fieldName);

export const createLengthValidator = (min, max, fieldName) => (value) => {
  const minError = minLength(min)(value, fieldName);
  if (minError) return minError;
  
  const maxError = maxLength(max)(value, fieldName);
  if (maxError) return maxError;
  
  return '';
};

export const createRangeValidator = (min, max, fieldName) => (value) => {
  return range(min, max)(value, fieldName);
};

// Form validation helpers
export const combineValidators = (...validators) => (value, allValues) => {
  for (const validator of validators) {
    const error = validator(value, allValues);
    if (error) return error;
  }
  return '';
};

export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const validators = validationRules[fieldName];
    const value = values[fieldName];
    
    for (const validator of validators) {
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

// Async validation wrapper
export const createAsyncValidator = (asyncValidationFn) => {
  return async (value, allValues) => {
    try {
      const result = await asyncValidationFn(value, allValues);
      return result;
    } catch (error) {
      return error.message || 'Validation failed';
    }
  };
};

// Common validation schemas
export const userRegistrationSchema = {
  displayName: [required, minLength(2), maxLength(50), alphabetic],
  email: [required, email],
  password: [required, password],
  confirmPassword: [required, (value, allValues) => confirmPassword(value, allValues.password)],
  phoneNumber: [phone]
};

export const loginSchema = {
  email: [required, email],
  password: [required]
};

export const addressSchema = {
  street: [required, minLength(5), maxLength(200)],
  city: [required, minLength(2), maxLength(50), alphabetic],
  state: [required, minLength(2), maxLength(50), alphabetic],
  zipCode: [required, pincode],
  country: [required]
};

export const productSchema = {
  name: [required, minLength(3), maxLength(100)],
  description: [required, minLength(10), maxLength(1000)],
  price: [required, productPrice],
  category: [required],
  inventory: [required, productInventory]
};

export const reviewSchema = {
  rating: [required, rating],
  comment: [reviewComment]
};