import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Radio,
  RadioGroup,
  Divider,
  Button,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Utils
import { formatPrice } from '../../../utils/helpers/formatters';

// Styled components
const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(2)
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '&:last-child': {
    marginBottom: 0
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.primary
}));

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  '& .MuiSlider-thumb': {
    width: 20,
    height: 20,
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}16`
    }
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: theme.palette.primary.main
  }
}));

const ProductFilters = ({
  filters = {},
  onFilterChange = () => {},
  categories = [],
  brands = [],
  showAccordion = false,
  compact = false
}) => {
  const theme = useTheme();

  // Handle filter updates
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    updateFilter('minPrice', newValue[0]);
    updateFilter('maxPrice', newValue[1]);
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 10000,
      inStock: false,
      rating: 0,
      sortBy: 'newest'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.category || 
           filters.brand || 
           filters.minPrice > 0 || 
           filters.maxPrice < 10000 || 
           filters.inStock || 
           filters.rating > 0;
  };

  // Category filter section
  const renderCategoryFilter = () => (
    <FilterSection>
      <SectionTitle variant="subtitle2">
        Categories
      </SectionTitle>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <FormControlLabel
            value=""
            control={<Radio size="small" />}
            label="All Categories"
          />
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              value={category.id}
              control={<Radio size="small" />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {category.icon}
                  </Typography>
                  {category.name}
                </Box>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    </FilterSection>
  );

  // Price filter section
  const renderPriceFilter = () => (
    <FilterSection>
      <SectionTitle variant="subtitle2">
        Price Range
      </SectionTitle>
      <Box sx={{ px: 1 }}>
        <PriceSlider
          value={[filters.minPrice || 0, filters.maxPrice || 10000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatPrice(value)}
          min={0}
          max={10000}
          step={100}
          marks={[
            { value: 0, label: '₹0' },
            { value: 2500, label: '₹2.5K' },
            { value: 5000, label: '₹5K' },
            { value: 10000, label: '₹10K+' }
          ]}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatPrice(filters.minPrice || 0)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatPrice(filters.maxPrice || 10000)}
          </Typography>
        </Box>
      </Box>
    </FilterSection>
  );

  // Brand filter section
  const renderBrandFilter = () => {
    if (!brands || brands.length === 0) return null;

    return (
      <FilterSection>
        <SectionTitle variant="subtitle2">
          Brands
        </SectionTitle>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={filters.brand || ''}
            onChange={(e) => updateFilter('brand', e.target.value)}
          >
            <FormControlLabel
              value=""
              control={<Radio size="small" />}
              label="All Brands"
            />
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                value={brand}
                control={<Radio size="small" />}
                label={brand}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </FilterSection>
    );
  };

  // Rating filter section
  const renderRatingFilter = () => (
    <FilterSection>
      <SectionTitle variant="subtitle2">
        Customer Rating
      </SectionTitle>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={filters.rating || 0}
          onChange={(e) => updateFilter('rating', Number(e.target.value))}
        >
          <FormControlLabel
            value={0}
            control={<Radio size="small" />}
            label="All Ratings"
          />
          {[4, 3, 2, 1].map((rating) => (
            <FormControlLabel
              key={rating}
              value={rating}
              control={<Radio size="small" />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={rating} readOnly size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {rating}+ Stars
                  </Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    </FilterSection>
  );

  // Availability filter section
  const renderAvailabilityFilter = () => (
    <FilterSection>
      <SectionTitle variant="subtitle2">
        Availability
      </SectionTitle>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.inStock || false}
              onChange={(e) => updateFilter('inStock', e.target.checked)}
              size="small"
            />
          }
          label="In Stock Only"
        />
      </FormGroup>
    </FilterSection>
  );

  // Quick filters section
  const renderQuickFilters = () => {
    const quickFilters = [
      { label: 'New Arrivals', filter: { sortBy: 'newest' } },
      { label: 'Best Sellers', filter: { sortBy: 'popularity' } },
      { label: 'Price: Low to High', filter: { sortBy: 'price_low' } },
      { label: 'Price: High to Low', filter: { sortBy: 'price_high' } },
      { label: 'Top Rated', filter: { sortBy: 'rating' } }
    ];

    return (
      <FilterSection>
        <SectionTitle variant="subtitle2">
          Quick Filters
        </SectionTitle>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickFilters.map((item, index) => (
            <Chip
              key={index}
              label={item.label}
              variant="outlined"
              size="small"
              clickable
              onClick={() => onFilterChange({ ...filters, ...item.filter })}
              color={filters.sortBy === item.filter.sortBy ? 'primary' : 'default'}
            />
          ))}
        </Box>
      </FilterSection>
    );
  };

  // Render filters with accordion (for mobile)
  const renderWithAccordion = () => (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderCategoryFilter()}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderPriceFilter()}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderRatingFilter()}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Availability
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderAvailabilityFilter()}
        </AccordionDetails>
      </Accordion>

      {brands && brands.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight={600}>
              Brands
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderBrandFilter()}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );

  // Render filters normally
  const renderNormal = () => (
    <FilterContainer elevation={1}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
        </Box>
        {hasActiveFilters() && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            color="primary"
          >
            Clear All
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Filter Sections */}
      {renderQuickFilters()}
      <Divider sx={{ my: 2 }} />
      {renderCategoryFilter()}
      <Divider sx={{ my: 2 }} />
      {renderPriceFilter()}
      <Divider sx={{ my: 2 }} />
      {renderRatingFilter()}
      <Divider sx={{ my: 2 }} />
      {renderAvailabilityFilter()}
      {brands && brands.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          {renderBrandFilter()}
        </>
      )}
    </FilterContainer>
  );

  return showAccordion ? renderWithAccordion() : renderNormal();
};

export default ProductFilters;