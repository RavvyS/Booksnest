import React from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';
import headerImage from '../assets/header3.png';
import aboutImage from '../assets/about8.png';

const features = [
  {
    title: 'Free Learning Access',
    description: 'Browse books and open learning resources without turning the platform into a maze.',
    icon: <PublicIcon />,
  },
  {
    title: 'Curated by Roles',
    description: 'Readers explore, authors contribute, and librarians keep quality high with approvals.',
    icon: <VerifiedIcon />,
  },
  {
    title: 'Built for Study Flow',
    description: 'Move from discovery to reading to bookmarking in a clean student-friendly experience.',
    icon: <SchoolIcon />,
  },
];

const stats = [
  { value: 'Free', label: 'public learning access' },
  { value: '3 Roles', label: 'secure role-based workflows' },
  { value: '1 Hub', label: 'books, materials, and community' },
];

export default function Landing() {
  return (
    <Box sx={{ bgcolor: '#f6f9fc' }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #031f4b 0%, #0653B8 48%, #39a0ff 100%)',
          color: 'white',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.14,
            background:
              'radial-gradient(circle at top left, #ffffff 0, transparent 28%), radial-gradient(circle at bottom right, #d8ecff 0, transparent 22%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 7, md: 11 } }}>
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                label="Web Digital Library"
                sx={{
                  mb: 2.5,
                  bgcolor: 'rgba(255,255,255,0.14)',
                  color: 'white',
                  fontWeight: 700,
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Typography variant="h1" sx={{ fontSize: { xs: '2.7rem', md: '4.5rem' }, lineHeight: 1.02, mb: 2 }}>
                Learn freely.
                <br />
                Read deeply.
                <br />
                Share better.
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.82)', maxWidth: 620, lineHeight: 1.7, mb: 3.5 }}
              >
                Booksnest brings free books, approved learning materials, and a contribution workflow together in one digital library built for students, educators, and librarians.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  component={Link}
                  to="/home"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#fff',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#eef5ff' },
                  }}
                >
                  Explore Library
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  Join as a Reader
                </Button>
              </Stack>

              <Grid container spacing={2}>
                {stats.map((stat) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'white',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: 560,
                  mx: 'auto',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -24,
                    right: -24,
                    width: 180,
                    height: 180,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.14)',
                    filter: 'blur(8px)',
                  }}
                />
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    p: 1.5,
                    borderRadius: 6,
                    bgcolor: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.16)',
                  }}
                >
                  <Box
                    component="img"
                    src={headerImage}
                    alt="Booksnest digital library hero"
                    sx={{
                      width: '100%',
                      display: 'block',
                      borderRadius: 5,
                      objectFit: 'cover',
                      maxHeight: { xs: 380, md: 520 },
                    }}
                  />
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    left: { xs: 12, md: -40 },
                    bottom: { xs: -18, md: 22 },
                    p: 2.2,
                    borderRadius: 4,
                    bgcolor: '#fff',
                    color: 'text.primary',
                    maxWidth: 220,
                    boxShadow: '0 24px 40px -24px rgba(15, 23, 42, 0.65)',
                  }}
                >
                  <Typography variant="overline" color="primary.main" fontWeight={700}>
                    Community Driven
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                    Authors contribute. Librarians verify. Readers discover trusted resources.
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
          {features.map((feature) => (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: 3.2,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    mb: 2,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 3,
                    bgcolor: '#e9f3ff',
                    color: 'primary.main',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={5} alignItems="center" sx={{ mb: { xs: 6, md: 8 } }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              src={aboutImage}
              alt="Students exploring free learning resources"
              sx={{
                width: '100%',
                display: 'block',
                borderRadius: 6,
                boxShadow: '0 30px 60px -34px rgba(15, 23, 42, 0.45)',
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Chip label="Why Booksnest" color="primary" variant="outlined" sx={{ mb: 2 }} />
            <Typography variant="h3" sx={{ mb: 2 }}>
              A better front door for free knowledge.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.9, mb: 2.5 }}>
              Instead of scattering resources across random links and folders, Booksnest organizes books, learning materials, categories, comments, and bookmarks into one clear platform. It gives students an easy place to learn while preserving a proper review flow for contributed content.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.9, mb: 3.5 }}>
              That means guests can explore freely, readers can engage with trusted content, authors can contribute meaningfully, and librarians can keep the system clean, structured, and safe.
            </Typography>

            <Grid container spacing={2.2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                  <LibraryBooksIcon color="primary" sx={{ mb: 1 }} />
                  <Typography fontWeight="bold" sx={{ mb: 0.5 }}>
                    Organized discovery
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categories, books, materials, and curated sections make exploration faster.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                  <GroupsIcon color="primary" sx={{ mb: 1 }} />
                  <Typography fontWeight="bold" sx={{ mb: 0.5 }}>
                    Role-based collaboration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Each user type has a clear purpose without compromising quality control.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4.5 },
            borderRadius: 5,
            background: 'linear-gradient(135deg, #fff8ec 0%, #eef7ff 100%)',
            border: '1px solid',
            borderColor: '#d8e6f7',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Start exploring the library today.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8 }}>
                Browse featured books, discover learning materials, or create an account to bookmark resources and be part of the Booksnest learning community.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.5}>
                <Button component={Link} to="/home" variant="contained" size="large">
                  Open Library
                </Button>
                <Button component={Link} to="/login" variant="outlined" size="large">
                  Sign In
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
