import { createTheme } from '@mui/material/styles';

// Custom color palette for nutrition/health theme
const colors = {
  primary: {
    main: '#2E7D32', // Green for health/nutrition
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#FF6F00', // Orange for energy/vitality
    light: '#FF8F00',
    dark: '#E65100',
    contrastText: '#ffffff'
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C'
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00'
  },
  error: {
    main: '#F44336',
    light: '#EF5350',
    dark: '#D32F2F'
  },
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2'
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    dark: '#1A1A1A',
    light: '#F5F5F5'
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD'
  },
  divider: '#E0E0E0',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
};

// Breakpoints for mobile-first responsive design
const breakpoints = {
  values: {
    xs: 0,      // Mobile portrait
    sm: 600,    // Mobile landscape
    md: 900,    // Tablet
    lg: 1200,   // Desktop
    xl: 1536    // Large desktop
  }
};

// Typography configuration
const typography = {
  fontFamily: [
    'Roboto',
    'Arial',
    'sans-serif'
  ].join(','),
  
  // Mobile-first font sizes
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (min-width:600px)': {
      fontSize: '2.5rem'
    },
    '@media (min-width:900px)': {
      fontSize: '3rem'
    }
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (min-width:600px)': {
      fontSize: '2rem'
    },
    '@media (min-width:900px)': {
      fontSize: '2.25rem'
    }
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (min-width:600px)': {
      fontSize: '1.75rem'
    }
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.4,
    '@media (min-width:600px)': {
      fontSize: '1.5rem'
    }
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.4,
    '@media (min-width:600px)': {
      fontSize: '1.25rem'
    }
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (min-width:600px)': {
      fontSize: '1.125rem'
    }
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 400
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.4,
    fontWeight: 400
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    lineHeight: 1.5
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.4
  }
};

// Custom spacing function
const spacing = (factor) => `${0.25 * factor}rem`;

// Shadow definitions
const shadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
];

// Create the theme
const theme = createTheme({
  palette: colors,
  breakpoints,
  typography,
  spacing,
  shadows,
  
  // Component overrides for mobile optimization
  components: {
    // Button optimizations
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44, // Touch-friendly minimum height
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 24px',
          '@media (max-width:600px)': {
            padding: '14px 20px', // Larger touch targets on mobile
            fontSize: '1rem'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    
    // Card optimizations
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    
    // AppBar optimization for mobile
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          color: colors.text.primary,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '@media (max-width:600px)': {
            paddingLeft: 8,
            paddingRight: 8
          }
        }
      }
    },
    
    // Chip styling
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          height: 32,
          '&.MuiChip-clickable': {
            '&:hover': {
              backgroundColor: colors.primary.light + '20'
            }
          }
        }
      }
    },
    
    // Dialog optimizations for mobile
    MuiDialog: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            margin: 16,
            maxHeight: 'calc(100% - 32px)'
          }
        },
        paper: {
          borderRadius: 12,
          '@media (max-width:600px)': {
            margin: 0,
            width: '100%',
            maxWidth: 'none',
            maxHeight: 'none',
            height: '100%',
            borderRadius: 0
          }
        }
      }
    },
    
    // Drawer optimizations
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            width: '85%',
            maxWidth: 320
          }
        }
      }
    },
    
    // Fab positioning for mobile
    MuiFab: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            bottom: 80, // Account for mobile navigation
            right: 16
          }
        }
      }
    },
    
    // Input field optimizations
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '@media (max-width:600px)': {
              fontSize: '16px' // Prevent zoom on iOS
            }
          }
        }
      }
    },
    
    // Table responsiveness
    MuiTable: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            '& .MuiTableCell-root': {
              padding: '8px 4px',
              fontSize: '0.875rem'
            }
          }
        }
      }
    }
  }
});

export default theme;

// Custom theme variants
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3'
    }
  }
});

// Theme helper functions
export const getSpacing = (factor) => theme.spacing(factor);
export const getBreakpoint = (size) => theme.breakpoints.values[size];

// Custom theme hooks can be added here
export const useThemeMode = () => {
  // This can be enhanced with local storage for theme persistence
  return 'light';
};