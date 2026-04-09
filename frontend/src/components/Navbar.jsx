import React from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function ResponsiveAppBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

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
    handleCloseUserMenu();
    logout();
    navigate("/");
  };

  const getNavLinks = () => {
    const links = [
      { label: "Home", path: "/home" },
      { label: "Materials", path: "/materials" },
      { label: "Books", path: "/books" },
    ];

    if (!isAuthenticated) return links;

    if (user.role === "reader") {
      links.push(
        { label: "Bookmarks", path: "/reader/bookmarks" },
        { label: "Borrows", path: "/reader/borrows" }
      );
    } else if (user.role === "author") {
      links.push(
        { label: "Dashboard", path: "/author/dashboard" },
        { label: "My Materials", path: "/author/materials" },
        { label: "My Books", path: "/author/books" }
      );
    } else if (user.role === "librarian") {
      links.push(
        { label: "Dashboard", path: "/librarian/dashboard" },
        { label: "Pending Review", path: "/librarian/pending" },
        { label: "Manage Books", path: "/librarian/books" },
        { label: "Manage Categories", path: "/librarian/categories" }
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", textDecoration: "none" }}
          >
            <Box component="img" src={logo} alt="Logo" sx={{ height: 40, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontFamily: "'Montserrat Alternates', sans-serif",
                fontWeight: 700,
                color: "#0653B8",
              }}
            >
              Book Nest
            </Typography>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="primary">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {navLinks.map((link) => (
                <MenuItem key={link.path} onClick={() => { handleCloseNavMenu(); navigate(link.path); }}>
                  <Typography textAlign="center">{link.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{ my: 2, color: "#434343", display: "block", mx: 1 }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* User Section */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name}>{user?.name?.charAt(0) || 'U'}</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate(`/${user.role}/profile`); }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component={Link} to="/login" variant="outlined" color="primary">
                  Login
                </Button>
                <Button component={Link} to="/register" variant="contained" color="primary">
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
