// src/components/product/ProductImageGallery/ProductImageGallery.jsx
import React, { useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Base64Image from '../../common/Base64Image/Base64Image';

const MainImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '100%', // 1:1 aspect ratio
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2]
}));

const MainImageWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
}));

const ThumbnailGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(0.5)
  }
}));

const ThumbnailContainer = styled(Box)(({ theme, selected }) => ({
  position: 'relative',
  paddingTop: '100%',
  cursor: 'pointer',
  border: selected 
    ? `3px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.grey[50],
  boxShadow: selected ? theme.shadows[3] : theme.shadows[1],
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4]
  }
}));

const ThumbnailWrapper = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: theme.shadows[6]
  },
  '&:disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.5
  },
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5)
  }
}));

const ZoomButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: theme.shadows[4]
  },
  zIndex: 2
}));

const ImageBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  color: 'white',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 600,
  zIndex: 2,
  backdropFilter: 'blur(4px)'
}));

const PlaceholderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: '100%',
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1]
}));

const PlaceholderContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500]
}));

const SwipeIndicators = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(2)
}));

const Indicator = styled(Box)(({ theme, active }) => ({
  width: active ? 24 : 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[400]
  }
}));

const ProductImageGallery = ({ images = [], productName = 'Product' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Normalize images to array format
  const normalizedImages = React.useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }
    
    // If images is already an array, use it
    if (Array.isArray(images)) {
      return images.filter(img => img); // Filter out null/undefined
    }
    
    // If images is a single string, wrap it in an array
    if (typeof images === 'string') {
      return [images];
    }
    
    return [];
  }, [images]);

  // Show placeholder if no images
  if (normalizedImages.length === 0) {
    return (
      <PlaceholderContainer>
        <PlaceholderContent>
          <Box
            component="svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="currentColor"
            sx={{ mb: 2, opacity: 0.3 }}
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </Box>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            No Images Available
          </Box>
        </PlaceholderContent>
      </PlaceholderContainer>
    );
  }

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
    setIsZoomed(false);
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === normalizedImages.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleImageClick = () => {
    if (!isMobile) {
      handleZoomToggle();
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };

  return (
    <Box>
      {/* Main Image Display */}
      <MainImageContainer>
        <MainImageWrapper>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              overflow: isZoomed ? 'auto' : 'hidden',
              '& > div': {
                transform: isZoomed ? 'scale(2)' : 'scale(1)',
                transition: 'transform 0.3s ease',
                transformOrigin: 'center center'
              }
            }}
            onClick={handleImageClick}
          >
            <Base64Image
              key={`image-${selectedImageIndex}`}
              src={normalizedImages[selectedImageIndex]}
              alt={`${productName} - Image ${selectedImageIndex + 1}`}
              fallback="/images/placeholder-product.png"
            />
          </Box>
        </MainImageWrapper>

        {/* Zoom Button */}
        {!isMobile && (
          <ZoomButton
            onClick={handleZoomToggle}
            size="small"
            title={isZoomed ? "Zoom Out" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut /> : <ZoomIn />}
          </ZoomButton>
        )}

        {/* Image Counter Badge */}
        {normalizedImages.length > 1 && (
          <ImageBadge>
            {selectedImageIndex + 1} / {normalizedImages.length}
          </ImageBadge>
        )}

        {/* Navigation Arrows - Show only if multiple images */}
        {normalizedImages.length > 1 && (
          <>
            <NavigationButton
              onClick={handlePrevious}
              sx={{ left: 8 }}
              size={isMobile ? "small" : "medium"}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </NavigationButton>
            <NavigationButton
              onClick={handleNext}
              sx={{ right: 8 }}
              size={isMobile ? "small" : "medium"}
              aria-label="Next image"
            >
              <ChevronRight />
            </NavigationButton>
          </>
        )}
      </MainImageContainer>

      {/* Thumbnail Grid - Show only if multiple images */}
      {normalizedImages.length > 1 && (
        <ThumbnailGrid>
          {normalizedImages.map((image, index) => (
            <ThumbnailContainer
              key={index}
              selected={selectedImageIndex === index}
              onClick={() => handleThumbnailClick(index)}
              role="button"
              tabIndex={0}
              aria-label={`View image ${index + 1}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleThumbnailClick(index);
                }
              }}
            >
              <ThumbnailWrapper>
                <Base64Image
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fallback="/images/placeholder-product.png"
                />
              </ThumbnailWrapper>
            </ThumbnailContainer>
          ))}
        </ThumbnailGrid>
      )}

      {/* Mobile swipe indicators */}
      {isMobile && normalizedImages.length > 1 && (
        <SwipeIndicators>
          {normalizedImages.map((_, index) => (
            <Indicator
              key={index}
              active={index === selectedImageIndex}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </SwipeIndicators>
      )}
    </Box>
  );
};

export default ProductImageGallery;