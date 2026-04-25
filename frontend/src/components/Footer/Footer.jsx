import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1E293B',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <AutoStoriesIcon color="primary" />
              <Typography variant="h5" color="white" fontWeight="bold">
                Booksnest
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, pr: 4 }}>
              Empowering communities with free access to digital books and community-driven learning materials. Explore, borrow, and contribute today.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'primary.main' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'primary.main' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'primary.main' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'primary.main' } }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 2.6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Explore
            </Typography>
            <Link href="/books" color="inherit" underline="hover" sx={{ display: 'block', mb: 1, color: '#94A3B8' }}>
              Digital Books
            </Link>
            <Link href="/materials" color="inherit" underline="hover" sx={{ display: 'block', mb: 1, color: '#94A3B8' }}>
              Learning Materials
            </Link>
            <Link href="/home" color="inherit" underline="hover" sx={{ display: 'block', mb: 1, color: '#94A3B8' }}>
              Featured Content
            </Link>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Community
            </Typography>
            <Link href="/register" color="inherit" underline="hover" sx={{ display: 'block', mb: 1, color: '#94A3B8' }}>
              Become a Member
            </Link>
            <Link href="/register" color="inherit" underline="hover" sx={{ display: 'block', mb: 1, color: '#94A3B8' }}>
              Upload Resources
            </Link>
            <Link href="/login" color="inherit" underline="hover" sx={{ display: 'block', mb: 1, color: '#94A3B8' }}>
              User Login
            </Link>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.8 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              Colombo, Sri Lanka
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              support@booksnest.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              +94 11 234 5678
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: '#334155' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
          <Typography variant="caption">
            &copy; {new Date().getFullYear()} Booksnest Digital Library. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" color="inherit" variant="caption" underline="hover">Privacy Policy</Link>
            <Link href="#" color="inherit" variant="caption" underline="hover">Terms of Service</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
