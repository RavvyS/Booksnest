import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Base URL for backend static files if needed
  const baseUrl = 'http://localhost:8070';
  
  // Resolve image source
  const imageSrc = book.coverImage 
    ? (book.coverImage.startsWith('http') ? book.coverImage : `${baseUrl}/${book.coverImage}`)
    : `https://images.unsplash.com/photo-1543004471-24b9a3dc73ef?q=80&w=400&auto=format&fit=crop&sig=${book.id || 'default'}`;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 22px 40px -18px rgba(15, 23, 42, 0.35)',
          borderColor: 'primary.light',
        },
      }}
    >
      <CardActionArea 
        onClick={() => navigate(`/books/${book.id}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          sx={{
            position: 'relative',
            px: 2,
            pt: 2,
            pb: 1,
            background: 'linear-gradient(180deg, #eaf3ff 0%, #f8fbff 100%)',
          }}
        >
          <CardMedia
            component="img"
            image={imageSrc}
            alt={book.title}
            sx={{ 
              height: 260,
              width: '100%',
              objectFit: 'cover',
              borderRadius: 3,
              boxShadow: '0 14px 32px -18px rgba(15, 23, 42, 0.5)',
              transition: 'transform 0.45s ease',
              '&:hover': { transform: 'scale(1.03)' }
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
            <Chip 
              label={book.availableCopies > 0 ? 'Available' : 'Out of Stock'} 
              color={book.availableCopies > 0 ? 'success' : 'error'} 
              size="small" 
              variant="filled"
            />
            {book.categoryId?.name && (
              <Chip label={book.categoryId.name} size="small" variant="outlined" />
            )}
          </Stack>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            fontWeight="bold" 
            title={book.title}
            sx={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              lineHeight: 1.25,
              minHeight: 58,
              mb: 0.75
            }}
          >
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1.5 }}>
            {book.author}
          </Typography>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {book.availableCopies > 0 ? `${book.availableCopies} copies left` : 'Currently unavailable'}
            </Typography>
            <Typography variant="caption" color="primary.main" fontWeight={700}>
              View details
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookCard;
