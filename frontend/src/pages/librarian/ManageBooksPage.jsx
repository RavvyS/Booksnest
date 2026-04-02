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
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import booksApi from '../../api/booksApi';

const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpen = (book = null) => {
    if (book) {
      setEditId(book._id);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description || '',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
      });
    } else {
      setEditId(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        totalCopies: 1,
        availableCopies: 1,
      });
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.delete(id);
      setMessage({ text: 'Book deleted.', type: 'success' });
      fetchBooks();
    } catch (err) {
      setMessage({ text: 'Failed to delete book.', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await booksApi.update(editId, formData);
        setMessage({ text: 'Book updated!', type: 'success' });
      } else {
        const payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));
        if (file) payload.append('file', file);
        await booksApi.create(payload);
        setMessage({ text: 'Book created!', type: 'success' });
      }
      setOpen(false);
      fetchBooks();
    } catch (err) {
      setMessage({ text: 'Action failed.', type: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/librarian/dashboard')} sx={{ mb: 4 }}>
        Dashboard
      </Button>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color="primary">Manage Books</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add New Book
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'secondary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={b.availableCopies > 0 ? "success.main" : "error.main"}>
                    {b.availableCopies} available / {b.totalCopies} total
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => handleOpen(b)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(b._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Book Title" name="title" required value={formData.title} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Author" name="author" required value={formData.author} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="ISBN" name="isbn" required value={formData.isbn} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Total Copies" name="totalCopies" required value={formData.totalCopies} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Available Now" name="availableCopies" required value={formData.availableCopies} onChange={handleChange} />
              </Grid>
              {!editId && (
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>PDF Upload (Optional)</Typography>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageBooksPage;
