import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Rating,
  Button
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const FreeBookCard = ({ book }) => {
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
        href={book.previewLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height="280"
          image={book.thumbnail || 'https://via.placeholder.com/400x600?text=No+Preview'}
          alt={book.title}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
        <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Typography variant="overline" color="primary" fontWeight="bold">
              Free E-Book
            </Typography>
            {book.rating > 0 && <Rating value={book.rating} readOnly size="small" precision={0.5} />}
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
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth 
            endIcon={<OpenInNewIcon />}
            sx={{ mt: 1 }}
          >
            Read Free
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FreeBookCard;
