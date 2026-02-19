import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { Link } from "react-router-dom";


// Search bar styles
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '2rem',
  border: '2px solid rgb(12, 57, 155)',
  backgroundColor: '#fff',
  boxShadow: '0px 2px 4px rgba(20, 101, 194, 0.1)',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  width: '20rem',
  height: '2rem',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: 'rgb(12, 57, 155)',
  display: 'flex',
  alignItems: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#7f7f7f',
  fontSize: '0.9rem',
  flex: 1,
  '& .MuiInputBase-input': {
    width: '100%',
    height: '100%',
    padding: 0,
  },
}));

function MainHome() {


  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from the backend
    axios
      .get("http://localhost:5000/api/books") // Update with your API endpoint
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);
 

  const handleBookClick = (bookId) => {
    window.location.href = `/bookpreview/${bookId}`;
  };

  return (
    <>
      <div className="head-items">
        <h1>Good Morning</h1>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search by book name, Author, Subject" inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <style>
          {`
            .head-items {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 10vh;
              font-size: 5rem;
              max-width: 1680px;
              margin: 1rem auto;
              padding: 0 2rem;
            }

            h1 {
              margin: 0;
              font-size: 2rem;
              font-weight: bold;
              color: #333;
              margin-left: -20px
            }
          `}
        </style>
      </div>

      <div className="card-one">
        <h2 className="card-h2">New Arrivals</h2>
        <a className="show-btn" href="/showall">
          show all
        </a>

        <style>
          {`
            .card-one {
              max-width: 1680px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 1rem auto;
              padding: 0 1rem;
              gap: 1rem;
              flex-wrap: wrap;
            }

            .card-h2 {
              font-size: 1.5rem;
              font-family: 'inter', sans-serif;
              font-weight: normal;
              margin: 0;
              flex-shrink: 0;
            }

            .show-btn {
              padding: 0.5rem 1rem;
              text-decoration: none;
              font-family: 'Poppins', sans-serif;
              font-size: 1rem;
              flex-shrink: 0;
            }

            @media (max-width: 768px) {
              .card-one {
                flex-direction: column;
                align-items: flex-start;
              }

              .card-h2, .show-btn {
                margin-bottom: 0.5rem;
              }
            }
          `}
        </style>
      </div>

      {/* Cards Section */}
      <Grid container spacing={2} style={{ maxWidth: '1680px', margin: '1rem auto', gap:'70px' , marginTop:"30px"}}>
      {books.map((book, index) => (
        <div key={book._id}>
          <Grid item xs={6} sm={4} md={3} lg={1.714} key={index}>
            <Card
            onClick={() => handleBookClick(book._id)}
              sx={{
                height: '400px',
                width: '250px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(9, 96, 177, 0.11)',  
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', 
                  transform: 'scale(1.05)',  
                }

                
              }}
              className="card"
            >
              <CardMedia
                component="img"
                style={{
                  height: '180px',
                  width: 'auto',
                  margin: '0 auto',
                  paddingTop: '10px',
                }}
                image={book.coverImageURL || "/default-image.png"}
                alt={`Cover of ${book.title}`}
              />
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  style={{ fontWeight: 'bold', marginBottom: '10px' }}
                >
                   {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
              </CardContent>
              <div style={{ textAlign: 'left', padding: '10px'  }}>
                <span style={{ fontWeight: 'bold' }}>{book.genre}</span>
                <span style={{ fontWeight: 'normal', marginLeft:'70px' }}>{book.publishedYear}</span>
              </div>
            </Card>
          </Grid>
          
          </div>
        ))}
      </Grid>

      

      
    </>
  );
}

export default MainHome;
