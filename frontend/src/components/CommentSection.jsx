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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CommentSection = ({ materialId, bookId }) => {
  const { user, isAuthenticated } = useAuth();
  const canPostComments = isAuthenticated && user?.role === 'reader';
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [openWarning, setOpenWarning] = useState(false);

  const fetchComments = async () => {
    try {
      const data = materialId 
        ? await commentsApi.getByMaterial(materialId)
        : await commentsApi.getByBook(bookId);
      
      // Filter out comments where the user has been deleted (Unknown User)
      const validComments = data.filter(c => c.userId);
      setComments(validComments);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [materialId, bookId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setOpenWarning(true);
  };

  const handleConfirmPost = async () => {
    setOpenWarning(false);
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

      {canPostComments ? (
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
      ) : isAuthenticated ? (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Only readers can add comments.
        </Typography>
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
                {comment.userId?.name?.[0] || 'U'}
              </Avatar>
              <ListItemText
                primaryTypographyProps={{ component: 'div' }}
                secondaryTypographyProps={{ component: 'div' }}
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.userId?.name || 'Unknown User'}
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
                    
                    {(user?.id === comment.userId?._id || user?.role === 'librarian') && (
                      <Box sx={{ mt: 1 }}>
                        {user?.id === comment.userId?._id && (
                          <IconButton size="small" onClick={() => { setEditingId(comment._id); setEditContent(comment.content); }}>
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        )}
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

      {/* Community Policy Warning Dialog */}
      <Dialog
        open={openWarning}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenWarning(false)}
        aria-describedby="community-policy-warning"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: '450px'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main', fontWeight: 'bold' }}>
          <WarningAmberIcon color="error" />
          Community Policy Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="community-policy-warning" sx={{ color: 'text.primary', mb: 2 }}>
            By posting this comment, you agree to comply with our <strong>Community Violation Policy</strong>.
          </DialogContentText>
          <Box sx={{ bgcolor: 'rgba(211, 47, 47, 0.05)', p: 2, borderRadius: 2, border: '1px solid rgba(211, 47, 47, 0.2)' }}>
            <Typography variant="body2" color="error.dark" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <GavelIcon sx={{ fontSize: 20, mt: 0.3 }} />
              <span>
                Please maintain respectful communication. Any violation of our policies may result in 
                <strong> temporary or permanent account suspension (Permanent Ban)</strong>.
              </span>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={() => setOpenWarning(false)} color="inherit" sx={{ fontWeight: 'bold' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPost} 
            variant="contained" 
            color="error"
            sx={{ 
              fontWeight: 'bold',
              px: 3,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
            }}
          >
            I Understand & Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentSection;
