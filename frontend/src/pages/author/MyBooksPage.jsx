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
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import booksApi from '../../api/booksApi';
import { toast } from 'react-toastify';

const MyBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getMyBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch author books', err);
      toast.error('Failed to load your books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.delete(id);
      setMessage({ text: 'Book deleted successfully.', type: 'success' });
      fetchBooks();
    } catch (err) {
      setMessage({ text: 'Failed to delete book.', type: 'error' });
      toast.error('Failed to delete book');
    }
  };

  const getStatusChip = (status) => {
    const config = {
      pending: { color: 'warning', label: 'Pending Review' },
      approved: { color: 'success', label: 'Approved' },
      rejected: { color: 'error', label: 'Rejected' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary">My Published Books</Typography>
          <Typography color="textSecondary" variant="subtitle1">Manage your library submissions and track their status.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/author/upload?type=book')}
          size="large"
        >
          New Book
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {books.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Book Details</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => {
                const bookId = book.id || book._id;
                return (
                  <TableRow key={bookId} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">{book.title}</Typography>
                      <Typography variant="caption" color="textSecondary">{book.author}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{book.isbn}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={book.categoryName || book.category?.name || book.category || 'General'} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>{getStatusChip(book.status)}</TableCell>
                    <TableCell>{new Date(book.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => navigate(`/books/${bookId}`)}
                        title="View Submission"
                      >
                        <LaunchIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="secondary" 
                        onClick={() => navigate(`/author/books/${bookId}/edit`)}
                        title="Edit Details"
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(bookId)}
                        title="Delete Book"
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f8fbff', borderRadius: 4, border: '1px dashed #b8cff2' }}>
          <Typography variant="h5" color="textSecondary" gutterBottom>No books found</Typography>
          <Typography color="textSecondary" sx={{ mb: 3 }}>You haven't uploaded any books yet.</Typography>
          <Button variant="contained" onClick={() => navigate('/author/upload?type=book')}>Upload Your First Book</Button>
        </Paper>
      )}
    </Container>
  );
};

export default MyBooksPage;
