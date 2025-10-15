import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  FilterList as FilterIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  Sort as SortIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSearchParams, useParams, Link as RouterLink } from 'react-router-dom';

// Components
import ProductCard from '../../components/product/ProductCard/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import CategoryFilter from '../../components/product/CategoryFilter/CategoryFilter';
import ProductFilters from '../../components/product/ProductFilters/ProductFilters';

// Hooks and contexts
import { useProducts } from '../../context/ProductContext/ProductContext';

// Utils and constants
import { PRODUCT_CATEGORIES, getCategoryBySlug } from '../../utils/constants/categories';
import { BUSINESS_CONSTANTS } from '../../utils/constants/orderStatus';

// Styled components
const ProductsContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4)
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 300,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}));

const ProductsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2)
  }
}));

const ControlsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between'
  }
}));

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();
  
  // Context hooks
  const {
    products,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    loadProducts,
    getProductsByCategory,
    searchProducts,
    getPaginatedProducts,
    updatePagination
  } = useProducts();

  // Local state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');

  // Get search query and category from URL
  const searchQuery = searchParams.get('q');
  const categorySlug = slug;
  const currentCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;

  // Load products based on current route
  useEffect(() => {
    if (searchQuery) {
      // Search products
      searchProducts(searchQuery, { ...filters, sortBy }, pagination.currentPage);
    } else if (categorySlug) {
      // Load products by category
      getProductsByCategory(currentCategory?.id, pagination.currentPage);
    } else {
      // Load all products
      loadProducts({ ...filters, sortBy, page: pagination.currentPage });
    }
  }, [searchQuery, categorySlug, filters, sortBy, pagination.currentPage]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    updateFilters({ sortBy: newSortBy });
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update pagination through context
    updatePagination({ currentPage: page });
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  // Clear filters
  const clearFilters = () => {
    updateFilters({
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      inStock: false,
      rating: 0
    });
    setSortBy('newest');
  };

  // Get filtered products
  const { products: paginatedProducts, totalPages } = getPaginatedProducts();

  // Generate page title
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    } else if (currentCategory) {
      return currentCategory.name;
    }
    return 'All Products';
  };

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      <Link key="home" component={RouterLink} to="/" color="inherit">
        Home
      </Link>
    ];

    if (currentCategory) {
      breadcrumbs.push(
        <Typography key="category" color="text.primary">
          {currentCategory.name}
        </Typography>
      );
    } else if (searchQuery) {
      breadcrumbs.push(
        <Typography key="search" color="text.primary">
          Search Results
        </Typography>
      );
    } else {
      breadcrumbs.push(
        <Typography key="products" color="text.primary">
          All Products
        </Typography>
      );
    }

    return breadcrumbs;
  };

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return (
      <ProductsContainer>
        <Typography variant="h6" color="error" align="center">
          Error loading products: {error}
        </Typography>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer maxWidth="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        {generateBreadcrumbs()}
      </Breadcrumbs>

      {/* Page Header */}
      <ProductsHeader>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {getPageTitle()}
          </Typography>
          {currentCategory && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {currentCategory.description}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {paginatedProducts.length} of {pagination.totalItems} products
          </Typography>
        </Box>

        <ControlsSection>
          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              startAdornment={<SortIcon sx={{ mr: 1 }} />}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          <IconButton
            onClick={toggleViewMode}
            color={viewMode === 'grid' ? 'primary' : 'default'}
          >
            {viewMode === 'grid' ? <GridIcon /> : <ListIcon />}
          </IconButton>

          {/* Filter Button (Mobile) */}
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
          )}
        </ControlsSection>
      </ProductsHeader>

      {/* Active Filters */}
      {(filters.category || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.inStock || filters.rating > 0) && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {filters.category && (
              <Chip
                label={`Category: ${filters.category}`}
                onDelete={() => handleFilterChange({ category: '' })}
                size="small"
              />
            )}
            {filters.minPrice > 0 && (
              <Chip
                label={`Min Price: ₹${filters.minPrice}`}
                onDelete={() => handleFilterChange({ minPrice: 0 })}
                size="small"
              />
            )}
            {filters.maxPrice < 10000 && (
              <Chip
                label={`Max Price: ₹${filters.maxPrice}`}
                onDelete={() => handleFilterChange({ maxPrice: 10000 })}
                size="small"
              />
            )}
            {filters.inStock && (
              <Chip
                label="In Stock Only"
                onDelete={() => handleFilterChange({ inStock: false })}
                size="small"
              />
            )}
            {filters.rating > 0 && (
              <Chip
                label={`${filters.rating}+ Stars`}
                onDelete={() => handleFilterChange({ rating: 0 })}
                size="small"
              />
            )}
            <Button
              size="small"
              onClick={clearFilters}
              sx={{ ml: 1 }}
            >
              Clear All
            </Button>
          </Stack>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Sidebar Filters (Desktop) */}
        {!isMobile && (
          <Grid item md={3}>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={Object.values(PRODUCT_CATEGORIES)}
            />
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {paginatedProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your filters or search terms
              </Typography>
              <Button variant="contained" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {paginatedProducts.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === 'grid' ? 6 : 12}
                    md={viewMode === 'grid' ? 4 : 12}
                    lg={viewMode === 'grid' ? 3 : 12}
                    key={product.id}
                  >
                    <ProductCard
                      product={product}
                      compact={viewMode === 'list'}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? 'small' : 'medium'}
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <ProductFilters
          filters={filters}
          onFilterChange={(newFilters) => {
            handleFilterChange(newFilters);
            setFilterDrawerOpen(false);
          }}
          categories={Object.values(PRODUCT_CATEGORIES)}
        />
      </FilterDrawer>
    </ProductsContainer>
  );
};

export default Products;