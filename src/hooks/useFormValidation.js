import { useState, useCallback } from 'react';
import { validateForm } from '../utils/helpers/validators';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation schema with field validators
 * @returns {Object} Form state and handlers
 */
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  /**
   * Handle input blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate single field on blur
    if (validationSchema[name]) {
      const validators = validationSchema[name];
      for (const validator of validators) {
        const error = validator(values[name], values);
        if (error) {
          setErrors(prev => ({
            ...prev,
            [name]: error
          }));
          break;
        } else {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      }
    }
  }, [values, validationSchema]);

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  }, [errors]);

  /**
   * Set a specific field error
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  /**
   * Set a specific field as touched
   */
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));
  }, []);

  /**
   * Validate all fields
   */
  const validate = useCallback(() => {
    const validation = validateForm(values, validationSchema);
    setErrors(validation.errors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    return validation.isValid;
  }, [values, validationSchema]);

  /**
   * Validate a single field
   */
  const validateField = useCallback((fieldName) => {
    if (!validationSchema[fieldName]) return true;

    const validators = validationSchema[fieldName];
    for (const validator of validators) {
      const error = validator(values[fieldName], values);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
        return false;
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    return true;
  }, [values, validationSchema]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Reset specific fields
   */
  const resetFields = useCallback((fieldNames = []) => {
    setValues(prev => {
      const newValues = { ...prev };
      fieldNames.forEach(fieldName => {
        newValues[fieldName] = initialValues[fieldName];
      });
      return newValues;
    });

    setErrors(prev => {
      const newErrors = { ...prev };
      fieldNames.forEach(fieldName => {
        delete newErrors[fieldName];
      });
      return newErrors;
    });

    setTouched(prev => {
      const newTouched = { ...prev };
      fieldNames.forEach(fieldName => {
        delete newTouched[fieldName];
      });
      return newTouched;
    });
  }, [initialValues]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);

      const isValid = validate();
      
      if (isValid && onSubmit) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    };
  }, [values, validate]);

  /**
   * Check if field has error
   */
  const hasError = useCallback((fieldName) => {
    return touched[fieldName] && !!errors[fieldName];
  }, [touched, errors]);

  /**
   * Get error message for field
   */
  const getErrorMessage = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : '';
  }, [touched, errors]);

  /**
   * Check if form is valid
   */
  const isValid = useCallback(() => {
    return Object.keys(errors).length === 0 && 
           Object.keys(touched).length > 0;
  }, [errors, touched]);

  /**
   * Check if form has been modified
   */
  const isDirty = useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,

    // Event handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Field-specific methods
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    hasError,
    getErrorMessage,

    // Form-level methods
    validate,
    reset,
    resetFields,
    isValid,
    isDirty,

    // Utility methods
    setValues,
    setErrors,
    setTouched,
    setIsSubmitting
  };
};

export default useFormValidation;