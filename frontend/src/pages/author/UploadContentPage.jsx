import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import materialsApi from '../../api/materialsApi';
import booksApi from '../../api/booksApi';
import categoriesApi from '../../api/categoriesApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UploadContentPage = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine type from query param or existing data
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || 'book';
  
  const [contentType, setContentType] = useState(initialType);
  const [formData, setFormData] = useState({
    title: '',
    author: user?.name || '',
    description: '',
    categoryId: '',
    // Book specific
    isbn: '',
    type: 'book', // shelf type for books
    totalCopies: 1,
    // Material specific
    contentUrl: '',
    materialType: 'video',
  });

  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === 'edit');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await categoriesApi.getAll();
        setCategories(catData);

        if (mode === 'edit' && id) {
          // Check if we are editing a book or material based on URL path or state
          const isBook = location.pathname.includes('/books/');
          const api = isBook ? booksApi : materialsApi;
          const data = await api.getById(id);
          
          setContentType(isBook ? 'book' : 'material');
          
          // CRITICAL FIX: Extract ID if categoryId is an object (populated)
          const catId = data.categoryId?._id || data.categoryId?.id || data.categoryId || '';

          setFormData({
            title: data.title,
            author: data.author,
            description: data.description || '',
            categoryId: catId,
            isbn: data.isbn || '',
            type: data.type || 'book',
            totalCopies: data.totalCopies || 1,
            contentUrl: data.contentUrl || '',
            materialType: data.type || 'video',
          });
        }
      } catch (err) {
        setError('Failed to load details.');
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, mode, location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (contentType === 'book') {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('isbn', formData.isbn);
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('categoryId', formData.categoryId);
        data.append('totalCopies', formData.totalCopies);
        if (file) data.append('file', file);

        if (mode === 'edit') {
          await booksApi.update(id, formData); // Usually doesn't support file update via PUT in this project
          toast.success('Book updated successfully');
        } else {
          if (!file) throw new Error('PDF file is required for new books');
          await booksApi.create(data);
          toast.success('Book submitted for review');
        }
        navigate('/author/books');
      } else {
        // Material Submission
        const materialData = {
          title: formData.title,
          author: formData.author,
          description: formData.description,
          categoryId: formData.categoryId,
          contentUrl: formData.contentUrl,
          type: formData.materialType,
        };

        if (mode === 'edit') {
          // Essential fields for material update
          const updateData = {
            title: formData.title,
            author: formData.author,
            description: formData.description,
            categoryId: formData.categoryId,
            contentUrl: formData.contentUrl,
            type: formData.materialType,
          };
          await materialsApi.update(id, updateData);
          toast.success('Material updated successfully');
        } else {
          await materialsApi.create(materialData);
          toast.success('Material submitted for review');
        }
        // Redirect based on user role or original source
        if (user?.role === 'librarian') {
          navigate('/librarian/materials');
        } else {
          navigate('/author/materials');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save content');
      toast.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>Back</Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {mode === 'edit' ? 'Edit' : 'Upload'} {contentType === 'book' ? 'Book' : 'Learning Material'}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Title" name="title" required
                value={formData.title} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Author Display Name" name="author" required
                value={formData.author} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Category">
                  {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {contentType === 'book' ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="ISBN" name="isbn" required
                    value={formData.isbn} onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Book Type</InputLabel>
                    <Select name="type" value={formData.type} onChange={handleChange} label="Book Type">
                      <MenuItem value="book">General Book</MenuItem>
                      <MenuItem value="magazine">Magazine</MenuItem>
                      <MenuItem value="journal">Journal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {mode === 'create' && (
                  <Grid item xs={12}>
                    <Button
                      variant="outlined" component="label" fullWidth
                      startIcon={<CloudUploadIcon />} sx={{ py: 1.5, borderStyle: 'dashed' }}
                    >
                      {file ? file.name : 'Upload PDF File'}
                      <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
                    </Button>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Material Type</InputLabel>
                    <Select name="materialType" value={formData.materialType} onChange={handleChange} label="Material Type">
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="audio">Audio</MenuItem>
                      <MenuItem value="article">Article / Link</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Content URL" name="contentUrl" required
                    value={formData.contentUrl} onChange={handleChange}
                    placeholder="e.g. https://youtube.com/..."
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth label="Description" name="description" multiline rows={4}
                value={formData.description} onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit" variant="contained" size="large" fullWidth
                disabled={loading} startIcon={<SaveIcon />}
              >
                {loading ? 'Processing...' : mode === 'edit' ? 'Update Content' : 'Submit for Review'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadContentPage;
