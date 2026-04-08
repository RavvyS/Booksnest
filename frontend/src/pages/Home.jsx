import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import booksApi from '../api/booksApi';
import BookCard from '../components/BookCard';
import FreeBookCard from '../components/FreeBookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [freeBooks, setFreeBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freeLoading, setFreeLoading] = useState(true);
  const [classicBooks, setClassicBooks] = useState([]);
  const [classicLoading, setClassicLoading] = useState(true);

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

    const fetchFree = async () => {
      try {
        // Call Google Books API directly from the browser to avoid server-side IP rate limiting
        const response = await fetch(
          'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&filter=free-ebooks&maxResults=8'
        );
        if (!response.ok) {
          throw new Error('Google Books API error');
        }
        const data = await response.json();
        const books = (data.items || []).map((item) => {
          const info = item.volumeInfo;
          return {
            id: item.id,
            title: info.title || '',
            author: info.authors ? info.authors.join(', ') : 'Unknown Author',
            thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '',
            previewLink: info.previewLink || info.infoLink || '',
            description: info.description || '',
            rating: info.averageRating || 0,
          };
        });
        setFreeBooks(books);
      } catch (err) {
        console.error('Failed to fetch free books, using fallback data:', err);
        // Fallback data in case of 429 Rate Limit
        setFreeBooks([
          {
            id: "fallback-1",
            title: "Pride and Prejudice",
            author: "Jane Austen",
            thumbnail: "http://books.google.com/books/content?id=s1gVAAAAYAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            previewLink: "http://books.google.com/books?id=s1gVAAAAYAAJ&hl=&source=gbs_api",
            description: "A classic novel.",
            rating: 4.5
          },
          {
            id: "fallback-2",
            title: "Frankenstein",
            author: "Mary Wollstonecraft Shelley",
            thumbnail: "http://books.google.com/books/content?id=381uAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            previewLink: "http://books.google.com/books?id=381uAAAAMAAJ&hl=&source=gbs_api",
            description: "The story of Victor Frankenstein.",
            rating: 4.0
          },
          {
            id: "fallback-3",
            title: "Dracula",
            author: "Bram Stoker",
            thumbnail: "http://books.google.com/books/content?id=R-MTAAAAYAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            previewLink: "http://books.google.com/books?id=R-MTAAAAYAAJ&hl=&source=gbs_api",
            description: "The story of the infamous vampire.",
            rating: 4.0
          },
          {
            id: "fallback-4",
            title: "Gulliver's Travels",
            author: "Jonathan Swift",
            thumbnail: "http://books.google.com/books/content?id=iwkQAAAAYAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            previewLink: "http://books.google.com/books?id=iwkQAAAAYAAJ&hl=&source=gbs_api",
            description: "A classic satire.",
            rating: 4.0
          }
        ]);
      } finally {
        setFreeLoading(false);
      }
    };

    const fetchClassics = async () => {
      try {
        const response = await fetch('https://openlibrary.org/search.json?q=subject:fiction&limit=8');
        if (!response.ok) throw new Error('Open Library API error');
        const data = await response.json();
        
        const books = (data.docs || []).slice(0, 8).map(doc => ({
          id: doc.key,
          title: doc.title,
          author: doc.author_name ? doc.author_name.join(', ') : 'Unknown Author',
          thumbnail: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : 'https://via.placeholder.com/400x600?text=No+Cover',
          previewLink: `https://openlibrary.org${doc.key}`,
          description: 'A classic read from Open Library.',
          rating: 4.5
        }));
        setClassicBooks(books);
      } catch (err) {
        console.error('Failed to fetch classics', err);
      } finally {
        setClassicLoading(false);
      }
    };

    fetchFeatured();
    fetchFree();
    fetchClassics();
  }, []);

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 7, md: 9 },
          mb: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #043A82 0%, #0653B8 50%, #0093E9 100%)',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="Digital Library"
            sx={{
              mb: 2,
              bgcolor: 'rgba(255,255,255,0.14)',
              color: 'white',
              fontWeight: 700,
            }}
          />
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
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Featured Books
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hand-picked library titles available inside Book Nest.
              </Typography>
            </Box>
            <Button component={Link} to="/books" variant="outlined">
              View All
            </Button>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {books.length > 0 ? (
              books.map((book) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={book._id || book.id}>
                  <BookCard book={book} />
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Typography variant="body1" align="center" color="textSecondary">
                  No books available at the moment. Check back later!
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* Free Collection Section */}
        <Box sx={{ pt: 4, mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(180deg, #ffffff 0%, #f7fcff 100%)',
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
              Free Collection
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Read open-access books from Google Books without leaving the learning flow.
            </Typography>
          </Paper>

          {freeLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {freeBooks.length > 0 ? (
                freeBooks.map((book, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`${book.id}-${index}`}>
                    <FreeBookCard book={book} />
                  </Grid>
                ))
              ) : (
                <Grid size={12}>
                  <Typography variant="body1" align="center" color="textSecondary">
                    Failed to load free collection. Please try again later.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>

        {/* Classics Collection Section */}
        <Box sx={{ pt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(180deg, #ffffff 0%, #fffaf3 100%)',
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 0.5 }}>
              Classics Collection
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore timeless public-domain reads from Open Library.
            </Typography>
          </Paper>

          {classicLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {classicBooks.length > 0 ? (
                classicBooks.map((book, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`classic-${book.id}-${index}`}>
                    <FreeBookCard book={book} />
                  </Grid>
                ))
              ) : (
                <Grid size={12}>
                  <Typography variant="body1" align="center" color="textSecondary">
                    Failed to load classics collection. Please try again later.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
