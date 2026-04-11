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
    categories: 0, 
    pendingUsers: 0,
    recentBooks: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const [books, pending, categories, pendingUsers] = await Promise.all([
          booksApi.getAll(),
          materialsApi.getPending(),
          categoriesApi.getAll(),
          usersApi.getPending(),
        ]);

        const sortedBooks = [...books].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ).slice(0, 3);

        setStats({
          books: books.length,
          pending: pending.length,
          categories: categories.length,
          pendingUsers: pendingUsers.length,
          recentBooks: sortedBooks
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEverything();
  }, []);

  const StatCard = ({ title, value, icon, accent, helper }) => (
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
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {helper}
      </Typography>
    </Paper>
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Box>;

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
            title="Pending Materials"
            value={stats.pending}
            icon={<RateReviewIcon />}
            accent="#F59E0B"
            helper="Submissions waiting for your approval."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Books"
            value={stats.books}
            icon={<LibraryBooksIcon />}
            accent="#0653B8"
            helper="Total cataloged books in the system."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats.categories}
            icon={<CategoryIcon />}
            accent="#10B981"
            helper="Active genre and topic classifications."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="User Approvals"
            value={stats.pendingUsers}
            icon={<PeopleIcon />}
            accent="#6366f1"
            helper="New registrations pending review."
          />
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Recently Added Books
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The latest titles added to our digital library.
                </Typography>
              </Box>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/librarian/books')}>
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {stats.recentBooks.length > 0 ? (
              <Box sx={{ display: 'grid', gap: 2 }}>
                {stats.recentBooks.map((book) => (
                  <Paper
                    key={book.id}
                    variant="outlined"
                    sx={{ p: 2.5, borderRadius: 3, borderColor: 'divider' }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          By {book.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          ISBN: {book.isbn} • {new Date(book.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={book.status || 'Approved'}
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography color="text.secondary">No recent books found.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <QuickActions />
            <AdminGuide />
          </Stack>
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
