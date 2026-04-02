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

  // Placeholder image for books without a cover
  const placeholderImage = 'https://images.unsplash.com/photo-1543004471-24b9a3dc73ef?q=80&w=1974&auto=format&fit=crop';

  return (
    <Card 
      sx={{ 
        maxWidth: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8,
        },
      }}
    >
      <CardActionArea 
        onClick={() => navigate(`/books/${book._id}`)}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <CardMedia
          component="img"
          height="240"
          image={placeholderImage} // In real app, use book.coverUrl if exists
          alt={book.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
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
          <Typography gutterBottom variant="h6" component="div" fontWeight="bold" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {book.author}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BookCard;
