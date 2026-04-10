import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { format } from 'date-fns';

const RecentActivity = ({ items }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        bgcolor: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom color="textPrimary" textAlign="center">
        Recent Activities
      </Typography>
      <List sx={{ mt: 1 }}>
        {items.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
            No recent activity recorded.
          </Typography>
        ) : (
          items.map((item, index) => (
            <React.Fragment key={item._id}>
              <ListItem alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 50 }}>
                  <Avatar sx={{ bgcolor: 'rgba(26, 115, 232, 0.1)', color: '#1a73e8' }}>
                    <LibraryBooksIcon size="small" />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Chip 
                        label="New Book" 
                        size="small" 
                        sx={{ fontSize: '0.7rem', height: 20, bgcolor: 'rgba(52, 168, 83, 0.1)', color: '#34a853', border: 'none' }} 
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="textSecondary" component="span">
                        Added {item.createdAt ? format(new Date(item.createdAt), 'MMM d, h:mm a') : 'Recently'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < items.length - 1 && <Divider component="li" sx={{ opacity: 0.5 }} />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default RecentActivity;
