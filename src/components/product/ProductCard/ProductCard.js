import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Badge,
  Rating,
  Tooltip,
  Skeleton,
  alpha
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  NewReleases as NewIcon,
  TrendingUp as TrendingIcon,
  Inventory as StockIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Hooks and contexts
import { useCart } from '../../../context/CartContext/CartContext';
import { useAuth } from '../../../context/AuthContext/AuthContext';

// Utils
import { formatPrice } from '../../../utils/helpers/formatters';
import { getInventoryStatus } from '../../../utils/constants/orderStatus';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)'
    },
    '& .product-image': {
      transform: 'scale(1.05)'
    }
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  height: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out'
}));

const BadgeContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5)
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease-in-out'
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(8px)',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    transform: 'scale(1.1)'
  }
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.disabled,
  fontSize: '0.875rem'
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  fontSize: '0.75rem',
  height: 20,
  '& .MuiChip-label': {
    padding: '0 6px'
  }
}));

const StockChip = styled(Chip)(({ theme, stockStatus }) => ({
  fontSize: '0.75rem',
  height: 20,
  backgroundColor: stockStatus === 'in_stock' 
    ? alpha(theme.palette.success.main, 0.1)
    : stockStatus === 'low_stock'
    ? alpha(theme.palette.warning.main, 0.1)
    : alpha(theme.palette.error.main, 0.1),
  color: stockStatus === 'in_stock'
    ? theme.palette.success.main
    : stockStatus === 'low_stock'
    ? theme.palette.warning.main
    : theme.palette.error.main,
  '& .MuiChip-label': {
    padding: '0 6px'
  }
}));

const ProductCard = ({
  product,
  showNewBadge = false,
  showBestSellerBadge = false,
  showDiscountBadge = true,
  showRating = true,
  showWishlist = true,
  showQuickView = true,
  compact = false,
  onQuickView = null,
  ...props
}) => {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback for missing product data
  if (!product) {
    return <ProductCardSkeleton />;
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Get inventory status
  const inventoryStatus = getInventoryStatus(product.inventory || 0);
  const isInCart = getItemQuantity(product.id) > 0;

  // Event handlers
  const handleCardClick = (event) => {
    // Don't navigate if clicking on buttons
    if (event.target.closest('button') || event.target.closest('.MuiIconButton-root')) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (inventoryStatus.id === 'out_of_stock') {
      return;
    }

    await addToCart(product, 1);
  };

  const handleWishlistToggle = (event) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API calls
  };

  const handleQuickView = (event) => {
    event.stopPropagation();
    
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <StyledCard {...props} onClick={handleCardClick}>
      <ImageContainer>
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        )}
        
        {!imageError ? (
          <ProductImage
            className="product-image"
            component="img"
            image={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{ display: imageLoading ? 'none' : 'block' }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: 'grey.100',
              color: 'grey.500'
            }}
          >
            <Typography variant="body2">No Image</Typography>
          </Box>
        )}

        {/* Badges */}
        <BadgeContainer>
          {showNewBadge && (
            <Chip
              icon={<NewIcon />}
              label="New"
              size="small"
              color="info"
              variant="filled"
            />
          )}
          {showBestSellerBadge && (
            <Chip
              icon={<TrendingIcon />}
              label="Best Seller"
              size="small"
              color="warning"
              variant="filled"
            />
          )}
          {showDiscountBadge && discountPercentage > 0 && (
            <DiscountChip
              icon={<OfferIcon />}
              label={`${discountPercentage}% OFF`}
              size="small"
            />
          )}
        </BadgeContainer>

        {/* Action Buttons */}
        <ActionButtons className="product-actions">
          {showWishlist && (
            <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
              <ActionButton
                size="small"
                onClick={handleWishlistToggle}
                color={isWishlisted ? "error" : "default"}
              >
                {isWishlisted ? <FavoriteFilledIcon /> : <FavoriteIcon />}
              </ActionButton>
            </Tooltip>
          )}
          
          {showQuickView && (
            <Tooltip title="Quick View">
              <ActionButton size="small" onClick={handleQuickView}>
                <ViewIcon />
              </ActionButton>
            </Tooltip>
          )}
        </ActionButtons>
      </ImageContainer>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Product Category */}
        {product.category && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', fontWeight: 500 }}
          >
            {product.category}
          </Typography>
        )}

        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: compact ? '1rem' : '1.125rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mt: 0.5,
            mb: 1
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        {showRating && product.averageRating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.averageRating}
              precision={0.1}
              size="small"
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount || 0})
            </Typography>
          </Box>
        )}

        {/* Price */}
        <PriceContainer>
          <Typography
            variant="h6"
            component="span"
            color="primary"
            fontWeight={600}
          >
            {formatPrice(product.price)}
          </Typography>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <OriginalPrice variant="body2">
              {formatPrice(product.originalPrice)}
            </OriginalPrice>
          )}
        </PriceContainer>

        {/* Stock Status */}
        <Box sx={{ mt: 1 }}>
          <StockChip
            icon={<StockIcon />}
            label={inventoryStatus.label}
            size="small"
            stockStatus={inventoryStatus.id}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          variant={isInCart ? "outlined" : "contained"}
          fullWidth
          startIcon={<CartIcon />}
          onClick={handleAddToCart}
          disabled={inventoryStatus.id === 'out_of_stock'}
          size={compact ? "small" : "medium"}
        >
          {isInCart
            ? "Added to Cart"
            : inventoryStatus.id === 'out_of_stock'
            ? "Out of Stock"
            : "Add to Cart"
          }
        </Button>
      </CardActions>
    </StyledCard>
  );
};

// Loading skeleton for product card
export const ProductCardSkeleton = ({ compact = false }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton width="60%" height={20} />
      <Skeleton width="100%" height={24} sx={{ mt: 1 }} />
      <Skeleton width="100%" height={24} />
      <Skeleton width="40%" height={32} sx={{ mt: 1 }} />
      <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2 }}>
      <Skeleton width="100%" height={36} />
    </CardActions>
  </Card>
);

// Compact product card variant
export const CompactProductCard = (props) => (
  <ProductCard {...props} compact={true} />
);

export default ProductCard;