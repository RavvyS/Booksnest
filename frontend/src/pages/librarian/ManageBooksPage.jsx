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
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  InputAdornment, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import booksApi from '../../api/booksApi';
import categoriesApi from '../../api/categoriesApi';
import borrowsApi from '../../api/borrowsApi';

const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    type: 'book',
    totalCopies: 1,
    availableCopies: 1,
    categoryId: '',
  });
  const [file, setFile] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Queue Management States
  const [queueDialogOpen, setQueueDialogOpen] = useState(false);
  const [selectedBookForQueue, setSelectedBookForQueue] = useState(null);
  const [queueData, setQueueData] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearchExternal = async () => {
    if (!searchText) return;
    setSearchLoading(true);
    try {
      const data = await booksApi.searchExternal(searchText);
      setSearchResults(data);
    } catch (err) {
      toast.error('Search failed. Try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    setFormData({
      ...formData,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description || '',
    });
    setSearchResults([]);
    setSearchText('');
  };

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleOpen = (book = null) => {
    setSearchResults([]);
    setSearchText('');
    setFile(null);
    if (book) {
      setEditId(book.id || book._id);
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description || '',
        type: book.type || 'book',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        categoryId: book.categoryId || '',
      });
    } else {
      setEditId(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        type: 'book',
        totalCopies: 1,
        availableCopies: 1,
        categoryId: '',
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
    try {
      await booksApi.delete(id);
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (err) {
      toast.error('Failed to delete book.');
    }
  };

  const handleBookPreview = async (id) => {
    try {
      toast.info('Loading preview...');
      const blob = await booksApi.read(id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updatePayload = {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          description: formData.description,
          type: formData.type,
          totalCopies: Number(formData.totalCopies),
          availableCopies: Number(formData.availableCopies),
          categoryId: formData.categoryId,
        };
        await booksApi.update(editId, updatePayload);
        toast.success('Book updated successfully!');
      } else {
        const payload = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== undefined && formData[key] !== null) {
            payload.append(key, formData[key]);
          }
        });
        if (file) payload.append('file', file);
        
        await booksApi.create(payload);
        toast.success('Book created successfully!');
      }
      setOpen(false);
      fetchBooks();
    } catch (err) {
      toast.error('Action failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenQueue = async (book) => {
    setSelectedBookForQueue(book);
    setQueueDialogOpen(true);
    setQueueLoading(true);
    try {
      const data = await borrowsApi.getBookQueue(book.id || book._id);
      setQueueData(data);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      setQueueLoading(false);
    }
  };

  const handleRemoveFromQueue = async (requestId) => {
    if (!window.confirm('Remove this user from the waitlist?')) return;
    try {
      await borrowsApi.adminCancelQueue(requestId);
      toast.success('Removed from waitlist');
      const data = await borrowsApi.getBookQueue(selectedBookForQueue.id || selectedBookForQueue._id);
      setQueueData(data);
    } catch (err) {
    }
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchText.toLowerCase()) ||
      b.author.toLowerCase().includes(searchText.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchText.toLowerCase());
      
    const matchesCategory = filterCategory === 'all' || b.categoryId === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

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

      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search items..."
          size="small"
          sx={{ flexGrow: 1 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category Filter</InputLabel>
          <MuiSelect
            value={filterCategory}
            label="Category Filter"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'secondary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ISBN</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((b) => {
              const bookId = b.id || b._id;
              return (
                <TableRow key={bookId}>
                  <TableCell>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      onClick={() => navigate(`/books/${bookId}`)}
                      sx={{ 
                        cursor: 'pointer', 
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {b.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{b.author}</TableCell>
                  <TableCell>
                    <Chip 
                      label={b.categoryName || 'Uncategorized'} 
                      size="small" 
                      variant="outlined"
                      color={b.categoryName ? "primary" : "default"}
                    />
                  </TableCell>
                  <TableCell>{b.isbn}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color={b.status === 'approved' ? "success.main" : "warning.main"} fontWeight="bold">
                      {b.status?.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {b.availableCopies} avail / {b.totalCopies} tot
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Direct Read (PDF)">
                        <IconButton size="small" color="info" onClick={() => handleBookPreview(bookId)}>
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Waitlist">
                        <IconButton size="small" color="secondary" onClick={() => handleOpenQueue(b)}>
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" color="primary" onClick={() => handleOpen(b)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => {
                        if (window.confirm('Delete this book permanently?')) {
                          handleDelete(bookId);
                        }
                      }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
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
                <TextField 
                  fullWidth 
                  select 
                  label="Type" 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                >
                  <MenuItem value="book">Book</MenuItem>
                  <MenuItem value="magazine">Magazine</MenuItem>
                  <MenuItem value="journal">Journal</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Author" name="author" required value={formData.author} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="ISBN" name="isbn" required value={formData.isbn} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
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

      {/* Queue Management Dialog */}
      <Dialog 
        open={queueDialogOpen} 
        onClose={() => setQueueDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 'bold' }}>
          Waitlist Management: {selectedBookForQueue?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {queueLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : queueData.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pos</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Reader Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Joined Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queueData.map((req, idx) => (
                    <TableRow key={req.id || req._id}>
                      <TableCell>
                        <Chip label={`#${idx + 1}`} size="small" color={idx === 0 ? "primary" : "default"} />
                      </TableCell>
                      <TableCell fontWeight="bold">{req.userName}</TableCell>
                      <TableCell>{req.userEmail}</TableCell>
                      <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => handleRemoveFromQueue(req.id || req._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="textSecondary">No readers are currently waiting for this book.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setQueueDialogOpen(false)} variant="contained" color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBooksPage;
