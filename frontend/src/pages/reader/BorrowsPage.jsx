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
          Active Borrows <Chip label={borrows.length} size="small" color="primary" />
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {borrows.length > 0 ? (
          <Grid container spacing={3}>
            {borrows.map((borrow) => (
              <Grid item key={borrow._id} xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{borrow.bookTitle}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Borrowed on: {new Date(borrow.borrowDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold', display: 'block', mt: 1 }}>
                        Due Date: {new Date(new Date(borrow.borrowDate).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<ExitToAppIcon />}
                      onClick={() => handleReturn(borrow.bookId)}
                    >
                      Return
                    </Button>
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
              <Grid item key={request._id} xs={12} md={6}>
                <Card elevation={2} sx={{ borderRadius: 2, borderLeft: '4px solid #ed6c02' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{request.bookTitle}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Requested on: {new Date(request.requestDate).toLocaleDateString()}
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
                      onClick={() => handleCancelQueue(request._id)}
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
