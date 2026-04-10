import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../../context/AuthContext';
import booksApi from '../../api/booksApi';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';
import usersApi from '../../api/usersApi';

// Sub-components
import DashboardCharts from '../../components/librarian/DashboardCharts';
import RecentActivity from '../../components/librarian/RecentActivity';
import QuickActions from '../../components/librarian/QuickActions';

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    books: 0, 
    pending: 0, 
    categories: 0, 
    pendingUsers: 0,
    booksData: [], // For chart
    recentBooks: [] // For activity
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const [books, pending, categories, pendingUsers] = await Promise.all([
          booksApi.getAll(),
          materialsApi.getPending(),
          categoriesApi.getAll(),
          usersApi.getPending(),
        ]);

        // Process data for charts
        const catMap = {};
        books.forEach(book => {
          const catName = book.category?.name || 'Uncategorized';
          catMap[catName] = (catMap[catName] || 0) + 1;
        });

        const chartData = Object.keys(catMap).map(name => ({
          name,
          count: catMap[name]
        })).slice(0, 6); // Limit to top 6 for clean look

        // Sort books by date for recent activity
        const sortedBooks = [...books].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        ).slice(0, 5);

        setStats({
          books: books.length,
          pending: pending.length,
          categories: categories.length,
          pendingUsers: pendingUsers.length,
          booksData: chartData,
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

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'white',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box 
        sx={{ 
          p: 1.5, 
          borderRadius: '50%', 
          background: gradient,
          color: 'white',
          display: 'flex',
          zIndex: 2,
          boxShadow: `0 8px 16px ${color}33`
        }}
      >
        {icon}
      </Box>
      <Box sx={{ zIndex: 2, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1, mb: 0.5 }}>{value}</Typography>
        <Typography variant="body2" color="textSecondary" fontWeight="medium">{title}</Typography>
      </Box>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress thickness={5} size={60} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f8fafc', 
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(26, 115, 232, 0.05) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(52, 168, 83, 0.05) 0, transparent 50%)',
        pb: 10 
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: '-0.02em', mb: 1 }}>
              Dashboard
            </Typography>
            <Typography variant="h6" color="textSecondary" fontWeight="medium">
              Welcome back, {user?.name.split(' ')[0]} 👋
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" fontWeight="bold">Librarian Account</Typography>
              <Typography variant="caption" color="textSecondary">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Typography>
            </Box>
            <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main', fontWeight: 'bold' }}>
              {user?.name[0]}
            </Avatar>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Pending Materials" 
              value={stats.pending} 
              icon={<RateReviewIcon />} 
              color="#f59e0b"
              gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Books" 
              value={stats.books} 
              icon={<LibraryBooksIcon />} 
              color="#3b82f6"
              gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Categories" 
              value={stats.categories} 
              icon={<CategoryIcon />} 
              color="#10b981"
              gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="User Approvals" 
              value={stats.pendingUsers} 
              icon={<PeopleIcon />} 
              color="#6366f1"
              gradient="linear-gradient(135deg, #6366f1 0%, #818cf8 100%)"
            />
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Grid container spacing={4}>
          {/* Left Column (8/12) */}
          <Grid item xs={12} lg={8}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <DashboardCharts data={stats.booksData} />
              </Grid>
              <Grid item xs={12}>
                <RecentActivity items={stats.recentBooks} />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Sidebar (4/12) */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <QuickActions />
              </Grid>
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    minHeight: '260px'
                  }}
                >
                  <Box sx={{ zIndex: 2 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>System Update</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                      The library management system has been updated with enhanced security features and real-time user approval notifications.
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Version 2.4.0 • Updated April 2026
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      right: -30, 
                      top: -30, 
                      width: 140, 
                      height: 140, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      zIndex: 1
                    }} 
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LibrarianDashboard;
