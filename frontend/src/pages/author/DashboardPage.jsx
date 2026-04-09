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
import AddIcon from '@mui/icons-material/Add';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsightsIcon from '@mui/icons-material/Insights';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useNavigate } from 'react-router-dom';
import materialsApi from '../../api/materialsApi';
import booksApi from '../../api/booksApi';

const AuthorDashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [materialsRaw, booksRaw] = await Promise.all([
          materialsApi.getMy(),
          booksApi.getMyBooks(),
        ]);
        
        const materials = Array.isArray(materialsRaw) ? materialsRaw : [];
        const books = Array.isArray(booksRaw) ? booksRaw : [];

        // Calculate Stats
        const allItems = [
          ...books.map(b => ({ ...b, itemType: 'Book' })),
          ...materials.map(m => ({ ...m, itemType: 'Material' }))
        ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setStats({
          total: allItems.length,
          approved: allItems.filter(i => i.status === 'approved').length,
          pending: allItems.filter(i => i.status === 'pending').length,
          rejected: allItems.filter(i => i.status === 'rejected').length,
        });

        setRecentItems(allItems.slice(0, 5)); // Show latest 5
      } catch (err) {
        console.error('Failed to fetch author stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'rejected') return 'error';
    return 'default';
  };

  const StatCard = ({ title, value, icon, accent, helper }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        height: '100%',
        background: `linear-gradient(180deg, #ffffff 0%, ${accent}12 100%)`,
        border: '1px solid #eee',
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header Banner */}
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
          label="Author Workspace"
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
            <Typography variant="h3" sx={{ mb: 1 }} fontWeight="bold">
              Welcome Back!
            </Typography>
            <Typography sx={{ maxWidth: 700, color: 'rgba(255,255,255,0.86)' }}>
              Track your submissions, monitor approval progress, and keep your library contributions organized in one place.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/author/upload?type=book')}
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#eef5ff' },
              }}
            >
              New Book
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/author/upload?type=material')}
              size="large"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              New Material
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Uploads"
            value={stats.total}
            icon={<LibraryBooksIcon />}
            accent="#0653B8"
            helper="All your submitted library items."
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircleIcon />}
            accent="#10B981"
            helper="Resources visible to readers."
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={<PendingIcon />}
            accent="#F59E0B"
            helper="Waiting for librarian review."
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<CancelIcon />}
            accent="#EF4444"
            helper="Items needing updates."
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Submissions */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Recent Submissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your latest content and their current review status.
                </Typography>
              </Box>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/author/books')}>
                Manage All
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {recentItems.length > 0 ? (
              <Box sx={{ display: 'grid', gap: 2 }}>
                {recentItems.map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    onClick={() => navigate(item.itemType === 'Book' ? `/books/${item.id}` : `/materials/${item.id}`)}
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 3, 
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: 'primary.main', bgcolor: '#f8fbff', transform: 'translateX(4px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Chip label={item.itemType} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} />
                          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                          {item.description?.slice(0, 100) || 'No description added yet.'}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Submitted on {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={item.status === 'approved' ? 'Published' : item.status === 'pending' ? 'In Review' : 'Rejected'}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 4, border: '1px dashed #ccc' }}>
                <Typography color="textSecondary">No recent activity detected.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Tips/Actions */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid #eee',
              background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Author Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Stay on top of your workflow with these quick tips.
            </Typography>

            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TaskAltIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Submit polished resources</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clear titles and strong descriptions help materials get approved faster.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <InsightsIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Monitor progress</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check pending items regularly and make updates when needed.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Navigation</Typography>
            <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
              <Button fullWidth variant="outlined" sx={{ borderRadius: 2 }} onClick={() => navigate('/author/books')}>
                Manage My Books
              </Button>
              <Button fullWidth variant="outlined" sx={{ borderRadius: 2 }} onClick={() => navigate('/author/materials')}>
                Manage My Materials
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthorDashboard;
