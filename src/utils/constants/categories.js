// Product categories for nutrition shop
export const PRODUCT_CATEGORIES = {
  PROTEIN: {
    id: 'protein',
    name: 'Protein',
    slug: 'protein',
    description: 'High-quality protein supplements for muscle building and recovery',
    icon: '💪',
    color: '#2E7D32',
    subcategories: [
      {
        id: 'whey-protein',
        name: 'Whey Protein',
        description: 'Fast-absorbing whey protein for post-workout recovery'
      },
      {
        id: 'casein-protein',
        name: 'Casein Protein',
        description: 'Slow-release protein ideal for nighttime recovery'
      },
      {
        id: 'plant-protein',
        name: 'Plant Protein',
        description: 'Vegan-friendly protein from plant sources'
      },
      {
        id: 'protein-blends',
        name: 'Protein Blends',
        description: 'Mixed protein formulations for sustained release'
      }
    ]
  },
  
  MASS_GAINER: {
    id: 'mass-gainer',
    name: 'Mass Gainer',
    slug: 'mass-gainer',
    description: 'High-calorie supplements for weight and muscle gain',
    icon: '📈',
    color: '#FF6F00',
    subcategories: [
      {
        id: 'weight-gainer',
        name: 'Weight Gainer',
        description: 'High-calorie formulas for healthy weight gain'
      },
      {
        id: 'lean-mass',
        name: 'Lean Mass Gainer',
        description: 'Clean calories for lean muscle development'
      }
    ]
  },
  
  VITAMINS_MINERALS: {
    id: 'vitamins-minerals',
    name: 'Vitamins & Minerals',
    slug: 'vitamins-minerals',
    description: 'Essential nutrients for optimal health and wellness',
    icon: '🌟',
    color: '#2196F3',
    subcategories: [
      {
        id: 'multivitamins',
        name: 'Multivitamins',
        description: 'Complete daily vitamin and mineral support'
      },
      {
        id: 'vitamin-d',
        name: 'Vitamin D',
        description: 'Bone health and immune system support'
      },
      {
        id: 'vitamin-c',
        name: 'Vitamin C',
        description: 'Antioxidant and immune system booster'
      },
      {
        id: 'b-complex',
        name: 'B-Complex',
        description: 'Energy metabolism and nervous system support'
      },
      {
        id: 'magnesium',
        name: 'Magnesium',
        description: 'Muscle function and bone health support'
      },
      {
        id: 'calcium',
        name: 'Calcium',
        description: 'Bone and teeth health support'
      },
      {
        id: 'iron',
        name: 'Iron',
        description: 'Blood health and oxygen transport'
      },
      {
        id: 'zinc',
        name: 'Zinc',
        description: 'Immune system and wound healing support'
      }
    ]
  },
  
  DETOX_CLEANSE: {
    id: 'detox-cleanse',
    name: 'Detox & Cleanse',
    slug: 'detox-cleanse',
    description: 'Natural detoxification and cleansing supplements',
    icon: '🌿',
    color: '#4CAF50',
    subcategories: [
      {
        id: 'liver-detox',
        name: 'Liver Detox',
        description: 'Support liver health and natural detoxification'
      },
      {
        id: 'lung-detox',
        name: 'Lung Detox',
        description: 'Respiratory system cleansing and support'
      },
      {
        id: 'kidney-detox',
        name: 'Kidney Detox',
        description: 'Kidney function and urinary system support'
      },
      {
        id: 'colon-cleanse',
        name: 'Colon Cleanse',
        description: 'Digestive system cleansing and gut health'
      },
      {
        id: 'full-body-detox',
        name: 'Full Body Detox',
        description: 'Complete system detoxification programs'
      }
    ]
  },
  
  PRE_POST_WORKOUT: {
    id: 'pre-post-workout',
    name: 'Pre & Post Workout',
    slug: 'pre-post-workout',
    description: 'Performance and recovery supplements for training',
    icon: '⚡',
    color: '#FF5722',
    subcategories: [
      {
        id: 'pre-workout',
        name: 'Pre-Workout',
        description: 'Energy and focus boosters for training'
      },
      {
        id: 'post-workout',
        name: 'Post-Workout',
        description: 'Recovery and muscle repair supplements'
      },
      {
        id: 'bcaa',
        name: 'BCAA',
        description: 'Branched-chain amino acids for muscle support'
      },
      {
        id: 'creatine',
        name: 'Creatine',
        description: 'Strength and power enhancement'
      },
      {
        id: 'glutamine',
        name: 'Glutamine',
        description: 'Muscle recovery and immune support'
      }
    ]
  },
  
  OMEGA_FISH_OIL: {
    id: 'omega-fish-oil',
    name: 'Omega & Fish Oil',
    slug: 'omega-fish-oil',
    description: 'Essential fatty acids for heart and brain health',
    icon: '🐟',
    color: '#00BCD4',
    subcategories: [
      {
        id: 'fish-oil',
        name: 'Fish Oil',
        description: 'High-quality omega-3 fatty acids'
      },
      {
        id: 'krill-oil',
        name: 'Krill Oil',
        description: 'Premium omega-3 with superior absorption'
      },
      {
        id: 'flaxseed-oil',
        name: 'Flaxseed Oil',
        description: 'Plant-based omega-3 fatty acids'
      }
    ]
  },
  
  DIGESTIVE_HEALTH: {
    id: 'digestive-health',
    name: 'Digestive Health',
    slug: 'digestive-health',
    description: 'Gut health and digestive system support',
    icon: '🦠',
    color: '#8BC34A',
    subcategories: [
      {
        id: 'probiotics',
        name: 'Probiotics',
        description: 'Beneficial bacteria for gut health'
      },
      {
        id: 'digestive-enzymes',
        name: 'Digestive Enzymes',
        description: 'Support for food breakdown and absorption'
      },
      {
        id: 'fiber-supplements',
        name: 'Fiber Supplements',
        description: 'Dietary fiber for digestive health'
      },
      {
        id: 'gut-health',
        name: 'Gut Health',
        description: 'Complete digestive system support'
      }
    ]
  },
  
  IMMUNITY: {
    id: 'immunity',
    name: 'Immunity',
    slug: 'immunity',
    description: 'Immune system strengthening supplements',
    icon: '🛡️',
    color: '#9C27B0',
    subcategories: [
      {
        id: 'immune-boosters',
        name: 'Immune Boosters',
        description: 'Natural immune system enhancers'
      },
      {
        id: 'elderberry',
        name: 'Elderberry',
        description: 'Traditional immune support berry extract'
      },
      {
        id: 'echinacea',
        name: 'Echinacea',
        description: 'Herbal immune system support'
      },
      {
        id: 'antioxidants',
        name: 'Antioxidants',
        description: 'Free radical fighting compounds'
      }
    ]
  },
  
  SPECIALTY: {
    id: 'specialty',
    name: 'Specialty',
    slug: 'specialty',
    description: 'Specialized nutrition and health supplements',
    icon: '⭐',
    color: '#FF9800',
    subcategories: [
      {
        id: 'collagen',
        name: 'Collagen',
        description: 'Skin, hair, and joint health support'
      },
      {
        id: 'weight-management',
        name: 'Weight Management',
        description: 'Healthy weight loss and management'
      },
      {
        id: 'sleep-support',
        name: 'Sleep Support',
        description: 'Natural sleep aid supplements'
      },
      {
        id: 'stress-management',
        name: 'Stress Management',
        description: 'Adaptogens and stress relief supplements'
      },
      {
        id: 'brain-health',
        name: 'Brain Health',
        description: 'Cognitive function and memory support'
      },
      {
        id: 'joint-health',
        name: 'Joint Health',
        description: 'Joint mobility and cartilage support'
      }
    ]
  }
};

// Helper functions for categories
export const getAllCategories = () => {
  return Object.values(PRODUCT_CATEGORIES);
};

export const getCategoryById = (id) => {
  return Object.values(PRODUCT_CATEGORIES).find(category => category.id === id);
};

export const getCategoryBySlug = (slug) => {
  return Object.values(PRODUCT_CATEGORIES).find(category => category.slug === slug);
};

export const getSubcategoriesByCategory = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.subcategories : [];
};

export const getAllSubcategories = () => {
  return Object.values(PRODUCT_CATEGORIES).reduce((acc, category) => {
    return [...acc, ...category.subcategories];
  }, []);
};

export const searchCategories = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return Object.values(PRODUCT_CATEGORIES).filter(category =>
    category.name.toLowerCase().includes(term) ||
    category.description.toLowerCase().includes(term) ||
    category.subcategories.some(sub =>
      sub.name.toLowerCase().includes(term) ||
      sub.description.toLowerCase().includes(term)
    )
  );
};

// Category colors for UI consistency
export const CATEGORY_COLORS = Object.values(PRODUCT_CATEGORIES).reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});

// Default category for new products
export const DEFAULT_CATEGORY = PRODUCT_CATEGORIES.PROTEIN.id;