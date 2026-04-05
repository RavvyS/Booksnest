import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import booksApi from '../../api/booksApi';

const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
  });
  const [file, setFile] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const handleSearchExternal = async () => {
    if (!searchText) return;
    setSearchLoading(true);
    try {
      const data = await booksApi.searchExternal(searchText);
      setSearchResults(data);
    } catch (err) {
      setMessage({ text: 'Search failed. Try again.', type: 'error' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description || '',
      coverImage: book.thumbnail || '',
      totalCopies: 1,
      availableCopies: 1,
    });
    setSearchResults([]);
    setSearchText('');
  };

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpen = (book = null) => {
    setSearchResults([]);
    setSearchText('');
    if (book) {
      setEditId(book._id);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description || '',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
      });
    } else {
      setEditId(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        totalCopies: 1,
        availableCopies: 1,
      });
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.delete(id);
      setMessage({ text: 'Book deleted.', type: 'success' });
      fetchBooks();
    } catch (err) {
      setMessage({ text: 'Failed to delete book.', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await booksApi.update(editId, formData);
        setMessage({ text: 'Book updated!', type: 'success' });
      } else {
        const payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));
        if (file) payload.append('file', file);
        await booksApi.create(payload);
        setMessage({ text: 'Book created!', type: 'success' });
      }
      setOpen(false);
      fetchBooks();
    } catch (err) {
      setMessage({ text: 'Action failed.', type: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/librarian/dashboard')} sx={{ mb: 4 }}>
        Dashboard
      </Button>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color="primary">Manage Books</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add New Book
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'secondary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>
                  <Typography variant="body2" color={b.availableCopies > 0 ? "success.main" : "error.main"}>
                    {b.availableCopies} available / {b.totalCopies} total
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary" onClick={() => handleOpen(b)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(b._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            {!editId && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                  Auto-fill from Google Books
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by Title or ISBN..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchExternal())}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearchExternal} edge="end" disabled={searchLoading}>
                          {searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: searchResults.length > 0 ? 1 : 0 }}
                />
                
                {searchResults.length > 0 && (
                  <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', borderRadius: 1 }}>
                    <List dense>
                      {searchResults.map((res, idx) => (
                        <React.Fragment key={idx}>
                          <ListItem 
                            button 
                            onClick={() => handleSelectBook(res)}
                            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                          >
                            <ListItemAvatar>
                              <Avatar 
                                variant="rounded" 
                                src={res.thumbnail} 
                                sx={{ width: 32, height: 48 }}
                              >
                                <SearchIcon fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={res.title} 
                              secondary={res.author} 
                              primaryTypographyProps={{ noWrap: true, variant: 'body2', fontWeight: 'bold' }}
                              secondaryTypographyProps={{ noWrap: true, variant: 'caption' }}
                            />
                          </ListItem>
                          {idx < searchResults.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                )}
                <Divider sx={{ mt: 3, mb: 1 }} />
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Book Title" name="title" required value={formData.title} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Author" name="author" required value={formData.author} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="ISBN" name="isbn" required value={formData.isbn} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Total Copies" name="totalCopies" required value={formData.totalCopies} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Available Now" name="availableCopies" required value={formData.availableCopies} onChange={handleChange} />
              </Grid>
              {!editId && (
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>PDF Upload (Optional)</Typography>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageBooksPage;
