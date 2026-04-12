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
  Tabs,
  Tab,
  Chip,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import materialsApi from '../../api/materialsApi';
import booksApi from '../../api/booksApi';

const PendingReviewPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingMaterials, pendingBooks] = await Promise.all([
        materialsApi.getPending(),
        booksApi.getPending()
      ]);
      setMaterials(pendingMaterials);
      setBooks(pendingBooks);
    } catch (err) {
      toast.error('Failed to load review queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMaterialReview = async (id, status) => {
    try {
      await materialsApi.approve(id, status);
      toast.success(`Material ${status} successfully!`);
      fetchData();
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleBookReview = async (id, status) => {
    try {
      await booksApi.approve(id, status);
      toast.success(`Book ${status} successfully!`);
      fetchData();
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleBookPreview = async (id) => {
    try {
      toast.info('Loading preview...');
      const blob = await booksApi.read(id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      toast.error('Failed to load PDF preview. Make sure you have permission.');
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
        Dashboard
      </Button>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">Pending Approvals</Typography>
        <Typography variant="body1" color="textSecondary">
          Review and approve community-submitted content for the library.
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, val) => setTabValue(val)} 
          indicatorColor="primary" 
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`Books (${books.length})`} />
          <Tab label={`Learning Materials (${materials.length})`} />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Box>
          {books.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ bgcolor: 'secondary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Book Details</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((b) => {
                    const bookId = b.id || b._id;
                    return (
                      <TableRow key={bookId} sx={{ '&:hover': { bgcolor: '#fdfdfd' } }}>
                        <TableCell>
                          <Typography fontWeight="bold">{b.title}</Typography>
                          <Typography variant="caption" color="textSecondary">By {b.author}</Typography>
                        </TableCell>
                        <TableCell>{b.isbn}</TableCell>
                        <TableCell><Chip label={b.type} size="small" /></TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="Preview PDF">
                              <IconButton color="info" onClick={() => handleBookPreview(bookId)}>
                                <LaunchIcon />
                              </IconButton>
                            </Tooltip>
                            <Button size="small" variant="contained" color="success" onClick={() => handleBookReview(bookId, 'approved')}>
                              Approve
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleBookReview(bookId, 'rejected')}>
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <NoItemsMessage message="No books pending approval." />
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {materials.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead sx={{ bgcolor: 'secondary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Material</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materials.map((m) => {
                    const mid = m.id || m._id;
                    return (
                      <TableRow key={mid} sx={{ '&:hover': { bgcolor: '#fdfdfd' } }}>
                        <TableCell>
                          <Typography fontWeight="bold">{m.title}</Typography>
                          <Typography variant="caption" color="textSecondary">By {m.author}</Typography>
                        </TableCell>
                        <TableCell>{m.categoryName || 'General'}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>{m.description?.slice(0, 80)}...</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="View Source">
                              <IconButton color="info" onClick={() => window.open(m.contentUrl, '_blank')}>
                                <LaunchIcon />
                              </IconButton>
                            </Tooltip>
                            <Button size="small" variant="contained" color="success" onClick={() => handleMaterialReview(mid, 'approved')}>
                              Approve
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleMaterialReview(mid, 'rejected')}>
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <NoItemsMessage message="No materials pending approval." />
          )}
        </Box>
      )}
    </Container>
  );
};

const NoItemsMessage = ({ message }) => (
  <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f8faf8', borderRadius: 2, border: '1px dashed #ced4ce' }}>
    <Typography variant="h6" color="textSecondary">{message}</Typography>
  </Paper>
);

export default PendingReviewPage;
