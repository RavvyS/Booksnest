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
  const [userActiveBorrow, setUserActiveBorrow] = useState(null); // active borrow for THIS book

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
      if (!isAuthenticated) return;
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

    const fetchUserStatus = async () => {
      if (!isAuthenticated || (user?.role !== 'reader' && user?.role !== 'author')) return;
      try {
        setUserQueueLoading(true);
        // Check queue position
        const queueData = await borrowsApi.getQueueStatus(id).catch(() => null);
        setUserQueueStatus(queueData);

        // Check if reader already has an active borrow for this book
        const allBorrows = await borrowsApi.getMyBorrows().catch(() => []);
        const activeBorrow = allBorrows.find(
          (b) => b.bookId === id && b.returned === false
        ) || null;
        setUserActiveBorrow(activeBorrow);
      } catch (err) {
        console.error('Failed to fetch user status', err);
      } finally {
        setUserQueueLoading(false);
      }
    };

    fetchBook();
    fetchQueue();
    fetchUserStatus();
  }, [id, user, isAuthenticated]);

  const refreshUserStatus = async () => {
    if (user?.role !== 'reader' && user?.role !== 'author') return;
    const queueData = await borrowsApi.getQueueStatus(id).catch(() => null);
    setUserQueueStatus(queueData);
    const allBorrows = await borrowsApi.getMyBorrows().catch(() => []);
    const activeBorrow = allBorrows.find((b) => b.bookId === id && b.returned === false) || null;
    setUserActiveBorrow(activeBorrow);
  };

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBorrowLoading(true);
    try {
      // Always fetch fresh copy count before deciding to borrow or queue.
      const freshBook = await booksApi.getById(id);
      setBook(freshBook);

      if (freshBook.availableCopies > 0) {
        // Copies available — borrow directly
        await borrowsApi.borrowBook(id);
        setMessage({ text: 'Book borrowed successfully! Check "My Borrows".', type: 'success' });
      } else {
        // No copies — join queue
        const result = await borrowsApi.joinQueue(id);

        if (result?.alreadyQueued) {
          // Already in queue — surface their existing position
          setUserQueueStatus(result);
          setMessage({ text: `You are already in the waitlist at position #${result.position}.`, type: 'info' });
        } else {
          setUserQueueStatus(result);
          setMessage({ text: `Joined the waitlist! You are at position #${result?.position ?? 1}.`, type: 'success' });
        }
      }

      // Refresh book stock and full user status
      const updated = await booksApi.getById(id);
      setBook(updated);
      await refreshUserStatus();

    } catch (err) {
      const code = err.response?.data?.code;
      const msg  = err.response?.data?.message || '';

      if (code === 'COPIES_AVAILABLE' || msg.includes('Copies are available')) {
        // Copies became available between the fresh fetch and the API call — auto-borrow
        try {
          await borrowsApi.borrowBook(id);
          setMessage({ text: 'Book borrowed successfully! Check "My Borrows".', type: 'success' });
          const updated = await booksApi.getById(id);
          setBook(updated);
          await refreshUserStatus();
        } catch (borrowErr) {
          setMessage({ text: borrowErr.response?.data?.message || 'Unable to borrow at this time.', type: 'error' });
        }

      } else if (code === 'ALREADY_BORROWED' || msg.includes('already have an active borrow')) {
        // User already has this book — refresh state to show the borrow panel
        await refreshUserStatus();
        setMessage({ text: 'You already have this book borrowed.', type: 'info' });

      } else {
        setMessage({ text: msg || 'Action failed.', type: 'error' });
      }
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
        <Grid size={{xs: 12, md: 4}}>
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
        <Grid size={{xs: 12, md: 8}}>
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
                {/* Already borrowed this book */}
                {userActiveBorrow ? (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.50', borderColor: 'success.200', borderRadius: 2, width: '100%' }}>
                    <Typography variant="subtitle2" color="success.main" fontWeight="bold">📚 You Currently Have This Book Borrowed</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      Due: {userActiveBorrow.dueDate ? new Date(userActiveBorrow.dueDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Paper>
                ) : userQueueStatus ? (
                  /* Already in queue */
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.200', borderRadius: 2, width: '100%' }}>
                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold">⏳ You are in the Waitlist</Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                      Position #{userQueueStatus.position}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      of {userQueueStatus.totalWaiting} total readers waiting. We'll notify you when a copy is returned!
                    </Typography>
                  </Paper>
                ) : (
                  /* Can borrow or join queue */
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<HistoryEduIcon />}
                    onClick={handleBorrow}
                    disabled={borrowLoading || userQueueLoading}
                    sx={{ px: 4 }}
                  >
                    {borrowLoading ? 'Processing...' : (book.availableCopies > 0 ? 'Borrow Book' : 'Join Waitlist')}
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

      {/* Unified Book Queue / Waitlist Table */}
      {isAuthenticated && (
        <Box sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PeopleAltIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="bold">Book Queue</Typography>
              <Typography variant="body2" color="textSecondary">
                First-come, first-served waitlist. We automatically assign the book to the next reader when it's returned.
              </Typography>
            </Box>
          </Box>
          
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            {queueLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
            ) : queue.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: 100 }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reader</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                      {user?.role === 'librarian' && (
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {queue.map((entry, index) => {
                      const isMe = entry.userId === user?.id;
                      return (
                        <TableRow 
                          key={entry.id} 
                          sx={{ 
                            '&:hover': { bgcolor: 'action.hover' },
                            bgcolor: isMe ? 'primary.50' : 'inherit'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ 
                              width: 32, 
                              height: 32, 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              bgcolor: index === 0 ? 'success.main' : 'primary.main',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.875rem'
                            }}>
                              {index + 1}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={isMe ? "bold" : "medium"}>
                              {entry.userName} {isMe && '(You)'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontStyle: entry.userEmail?.includes('***') ? 'italic' : 'normal' }}>
                            {entry.userEmail}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={index === 0 ? "Priority" : "Waiting"} 
                              size="small" 
                              variant="outlined"
                              color={index === 0 ? "success" : "primary"}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </TableCell>
                          {user?.role === 'librarian' && (
                            <TableCell align="right">
                              <Tooltip title="Remove from Waitlist">
                                <IconButton color="error" size="small" onClick={() => handleRemoveFromQueue(entry.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 8, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">The queue is empty.</Typography>
                <Typography variant="body2" color="text.disabled">No one is currently waiting for a copy of this book.</Typography>
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
