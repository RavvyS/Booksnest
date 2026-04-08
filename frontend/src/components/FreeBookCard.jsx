import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Rating,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const FreeBookCard = ({ book }) => {
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
        background: 'linear-gradient(180deg, #ffffff 0%, #fdfcff 100%)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 22px 40px -18px rgba(15, 23, 42, 0.35)',
          borderColor: 'secondary.light',
        },
      }}
    >
      <CardActionArea 
        href={book.previewLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          sx={{
            position: 'relative',
            px: 2,
            pt: 2,
            pb: 1,
            background: 'linear-gradient(180deg, #eef8ff 0%, #fcfdff 100%)',
          }}
        >
          <CardMedia
            component="img"
            image={book.thumbnail || 'https://via.placeholder.com/400x600?text=No+Preview'}
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
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Chip label="Free Access" color="secondary" size="small" variant="filled" />
            {book.rating > 0 && <Rating value={book.rating} readOnly size="small" precision={0.5} />}
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
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
            {book.author}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 'auto',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 42,
            }}
          >
            {book.description || 'Open this title to start reading online.'}
          </Typography>
          <Button 
            variant="contained" 
            size="small"
            fullWidth 
            endIcon={<OpenInNewIcon />}
            sx={{ mt: 2 }}
          >
            Read Free
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FreeBookCard;
