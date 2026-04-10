import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import bookmarksApi from '../../api/bookmarksApi';
import materialsApi from '../../api/materialsApi';

const BookmarkCreatePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [material, setMaterial] = useState(location.state?.material || null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(!material);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // If material was not passed via state, fetch it
    const fetchMaterial = async () => {
      if (!material) {
        try {
          const data = await materialsApi.getById(id);
          setMaterial(data);
        } catch (error) {
          toast.error("Failed to load material details.");
          navigate('/materials');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMaterial();
  }, [id, material, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      toast.warning("Please enter a note for your bookmark.");
      return;
    }

    setSaving(true);
    try {
      await bookmarksApi.create({
        materialId: id,
        materialTitle: material.title,
        materialContentUrl: material.contentUrl,
        category: material.category || null,
        itemType: 'material',
        note: note.trim()
      });
      toast.success("Bookmark added successfully!");
      navigate('/reader/bookmarks');
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || err.response.data.error || "Failed to save bookmark.");
      } else {
        toast.error("Failed to save bookmark. It might already exist.");
      }
      console.error('Bookmark creation error:', err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Add Bookmark
        </Typography>
        
        <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            Material
          </Typography>
          <Typography variant="h6" fontWeight="medium">
            {material?.title}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Note"
            placeholder="Enter your note (e.g., Important Math formulas for exam)"
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 4 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={saving}
            >
              Save Bookmark
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BookmarkCreatePage;
