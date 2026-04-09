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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import booksApi from '../../api/booksApi';

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
      setMessage({ text: 'Book deleted.', type: 'success' });
      fetchBooks();
    } catch (err) {
      setMessage({ text: 'Failed to delete book.', type: 'error' });
    }
  };

  const getStatusChip = (status) => {
    const config = {
      pending: { color: 'warning', label: 'In Review' },
      approved: { color: 'success', label: 'Published' },
      rejected: { color: 'error', label: 'Rejected' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/author/dashboard')} 
        sx={{ mb: 4 }}
      >
        Dashboard
      </Button>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color="primary">My Book Submissions</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/author/upload?type=book')}
        >
          Submit New Book
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {books.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((b) => (
                <TableRow key={b.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="bold" 
                      sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
                      onClick={() => navigate(`/books/${b.id}`)}
                    >
                      {b.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">{b.description?.slice(0, 50)}...</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={b.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{b.isbn}</TableCell>
                  <TableCell>{getStatusChip(b.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      title="View PDF"
                      onClick={async () => {
                        try {
                          const blob = await booksApi.read(b.id);
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, '_blank');
                        } catch (err) {
                          setMessage({ text: 'Failed to open PDF.', type: 'error' });
                        }
                      }}
                    >
                      <LaunchIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" color="secondary" onClick={() => navigate(`/author/books/${b.id}/edit`)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(b.id)}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2, border: '1px dashed #ccc' }}>
          <Typography color="textSecondary">You haven't submitted any books for review yet.</Typography>
          <Button onClick={() => navigate('/author/upload?type=book')} sx={{ mt: 2 }}>
            Submit Your First Book
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default MyBooksPage;
