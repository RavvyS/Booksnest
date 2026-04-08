import React, { useEffect, useState, useMemo } from 'react';
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import bookmarksApi from '../../api/bookmarksApi';
import BookmarkEditModal from '../../components/BookmarkEditModal';
import BookmarkAnalytics from '../../components/BookmarkAnalytics';

// ─────────────────────────────────────────────────────────────────────────────
// HighlightText — wraps matched keyword in a yellow highlight span
// ─────────────────────────────────────────────────────────────────────────────
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <>{text}</>;
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} style={{ backgroundColor: '#fff59d', fontWeight: 'bold', borderRadius: 2 }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// filterBookmarks — pure function, no side-effects
// ─────────────────────────────────────────────────────────────────────────────
function filterBookmarks(bookmarks, { searchTerm, selectedCategory, typeFilter }) {
  let result = [...bookmarks];

  // 1. Real-time search on title and note
  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    result = result.filter(
      (b) =>
        (b.materialTitle && b.materialTitle.toLowerCase().includes(lower)) ||
        (b.note && b.note.toLowerCase().includes(lower))
    );
  }

  // 2. Category filter — uses the name stored on the bookmark
  if (selectedCategory && selectedCategory !== 'All Category') {
    result = result.filter((b) => b.category === selectedCategory);
  }

  // 3. Type filter — 'book' | 'material'
  if (typeFilter && typeFilter !== 'all') {
    result = result.filter((b) => (b.itemType || 'material') === typeFilter);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// sortBookmarks — pure function
// ─────────────────────────────────────────────────────────────────────────────
function sortBookmarks(bookmarks, sortOrder) {
  const sorted = [...bookmarks];
  sorted.sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'a-z':
        return (a.materialTitle || '').localeCompare(b.materialTitle || '');
      case 'z-a':
        return (b.materialTitle || '').localeCompare(a.materialTitle || '');
      default:
        return 0;
    }
  });
  return sorted;
}

// ─────────────────────────────────────────────────────────────────────────────
// Export Handlers
// ─────────────────────────────────────────────────────────────────────────────
const generatePDF = (data) => {
  const doc = new jsPDF();
  doc.text('My Bookmarks Report', 14, 15);
  
  doc.setFontSize(10);
  doc.text(`Total Bookmarks: ${data.length}`, 14, 25);
  
  if (data.length > 0) {
    const latestDate = new Date(Math.max(...data.map(b => new Date(b.createdAt).getTime())));
    doc.text(`Latest Bookmark Date: ${latestDate.toLocaleDateString()}`, 14, 30);
  }
  
  const tableColumn = ["Title", "Note", "Category", "Date Added"];
  const tableRows = [];
  
  data.forEach(bookmark => {
    const bookmarkData = [
      bookmark.materialTitle || 'N/A',
      bookmark.note || 'N/A',
      bookmark.category || 'N/A',
      new Date(bookmark.createdAt).toLocaleDateString()
    ];
    tableRows.push(bookmarkData);
  });
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
  });
  
  doc.save('bookmarks_report.pdf');
};

// ─────────────────────────────────────────────────────────────────────────────
// BookmarksPage
// ─────────────────────────────────────────────────────────────────────────────
const BookmarksPage = () => {
  // Raw data
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category options are derived directly from bookmarks.
  // Each bookmark already carries category from its material (e.g. 'Science', 'Mathematics').
  // No separate API call needed.

  const navigate = useNavigate();

  // Filter & sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortOrder, setSortOrder] = useState('newest');
  const [typeFilter, setTypeFilter] = useState('all');

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  // ── Fetch bookmarks from API ──
  const fetchBookmarks = async () => {
    try {
      const data = await bookmarksApi.getAll();
      setBookmarks(data);
    } catch (err) {
      toast.error('Failed to fetch bookmarks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── On mount: load bookmarks ──
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // ── Category dropdown list ──
  // Extracted dynamically from bookmarks — each bookmark.category comes from
  // the material's own category field (e.g. 'Science', 'Technology', 'Mathematics')
  const categoryOptions = useMemo(() => {
    const cats = bookmarks
      .map((b) => b.category)
      .filter(Boolean);                          // drop null / undefined
    const unique = [...new Set(cats)].sort();    // alphabetical, deduplicated
    return ['All Category', ...unique];
  }, [bookmarks]);

  // ── Apply filter + sort (memo for performance) ──
  const filteredBookmarks = useMemo(() => {
    const filtered = filterBookmarks(bookmarks, { searchTerm, selectedCategory, typeFilter });
    return sortBookmarks(filtered, sortOrder);
  }, [bookmarks, searchTerm, selectedCategory, typeFilter, sortOrder]);

  // ── Active filter count (for "Clear All" badge) ──
  const activeFilterCount = [
    searchTerm.trim() !== '',
    selectedCategory !== 'All Category',
    typeFilter !== 'all',
    sortOrder !== 'newest',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Category');
    setSortOrder('newest');
    setTypeFilter('all');
  };

  // ── CRUD handlers ──
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) return;
    try {
      await bookmarksApi.delete(id);
      toast.success('Bookmark deleted successfully!');
      fetchBookmarks();
    } catch {
      toast.error('Failed to delete bookmark.');
    }
  };

  const handleEditOpen = (bookmark) => {
    setSelectedBookmark(bookmark);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedBookmark(null);
  };

  const handleToggleFavorite = async (bookmark) => {
    // Optimistic update
    setBookmarks((prev) =>
      prev.map((b) => (b._id === bookmark._id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
    try {
      await bookmarksApi.update(bookmark._id, { isFavorite: !bookmark.isFavorite });
    } catch {
      // Revert on failure
      setBookmarks((prev) =>
        prev.map((b) => (b._id === bookmark._id ? { ...b, isFavorite: bookmark.isFavorite } : b))
      );
      toast.error('Failed to update favorite status');
    }
  };

  const handleToggleCompleted = async (bookmark) => {
    // Optimistic update
    setBookmarks((prev) =>
      prev.map((b) => (b._id === bookmark._id ? { ...b, isCompleted: !b.isCompleted } : b))
    );
    try {
      await bookmarksApi.update(bookmark._id, { isCompleted: !bookmark.isCompleted });
    } catch {
      // Revert on failure
      setBookmarks((prev) =>
        prev.map((b) => (b._id === bookmark._id ? { ...b, isCompleted: bookmark.isCompleted } : b))
      );
      toast.error('Failed to update completion status');
    }
  };

  const handleViewResource = async (bookmark) => {
    try {
      await bookmarksApi.update(bookmark._id, { lastViewed: new Date() });
      fetchBookmarks();
    } catch (e) {
      console.error(e);
    }
    window.open(bookmark.materialContentUrl, '_blank');
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const recentlyViewed = useMemo(() => {
    return bookmarks
      .filter(b => b.lastViewed)
      .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
      .slice(0, 3);
  }, [bookmarks]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>

      {/* ── Page Title & Actions ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            My Bookmarks
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Your saved learning materials and resources.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            startIcon={<PictureAsPdfIcon />} 
            onClick={() => generatePDF(filteredBookmarks)}
            disabled={filteredBookmarks.length === 0}
          >
            Download PDF
          </Button>
        </Stack>
      </Box>

      {/* ── Analytics Dashboard ── */}
      {bookmarks.length > 0 && <BookmarkAnalytics bookmarks={bookmarks} />}

      {/* ── Filter & Search Toolbar ── */}
      <Paper elevation={1} sx={{ p: 2.5, mb: 4, borderRadius: 2 }}>

        {/* Top row: label + active filters + clear */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="textSecondary">
            Search &amp; Filter
          </Typography>
          {activeFilterCount > 0 && (
            <>
              <Chip label={`${activeFilterCount} active`} size="small" color="primary" variant="outlined" />
              <Button size="small" onClick={clearAllFilters} sx={{ ml: 'auto !important', fontSize: '0.75rem' }}>
                Clear All
              </Button>
            </>
          )}
        </Stack>

        <Grid container spacing={2} alignItems="center">

          {/* 1. Search */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              id="bookmark-search"
              placeholder="Search bookmarks..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* 2. Category filter — populated from /categories API */}
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 3. Type filter */}
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="type-filter-label">Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="material">Materials</MenuItem>
                <MenuItem value="book">Books</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 4. Sort */}
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-order-label">Sort By</InputLabel>
              <Select
                labelId="sort-order-label"
                id="sort-order"
                value={sortOrder}
                label="Sort By"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="a-z">Title (A–Z)</MenuItem>
                <MenuItem value="z-a">Title (Z–A)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Results count */}
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1.5, display: 'block' }}>
          Showing {filteredBookmarks.length} of {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
        </Typography>
      </Paper>

      {/* ── Recently Viewed ── */}
      {recentlyViewed.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom color="textSecondary">
            Recently Viewed
          </Typography>
          <Grid container spacing={2}>
            {recentlyViewed.map(bookmark => (
              <Grid item xs={12} sm={4} key={`recent-${bookmark._id}`}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleViewResource(bookmark)}
                >
                  <Typography variant="subtitle2" noWrap fontWeight="bold">
                    {bookmark.materialTitle}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Viewed {new Date(bookmark.lastViewed).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ── Bookmark List ── */}
      {filteredBookmarks.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <List sx={{ p: 0 }}>
            {filteredBookmarks.map((bookmark, index) => (
              <React.Fragment key={bookmark._id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleFavorite(bookmark)}
                        title={bookmark.isFavorite ? "Remove from Favorites" : "Mark as Favorite"}
                        sx={{
                          color: bookmark.isFavorite ? '#FFD700' : 'action.active',
                          transition: 'all 0.3s ease',
                          transform: bookmark.isFavorite ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {bookmark.isFavorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color={bookmark.isCompleted ? "success" : "default"}
                        onClick={() => handleToggleCompleted(bookmark)}
                        title={bookmark.isCompleted ? "Mark Incomplete" : "Mark as Completed"}
                        sx={{
                          transition: 'all 0.3s ease',
                          transform: bookmark.isCompleted ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {bookmark.isCompleted ? <CheckCircleIcon fontSize="small" /> : <RadioButtonUncheckedIcon fontSize="small" />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleCopyLink(bookmark.materialContentUrl)}
                        title="Copy Link"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewResource(bookmark)}
                        title="Open Resource"
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleEditOpen(bookmark)}
                        title="Edit Bookmark"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(bookmark._id)}
                        title="Delete Bookmark"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  sx={{ 
                    py: 2, 
                    pr: { xs: 2, sm: 26 }, 
                    opacity: bookmark.isCompleted ? 0.7 : 1,
                    bgcolor: bookmark.isCompleted ? '#f0fdf4' : 'transparent',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        sx={{ 
                          lineHeight: 1.3,
                          textDecoration: bookmark.isCompleted ? 'line-through' : 'none'
                        }}
                      >
                        <HighlightText text={bookmark.materialTitle} highlight={searchTerm} />
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>

                        {/* Category chip — shows full category name */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 0.5 }}>
                          {bookmark.category ? (
                            <Chip
                              label={bookmark.category}          // full name e.g. "Mathematics"
                              size="small"
                              color="primary"
                              variant="filled"
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: 0.4,
                              }}
                            />
                          ) : (
                            <Chip
                              label="No Category"
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', color: 'text.disabled' }}
                            />
                          )}

                          {/* Type badge */}
                          <Chip
                            label={bookmark.itemType === 'book' ? 'Book' : 'Material'}
                            size="small"
                            color={bookmark.itemType === 'book' ? 'secondary' : 'info'}
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Stack>

                        {/* Note with search highlight */}
                        {bookmark.note && (
                          <Typography variant="body2" color="textPrimary" sx={{ mt: 0.5 }}>
                            <strong>Note:</strong>{' '}
                            <HighlightText text={bookmark.note} highlight={searchTerm} />
                          </Typography>
                        )}

                        {/* Date + View Details link */}
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="textSecondary">
                            Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                          </Typography>
                          <Button
                            size="small"
                            sx={{ p: 0, minWidth: 0, fontSize: '0.75rem' }}
                            onClick={() => navigate(`/materials/${bookmark.materialId}`)}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredBookmarks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: '#fafafa',
            borderRadius: 2,
            border: '1px dashed #ccc',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            {bookmarks.length === 0
              ? "You haven't bookmarked anything yet."
              : 'No bookmarks match your search criteria.'}
          </Typography>
          {bookmarks.length === 0 ? (
            <Button onClick={() => navigate('/materials')} sx={{ mt: 2 }}>
              Explore Materials
            </Button>
          ) : (
            <Button onClick={clearAllFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          )}
        </Paper>
      )}

      {/* ── Edit Modal ── */}
      <BookmarkEditModal
        open={editModalOpen}
        bookmark={selectedBookmark}
        onClose={handleEditClose}
        onSave={fetchBookmarks}
      />
    </Container>
  );
};

export default BookmarksPage;
