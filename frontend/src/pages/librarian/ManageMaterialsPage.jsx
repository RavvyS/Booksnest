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
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import materialsApi from '../../api/materialsApi';
import categoriesApi from '../../api/categoriesApi';
import { toast } from 'react-toastify';

const ManageMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materialsData, categoriesData] = await Promise.all([
        materialsApi.getAll(),
        categoriesApi.getAll()
      ]);
      setMaterials(materialsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch materials', err);
      toast.error('Failed to load materials catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material permanently?')) return;
    try {
      await materialsApi.delete(id);
      toast.success('Material deleted successfully.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete material.');
    }
  };

  const getStatusChip = (status) => {
    const config = {
      pending: { color: 'warning', label: 'Pending' },
      approved: { color: 'success', label: 'Approved' },
      rejected: { color: 'error', label: 'Rejected' },
    };
    const { color, label } = config[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  const filteredMaterials = materials.filter(m => {
    const searchLower = searchText.toLowerCase();
    const matchesSearch = 
      m.title.toLowerCase().includes(searchLower) ||
      m.author.toLowerCase().includes(searchLower);
      
    const matchesCategory = filterCategory === 'all' || m.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary">Manage Materials</Typography>
          <Typography variant="body1" color="textSecondary">
            Global catalog management for all learning materials.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/author/materials/create')}
          sx={{ px: 4, borderRadius: 2, fontWeight: 'bold' }}
        >
          Add New Material
        </Button>
      </Box>

      {/* Filters & Search */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search materials..."
          size="small"
          sx={{ flexGrow: 1, minWidth: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterCategory}
            label="Genre"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title & Author</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Genre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaterials.map((m) => (
              <TableRow key={m._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">{m.title}</Typography>
                  <Typography variant="body2" color="textSecondary">By {m.author}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={m.categoryName || 'General'} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>{getStatusChip(m.status)}</TableCell>
                <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="View Source">
                      <IconButton size="small" color="info" onClick={() => window.open(m.contentUrl, '_blank')}>
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Material">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => navigate(`/author/materials/${m._id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Material">
                      <IconButton size="small" color="error" onClick={() => handleDelete(m._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary">No materials found matching your filters.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageMaterialsPage;
