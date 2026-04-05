import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import bookService from "../services/bookService";
import categoryService from "../services/categoryService";
import BookCard from "../components/common/BookCard";
import Navbar from "../components/layout/Navbar";
import { toast } from "react-toastify";

const BookExplore = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setSelectedCategory(categoryParam || "all");
  }, [categoryParam]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, catsData] = await Promise.all([
        bookService.getAllBooks(selectedCategory === "all" ? "" : selectedCategory),
        categoryService.getAll(),
      ]);
      setBooks(booksData);
      setCategories(catsData);
    } catch (error) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic (Search only, Category is handled by server)
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <header className="bg-white shadow-sm border-b py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Books</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
              value={selectedCategory}
              onChange={(e) => {setSelectedCategory(e.target.value); setCurrentPage(1);}}
            >
              <option value="all">All Genres</option>
              {categories.map((cat, index) => (
                <option key={`${cat.id || cat._id || 'cat'}-${index}`} value={cat.id || cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentBooks.map((book, index) => (
                <BookCard key={`${book.id || book._id || 'book'}-${index}`} book={book} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={`page-${index}`}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100 border transition-all shadow-sm"}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="mt-2 text-xl font-medium text-gray-900">No books found</h2>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookExplore;
