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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
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
  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [userQueueStatus, setUserQueueStatus] = useState(null);
  const [userQueueLoading, setUserQueueLoading] = useState(false);

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

    const fetchQueue = async () => {
      if (user?.role !== 'librarian') return;
      try {
        setQueueLoading(true);
        const data = await borrowsApi.getBookQueue(id);
        setQueue(data);
      } catch (err) {
        console.error('Failed to fetch queue', err);
      } finally {
        setQueueLoading(false);
      }
    };

    const fetchUserQueueStatus = async () => {
      if (user?.role !== 'reader' || !isAuthenticated) return;
      try {
        setUserQueueLoading(true);
        const data = await borrowsApi.getQueueStatus(id);
        setUserQueueStatus(data);
      } catch (err) {
        console.error('Failed to fetch user queue status', err);
      } finally {
        setUserQueueLoading(false);
      }
    };

    fetchBook();
    fetchQueue();
    fetchUserQueueStatus();
  }, [id, user, isAuthenticated]);

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
      const blob = await booksApi.read(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      setMessage({ text: 'Need an active borrow to read this book.', type: 'error' });
    }
  };

  const handleRemoveFromQueue = async (requestId) => {
    if (!window.confirm('Remove this user from the waitlist?')) return;
    try {
      await borrowsApi.adminCancelQueue(requestId);
      setMessage({ text: 'User removed from queue successfully.', type: 'success' });
      // Refresh queue
      const data = await borrowsApi.getBookQueue(id);
      setQueue(data);
    } catch (err) {
      setMessage({ text: 'Failed to remove user from queue.', type: 'error' });
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
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {book.categoryName && (
              <Chip 
                label={book.categoryName} 
                color="secondary" 
                variant="outlined" 
                size="small" 
                sx={{ borderRadius: 1, fontWeight: 'bold' }} 
              />
            )}
            <Chip 
              label={book.availableCopies > 0 ? 'Available' : 'Out of Stock'} 
              color={book.availableCopies > 0 ? 'success' : 'error'} 
              size="small" 
              sx={{ borderRadius: 1, fontWeight: 'bold' }} 
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
              disabled={!isAuthenticated || !book.filePath}
              sx={{ px: 4 }}
              title={!book.filePath ? "No PDF available for this book" : ""}
            >
              Read Now
            </Button>
            {user?.role !== 'librarian' && (
              <>
                {userQueueStatus ? (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.200', borderRadius: 2, width: '100%' }}>
                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold">You are in the Waitlist</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                      Position #{userQueueStatus.position}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      of {userQueueStatus.totalWaiting} total readers waiting. We'll notify you when a copy is returned!
                    </Typography>
                  </Paper>
                ) : (
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<HistoryEduIcon />}
                    onClick={handleBorrow}
                    disabled={borrowLoading || userQueueLoading}
                    sx={{ px: 4 }}
                  >
                    {book.availableCopies > 0 ? 'Borrow Book' : 'Join Queue'}
                  </Button>
                )}
              </>
            )}
          </Box>
          {!isAuthenticated && user?.role !== 'librarian' && (
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Please login to borrow or read books.
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Librarian Queue Management */}
      {user?.role === 'librarian' && (
        <Box sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PeopleAltIcon color="primary" fontSize="large" />
            <Typography variant="h4" fontWeight="bold">Waitlist Management</Typography>
          </Box>
          
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {queueLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
            ) : queue.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.100' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reader Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queue.map((entry, index) => (
                      <TableRow key={entry.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <Chip 
                            label={`#${index + 1}`} 
                            size="small" 
                            color={index === 0 ? "primary" : "default"} 
                            variant={index === 0 ? "filled" : "outlined"}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">{entry.userName}</Typography>
                        </TableCell>
                        <TableCell>{entry.userEmail}</TableCell>
                        <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Remove from Waitlist">
                            <IconButton color="error" onClick={() => handleRemoveFromQueue(entry.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography color="textSecondary">No readers are currently in the waitlist for this book.</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {/* Comments Section */}
      <CommentSection bookId={id} />
    </Container>
  );
};

export default BookDetailPage;
