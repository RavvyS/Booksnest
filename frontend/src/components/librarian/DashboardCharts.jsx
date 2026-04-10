import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

const DashboardCharts = ({ data }) => {
  const COLORS = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9334e9', '#06b6d4'];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        bgcolor: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        height: '400px'
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom color="textPrimary" textAlign="center">
        Book Distribution by Category
      </Typography>
      <Box sx={{ width: '100%', height: '320px', mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              fontSize={12} 
              tick={{ fill: '#666' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              fontSize={12} 
              tick={{ fill: '#666' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
              }} 
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DashboardCharts;
