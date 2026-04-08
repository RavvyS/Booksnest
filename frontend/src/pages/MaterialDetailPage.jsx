import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LaunchIcon from '@mui/icons-material/Launch';
import materialsApi from '../api/materialsApi';
import bookmarksApi from '../api/bookmarksApi';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { toast } from 'react-toastify';

const MaterialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchMaterialAndBookmark = async () => {
      try {
        const data = await materialsApi.getById(id);
        setMaterial(data);

        // Check if bookmarked
        if (isAuthenticated) {
          const allBookmarks = await bookmarksApi.getAll();
          const existing = allBookmarks.find(b => b.materialId === id);
          if (existing) {
            setIsBookmarked(true);
          }
        }
      } catch (err) {
        setError('Failed to load material details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterialAndBookmark();
  }, [id, isAuthenticated]);

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.info('Please login to bookmark this material');
      return;
    }

    if (isBookmarked) {
      toast.warning('This material is already bookmarked');
      return;
    }

    // Navigate to create page and pass material data
    navigate(`/reader/bookmarks/create/${id}`, { state: { material } });
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 10 }}><Alert severity="error">{error}</Alert></Container>;
  if (!material) return <Container sx={{ mt: 10 }}><Alert severity="info">Material not found.</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4 }}
      >
        Back to List
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Chip 
              label={material.category || 'General'} 
              color="primary" 
              variant="outlined" 
              size="small" 
              sx={{ mb: 1 }} 
            />
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {material.title}
            </Typography>
          </Box>
          <Button 
            variant={isBookmarked ? "contained" : "outlined"} 
            color="primary"
            onClick={handleBookmark}
            disabled={isBookmarked && isAuthenticated}
            startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isBookmarked && isAuthenticated ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </Box>

        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Published by <strong>{material.author}</strong> on {new Date(material.createdAt).toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {material.description}
        </Typography>

        <Box sx={{ bgcolor: '#f0f7ff', p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              Resource Link
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Access the full material via the link below.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            href={material.contentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            endIcon={<LaunchIcon />}
          >
            Open Resource
          </Button>
        </Box>
      </Paper>

      {/* Comments Section */}
      <CommentSection materialId={id} />
    </Container>
  );
};

export default MaterialDetailPage;
