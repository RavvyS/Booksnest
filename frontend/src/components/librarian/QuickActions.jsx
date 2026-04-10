import React from 'react';
import { Paper, Typography, Grid, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Add New Book', icon: <LibraryBooksIcon />, path: '/librarian/books', color: '#1a73e8' },
    { label: 'Create Category', icon: <CategoryIcon />, path: '/librarian/categories', color: '#34a853' },
    { label: 'Manage Users', icon: <PeopleIcon />, path: '/librarian/users', color: '#fbbc04' },
    { label: 'Review Materials', icon: <AddIcon />, path: '/librarian/pending', color: '#ea4335' },
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        bgcolor: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom color="textPrimary" textAlign="center">
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {actions.map((action, index) => (
          <Grid item xs={6} key={index}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{
                justifyContent: 'flex-start',
                py: 2,
                px: 2,
                borderRadius: 2,
                color: 'textPrimary',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                textTransform: 'none',
                fontWeight: 'medium',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.02)',
                  borderColor: action.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${action.color}22`
                }
              }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuickActions;
