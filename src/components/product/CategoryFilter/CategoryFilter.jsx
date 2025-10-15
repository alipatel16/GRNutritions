// ==================== CategoryFilter.jsx ====================
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { ROUTE_BUILDERS } from '../../../utils/constants/routes';

const CategoryCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `2px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: selected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main
  }
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  fontSize: '2rem',
  marginBottom: theme.spacing(1)
}));

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, variant = 'grid' }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category.id);
    } else {
      navigate(ROUTE_BUILDERS.category(category.slug));
    }
  };

  if (variant === 'chips') {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All Categories"
          onClick={() => handleCategoryClick({ id: '', slug: '' })}
          color={!selectedCategory ? 'primary' : 'default'}
          variant={!selectedCategory ? 'filled' : 'outlined'}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onClick={() => handleCategoryClick(category)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {categories.map((category) => (
        <Grid item xs={6} sm={4} md={3} key={category.id}>
          <CategoryCard
            selected={selectedCategory === category.id}
            onClick={() => handleCategoryClick(category)}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CategoryIcon>{category.icon || '📦'}</CategoryIcon>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.description}
              </Typography>
            </CardContent>
          </CategoryCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryFilter;