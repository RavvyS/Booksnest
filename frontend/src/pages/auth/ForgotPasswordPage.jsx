import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import authApi from '../../api/authApi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);
      setMessage(response.message || 'If an account exists with that email, a new password has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
            Forgot Password
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a new system-generated password.
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {!message && (
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
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send New Password'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button component={Link} to="/login" color="primary">
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
