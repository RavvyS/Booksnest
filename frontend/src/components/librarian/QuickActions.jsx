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
    { label: 'Manage All Books', icon: <LibraryBooksIcon />, path: '/librarian/books', color: '#0653B8' },
    { label: 'Create Genre', icon: <CategoryIcon />, path: '/librarian/categories', color: '#10B981' },
    { label: 'Moderate Users', icon: <PeopleIcon />, path: '/librarian/users', color: '#6366F1' },
    { label: 'Pending Review', icon: <AddIcon />, path: '/librarian/pending', color: '#F59E0B' },
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        bgcolor: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom color="textPrimary">
        Quick Management
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {actions.map((action, index) => (
          <Grid item xs={12} key={index}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2.5,
                borderRadius: 3,
                color: 'text.primary',
                borderColor: 'divider',
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${action.color}08`,
                  borderColor: action.color,
                  transform: 'translateX(4px)',
                  boxShadow: `0 4px 12px ${action.color}11`
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
