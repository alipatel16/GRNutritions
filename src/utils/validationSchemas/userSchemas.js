import * as validators from '../helpers/validators';

// User registration validation schema
export const userRegistrationSchema = {
  displayName: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50),
      validators.alphabetic
    ],
    fieldName: 'Full Name'
  },
  email: {
    validators: [
      validators.required,
      validators.email
    ],
    fieldName: 'Email'
  },
  password: {
    validators: [
      validators.required,
      validators.password
    ],
    fieldName: 'Password'
  },
  confirmPassword: {
    validators: [
      validators.required,
      (value, allValues) => validators.confirmPassword(value, allValues.password)
    ],
    fieldName: 'Confirm Password'
  },
  phoneNumber: {
    validators: [
      validators.phone
    ],
    fieldName: 'Phone Number'
  }
};

// User login validation schema
export const userLoginSchema = {
  email: {
    validators: [
      validators.required,
      validators.email
    ],
    fieldName: 'Email'
  },
  password: {
    validators: [
      validators.required
    ],
    fieldName: 'Password'
  }
};

// User profile update validation schema
export const userProfileSchema = {
  displayName: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ],
    fieldName: 'Full Name'
  },
  phoneNumber: {
    validators: [
      validators.phone
    ],
    fieldName: 'Phone Number'
  },
  bio: {
    validators: [
      validators.maxLength(200)
    ],
    fieldName: 'Bio'
  }
};

// Password change validation schema
export const passwordChangeSchema = {
  currentPassword: {
    validators: [
      validators.required
    ],
    fieldName: 'Current Password'
  },
  newPassword: {
    validators: [
      validators.required,
      validators.password
    ],
    fieldName: 'New Password'
  },
  confirmNewPassword: {
    validators: [
      validators.required,
      (value, allValues) => validators.confirmPassword(value, allValues.newPassword)
    ],
    fieldName: 'Confirm New Password'
  }
};

// Address validation schema
export const addressSchema = {
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
      validators.maxLength(50),
      validators.alphabetic
    ],
    fieldName: 'City'
  },
  state: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
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
  },
  addressType: {
    validators: [
      validators.required
    ],
    fieldName: 'Address Type'
  },
  isDefault: {
    validators: [],
    fieldName: 'Default Address'
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
  userRegistrationSchema,
  userLoginSchema,
  userProfileSchema,
  passwordChangeSchema,
  addressSchema,
  validateWithSchema
};