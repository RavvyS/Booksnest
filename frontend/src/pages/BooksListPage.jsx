import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import booksApi from '../api/booksApi';
import categoriesApi from '../api/categoriesApi';
import BookCard from '../components/BookCard';

const BooksListPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, categoriesData] = await Promise.all([
          booksApi.getAll(),
          categoriesApi.getAll()
        ]);
        setBooks(booksData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase()) ||
      (b.categoryName && b.categoryName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || b.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom color="primary">
          Explore Books
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Discover high-quality books in our digital collection.
        </Typography>
      </Box>

      {/* Filters & Search */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          placeholder="Search books..."
          variant="outlined"
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', md: '50%' } }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Grid item key={book.id} xs={12} sm={6} md={3}>
                <BookCard book={book} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="textSecondary" sx={{ py: 8 }}>
                No books found matching your search.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default BooksListPage;
