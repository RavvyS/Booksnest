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
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../api/authApi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      login(data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: { xs: 4, md: 10 }, mb: 4 }}>
        <Paper 
          elevation={10} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold" color="primary" sx={{ letterSpacing: '-0.02em' }}>
            BookNest
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4, fontWeight: 'medium' }}>
            Welcome back! Please login to continue.
          </Typography>

          {error && (
            <Alert 
              severity={error.includes('pending') ? 'warning' : 'error'} 
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight="bold">
                {error.includes('pending') ? 'Account Pending Approval' : 'Login Failed'}
              </Typography>
              <Typography variant="body2">
                {error.includes('pending') 
                  ? 'Your account is currently being reviewed by a librarian. This typically takes about 24 hours. You will receive an email once it is approved.' 
                  : error}
              </Typography>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button component={Link} to="/forgot-password" size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                Forgot password?
              </Button>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 4, 
                mb: 2, 
                py: 1.8, 
                fontSize: '1.1rem', 
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(4, 58, 130, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 25px rgba(4, 58, 130, 0.35)',
                }
              }}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Login to Dashboard'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account yet?{' '}
              <Button component={Link} to="/register" color="primary" sx={{ fontWeight: 'bold', textTransform: 'none' }}>
                Join BookNest
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
