// ==================== CategoryList.jsx ====================
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box
} from '@mui/material';
import { Edit, Delete, DragIndicator } from '@mui/icons-material';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

const CategoryList = ({ categories, loading, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!categories || categories.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        No categories found
      </Box>
    );
  }

  // Sort by display order
  const sortedCategories = [...categories].sort((a, b) => 
    (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <DragIndicator sx={{ color: 'text.secondary', cursor: 'move' }} />
              </TableCell>
              <TableCell>
                <strong>{category.name}</strong>
              </TableCell>
              <TableCell>
                <code>{category.slug}</code>
              </TableCell>
              <TableCell>
                {category.description || '-'}
              </TableCell>
              <TableCell>
                {category.displayOrder || 0}
              </TableCell>
              <TableCell>
                <Chip
                  label={category.active ? 'Active' : 'Inactive'}
                  color={category.active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(category)}>
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(category.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryList;