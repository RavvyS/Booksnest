import React, { useState, useEffect } from "react";
import api from "../../services/api";
import bookService from "../../services/bookService";
import { toast } from "react-toastify";

const ReaderDashboard = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await api.get("/borrows/my-borrows");
      setBorrows(response.data);
    } catch (error) {
      toast.error("Failed to fetch borrows");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await api.post(`/borrows/return/${bookId}`);
      toast.success("Book returned successfully");
      fetchBorrows();
    } catch (error) {
      toast.error(error.response?.data?.message || "Return failed");
    }
  };

  const handleRead = async (bookId) => {
    try {
      const { url } = await bookService.getReadLink(bookId);
      window.open(url, "_blank");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not open reader");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 border-b pb-2">My Borrowed Books</h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : borrows.length > 0 ? (
        <div className="overflow-hidden bg-white shadow sm:rounded-md border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {borrows.map((borrow, index) => (
              <li key={`${borrow.id || borrow._id || 'borrow'}-${index}`} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {borrow.bookId?.title?.[0] || "B"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{borrow.bookId?.title || "Unknown Book"}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(borrow.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!borrow.returned ? (
                    <>
                      <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded">Active</span>
                      <button
                        onClick={() => handleReturn(borrow.bookId?.id || borrow.bookId)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded transition-colors"
                      >
                        Return
                      </button>
                      <button
                        onClick={() => handleRead(borrow.bookId?.id || borrow.bookId)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded transition-colors"
                      >
                        Read
                      </button>
                    </>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded">Returned</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 italic">You haven't borrowed any books yet.</p>
        </div>
      )}
    </div>
  );
};

export default ReaderDashboard;
