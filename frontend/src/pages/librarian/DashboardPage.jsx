import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import booksApi from '../../api/booksApi';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';

const LibrarianDashboard = () => {
  const [stats, setStats] = useState({ books: 0, pending: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, pending, categories] = await Promise.all([
          booksApi.getAll(),
          materialsApi.getPending(),
          categoriesApi.getAll(),
        ]);
        setStats({
          books: books.length,
          pending: pending.length,
          categories: categories.length,
        });
      } catch (err) {
        console.error('Failed to fetch librarian stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, actionLabel, onClick }) => (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
        <Box sx={{ p: 2, bgcolor: `${color}.light`, borderRadius: 2, color: `${color}.main` }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h3" fontWeight="bold">{value}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{title}</Typography>
        </Box>
      </Box>
      <Button 
        variant="text" 
        color={color} 
        size="small" 
        fullWidth 
        onClick={onClick}
        sx={{ mt: 'auto', fontWeight: 'bold' }}
      >
        {actionLabel}
      </Button>
    </Paper>
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" color="primary">Librarian Panel</Typography>
        <Typography variant="h6" color="textSecondary">System administration and content management overview.</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Pending Materials" 
            value={stats.pending} 
            icon={<RateReviewIcon fontSize="large" />} 
            color="warning" 
            actionLabel="Review All"
            onClick={() => navigate('/librarian/pending')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Total Books" 
            value={stats.books} 
            icon={<LibraryBooksIcon fontSize="large" />} 
            color="primary" 
            actionLabel="Manage Books"
            onClick={() => navigate('/librarian/books')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Content Categories" 
            value={stats.categories} 
            icon={<CategoryIcon fontSize="large" />} 
            color="success" 
            actionLabel="Manage Categories"
            onClick={() => navigate('/librarian/categories')}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, p: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Library Management System</Typography>
          <Typography variant="body1">Maintain order and ensure high-quality content for the learning community.</Typography>
        </Box>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<CategoryIcon />}
          onClick={() => navigate('/librarian/categories')}
          sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}
        >
          Add New Category
        </Button>
      </Box>
    </Container>
  );
};

export default LibrarianDashboard;
