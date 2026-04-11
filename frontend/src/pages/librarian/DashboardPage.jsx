import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import booksApi from '../../api/booksApi';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';
import usersApi from '../../api/usersApi';

import AdminGuide from '../../components/librarian/AdminGuide';
import QuickActions from '../../components/librarian/QuickActions';

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    books: 0, 
    pending: 0, 
    materials: 0,
    categories: 0, 
    pendingUsers: 0,
    recentBooks: []
  });
  const [loading, setLoading] = useState({
    books: true,
    materials: true,
    categories: true,
    users: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Independent Fetching for better resilience
    const fetchBooks = async () => {
      try {
        const books = await booksApi.getAll();
        const sorted = [...books].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ).slice(0, 3);
        setStats(prev => ({ ...prev, books: books.length, recentBooks: sorted }));
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoading(prev => ({ ...prev, books: false }));
      }
    };

    const fetchMaterials = async () => {
      try {
        const [pending, all] = await Promise.all([
          materialsApi.getPending(),
          materialsApi.getAll()
        ]);
        setStats(prev => ({ ...prev, pending: pending.length, materials: all.length }));
      } catch (err) {
        console.error('Failed to fetch materials', err);
      } finally {
        setLoading(prev => ({ ...prev, materials: false }));
      }
    };

    const fetchCategories = async () => {
      try {
        const cats = await categoriesApi.getAll();
        setStats(prev => ({ ...prev, categories: cats.length }));
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    const fetchUsers = async () => {
      try {
        const pendingUsers = await usersApi.getPending();
        setStats(prev => ({ ...prev, pendingUsers: pendingUsers.length }));
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    fetchBooks();
    fetchMaterials();
    fetchCategories();
    fetchUsers();
  }, []);

  const StatCard = ({ title, value, icon, accent, helper, onClick, loading }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        height: '100%',
        background: `linear-gradient(180deg, #ffffff 0%, ${accent}12 100%)`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: 3,
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${accent}22`,
            color: accent,
          }}
        >
          {icon}
        </Box>
        {loading ? (
          <CircularProgress size={24} sx={{ color: accent }} />
        ) : (
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        )}
      </Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {helper}
      </Typography>
      <Button 
        size="small" 
        fullWidth 
        sx={{ mt: 2, borderRadius: 2 }} 
        onClick={onClick}
        disabled={loading}
      >
        Manage
      </Button>
    </Paper>
  );

  // Removed global loading check to allow shell to render instantly

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Premium Header */}
      <Box
        sx={{
          mb: 4,
          borderRadius: 5,
          p: { xs: 3, md: 4 },
          color: 'white',
          background: 'linear-gradient(135deg, #043A82 0%, #0653B8 55%, #0093E9 100%)',
          boxShadow: '0 24px 50px rgba(6, 83, 184, 0.22)',
        }}
      >
        <Chip
          label="Librarian Workspace"
          sx={{
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.16)',
            color: 'white',
            fontWeight: 700,
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 3,
            alignItems: { xs: 'flex-start', md: 'center' },
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
              Admin Dashboard
            </Typography>
            <Typography sx={{ maxWidth: 700, color: 'rgba(255,255,255,0.86)' }}>
              Welcome back, {user?.name.split(' ')[0]}. Manage library assets, oversee new submissions, and moderate the community from your central hub.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/librarian/books')}
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              px: 4,
              '&:hover': { bgcolor: '#eef5ff' },
            }}
          >
            Manage Books
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Learning Materials"
            value={stats.pending > 0 ? `${stats.pending} Pending` : `${stats.materials} Total`}
            icon={<RateReviewIcon />}
            accent="#F59E0B"
            helper="Manage submissions and full catalog."
            onClick={() => navigate('/librarian/materials')}
            loading={loading.materials}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Books"
            value={stats.books}
            icon={<LibraryBooksIcon />}
            accent="#0653B8"
            helper="Total cataloged books in the system."
            onClick={() => navigate('/librarian/books')}
            loading={loading.books}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats.categories}
            icon={<CategoryIcon />}
            accent="#10B981"
            helper="Active genre and topic classifications."
            onClick={() => navigate('/librarian/categories')}
            loading={loading.categories}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="User Approvals"
            value={stats.pendingUsers}
            icon={<PeopleIcon />}
            accent="#6366f1"
            helper="New registrations pending review."
            onClick={() => navigate('/librarian/users')}
            loading={loading.users}
          />
        </Grid>
      </Grid>

      {/* Main Management Area */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <QuickActions />
        </Grid>
        <Grid item xs={12} md={6}>
          <AdminGuide />
        </Grid>
      </Grid>

    </Container>
  );
};

const Stack = ({ children, spacing }) => (
  <Box sx={{ display: 'grid', gap: spacing }}>
    {children}
  </Box>
);

export default LibrarianDashboard;
