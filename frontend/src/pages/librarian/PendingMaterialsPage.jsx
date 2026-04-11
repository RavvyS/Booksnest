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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import materialsApi from '../../api/materialsApi';

const PendingMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchPending = async () => {
    try {
      const data = await materialsApi.getPending();
      setMaterials(data);
    } catch (err) {
      console.error('Failed to fetch pending materials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await materialsApi.approve(id, status);
      setMessage({ text: `Material ${status} successfully!`, type: status === 'approved' ? 'success' : 'info' });
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

      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">Review Queue</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Approve or reject community-submitted learning materials.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {materials.length > 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'secondary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((m) => (
                <TableRow key={m._id} sx={{ '&:hover': { bgcolor: '#fdfdfd' } }}>
                  <TableCell fontWeight="bold">{m.title}</TableCell>
                  <TableCell>{m.author}</TableCell>
                  <TableCell>{m.category || 'General'}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>{m.description?.slice(0, 100)}...</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton color="primary" onClick={() => window.open(m.contentUrl, '_blank')} title="View Resource">
                        <LaunchIcon />
                      </IconButton>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleReview(m._id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<CancelIcon />}
                        onClick={() => handleReview(m._id, 'rejected')}
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
          <Typography variant="h6" color="success.main">The review queue is clear! Great work.</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default PendingMaterialsPage;
