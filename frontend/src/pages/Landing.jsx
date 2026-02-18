import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Grid, IconButton, Card, TextField } from '@mui/material';

import ScrollReveal from 'scrollreveal';
import Typed from 'typed.js';
import headerImage from '../assets/header3.png';
import aboutImage from '../assets/about8.png';

import LandingNavbar from '../components/LandingNavbar';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import Footer from '../components/Footer/Footer';

function Landing() {
  const imageRef = useRef(null);
  const typedRef = useRef(null);
  const iconsRef = useRef(null);
  const headingRef = useRef(null);
  const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
  const [bgColor, setBgColor] = useState('linear-gradient(135deg, #fff 40%, #0093E9 100%)'); // Default background color

  useEffect(() => {
    // Typing effect setup
    const typed = new Typed(typedRef.current, {
      strings: ['EFFICIANCY', 'SMARTLY', 'INNOVATION'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    });

    // ScrollReveal animations
    const scrollRevealOptions = {
      distance: '50px',
      origin: 'bottom',
      duration: 1000,
      opacity: 0, // Ensure elements are hidden initially
    };

    // Slide-in with Scale-Up effect for the image
    ScrollReveal().reveal('.header__image img', {
      ...scrollRevealOptions,
      origin: 'right', // Slide in from the right
      delay: 500, // Delay before animation starts
      distance: '150px', // Move the image from the right
      scale: 0.8, // Start the image at 80% of its size
      afterReveal: (el) => {
        el.style.transition = 'transform 1s ease-out, opacity 1s ease-out, scale 1s ease-out';
        el.style.opacity = 1; // Make the image fully visible
        el.style.transform = 'translateX(0)'; // Final position (no offset)
        el.style.scale = '1'; // Final scale (full size)
      },
    });

    // Fix for h3 fade-in effect (Ensure opacity starts at 0 and transitions to 1)
    ScrollReveal().reveal(headingRef.current, {
      ...scrollRevealOptions,
      delay: 500, // Delay before animation starts
      afterReveal: (el) => {
        el.style.transition = 'opacity 1s ease'; // Transition for opacity
        el.style.opacity = 1; // Ensure opacity reaches 1 after reveal
      },
    });

    // Reveal the paragraph and form after delays
    ScrollReveal().reveal('.header__content p', { ...scrollRevealOptions, delay: 1000 });
    ScrollReveal().reveal('.header__content form', { ...scrollRevealOptions, delay: 1500 });

    // Fade-in effect for social media icons
    ScrollReveal().reveal(iconsRef.current, {
      ...scrollRevealOptions,
      delay: 2000,
      afterReveal: (el) => {
        el.style.transition = 'opacity 1s ease';
        el.style.opacity = 1; // Make icons fade in
      },
    });

    return () => {
      typed.destroy(); // Cleanup the Typed.js instance on unmount
    };
  }, []);

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 20;
      const y = ((e.clientY - top) / height - 0.5) * 20;

      imageRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'translate(0, 0)';
    }
  };

  // change background color
  const handleRegisterClick = () => { 
    setButtonClicked(true); // Set the button clicked state
    setBgColor('linear-gradient(135deg, #fff 40%, #43A047 100%)'); 
    setTimeout(() => {
      setBgColor('linear-gradient(135deg, #fff 40%, #0093E9 100%)'); 
      setButtonClicked(false);
    }, 2000); 
  };

  

  return (
    <Box>
      {/* Navigation Section */}
      <LandingNavbar />

      {/* Header Section */}
      <Box
        sx={{
          background: bgColor, // Use dynamic background color from state
          padding: '71px 32px',
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{
            width: '100%',
            maxWidth: '1450px',
            margin: '0 auto',
          }}
        >
          {/* Text Content on the Left */}
          <Grid item xs={12} md={6} className="header__content">
            <Typography
              variant="h3"
              fontWeight="700"
              marginBottom="16px"
              ref={headingRef}  
              sx={{ opacity: 0 }} 
            >
              MANAGE YOUR LIBRARY WITH {'  '}
              <span ref={typedRef} style={{ color: '#6eb0ec' }}></span>.
            </Typography>
            <Typography variant="body1" marginBottom="32px" color="textSecondary">
              Our Library Management Platform is designed to simplify library operations, enhance the experience of book
              borrowing and returns, and foster seamless collaboration between librarians and readers. Whether you're
              managing a personal collection or overseeing a large institutional library, our platform adapts to meet
              your needs with innovative features and intuitive tools.
            </Typography>
            <Box component="form" display="flex" flexDirection="row" gap="16px">
              <Button variant="contained" color="primary" fullWidth>
                Get Started
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#43A047',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                  },
                }}
                onClick={handleRegisterClick} // Trigger the click handler
              >
                Register Now
              </Button>
            </Box>

            {/* Social Media Icons */}
            <Box
              ref={iconsRef}
              display="flex"
              justifyContent="center"
              marginTop="30px"
              opacity="0" 
            >
              <IconButton
                component="a"
                href="https://www.facebook.com/mithila.madushanka.37"
                target="_blank"
                aria-label="Facebook"
                sx={{ margin: '0 8px' }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://x.com/madhusankha_"
                target="_blank"
                aria-label="Twitter"
                sx={{ margin: '0 8px' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.youtube.com"
                target="_blank"
                aria-label="YouTube"
                sx={{ margin: '0 8px' }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/mithila_madhusankha"
                target="_blank"
                aria-label="Instagram"
                sx={{ margin: '0 8px' }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://github.com/NKDMMadhusankha"
                target="_blank"
                aria-label="GitHub"
                sx={{ margin: '0 8px' }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Image on the Right */}
          <Grid item xs={12} md={6}>
            <Box
              className="header__image"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={imageRef}
              sx={{
                perspective: '1000px',
                width: '100%',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              <img
                src={headerImage}
                alt="Header"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* second section */}
      <Box sx={{ padding: '50px 32px',  marginTop: "4rem" }}>
          <Grid container spacing={4} alignItems="center" sx={{ maxWidth: 'xl', margin: '0 auto' }}>
            
            {/* Right Section: Image */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={aboutImage}// Replace with your image URL
                  alt="About Us"
                  style={{
                    width: '75%',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            </Grid>

            {/* Left Section: About Us Text */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="700" marginBottom="16px">
                About Us
              </Typography>
              <Typography variant="body1" color="textSecondary"  >
                Welcome to Book Nest, your ultimate platform for hassle-free book reservations! At Book Nest, our goal is to provide a simple and efficient way for users to access and reserve books from our extensive library collection. Whether you're an avid reader or a casual explorer, we’ve designed our platform to make your reading journey as easy and enjoyable as possible.
                With just a few clicks, you can browse through our wide variety of books, check their availability, and reserve them directly on our platform. We strive to offer a seamless, user-friendly experience, allowing you to focus on discovering new reads without any of the hassle.
                At Book Nest, we’re committed to providing you with a secure and accessible platform to manage all your library needs. From making reservations to tracking your borrowed books, everything is conveniently organized in one place. 
              <Typography
              sx={{
                marginTop: '20px', // Adjust this value to move the text down
                color: '#0653B8', // Blue color (you can customize the shade)
              }}
              
              >
                Thank you for choosing Book Nest — your trusted library at your fingertips !</Typography>
               
              </Typography>

              <Button
              sx={{
                backgroundColor: "#0653B8", 
                color: "white", 
                marginTop: "30px",
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgb(7, 75, 139)',  // Adding a dim effect with transparency to #0960b1
                }
              }}
              >Read More</Button>
            </Grid>
          </Grid>
        </Box>



              {/* User Review Card Section */}
          <Box sx={{ padding: '50px 32px', marginTop: '4rem' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              marginLeft: { xs: '16px', sm: '32px', md: 'calc((100% - 1400px) / 2)' },
              marginRight: { xs: '16px', sm: '32px', md: 'calc((100% - 1450px) / 2)' },
            }}
          >
            <Typography variant="h3" fontWeight="700">
              What Our Users Say ...
            </Typography>

            <Button
              sx={{
                textTransform: 'none',
                fontWeight: '600',
                backgroundColor: "#fff",
                '&:hover': {
                  textDecoration: "underline",
                },
              }}
            >
              See All
            </Button>
          </Box>

            {/* First Row of Cards */}
            <Grid container spacing={4} sx={{ maxWidth: '1450px', margin: '0 auto', cursor:"pointer" }}>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Mizzaka
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “Great platform! Easy to use and very efficient.”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    01 Jan 2025
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Kasun 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “A fantastic tool for managing my library effortlessly.”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    15 Dec 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Dinoda 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “Saved me so much time with its seamless features!”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    10 Nov 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Mithila 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “Highly recommended for all book lovers!”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    05 Oct 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Milan 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “The best platform for organizing my book collection!”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    20 Sep 2024
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Second Row of Cards */}
            <Grid container spacing={4} sx={{ maxWidth: '1450px', margin: '0 auto', marginTop: '32px', cursor:"pointer" }}>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Ajith 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “Super helpful and easy to navigate!”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    12 Aug 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Raveena 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “I absolutely love using Book Nest!”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    08 Jul 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Amandi
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “I absolutely love using Book Nest!”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    08 Jul 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Kusal 
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “A must-have platform for readers.”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    25 May 2024
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <Box
                  sx={{
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" >
                    Jana
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginY="16px">
                    “An excellent resource for libraries.”
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    05 Apr 2024
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>


          {/* Adding Review Form */}
        <Box sx={{ padding: '50px 32px', marginTop: '5rem', backgroundColor:"black", marginBottom:"-10rem"}}>
          <Typography variant="h3" fontWeight="700" marginBottom="16px" textAlign="center" color='white'>
            Share Your Experience
          </Typography>

          <Typography variant="body1" color="white" marginBottom="32px" textAlign="center">
              We'd love to hear your feedback ! Please share your experience with Book Nest.
          </Typography>

          <Box component="form" sx={{ maxWidth: '600px', margin: '0 auto'}}>
            {/* User Name Field */}

            <TextField 
            sx={{
              backgroundColor:"#fff" , 
              borderRadius:"10px",
              
            }}
            fullWidth
            label="Email"
            variant='outlined'
            margin='normal'
            color='white'
            />

            <TextField sx={{backgroundColor:"#fff" , borderRadius:"10px"}}
            fullWidth
            label="Your Name"
            variant='outlined'
            margin='normal'
            color='white'
            />

            <TextField sx={{backgroundColor:"#fff" , borderRadius:"10px"}}
            fullWidth
            label="Your Review"
            variant='outlined'
            margin='normal'
            color='white'
            />

              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: '16px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    backgroundColor:"green"
                  },
                }}
                type="submit"
              >
                Submit Review
              </Button>
            

          </Box>
        </Box>
    
      <Footer />
    </Box>
  );
}

export default Landing;
