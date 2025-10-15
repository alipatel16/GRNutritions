import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Hooks and contexts
import { useApp } from '../../../context/AppContext/AppProvider';
import { useProducts } from '../../../context/ProductContext/ProductContext';
import { useDebounce } from '../../../hooks/useDebounce';

// Utils
import { formatPrice } from '../../../utils/helpers/formatters';
import { PRODUCT_CATEGORIES } from '../../../utils/constants/categories';

// Styled components
const DrawerContent = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default
}));

const SearchHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper
}));

const SearchResults = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  }
}));

const SearchDrawer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Context hooks
  const { ui, toggleSearch } = useApp();
  const { searchProducts } = useProducts();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isOpen = ui.searchOpen;

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    setSearchHistory(history.slice(0, 5)); // Keep only last 5 searches
  }, []);

  // Perform search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      performSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const performSearch = async (term) => {
    setIsSearching(true);
    try {
      const result = await searchProducts(term, { limit: 10 });
      if (result.success) {
        setSearchResults(result.data.data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    toggleSearch(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearchSubmit = (term = searchTerm) => {
    if (!term.trim()) return;
    
    // Save to search history
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
    
    // Navigate to search results
    handleClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleProductClick = (product) => {
    handleClose();
    navigate(`/products/${product.id}`);
  };

  const handleCategoryClick = (category) => {
    handleClose();
    navigate(`/category/${category.slug}`);
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    handleSearchSubmit(term);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('search_history');
    setSearchHistory([]);
  };

  const popularCategories = Object.values(PRODUCT_CATEGORIES).slice(0, 6);
  const trendingSearches = ['whey protein', 'mass gainer', 'multivitamin', 'omega 3', 'bcaa'];

  return (
    <Drawer
      anchor="top"
      open={isOpen}
      onClose={handleClose}
      ModalProps={{
        keepMounted: false
      }}
      PaperProps={{
        sx: { height: '100vh' }
      }}
    >
      <DrawerContent>
        {/* Search Header */}
        <SearchHeader>
          <TextField
            fullWidth
            placeholder="Search for products, brands, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            autoFocus
            variant="outlined"
            sx={{ mr: 2 }}
          />
          
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </SearchHeader>

        {/* Search Results */}
        <SearchResults>
          {/* Show results when searching */}
          {searchTerm.trim() && (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {isSearching ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography>Searching...</Typography>
                </Box>
              ) : searchResults.length > 0 ? (
                <List>
                  {searchResults.map((product) => (
                    <ListItem
                      key={product.id}
                      button
                      onClick={() => handleProductClick(product)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={product.images?.[0]}
                          alt={product.name}
                          variant="rounded"
                        >
                          {product.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="primary">
                              {formatPrice(product.price)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.category}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No products found for "{searchTerm}"
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Show suggestions when not searching */}
          {!searchTerm.trim() && (
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {/* Search History */}
              {searchHistory.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Recent Searches
                    </Typography>
                    <IconButton size="small" onClick={clearSearchHistory}>
                      <ClearIcon />
                    </IconButton>
                  </Box>
                  
                  <Box>
                    {searchHistory.map((term, index) => (
                      <SuggestionChip
                        key={index}
                        label={term}
                        variant="outlined"
                        size="small"
                        onClick={() => handleHistoryClick(term)}
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Trending Searches */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  <TrendingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Trending Searches
                </Typography>
                
                <Box>
                  {trendingSearches.map((term, index) => (
                    <SuggestionChip
                      key={index}
                      label={term}
                      variant="outlined"
                      size="small"
                      onClick={() => handleHistoryClick(term)}
                      clickable
                    />
                  ))}
                </Box>
              </Box>

              {/* Popular Categories */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Popular Categories
                </Typography>
                
                <List>
                  {popularCategories.map((category) => (
                    <ListItem
                      key={category.id}
                      button
                      onClick={() => handleCategoryClick(category)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>
                              {category.icon}
                            </Typography>
                            {category.name}
                          </Box>
                        }
                        secondary={category.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </SearchResults>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;