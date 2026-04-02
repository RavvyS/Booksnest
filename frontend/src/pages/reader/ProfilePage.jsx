import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
            <Typography fontWeight="medium">January 2024</Typography> {/* Optional: Add actual date if available */}
          </Box>
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
