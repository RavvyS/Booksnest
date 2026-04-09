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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import booksApi from '../../api/booksApi';
import categoriesApi from '../../api/categoriesApi';
import { useAuth } from '../../context/AuthContext';

const BookFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    type: 'book',
    categoryId: '',
    totalCopies: 1,
  });
  const [file, setFile] = useState(null);
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
          const bookData = await booksApi.getById(id);
          setFormData({
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            description: bookData.description || '',
            type: bookData.type,
            categoryId: bookData.categoryId || '',
            totalCopies: bookData.totalCopies,
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (file) payload.append('file', file);

      if (isEditMode) {
        await booksApi.update(id, formData); // Usually update doesn't support file re-upload in simple logic
      } else {
        await booksApi.create(payload);
      }
      navigate('/author/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book.');
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
          {isEditMode ? 'Edit Book / Magazine' : 'Submit for Review'}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {isEditMode ? 'Update details' : 'Share your work with the digital library. Submissions must be approved by a librarian.'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., The Future of Web Development"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author Name"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN / Serial Number"
                name="isbn"
                required
                value={formData.isbn}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="book">Book</MenuItem>
                  <MenuItem value="magazine">Magazine</MenuItem>
                  <MenuItem value="journal">Journal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              />
            </Grid>
            {!isEditMode && (
              <Grid item xs={12}>
                <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Upload Book Content (PDF only)
                  </Typography>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </Box>
              </Grid>
            )}
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
                  {loading ? 'Submitting...' : 'Submit Book'}
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => navigate('/author/dashboard')}
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

export default BookFormPage;
