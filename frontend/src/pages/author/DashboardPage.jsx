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
import AddIcon from '@mui/icons-material/Add';
import libraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useNavigate } from 'react-router-dom';
import materialsApi from '../../api/materialsApi';

const AuthorDashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await materialsApi.getAll();
        // In a real app, the API should return only the author's materials
        // or a separate stats endpoint should be used.
        setStats({
          total: data.length,
          approved: data.filter(m => m.status === 'approved').length,
          pending: data.filter(m => m.status === 'pending').length,
        });
      } catch (err) {
        console.error('Failed to fetch author stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ p: 1.5, bgcolor: `${color}.light`, borderRadius: 1.5, color: `${color}.main` }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
        <Typography variant="body2" color="textSecondary">{title}</Typography>
      </Box>
    </Paper>
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary">Author Dashboard</Typography>
          <Typography variant="body1" color="textSecondary">Manage your contributions to the digital library.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/author/materials/create')}
          size="large"
        >
          Upload Material
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Uploads" value={stats.total} icon={<libraryBooksIcon />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Approved" value={stats.approved} icon={<CheckCircleIcon />} color="success" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending Review" value={stats.pending} icon={<PendingIcon />} color="warning" />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Ready to share your knowledge?
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Upload articles, research, or resources to help others in the community.
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/author/materials')}
        >
          View My Materials
        </Button>
      </Box>
    </Container>
  );
};

export default AuthorDashboard;
