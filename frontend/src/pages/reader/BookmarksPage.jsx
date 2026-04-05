import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
import bookmarksApi from '../../api/bookmarksApi';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const data = await bookmarksApi.getAll();
      setBookmarks(data);
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await bookmarksApi.delete(id);
      setMessage({ text: 'Bookmark removed.', type: 'success' });
      fetchBookmarks();
    } catch (err) {
      setMessage({ text: 'Failed to remove bookmark.', type: 'error' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
        My Bookmarks
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Your saved learning materials and resources.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {bookmarks.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <List sx={{ p: 0 }}>
            {bookmarks.map((bookmark, index) => (
              <React.Fragment key={bookmark._id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        color="primary" 
                        onClick={() => window.open(bookmark.materialContentUrl, '_blank')}
                        sx={{ mr: 1 }}
                      >
                        <LaunchIcon />
                      </IconButton>
                      <IconButton edge="end" color="error" onClick={() => handleDelete(bookmark._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold">
                        {bookmark.materialTitle}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {bookmark.note && (
                          <Typography variant="body2" color="textPrimary" sx={{ mt: 1 }}>
                            Note: {bookmark.note}
                          </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                          Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/materials/${bookmark.materialId}`)} 
                          sx={{ mt: 1, p: 0 }}
                        >
                          View Details
                        </Button>
                      </Box>
                    }
                  />
                </ListItem>
                {index < bookmarks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2, border: '1px dashed #ccc' }}>
          <Typography variant="h6" color="textSecondary">
            You haven't bookmarked anything yet.
          </Typography>
          <Button component={navigate} onClick={() => navigate('/materials')} sx={{ mt: 2 }}>
            Explore Materials
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default BookmarksPage;
