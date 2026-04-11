import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import materialsApi from '../api/materialsApi';
import categoriesApi from '../api/categoriesApi';

const MaterialsListPage = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mats, cats] = await Promise.all([
          materialsApi.getAll({ categoryId: filterCategory || undefined }),
          categoriesApi.getAll()
        ]);
        setMaterials(mats);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterCategory]);

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom color="primary">
          Learning Materials
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Discover educational resources contributed by the community.
        </Typography>
      </Box>

      {/* Search and Filters Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search materials..."
          variant="outlined"
          sx={{ flexGrow: 1 }}
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Genre</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Genre"
          >
            <MenuItem value="">All Genres</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <Grid item key={material._id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                  <CardActionArea onClick={() => navigate(`/materials/${material._id}`)} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ mb: 1 }}>
                        <Chip 
                          label={material.categoryName || material.category || 'General'} 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ mb: 1, mr: 1 }} 
                        />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {material.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {material.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="caption" color="textSecondary">
                          By {material.author}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="textSecondary" sx={{ py: 8 }}>
                No materials found matching your search.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default MaterialsListPage;
