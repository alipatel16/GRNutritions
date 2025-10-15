import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper
} from '@mui/material';
import {
  Visibility,
  Edit,
  Block,
  CheckCircle,
  Search,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import databaseService from '../../../services/firebase/database';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { formatDateTime } from '../../../utils/helpers/formatters';
import { USER_ROLES } from '../../../utils/constants/orderStatus';
import { toast } from 'react-toastify';
import usersAPI from '../../../services/api/users';

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3)
}));

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await usersAPI.getAllUsers();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setEditRoleOpen(true);
  };

  const handleUpdateRole = async () => {
    try {
      await databaseService.updateUserRole(selectedUser.uid, newRole);
      toast.success('User role updated successfully');
      setEditRoleOpen(false);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await databaseService.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h4" fontWeight={600}>
          User Management
        </Typography>
      </HeaderBox>

      <SearchBox>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">All Roles</MenuItem>
            {Object.values(USER_ROLES).map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SearchBox>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.uid} hover>
                    <TableCell>
                      <Avatar
                        src={user.photoURL}
                        alt={user.displayName}
                        sx={{ width: 40, height: 40 }}
                      >
                        <Person />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {user.displayName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={USER_ROLES[user.role?.toUpperCase()]?.label || user.role || 'User'}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={user.active !== false ? <CheckCircle /> : <Block />}
                        label={user.active !== false ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.active !== false ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      {formatDateTime(user.createdAt)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditRole(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={user.active !== false ? 'error' : 'success'}
                        onClick={() => handleToggleUserStatus(user.uid, user.active !== false)}
                      >
                        {user.active !== false ? <Block /> : <CheckCircle />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* User Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Avatar
                      src={selectedUser.photoURL}
                      alt={selectedUser.displayName}
                      sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}
                    >
                      <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedUser.displayName || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Account Information
                    </Typography>
                    <Typography variant="body2">
                      Role: {USER_ROLES[selectedUser.role?.toUpperCase()]?.label || selectedUser.role || 'User'}
                    </Typography>
                    <Typography variant="body2">
                      Status: {selectedUser.active !== false ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="body2">
                      Phone: {selectedUser.phoneNumber || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Joined: {formatDateTime(selectedUser.createdAt)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleOpen} onClose={() => setEditRoleOpen(false)}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>User Role</InputLabel>
            <Select
              value={newRole}
              label="User Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              {Object.values(USER_ROLES).map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRoleOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;