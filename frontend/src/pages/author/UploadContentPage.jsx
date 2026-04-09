import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
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
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import booksApi from '../../api/booksApi';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';
import { useAuth } from '../../context/AuthContext';

const UploadContentPage = ({ mode = 'create' }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Default to 'book' if no type provided in URL
  const [contentType, setContentType] = useState(searchParams.get('type') || 'book');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: user?.name || '',
    // Book Specifics
    isbn: '',
    type: 'book', // book, magazine, journal
    categoryId: '',
    // Material Specifics
    contentUrl: '',
    materialCategory: '',
    materialType: 'video',
  });

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializePage = async () => {
      setFetching(true);
      setError('');
      
      try {
        // 1. Fetch Categories (Always needed)
        const catData = await categoriesApi.getAll();
        setCategories(catData);

        // 2. Determine and Fetch Edit Data
        if (mode === 'edit' && id) {
          const type = window.location.pathname.includes('/books/') ? 'book' : 'material';
          setContentType(type);
          
          let data;
          if (type === 'book') {
            data = await booksApi.getById(id);
            setFormData({
              title: data.title,
              description: data.description,
              author: data.author,
              isbn: data.isbn,
              type: data.type,
              categoryId: data.categoryId,
            });
          } else {
            data = await materialsApi.getById(id);
            setFormData({
              title: data.title,
              description: data.description,
              author: data.author,
              contentUrl: data.contentUrl,
              materialType: data.type,
              materialCategory: data.category,
            });
          }
        }
      } catch (err) {
        console.error('Failed to initialize upload/edit page', err);
        setError('Failed to load necessary data. Please try again.');
      } finally {
        setFetching(false);
      }
    };

    initializePage();
  }, [mode, id]);

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setContentType(newType);
      setError('');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    const isEdit = mode === 'edit';
    if (contentType === 'book' && !file && !isEdit) {
      setError('PDF Content file is required for new books.');
      return;
    }
    if (contentType === 'material' && !formData.contentUrl) {
      setError('Content URL is required for learning materials.');
      return;
    }

    setLoading(true);

    try {
      if (contentType === 'book') {
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('author', formData.author);
        payload.append('isbn', formData.isbn);
        payload.append('description', formData.description);
        payload.append('type', formData.type);
        payload.append('categoryId', formData.categoryId);
        payload.append('totalCopies', '1');
        payload.append('availableCopies', '1');
        if (file) payload.append('file', file);
        
        if (isEdit) {
          await booksApi.update(id, payload);
        } else {
          await booksApi.create(payload);
        }
        navigate('/author/books');
      } else {
        const materialPayload = {
          title: formData.title,
          description: formData.description,
          author: formData.author,
          contentUrl: formData.contentUrl,
          type: formData.materialType || 'video',
          category: formData.materialCategory || 'General',
        };
        if (isEdit) {
          await materialsApi.update(id, materialPayload);
        } else {
          await materialsApi.create(materialPayload);
        }
        navigate('/author/materials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit content.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/author/dashboard')} 
        sx={{ mb: 4 }}
      >
        Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          {mode === 'edit' ? (contentType === 'book' ? 'Edit Book Details' : 'Edit Material Details') : (contentType === 'book' ? 'Upload New Book' : 'Upload New Material')}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          {mode === 'edit' ? 'Update your submission details.' : "Contribute to the library's knowledge base. Your submission will be reviewed by a librarian."}
        </Typography>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <ToggleButtonGroup
            color="primary"
            value={contentType}
            exclusive
            onChange={handleTypeChange}
            aria-label="Content Type"
            fullWidth
            sx={{ bgcolor: '#fdfdfd' }}
          >
            <ToggleButton value="book" sx={{ py: 1.5 }}>
              <MenuBookIcon sx={{ mr: 1 }} /> Book / Periodical
            </ToggleButton>
            <ToggleButton value="material" sx={{ py: 1.5 }}>
              <LibraryBooksIcon sx={{ mr: 1 }} /> Learning Material
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Core Info */}
            <TextField
              fullWidth
              label="Resource Title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Modern Web Architecture"
            />

            {/* Classification: Guaranteed Full Row for each */}
            {contentType === 'book' ? (
              <>
                <FormControl fullWidth required>
                  <InputLabel id="type-label">Content Format (Book, Magazine, Journal)</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Content Format (Book, Magazine, Journal)"
                  >
                    <MenuItem value="book">Book</MenuItem>
                    <MenuItem value="magazine">Magazine</MenuItem>
                    <MenuItem value="journal">Journal</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel id="category-label">Choose Category / Subject Area</InputLabel>
                  <Select
                    labelId="category-label"
                    name="categoryId"
                    value={formData.categoryId || ""}
                    onChange={handleChange}
                    label="Choose Category / Subject Area"
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <MenuItem 
                          key={cat._id || cat.id || cat.name} 
                          value={cat._id || cat.id || cat.name}
                        >
                          {cat.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        Loading categories...
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <FormControl fullWidth required>
                  <InputLabel id="mat-type-label">Material format (Video, Audio)</InputLabel>
                  <Select
                    labelId="mat-type-label"
                    name="materialType"
                    value={formData.materialType || 'video'}
                    onChange={handleChange}
                    label="Material format (Video, Audio)"
                  >
                    <MenuItem value="video">Video Resource</MenuItem>
                    <MenuItem value="audio">Audio / Podcast</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth required>
                  <InputLabel id="mat-category-label">Material Learning Category</InputLabel>
                  <Select
                    labelId="mat-category-label"
                    name="materialCategory"
                    value={formData.materialCategory || ""}
                    onChange={handleChange}
                    label="Material Learning Category"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                    <MenuItem value="General">General</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            <TextField
              fullWidth
              label="Author Name"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
            />

            {contentType === 'book' && (
              <>
                <TextField
                  fullWidth
                  label="ISBN / Serial Number"
                  name="isbn"
                  required
                  value={formData.isbn}
                  onChange={handleChange}
                />
                
                <Box sx={{ p: 4, border: '2px dashed #90caf9', borderRadius: 3, textAlign: 'center', bgcolor: '#f1f8fe' }}>
                  <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">PDF Content Upload</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    The actual document must be uploaded to proceed.
                  </Typography>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                </Box>
              </>
            )}

            {contentType === 'material' && (
              <TextField
                fullWidth
                label="Content URL / Link"
                name="contentUrl"
                required
                value={formData.contentUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            )}

            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{ px: 8, py: 1.8, borderRadius: 2, fontWeight: 'bold' }}
              >
                {loading ? 'Finalizing...' : (mode === 'edit' ? 'Save Changes' : 'Publish Content')}
              </Button>
              <Button 
                variant="text" 
                size="large" 
                onClick={() => navigate('/author/dashboard')}
              >
                Go Back
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadContentPage;
