import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Security,
  LocalShipping,
  SupportAgent,
  Verified
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Constants
import { ROUTES, NAVIGATION } from '../../../utils/constants/routes';
import { BUSINESS_CONSTANTS } from '../../../utils/constants/orderStatus';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  marginTop: 'auto'
}));

const FooterContent = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4)
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4)
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.common.white
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[300],
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  fontSize: '0.875rem',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline'
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[300],
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  }
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[300],
  fontSize: '0.875rem'
}));

const TrustBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[300],
  fontSize: '0.875rem',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

const BottomBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3)
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: YouTube, url: 'https://youtube.com', label: 'YouTube' },
    { icon: LinkedIn, url: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const trustFeatures = [
    { icon: Security, text: 'Secure Payments' },
    { icon: LocalShipping, text: 'Free Shipping Over ₹999' },
    { icon: SupportAgent, text: '24/7 Customer Support' },
    { icon: Verified, text: 'Authentic Products' }
  ];

  return (
    <FooterContainer component="footer">
      <FooterContent maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <FooterTitle variant="h6">
                🍃 NutriShop
              </FooterTitle>
              <Typography variant="body2" color="grey.300" paragraph>
                Your trusted partner for premium nutrition supplements. 
                Committed to your health and fitness journey.
              </Typography>
              
              {/* Social Media */}
              <Box>
                <FooterTitle variant="subtitle2">
                  Follow Us
                </FooterTitle>
                <Box>
                  {socialLinks.map((social, index) => (
                    <SocialButton
                      key={index}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      size="small"
                    >
                      <social.icon fontSize="small" />
                    </SocialButton>
                  ))}
                </Box>
              </Box>
            </FooterSection>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <FooterTitle variant="h6">
                Quick Links
              </FooterTitle>
              <FooterLink component={RouterLink} to={ROUTES.HOME}>
                Home
              </FooterLink>
              <FooterLink component={RouterLink} to={ROUTES.PRODUCTS}>
                All Products
              </FooterLink>
              <FooterLink component={RouterLink} to="/category/protein">
                Protein
              </FooterLink>
              <FooterLink component={RouterLink} to="/category/vitamins-minerals">
                Vitamins
              </FooterLink>
              <FooterLink component={RouterLink} to="/category/mass-gainer">
                Mass Gainers
              </FooterLink>
              <FooterLink component={RouterLink} to="/about">
                About Us
              </FooterLink>
            </FooterSection>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <FooterTitle variant="h6">
                Customer Service
              </FooterTitle>
              <FooterLink component={RouterLink} to="/contact">
                Contact Us
              </FooterLink>
              <FooterLink component={RouterLink} to="/faq">
                FAQ
              </FooterLink>
              <FooterLink component={RouterLink} to="/shipping">
                Shipping Info
              </FooterLink>
              <FooterLink component={RouterLink} to="/returns">
                Returns & Refunds
              </FooterLink>
              <FooterLink component={RouterLink} to="/track-order">
                Track Your Order
              </FooterLink>
              <FooterLink component={RouterLink} to="/size-guide">
                Size Guide
              </FooterLink>
            </FooterSection>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <FooterTitle variant="h6">
                Legal
              </FooterTitle>
              <FooterLink component={RouterLink} to={ROUTES.TERMS}>
                Terms of Service
              </FooterLink>
              <FooterLink component={RouterLink} to={ROUTES.PRIVACY}>
                Privacy Policy
              </FooterLink>
              <FooterLink component={RouterLink} to="/cookies">
                Cookie Policy
              </FooterLink>
              <FooterLink component={RouterLink} to="/disclaimer">
                Disclaimer
              </FooterLink>
              <FooterLink component={RouterLink} to="/accessibility">
                Accessibility
              </FooterLink>
            </FooterSection>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <FooterTitle variant="h6">
                Contact Info
              </FooterTitle>
              
              <ContactItem>
                <Email sx={{ mr: 1, fontSize: 18 }} />
                {BUSINESS_CONSTANTS.CONTACT_INFO.SUPPORT_EMAIL}
              </ContactItem>
              
              <ContactItem>
                <Phone sx={{ mr: 1, fontSize: 18 }} />
                {BUSINESS_CONSTANTS.CONTACT_INFO.SUPPORT_PHONE}
              </ContactItem>
              
              <ContactItem>
                <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                <Box>
                  {BUSINESS_CONSTANTS.CONTACT_INFO.ADDRESS.street}<br />
                  {BUSINESS_CONSTANTS.CONTACT_INFO.ADDRESS.city}, {BUSINESS_CONSTANTS.CONTACT_INFO.ADDRESS.state}<br />
                  {BUSINESS_CONSTANTS.CONTACT_INFO.ADDRESS.zipCode}
                </Box>
              </ContactItem>

              <Typography variant="body2" color="grey.400" sx={{ mt: 2, fontSize: '0.75rem' }}>
                Business Hours:<br />
                {BUSINESS_CONSTANTS.CONTACT_INFO.BUSINESS_HOURS}
              </Typography>
            </FooterSection>
          </Grid>
        </Grid>

        {/* Trust Badges */}
        <Divider sx={{ my: 4, borderColor: 'grey.700' }} />
        
        <Grid container spacing={2} justifyContent={isMobile ? 'center' : 'space-between'} alignItems="center">
          {trustFeatures.map((feature, index) => (
            <Grid item key={index}>
              <TrustBadge>
                <feature.icon />
                <Typography variant="body2">
                  {feature.text}
                </Typography>
              </TrustBadge>
            </Grid>
          ))}
        </Grid>
      </FooterContent>

      {/* Bottom Bar */}
      <BottomBar>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="grey.400" align={isMobile ? 'center' : 'left'}>
                © {currentYear} NutriShop. All rights reserved. Built with ❤️ for your health.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack 
                direction={isMobile ? 'column' : 'row'} 
                spacing={2} 
                justifyContent={isMobile ? 'center' : 'flex-end'}
                alignItems="center"
              >
                <Typography variant="caption" color="grey.500">
                  Powered by React & Firebase
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography variant="caption" color="grey.500">
                    Payment Methods:
                  </Typography>
                  <Typography variant="caption" color="grey.400">
                    Cards, UPI, Wallets
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;