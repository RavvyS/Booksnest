import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigate hook
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import logo from "../assets/logo.png";

const pages = ["Home", "About", "Contribute", "Announcements"];
const loggedInActions = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate(); // Initialize navigate
  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu(); // Close the user menu
    localStorage.removeItem("authToken"); // Clear authentication token
    navigate("/login"); // Redirect to login form
  };


  const isLoggedIn = true;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "none", // Remove default MUI AppBar shadow
        borderBottom: "1px solid #e0e0e0", // Optional: Add a bottom border if needed
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          margin: 0,
          padding: '0 30px',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Library Logo"
            sx={{
              display: { xs: "none", md: "flex" },
              height: 40,
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "'Montserrat Alternates', sans-serif ",
              fontWeight: 700,
              letterSpacing: ".0rem",
              color: "#0653B8",
              textDecoration: "none",
            }}
          >
            Book Nest
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="#0653B8"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginLeft: "20px",
              gap: "16px",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                href={`/${page.toLowerCase()}`}
                sx={{ my: 2, color: "#434343", display: "block" }}
              >
                {page}
              </Button>
            ))}
            <Button
              href="/myshelf"
              sx={{
                my: 2,
                color: "#434343",
                display: "block",
                fontWeight: "bold",
                marginLeft: "auto",
                marginRight: "16px",
              }}
            >
              My Shelf
            </Button>

            
          </Box>

          {/* User Avatar */}
          {isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {loggedInActions.map((action) => (
                  <MenuItem
                    key={action}
                    onClick={
                      action === "Logout" ? handleLogout : handleCloseUserMenu
                    }
                  >
                    <Typography textAlign="center">{action}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
