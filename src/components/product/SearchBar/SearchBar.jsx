// ==================== SearchBar.jsx ====================
import React, { useState, useEffect } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Popper,
  ClickAwayListener,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import { ROUTE_BUILDERS } from '../../../utils/constants/routes';

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[2],
  '&:focus-within': {
    boxShadow: theme.shadows[4]
  }
}));

const SearchBar = ({ onSearch, suggestions = [], loading = false, placeholder = 'Search products...' }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch && onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setAnchorEl(e.currentTarget);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(ROUTE_BUILDERS.search(searchTerm));
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    navigate(ROUTE_BUILDERS.search(suggestion));
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <SearchContainer component="form" onSubmit={handleSearchSubmit}>
          <IconButton type="submit" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
          />
          {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          {searchTerm && !loading && (
            <IconButton onClick={handleClear} size="small">
              <ClearIcon />
            </IconButton>
          )}
        </SearchContainer>

        {showSuggestions && suggestions.length > 0 && (
          <Popper open={showSuggestions} anchorEl={anchorEl} placement="bottom-start" style={{ width: '100%', zIndex: 1300 }}>
            <Paper sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} button onClick={() => handleSuggestionClick(suggestion)}>
                    <SearchIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;