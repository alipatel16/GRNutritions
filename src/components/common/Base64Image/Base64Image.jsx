// src/components/common/Base64Image/Base64Image.jsx
import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'opacity 0.3s ease'
}));

/**
 * Component to display base64 encoded images with loading state
 * @param {string} src - Base64 encoded image or regular URL
 * @param {string} alt - Alt text for image
 * @param {Object} sx - MUI sx prop for styling
 * @param {string} fallback - Fallback image URL
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 */
const Base64Image = ({ 
  src, 
  alt = 'Product Image', 
  sx = {},
  fallback = '/images/placeholder-product.png',
  onLoad,
  onError,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleImageLoad = (e) => {
    setLoading(false);
    setError(false);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    setLoading(false);
    setError(true);
    
    // Set fallback image
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
    
    if (onError) onError(e);
  };

  return (
    <ImageContainer sx={sx}>
      {loading && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <StyledImage
        src={imageSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ 
          opacity: loading ? 0 : 1,
          display: error && imageSrc === fallback ? 'none' : 'block'
        }}
        {...props}
      />
      {error && imageSrc === fallback && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
            color: 'grey.500'
          }}
        >
          No Image
        </Box>
      )}
    </ImageContainer>
  );
};

export default Base64Image;