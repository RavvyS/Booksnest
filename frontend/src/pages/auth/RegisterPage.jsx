import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import authApi from '../../api/authApi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reader',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
            Create an Account
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Join the Book Nest community today.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              variant="outlined"
              margin="normal"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel>User Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="User Role"
              >
                <MenuItem value="reader">Reader / Student</MenuItem>
                <MenuItem value="author">Author / Educator</MenuItem>
                <MenuItem value="librarian">Librarian / Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button component={Link} to="/login" color="primary" sx={{ fontWeight: 'bold' }}>
                Login Here
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
