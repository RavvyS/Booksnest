import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Base URL for backend static files if needed
  const baseUrl = 'http://localhost:8070';
  
  // Resolve image source
  const imageSrc = book.coverImage 
    ? (book.coverImage.startsWith('http') ? book.coverImage : `${baseUrl}/${book.coverImage}`)
    : `https://images.unsplash.com/photo-1543004471-24b9a3dc73ef?q=80&w=400&auto=format&fit=crop&sig=${book._id || 'default'}`;

  return (
    <Card 
      sx={{ 
        height: '460px', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.3)',
        },
      }}
    >
      <CardActionArea 
        onClick={() => navigate(`/books/${book._id}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height="280"
          image={imageSrc}
          alt={book.title}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
        <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={book.availableCopies > 0 ? 'Available' : 'Out of Stock'} 
              color={book.availableCopies > 0 ? 'success' : 'error'} 
              size="small" 
              variant="outlined" 
            />
            {book.availableCopies > 0 && (
              <Typography variant="caption" color="textSecondary">
                {book.availableCopies} left
              </Typography>
            )}
          </Box>
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
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {book.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap sx={{ mb: 'auto' }}>
            {book.author}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookCard;
