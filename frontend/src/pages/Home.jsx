import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import booksApi from '../api/booksApi';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const bookData = await booksApi.getAll();
        setBooks(bookData.slice(0, 4)); // Show top 4 as featured
      } catch (err) {
        console.error('Failed to fetch featured content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0653B8 0%, #0093E9 100%)',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to Book Nest
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your digital gateway to knowledge. Explore our curated collection of books and learning materials.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/books"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#f0f0f0' } }}
            >
              Browse Books
            </Button>
            <Button
              component={Link}
              to="/materials"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Learning Materials
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Books Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Featured Books
          </Typography>
          <Link to="/books" style={{ textDecoration: 'none' }}>
            <Typography variant="button" color="primary" fontWeight="bold">
              View All
            </Typography>
          </Link>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {books.length > 0 ? (
              books.map((book) => (
                <Grid item key={book._id} xs={12} sm={6} md={3}>
                  <BookCard book={book} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" align="center" color="textSecondary">
                  No books available at the moment. Check back later!
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;
