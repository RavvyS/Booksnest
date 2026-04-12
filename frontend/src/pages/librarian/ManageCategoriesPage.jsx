import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import categoriesApi from '../../api/categoriesApi';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = (cat = null) => {
    if (cat) {
      setEditId(cat.id);
      setName(cat.name);
      setDescription(cat.description || '');
    } else {
      setEditId(null);
      setName('');
      setDescription('');
    }
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This might affect materials linked to it.')) return;
    try {
      await categoriesApi.delete(id);
      setMessage({ text: 'Category deleted.', type: 'success' });
      fetchCategories();
    } catch (err) {
      setMessage({ text: 'Failed to delete category.', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoriesApi.update(editId, { name, description });
        setMessage({ text: 'Category updated!', type: 'success' });
      } else {
        await categoriesApi.create({ name, description });
        setMessage({ text: 'Category created!', type: 'success' });
      }
      setOpen(false);
      fetchCategories();
    } catch (err) {
      setMessage({ text: 'Action failed.', type: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/librarian/dashboard')} sx={{ mb: 4 }}>
        Panel Dashboard
      </Button>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color="primary">Manage Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: 'secondary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} sx={{ '&:hover': { bgcolor: '#fdfdfd' } }}>
                <TableCell fontWeight="bold">{cat.name}</TableCell>
                <TableCell>{cat.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => handleOpen(cat)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(cat.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Edit Category' : 'New Category'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField fullWidth label="Name" required value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Description" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageCategoriesPage;
