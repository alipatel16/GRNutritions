// ==================== ProductImages.jsx ====================
import React, { useState } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const MainImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: 500,
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    height: 8
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 4
  }
}));

const Thumbnail = styled('img')(({ theme, selected }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
  opacity: selected ? 1 : 0.6,
  transition: 'all 0.2s',
  '&:hover': {
    opacity: 1
  }
}));

const ProductImages = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const imageList = Array.isArray(images) ? images : [images];
  
  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2, position: 'relative' }}>
        {imageList.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper' }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'background.paper' }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
        <MainImage src={imageList[selectedIndex] || '/images/placeholder-product.png'} alt="Product" />
      </Paper>

      {imageList.length > 1 && (
        <ThumbnailContainer>
          {imageList.map((img, index) => (
            <Thumbnail
              key={index}
              src={img}
              selected={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </ThumbnailContainer>
      )}
    </Box>
  );
};

export default ProductImages;