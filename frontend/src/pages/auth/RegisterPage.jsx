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
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const { login } = useAuth();
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
      const data = await authApi.register(formData);
      if (data.token) {
        login(data.token);
        navigate('/home');
      } else {
        setError('success-pending');
      }
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

          {error === 'success-pending' ? (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">Registration Received!</Typography>
              <Typography variant="body2">
                Thank you for joining BookNest. Your account is now <strong>pending librarian approval</strong>.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                We typically review and approve registrations within <strong>24 hours</strong>. You will receive an email once you're ready to log in.
              </Typography>
            </Alert>
          ) : error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          )}

          {!error || error !== 'success-pending' ? (
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <FormControl fullWidth variant="outlined" margin="normal" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
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

              <Box sx={{ mt: 2, mb: 1, p: 2, bgcolor: 'rgba(4, 58, 130, 0.04)', borderRadius: 2, border: '1px dashed rgba(4, 58, 130, 0.2)' }}>
                <Typography variant="caption" color="textSecondary" display="block" align="center">
                  <strong>Note:</strong> All new accounts (except Librarians) require manual approval. 
                  Approval usually takes about <strong>24 hours</strong>.
                </Typography>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  py: 1.5, 
                  fontSize: '1.1rem', 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(4, 58, 130, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
              </Button>
            </form>
          ) : null}

          <Box sx={{ mt: error === 'success-pending' ? 0 : 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button component={Link} to="/login" color="primary" sx={{ fontWeight: 'bold', textTransform: 'none' }}>
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
