import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';

const AdminGuide = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        height: '100%',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Librarian Insights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Efficiency and accuracy are key to maintaining a high-quality digital library.
      </Typography>

      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TaskAltIcon color="primary" />
          <Box>
            <Typography fontWeight="bold">Prompt Material Review</Typography>
            <Typography variant="body2" color="text.secondary">
              Reviewing pending materials within 24 hours keeps the learning flow smooth for readers.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <InsightsIcon color="primary" />
          <Box>
            <Typography fontWeight="bold">Analyze Collection Gaps</Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor category distribution to identify which subjects need more resource contributions.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <SecurityIcon color="primary" />
          <Box>
            <Typography fontWeight="bold">User Security</Typography>
            <Typography variant="body2" color="text.secondary">
              Vetting new author registrations ensures the integrity and quality of our library contents.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          borderRadius: 3, 
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">System Status: Optimal</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          All services are running smoothly.
        </Typography>
      </Box>
    </Paper>
  );
};

export default AdminGuide;
