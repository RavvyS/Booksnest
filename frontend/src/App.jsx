import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@mui/material';

// Public Pages
import Landing from './pages/Landing';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Home from './pages/Home';
import MaterialsListPage from './pages/MaterialsListPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import BooksListPage from './pages/BooksListPage';
import BookDetailPage from './pages/BookDetailPage';

// Reader Pages
import BookmarksPage from './pages/reader/BookmarksPage';
import BorrowsPage from './pages/reader/BorrowsPage';
import ReaderProfilePage from './pages/reader/ProfilePage';

// Author Pages
import AuthorDashboard from './pages/author/DashboardPage';
import MyMaterialsPage from './pages/author/MyMaterialsPage';
import MaterialFormPage from './pages/author/MaterialFormPage';
import AuthorProfilePage from './pages/author/ProfilePage';

// Librarian Pages
import LibrarianDashboard from './pages/librarian/DashboardPage';
import PendingMaterialsPage from './pages/librarian/PendingMaterialsPage';
import ManageBooksPage from './pages/librarian/ManageBooksPage';
import ManageCategoriesPage from './pages/librarian/ManageCategoriesPage';
import LibrarianProfilePage from './pages/librarian/ProfilePage';

import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/materials" element={<MaterialsListPage />} />
          <Route path="/materials/:id" element={<MaterialDetailPage />} />
          <Route path="/books" element={<BooksListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />

          {/* Reader Routes */}
          <Route element={<ProtectedRoute allowedRoles={['reader', 'author', 'librarian']} />}>
            <Route path="/reader/bookmarks" element={<BookmarksPage />} />
            <Route path="/reader/borrows" element={<BorrowsPage />} />
            <Route path="/reader/profile" element={<ReaderProfilePage />} />
          </Route>

          {/* Author Routes */}
          <Route element={<ProtectedRoute allowedRoles={['author', 'librarian']} />}>
            <Route path="/author/dashboard" element={<AuthorDashboard />} />
            <Route path="/author/materials" element={<MyMaterialsPage />} />
            <Route path="/author/materials/create" element={<MaterialFormPage />} />
            <Route path="/author/materials/:id/edit" element={<MaterialFormPage />} />
            <Route path="/author/profile" element={<AuthorProfilePage />} />
          </Route>

          {/* Librarian Routes */}
          <Route element={<ProtectedRoute allowedRoles={['librarian']} />}>
            <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
            <Route path="/librarian/pending" element={<PendingMaterialsPage />} />
            <Route path="/librarian/books" element={<ManageBooksPage />} />
            <Route path="/librarian/categories" element={<ManageCategoriesPage />} />
            <Route path="/librarian/profile" element={<LibrarianProfilePage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;