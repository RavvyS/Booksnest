import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';

const PasswordChangeForm = () => {
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setLoading(true);
    try {
      await authApi.changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
      toast.success("Password updated successfully!");
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Current Password"
        name="oldPassword"
        type="password"
        size="small"
        margin="dense"
        required
        value={passwords.oldPassword}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="New Password"
        name="newPassword"
        type="password"
        size="small"
        margin="dense"
        required
        value={passwords.newPassword}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        size="small"
        margin="dense"
        required
        value={passwords.confirmPassword}
        onChange={handleChange}
      />
      <Button
        type="submit"
        variant="contained"
        size="small"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={20} /> : "Update Password"}
      </Button>
    </Box>
  );
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: 'primary.main', 
            mx: 'auto', 
            mb: 3,
            fontSize: '3rem'
          }}
        >
          {user?.name?.[0] || <AccountCircleIcon sx={{ fontSize: '4rem' }} />}
        </Avatar>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {user?.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {user?.email}
        </Typography>

        <Box sx={{ mt: 2, mb: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            sx={{ borderRadius: 20, textTransform: 'capitalize', px: 3 }}
          >
            {user?.role}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Account Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography color="textSecondary">User ID:</Typography>
            <Typography fontWeight="medium">{user?.id}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography color="textSecondary">Member Since:</Typography>
            <Typography fontWeight="medium">January 2024</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Security
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Change your password to keep your account secure.
          </Typography>
          
          <PasswordChangeForm />
        </Box>

        <Button 
          fullWidth 
          variant="outlined" 
          color="error" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout Account
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
