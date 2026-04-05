import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookService from "../services/bookService";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import { toast } from "react-toastify";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    if (!id || id === "undefined") {
      setLoading(false);
      return;
    }
    try {
      const data = await bookService.getBookById(id);
      setBook(data);
    } catch (error) {
      toast.error("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      toast.info("Please login to borrow books");
      navigate("/login");
      return;
    }
    try {
      await api.post(`/borrows/borrow/${id}`);
      toast.success("Book borrowed successfully!");
      fetchBook(); // Refresh to update availability
    } catch (error) {
      toast.error(error.response?.data?.message || "Borrow failed");
    }
  };

  const handleRead = async () => {
    try {
      const { url } = await bookService.getReadLink(id);
      window.open(url, "_blank");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not open reader");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) return <div className="text-center mt-20">Book not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="md:w-1/3 bg-gray-100 relative group overflow-hidden">
            <img
              src={book.coverImageURL || "https://placehold.co/400x600?text=No+Cover"}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
               <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${book.availableCopies > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                 {book.availableCopies > 0 ? "In Stock" : "Out of Stock"}
               </span>
            </div>
          </div>
          <div className="md:w-2/3 p-10 space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">{book.title}</h1>
              <p className="text-2xl font-medium text-blue-600 italic">By {book.author}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</span>
                <span className="text-lg font-semibold text-gray-900">{book.category?.name || book.genre || "General"}</span>
              </div>
              <div className="flex flex-col border-l pl-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ISBN</span>
                <span className="text-lg font-semibold text-gray-900 font-mono">{book.isbn}</span>
              </div>
              <div className="flex flex-col border-l pl-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Availability</span>
                <span className="text-lg font-semibold text-gray-900">{book.availableCopies} / {book.totalCopies}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900">Summary</h3>
              <p className="text-gray-600 leading-loose text-lg font-serif italic">
                {book.description || "No description available for this title."}
              </p>
            </div>

            <div className="pt-8">
              {user?.role === "reader" || !user ? (
                <button
                  onClick={handleBorrow}
                  disabled={book.availableCopies <= 0}
                  className={`w-full md:w-auto px-12 py-4 rounded-xl font-black text-xl tracking-wide transition-all shadow-xl ${book.availableCopies > 0 ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-2xl" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  {book.availableCopies > 0 ? "BORROW THIS BOOK" : "NOT AVAILABLE"}
                </button>
              ) : (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                   <p className="text-amber-800 font-medium">Borrowing is only available for Readers.</p>
                </div>
              )}

              {/* READ NOW Button (only if currently borrowed) */}
              {user?.role === "reader" && book.isBorrowedByUser && (
                <button
                  onClick={handleRead}
                  className="mt-4 w-full md:w-auto px-12 py-4 rounded-xl font-black text-xl tracking-wide bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl transition-all hover:shadow-2xl flex items-center justify-center space-x-2"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>READ NOW</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetail;
