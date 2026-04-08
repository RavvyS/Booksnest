import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import bookmarksApi from '../api/bookmarksApi';

const BookmarkEditModal = ({ open, bookmark, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setNote(bookmark.note || '');
    }
  }, [bookmark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await bookmarksApi.update(bookmark._id, { note });
      toast.success('Bookmark updated successfully');
      onSave(); // Refresh list in parent
      onClose(); // Close modal
    } catch (error) {
      console.error('Update failed:', error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Bookmark Note</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
            placeholder="Enter your updated note"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookmarkEditModal;
