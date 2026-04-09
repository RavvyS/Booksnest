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
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import booksApi from '../../api/booksApi';

const PendingBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchPending = async () => {
    try {
      const data = await booksApi.getPending();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch pending books', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await booksApi.approve(id, status);
      setMessage({ text: `Book ${status} successfully!`, type: status === 'approved' ? 'success' : 'info' });
      fetchPending();
    } catch (err) {
      setMessage({ text: 'Action failed.', type: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/librarian/dashboard')} 
        sx={{ mb: 4 }}
      >
        Librarian Dashboard
      </Button>

      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">Book Review Queue</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Review, verify ISBNs, and approve community-submitted books and magazines.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {books.length > 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'secondary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((b) => (
                <TableRow key={b._id} sx={{ '&:hover': { bgcolor: '#fdfdfd' } }}>
                  <TableCell fontWeight="bold">{b.title}</TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>{b.isbn}</TableCell>
                  <TableCell>
                    <Chip label={b.type} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleReview(b._id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<CancelIcon />}
                        onClick={() => handleReview(b._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f0f7f0', borderRadius: 2, border: '1px dashed #4caf50' }}>
          <Typography variant="h6" color="success.main">The book review queue is empty!</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default PendingBooksPage;
