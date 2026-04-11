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
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LinkIcon from '@mui/icons-material/Link';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
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
    type: 'video',
    categoryId: '',
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
            type: matData.type || 'video',
            categoryId: matData.categoryId || '',
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
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
      >
        Back
      </Button>

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
          label={isEditMode ? 'Update Existing Resource' : 'Author Submission'}
          sx={{
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.16)',
            color: 'white',
            fontWeight: 700,
          }}
        />
        <Typography variant="h3" sx={{ mb: 1 }}>
          {isEditMode ? 'Edit Learning Material' : 'Upload New Material'}
        </Typography>
        <Typography sx={{ maxWidth: 720, color: 'rgba(255,255,255,0.86)' }}>
          {isEditMode
            ? 'Refine the details of your resource before it reaches more readers.'
            : 'Share a trusted learning resource with the library. Your submission will appear publicly after librarian approval.'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Resource Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Complete the fields below so the librarian can review your submission quickly.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={12}>
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
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Briefly explain what this resource covers, who it is for, and why it is useful."
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Resource Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      label="Resource Type"
                    >
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="audio">Audio</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Genre</InputLabel>
                    <Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      label="Genre"
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                      ))}
                      {categories.length === 0 && <MenuItem value="General">General</MenuItem>}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Author Display Name"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Submission Status"
                    value={isEditMode ? 'Editable draft' : 'Pending review after submit'}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Content URL / Link"
                    name="contentUrl"
                    required
                    value={formData.contentUrl}
                    onChange={handleChange}
                    placeholder="e.g., https://drive.google.com/file/..."
                    helperText="Provide a direct link to the article, video, or document."
                  />
                </Grid>
                <Grid size={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large" 
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{ px: 4 }}
                    >
                      {loading ? 'Saving...' : isEditMode ? 'Update Material' : 'Submit Material'}
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
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              height: '100%',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Submission Checklist
            </Typography>

            <Box sx={{ display: 'grid', gap: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <AutoStoriesIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Clear title and summary</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Make it obvious what the resource teaches and who it helps.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <CategoryOutlinedIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Correct category and type</Typography>
                  <Typography variant="body2" color="text.secondary">
                    These help readers discover the resource more easily.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <LinkIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Working public link</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Double-check the URL before saving. Broken links will likely be rejected.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Review Flow
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              1. Author submits a material.
              <br />
              2. Librarian reviews the content.
              <br />
              3. Approved materials become visible to guests and readers.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MaterialFormPage;
