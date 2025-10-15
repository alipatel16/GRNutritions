// ==================== ProductDetail.jsx (page) ====================
import React, { useEffect, useState } from 'react';
import { Container, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetails from '../../components/product/ProductDetails/ProductDetails';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { useProducts } from '../../context/ProductContext/ProductContext';
import { useCart } from '../../context/CartContext/CartContext';
import { ROUTES } from '../../utils/constants/routes';
import toast from '../../services/notification/toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, currentProduct, loading, error } = useProducts();
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    const result = await getProductById(id);
    if (!result.success) {
      navigate(ROUTES.NOT_FOUND);
    }
  };

  const handleAddToCart = async (product, quantity) => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        maxQuantity: product.inventory
      });
      toast.messages.addToCart(product.name);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = (product) => {
    toast.info('Wishlist feature coming soon!');
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !currentProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <ProductDetails
      product={currentProduct}
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleAddToWishlist}
    />
  );
};

export default ProductDetail;