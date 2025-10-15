import * as validators from '../helpers/validators';

// Product creation/edit validation schema
export const productSchema = {
  name: {
    validators: [
      validators.required,
      validators.minLength(3),
      validators.maxLength(100)
    ],
    fieldName: 'Product Name'
  },
  description: {
    validators: [
      validators.required,
      validators.minLength(10),
      validators.maxLength(2000)
    ],
    fieldName: 'Description'
  },
  shortDescription: {
    validators: [
      validators.maxLength(200)
    ],
    fieldName: 'Short Description'
  },
  price: {
    validators: [
      validators.required,
      validators.productPrice
    ],
    fieldName: 'Price'
  },
  compareAtPrice: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Compare At Price'
  },
  category: {
    validators: [
      validators.required
    ],
    fieldName: 'Category'
  },
  subcategory: {
    validators: [],
    fieldName: 'Subcategory'
  },
  brand: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ],
    fieldName: 'Brand'
  },
  sku: {
    validators: [
      validators.required,
      validators.alphanumeric
    ],
    fieldName: 'SKU'
  },
  barcode: {
    validators: [
      validators.alphanumeric
    ],
    fieldName: 'Barcode'
  },
  inventory: {
    validators: [
      validators.required,
      validators.productInventory
    ],
    fieldName: 'Inventory'
  },
  weight: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Weight'
  },
  dimensions: {
    validators: [],
    fieldName: 'Dimensions'
  },
  tags: {
    validators: [],
    fieldName: 'Tags'
  },
  featured: {
    validators: [],
    fieldName: 'Featured'
  },
  active: {
    validators: [],
    fieldName: 'Active'
  }
};

// Product filter validation schema
export const productFilterSchema = {
  category: {
    validators: [],
    fieldName: 'Category'
  },
  minPrice: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Minimum Price'
  },
  maxPrice: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Maximum Price'
  },
  brand: {
    validators: [],
    fieldName: 'Brand'
  },
  rating: {
    validators: [
      validators.rating
    ],
    fieldName: 'Minimum Rating'
  },
  inStock: {
    validators: [],
    fieldName: 'In Stock'
  },
  sortBy: {
    validators: [],
    fieldName: 'Sort By'
  }
};

// Product review validation schema
export const productReviewSchema = {
  rating: {
    validators: [
      validators.required,
      validators.rating
    ],
    fieldName: 'Rating'
  },
  title: {
    validators: [
      validators.required,
      validators.minLength(5),
      validators.maxLength(100)
    ],
    fieldName: 'Review Title'
  },
  comment: {
    validators: [
      validators.required,
      validators.reviewComment
    ],
    fieldName: 'Review Comment'
  },
  images: {
    validators: [],
    fieldName: 'Review Images'
  }
};

// Inventory update validation schema
export const inventoryUpdateSchema = {
  productId: {
    validators: [
      validators.required
    ],
    fieldName: 'Product ID'
  },
  quantity: {
    validators: [
      validators.required,
      validators.productInventory
    ],
    fieldName: 'Quantity'
  },
  reason: {
    validators: [
      validators.required
    ],
    fieldName: 'Update Reason'
  },
  notes: {
    validators: [
      validators.maxLength(500)
    ],
    fieldName: 'Notes'
  }
};

// Category validation schema
export const categorySchema = {
  name: {
    validators: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ],
    fieldName: 'Category Name'
  },
  slug: {
    validators: [
      validators.required,
      validators.alphanumeric
    ],
    fieldName: 'Slug'
  },
  description: {
    validators: [
      validators.maxLength(200)
    ],
    fieldName: 'Description'
  },
  parentCategory: {
    validators: [],
    fieldName: 'Parent Category'
  },
  displayOrder: {
    validators: [
      validators.positiveNumber
    ],
    fieldName: 'Display Order'
  },
  active: {
    validators: [],
    fieldName: 'Active'
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
  productSchema,
  productFilterSchema,
  productReviewSchema,
  inventoryUpdateSchema,
  categorySchema,
  validateWithSchema
};