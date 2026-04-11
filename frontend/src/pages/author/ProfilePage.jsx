import React from 'react';
import ProfilePage from '../reader/ProfilePage';
import { Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AuthorProfile = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/author/dashboard')}>
          Author Dashboard
        </Button>
      </Box>
      <ProfilePage />
    </Container>
  );
};

export default AuthorProfile;
