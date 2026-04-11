import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CancelIcon from '@mui/icons-material/Cancel';
import borrowsApi from '../../api/borrowsApi';
import booksApi from '../../api/booksApi';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const BorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [queueRequests, setQueueRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  const fetchData = async () => {
    try {
      const borrowData = await borrowsApi.getMyBorrows();
      const queueData = await borrowsApi.getMyQueue();
      setBorrows(borrowData);
      setQueueRequests(queueData);
    } catch (err) {
      console.error('Failed to fetch borrowed data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      await borrowsApi.returnBook(bookId);
      setMessage({ text: 'Book returned successfully!', type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to return book.', type: 'error' });
    }
  };

  const handleCancelQueue = async (requestId) => {
    try {
      await borrowsApi.cancelQueue(requestId);
      setMessage({ text: 'Queue request cancelled.', type: 'info' });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to cancel queue request.', type: 'error' });
    }
  };

  const handleRead = async (bookId) => {
    try {
      const blob = await booksApi.read(bookId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      setMessage({ text: 'Failed to open book PDF. Make sure borrow is active.', type: 'error' });
    }
  };

  const activeBorrows = borrows.filter(b => !b.returned);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
        My Shelf
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 6 }}>
        Manage your active borrows and library queue.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {/* Active Borrows */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Active Borrows <Chip label={activeBorrows.length} size="small" color="primary" />
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {activeBorrows.length > 0 ? (
          <Grid container spacing={3}>
            {activeBorrows.map((borrow) => (
              <Grid item key={borrow.id} xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2, borderLeft: '4px solid #0653B8' }}>
                  <CardContent sx={{ display: 'flex', direction: 'column', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">{borrow.bookTitle}</Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>By {borrow.bookAuthor}</Typography>
                      <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Borrowed: {new Date(borrow.borrowedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                          Access Until: {new Date(borrow.dueDate).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<MenuBookIcon />}
                        onClick={() => handleRead(borrow.bookId)}
                        disabled={!borrow.filePath}
                        title={!borrow.filePath ? "No PDF available for this book" : ""}
                      >
                        Read
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                        startIcon={<ExitToAppIcon />}
                        onClick={() => handleReturn(borrow.bookId)}
                      >
                        Return
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <Typography color="textSecondary">You have no active borrows.</Typography>
          </Paper>
        )}
      </Box>

      {/* Queue Requests */}
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Waiting List Queue <Chip label={queueRequests.length} size="small" color="secondary" />
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {queueRequests.length > 0 ? (
          <Grid container spacing={3}>
            {queueRequests.map((request) => (
              <Grid item key={request.id} xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2, borderLeft: '4px solid #ed6c02' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{request.bookTitle}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Requested: {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                      <Chip 
                        label={`Status: ${request.status || 'Pending'}`} 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }} 
                      />
                    </Box>
                    <Button 
                      variant="text" 
                      color="inherit"
                      startIcon={<CancelIcon />}
                      onClick={() => handleCancelQueue(request.id)}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <Typography color="textSecondary">Your queue list is empty.</Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default BorrowsPage;
