// ==================== useResponsive.js ====================
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  // Specific breakpoint checks
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  // Utility functions
  const isMobileOrTablet = isMobile || isTablet;
  const isTabletOrDesktop = isTablet || isDesktop;

  return {
    // General categories
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isXLDesktop,

    // Specific breakpoints
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,

    // Utility checks
    isMobileOrTablet,
    isTabletOrDesktop,

    // Get current breakpoint name
    getCurrentBreakpoint: () => {
      if (isXs) return 'xs';
      if (isSm) return 'sm';
      if (isMd) return 'md';
      if (isLg) return 'lg';
      if (isXl) return 'xl';
      return 'xs';
    },

    // Check if screen is at least a certain size
    isAtLeast: (breakpoint) => {
      return useMediaQuery(theme.breakpoints.up(breakpoint));
    },

    // Check if screen is at most a certain size
    isAtMost: (breakpoint) => {
      return useMediaQuery(theme.breakpoints.down(breakpoint));
    }
  };
};