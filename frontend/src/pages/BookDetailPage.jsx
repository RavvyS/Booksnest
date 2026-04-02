import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import booksApi from '../api/booksApi';
import borrowsApi from '../api/borrowsApi';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await booksApi.getById(id);
        setBook(data);
      } catch (err) {
        setError('Failed to load book details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBorrowLoading(true);
    try {
      if (book.availableCopies > 0) {
        await borrowsApi.borrowBook(id);
        setMessage({ text: 'Book borrowed successfully! Check "My Borrows".', type: 'success' });
      } else {
        await borrowsApi.joinQueue(id);
        setMessage({ text: 'Joint the queue successfully! We will notify you when it\'s available.', type: 'info' });
      }
      // Refresh book data
      const updated = await booksApi.getById(id);
      setBook(updated);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Action failed.', type: 'error' });
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleRead = async () => {
    try {
      const data = await booksApi.read(id);
      if (data.filePath) {
        window.open(data.filePath, '_blank');
      } else {
        setMessage({ text: 'Reading content not available.', type: 'warning' });
      }
    } catch (err) {
      setMessage({ text: 'Need an active borrow to read this book.', type: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  if (!book) return <Container sx={{ mt: 10 }}><Alert severity="info">Book not found.</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4 }}
      >
        Back to List
      </Button>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={6}>
        {/* Book Cover Placeholder */}
        <Grid item xs={12} md={4}>
          <Paper elevation={8} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1543004471-24b9a3dc73ef?q=80&w=1974&auto=format&fit=crop"
              alt={book.title}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Paper>
        </Grid>

        {/* Book Details */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={book.availableCopies > 0 ? 'In Stock' : 'Out of Stock'} 
              color={book.availableCopies > 0 ? 'success' : 'error'} 
              sx={{ mb: 1 }} 
            />
          </Box>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            By {book.author}
          </Typography>
          <Typography variant="overline" color="textSecondary">
            ISBN: {book.isbn}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            {book.description || 'No description available for this book.'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<MenuBookIcon />}
              onClick={handleRead}
              disabled={!isAuthenticated}
              sx={{ px: 4 }}
            >
              Read Now
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              startIcon={<HistoryEduIcon />}
              onClick={handleBorrow}
              disabled={borrowLoading}
              sx={{ px: 4 }}
            >
              {book.availableCopies > 0 ? 'Borrow Book' : 'Join Queue'}
            </Button>
          </Box>
          {!isAuthenticated && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Please login to borrow or read books.
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Comments Section */}
      <CommentSection bookId={id} />
    </Container>
  );
};

export default BookDetailPage;
