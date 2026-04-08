import React, { useMemo } from 'react';
import { Box, Typography, Card, Grid, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TimelineIcon from '@mui/icons-material/Timeline';

const BookmarkAnalytics = ({ bookmarks = [] }) => {
  const analyticsData = useMemo(() => {
    // Basic stats
    const total = bookmarks.length;
    
    // Type breakdown
    let materialCount = 0;
    let bookCount = 0;
    
    // Recent count
    let recentCount = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    bookmarks.forEach(b => {
      const type = b.itemType || 'material';
      if (type === 'book') bookCount++;
      else materialCount++;
      
      const createdDate = new Date(b.createdAt);
      if (createdDate >= sevenDaysAgo) {
        recentCount++;
      }
    });

    const mostUsedType = total === 0 ? 'N/A' : (materialCount >= bookCount ? 'Materials' : 'Books');

    const barData = [
      { name: 'Materials', count: materialCount },
      { name: 'Books', count: bookCount }
    ];

    // Grouping by date for line chart
    const groupedByRealDate = {};
    bookmarks.forEach(b => {
       const cd = new Date(b.createdAt);
       const yyyy = cd.getFullYear();
       const mm = String(cd.getMonth() + 1).padStart(2, '0');
       const dd = String(cd.getDate()).padStart(2, '0');
       const key = `${yyyy}-${mm}-${dd}`;
       groupedByRealDate[key] = (groupedByRealDate[key] || 0) + 1;
    });

    const lineData = Object.keys(groupedByRealDate)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(key => {
        const d = new Date(key);
        // Correct date off-by-one by keeping local time if using new Date("YYYY-MM-DD")
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: groupedByRealDate[key]
        };
      });

    return { total, mostUsedType, recentCount, barData, lineData };
  }, [bookmarks]);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Total Bookmarks Card */}
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2, display: 'flex', alignItems: 'center', p: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ bgcolor: 'rgba(63, 81, 181, 0.1)', color: '#3f51b5', p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
              <LibraryBooksIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight="bold">Total Bookmarks</Typography>
              <Typography variant="h5" fontWeight="bold">{analyticsData.total}</Typography>
            </Box>
          </Card>
        </Grid>
        
        {/* Most Used Type */}
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2, display: 'flex', alignItems: 'center', p: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ bgcolor: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0', p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
              <AssessmentIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight="bold">Most Used Type</Typography>
              <Typography variant="h5" fontWeight="bold">{analyticsData.mostUsedType}</Typography>
            </Box>
          </Card>
        </Grid>
        
        {/* Recently Added */}
        <Grid item xs={12} sm={4}>
          <Card elevation={1} sx={{ borderRadius: 2, display: 'flex', alignItems: 'center', p: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', p: 1.5, borderRadius: 2, mr: 2, display: 'flex' }}>
              <TimelineIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary" fontWeight="bold">Added (Last 7 Days)</Typography>
              <Typography variant="h5" fontWeight="bold">{analyticsData.recentCount}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" fontWeight="bold" color="textSecondary" sx={{ mb: 2 }}>
              Bookmarks by Type
            </Typography>
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={analyticsData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3f51b5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" fontWeight="bold" color="textSecondary" sx={{ mb: 2 }}>
              Bookmarks Over Time
            </Typography>
            {analyticsData.lineData.length > 0 ? (
              <Box sx={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <LineChart data={analyticsData.lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="count" stroke="#f50057" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#f50057', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary" variant="body2">No temporal data available.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookmarkAnalytics;
