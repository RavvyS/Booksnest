import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent, CardMedia, Typography, Grid, Box, Chip } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import categoryService from "../../services/categoryService";


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
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksData, catsData] = await Promise.all([
        bookService.getAllBooks(),
        categoryService.getAll(),
      ]);
      setBooks(booksData.slice(0, 7)); // Just show a few for "New Arrivals"
      setCategories(catsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 

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

      <div className="categories-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="categories-container">
          <div 
            className="category-chip all-chip"
            onClick={() => navigate('/books')}
          >
            All
          </div>
          {categories.map((cat) => (
            <div 
              key={cat.id || cat._id} 
              className="category-chip"
              onClick={() => navigate(`/books?category=${cat.id || cat._id}`)}
            >
              {cat.name}
            </div>
          ))}
        </div>
        <style>
          {`
            .categories-section {
              max-width: 1680px;
              margin: 2rem auto;
              padding: 0 2rem;
            }
            .section-title {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 1.5rem;
              color: #1a237e;
            }
            .categories-container {
              display: flex;
              gap: 1rem;
              overflow-x: auto;
              padding-bottom: 1rem;
              scrollbar-width: none;
            }
            .categories-container::-webkit-scrollbar {
              display: none;
            }
            .category-chip {
              padding: 0.8rem 1.5rem;
              background: white;
              border: 1px solid #e0e0e0;
              border-radius: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .category-chip:hover {
              background: #0c399b;
              color: white;
              border-color: #0c399b;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(12, 57, 155, 0.2);
            }
            .all-chip {
              background: #e8f0fe;
              color: #0c399b;
              border-color: #d2e3fc;
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
                <span style={{ fontWeight: 'bold' }}>{book.category?.name || book.genre || "General"}</span>
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
