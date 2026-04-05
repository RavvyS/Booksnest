import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      <div className="h-48 bg-gray-200 relative overflow-hidden group">
        <img
          src={book.coverImageURL || "https://placehold.co/400x600?text=No+Cover"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${book.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {book.availableCopies > 0 ? "Available" : "Out of Stock"}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
            {book.category?.name || book.genre || "Book"}
          </span>
          <Link
            to={`/books/${book.id || book._id}`}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
