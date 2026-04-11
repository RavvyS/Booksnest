import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';
import { useAuth } from '../../context/AuthContext';

const MaterialFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentUrl: '',
    category: '',
    author: user?.name || '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catData = await categoriesApi.getAll();
        setCategories(catData);

        if (isEditMode) {
          const matData = await materialsApi.getById(id);
          setFormData({
            title: matData.title,
            description: matData.description || '',
            contentUrl: matData.contentUrl,
            category: matData.category || '',
            author: matData.author,
          });
        }
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchInitialData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await materialsApi.update(id, formData);
      } else {
        await materialsApi.create(formData);
      }
      navigate('/author/materials');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save material.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          {isEditMode ? 'Edit Material' : 'Upload New Material'}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {isEditMode ? 'Update the details of your contribution.' : 'Share a new resource with the digital library community.'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resource Title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to Quantum Physics"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly explain what this resource covers..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                  ))}
                  {categories.length === 0 && <MenuItem value="General">General</MenuItem>}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author Display Name"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content URL / Link"
                name="contentUrl"
                required
                value={formData.contentUrl}
                onChange={handleChange}
                placeholder="e.g., https://drive.google.com/file/..."
                helperText="Provide a direct link to the article, video or document."
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Saving...' : 'Save Material'}
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => navigate('/author/materials')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default MaterialFormPage;
