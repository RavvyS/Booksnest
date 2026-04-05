import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import commentsApi from '../api/commentsApi';

const CommentSection = ({ materialId, bookId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = async () => {
    try {
      const data = materialId 
        ? await commentsApi.getByMaterial(materialId)
        : await commentsApi.getByBook(bookId);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [materialId, bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentsApi.create({
        content: newComment,
        materialId,
        bookId,
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await commentsApi.delete(id);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await commentsApi.update(id, editContent);
      setEditingId(null);
      fetchComments();
    } catch (err) {
      console.error('Failed to update comment', err);
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {isAuthenticated ? (
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add a comment..."
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ bgcolor: 'white', mb: 2 }}
            />
            <Button variant="contained" type="submit" disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </form>
        </Paper>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Please login to join the conversation.
        </Typography>
      )}

      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment._id}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                {comment.userName?.[0] || 'U'}
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.userName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {editingId === comment._id ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Button size="small" onClick={() => handleUpdate(comment._id)}>Save</Button>
                        <Button size="small" color="inherit" onClick={() => setEditingId(null)}>Cancel</Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textPrimary">
                        {comment.content}
                      </Typography>
                    )}
                    
                    {(user?.id === comment.userId || user?.role === 'librarian') && (
                      <Box sx={{ mt: 1 }}>
                        <IconButton size="small" onClick={() => { setEditingId(comment._id); setEditContent(comment.content); }}>
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(comment._id)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CommentSection;
