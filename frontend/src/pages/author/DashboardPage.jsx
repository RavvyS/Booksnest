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
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [materials, books] = await Promise.all([
          materialsApi.getMine(),
          booksApi.getMyBooks()
        ]);
        
        const allItems = [...materials, ...books];

        setStats({
          total: allItems.length,
          approved: allItems.filter((i) => i.status === 'approved').length,
          pending: allItems.filter((i) => i.status === 'pending').length,
          rejected: allItems.filter((i) => i.status === 'rejected').length,
        });
        
        // Combine and sort recent items
        const combined = [
          ...materials.map(m => ({ ...m, type: 'material' })),
          ...books.map(b => ({ ...b, type: 'book' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setRecentMaterials(combined.slice(0, 5));
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
            <Typography variant="h3" sx={{ mb: 1 }}>
              Author Dashboard
            </Typography>
            <Typography sx={{ maxWidth: 700, color: 'rgba(255,255,255,0.86)' }}>
              Track your submissions, monitor approval progress, and keep your library contributions organized in one place.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/author/upload?type=book')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: '#eef5ff' },
              }}
            >
              Upload Book
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/author/upload?type=material')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Upload Material
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Uploads"
            value={stats.total}
            icon={<AutoStoriesIcon />}
            accent="#0653B8"
            helper="Everything you have submitted to the library."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircleIcon />}
            accent="#10B981"
            helper="Resources currently visible to readers and guests."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={<PendingIcon />}
            accent="#F59E0B"
            helper="Submissions waiting for librarian review."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={<CancelIcon />}
            accent="#EF4444"
            helper="Items that may need edits before resubmission."
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Recent Submissions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your latest materials and their current review status.
                </Typography>
              </Box>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/author/materials')}>
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {recentMaterials.length > 0 ? (
              <Box sx={{ display: 'grid', gap: 2 }}>
                {recentMaterials.map((item) => (
                  <Paper
                    key={item.id || item._id}
                    variant="outlined"
                    sx={{ p: 2.5, borderRadius: 3, borderColor: 'divider', position: 'relative' }}
                  >
                    <Chip 
                      label={item.type === 'book' ? 'Book' : 'Material'} 
                      size="small" 
                      variant="outlined" 
                      sx={{ position: 'absolute', top: 10, right: 10, fontSize: '0.6rem', height: 18 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mt: 1 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                          {item.description?.slice(0, 120) || 'No description added yet.'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.category?.name || item.category || 'General'} • {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  borderRadius: 4,
                  p: 5,
                  textAlign: 'center',
                  bgcolor: '#f8fbff',
                  border: '1px dashed #b8cff2',
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  No materials uploaded yet
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Start building your author profile by publishing your first book or learning resource.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="contained" onClick={() => navigate('/author/upload?type=book')}>
                    Upload Book
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/author/upload?type=material')}>
                    Upload Material
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              height: '100%',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Author Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Stay on top of your workflow with a quick review of what to do next.
            </Typography>

            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TaskAltIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Submit polished resources</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clear titles, working links, and strong descriptions help materials get approved faster.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <InsightsIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Monitor approval progress</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check pending and rejected items regularly so you can make updates when needed.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <AutoStoriesIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Grow your collection</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keep your profile active by adding valuable resources across multiple categories.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/author/upload?type=book')}
              >
                Upload New Book
              </Button>
              <Button
                variant="outlined"
                startIcon={<AutoStoriesIcon />}
                onClick={() => navigate('/author/books')}
              >
                Manage My Books
              </Button>
              <Button
                variant="outlined"
                startIcon={<InsightsIcon />}
                onClick={() => navigate('/author/materials')}
              >
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
