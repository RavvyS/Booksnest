import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';

const MyMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mats, cats] = await Promise.all([
        materialsApi.getMine(),
        categoriesApi.getAll()
      ]);
      setMaterials(mats);
      setCategories(cats);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await materialsApi.delete(id);
      setMessage({ text: 'Material deleted.', type: 'success' });
      fetchData();
    } catch (err) {
      setMessage({ text: 'Failed to delete material.', type: 'error' });
    }
  };

  const getStatusChip = (status) => {
    const config = {
      pending: { color: 'warning', label: 'Pending Review' },
      approved: { color: 'success', label: 'Approved' },
      rejected: { color: 'error', label: 'Rejected' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                         m.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" fontWeight="bold" color="primary">My Materials</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/author/upload?type=material')}
        >
          New Material
        </Button>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 4 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {/* Filters Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search my materials..."
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: 250 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Genre"
          >
            <MenuItem value="all">All Genres</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {materials.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'secondary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((m) => {
                  const materialId = m.id || m._id;
                  return (
                    <TableRow key={materialId} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">{m.title}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {m.description ? `${m.description.slice(0, 50)}...` : 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={m.categoryName || (m.category && m.category.name) || m.category || 'General'} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>{getStatusChip(m.status)}</TableCell>
                      <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => window.open(m.contentUrl, '_blank')}>
                          <LaunchIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" color="secondary" onClick={() => navigate(`/author/materials/${materialId}/edit`)}>
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(materialId)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No materials match your search filters.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2 }}>
          <Typography color="textSecondary">You haven't uploaded any materials yet.</Typography>
          <Button onClick={() => navigate('/author/upload?type=material')} sx={{ mt: 2 }} variant="outlined">
            Get Started Now
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default MyMaterialsPage;
