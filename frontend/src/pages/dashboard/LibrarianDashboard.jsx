import React, { useState, useEffect } from "react";
import bookService from "../../services/bookService";
import materialService from "../../services/materialService";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("books");
  const [loading, setLoading] = useState(true);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    isbn: "",
    categoryId: "",
    description: "",
    totalCopies: 1,
    file: null,
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, materialsData, catsData] = await Promise.all([
        bookService.getAllBooks(),
        materialService.getPending(),
        categoryService.getAll(),
      ]);
      setBooks(booksData);
      setPendingMaterials(materialsData);
      setCategories(catsData);
    } catch (error) {
      toast.error("Failed to load management data");
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setBookData({ ...bookData, file: files[0] });
    } else {
      setBookData({ ...bookData, [name]: value });
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        // Edit mode: Use plain object since file upload isn't handled in edit yet
        // If file needs updating, a different endpoint/logic might be needed
        await bookService.updateBook(editingBook.id || editingBook._id, {
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          categoryId: bookData.categoryId,
          description: bookData.description,
        });
        toast.success("Book updated successfully!");
      } else {
        // Create mode: Use FormData for file upload
        const formData = new FormData();
        Object.keys(bookData).forEach((key) => {
          formData.append(key, bookData[key]);
        });
        await bookService.createBook(formData);
        toast.success("Book added successfully!");
      }
      
      setIsAddingBook(false);
      setEditingBook(null);
      setBookData({ title: "", author: "", isbn: "", categoryId: "", description: "", totalCopies: 1, file: null });
      fetchData();
    } catch (error) {
      toast.error(editingBook ? "Failed to update book" : "Failed to add book");
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      categoryId: book.categoryId || (book.category?.id || book.category?._id) || "",
      description: book.description,
      totalCopies: book.totalCopies,
      file: null,
    });
    setIsAddingBook(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveMaterial = async (id, status) => {
    try {
      await materialService.approve(id, status);
      toast.success(`Material ${status}!`);
      fetchData();
    } catch (error) {
      toast.error("Process failed");
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(id);
        toast.success("Book deleted");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id || editingCategory._id, categoryFormData);
        toast.success("Category updated!");
      } else {
        await categoryService.create(categoryFormData);
        toast.success("Category created!");
      }
      setIsAddingCategory(false);
      setEditingCategory(null);
      setCategoryFormData({ name: "", description: "" });
      fetchData();
    } catch (error) {
      toast.error("Category operation failed");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({ name: category.name, description: category.description || "" });
    setIsAddingCategory(true);
    setActiveTab("categories");
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure? This might affect books in this category.")) {
      try {
        await categoryService.delete(id);
        toast.success("Category deleted");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("books")}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === "books" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Manage Books
        </button>
        <button
          onClick={() => setActiveTab("materials")}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === "materials" ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Review Materials ({pendingMaterials.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === "categories" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Manage Categories
        </button>
      </div>

      {activeTab === "books" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Library Catalog</h3>
            <button
              onClick={() => {
                setIsAddingBook(!isAddingBook);
                if (editingBook) setEditingBook(null);
                setBookData({ title: "", author: "", isbn: "", categoryId: "", description: "", totalCopies: 1, file: null });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-blue-700 transition"
            >
              {isAddingBook ? "Close Form" : "+ Add New Book"}
            </button>
          </div>

          {isAddingBook && (
            <form onSubmit={handleBookSubmit} className="bg-white p-6 rounded-xl border-2 border-blue-50 space-y-4 shadow-sm">
              <h4 className="font-bold text-blue-900">{editingBook ? `Editing: ${editingBook.title}` : "Add New Book"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="title" required placeholder="Book Title" className="p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" onChange={handleBookChange} value={bookData.title} />
                <input name="author" required placeholder="Author" className="p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" onChange={handleBookChange} value={bookData.author} />
                <input name="isbn" required placeholder="ISBN" className="p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" onChange={handleBookChange} value={bookData.isbn} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="categoryId" required className="p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" onChange={handleBookChange} value={bookData.categoryId}>
                  <option value="">Select Category</option>
                  {categories.map((c, index) => (
                    <option key={`${c.id || c._id || 'cat'}-${index}`} value={c.id || c._id}>{c.name}</option>
                  ))}
                </select>
                <input name="totalCopies" type="number" required placeholder="Total Copies" className="p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" onChange={handleBookChange} value={bookData.totalCopies} />
              </div>
              <textarea name="description" required placeholder="Book Description" className="w-full p-2 border rounded shadow-sm focus:ring-1 focus:ring-blue-500" rows="3" onChange={handleBookChange} value={bookData.description}></textarea>
              {!editingBook && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">PDF Source File (Optional)</label>
                  <input name="file" type="file" accept="application/pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleBookChange} />
                </div>
              )}
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 shadow-lg transition-transform hover:scale-[1.01]">
                {editingBook ? "Update Book Information" : "Save Book to Catalog"}
              </button>
            </form>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book, index) => (
                  <tr key={`${book.id || book._id || 'book'}-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-xs text-gray-500 italic">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">
                        {book.category?.name || book.genre || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.availableCopies} / {book.totalCopies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {book.isbn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEditBook(book)} className="text-blue-600 hover:text-blue-900 font-bold">Edit</button>
                      <button onClick={() => handleDeleteBook(book.id || book._id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "materials" ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Pending Review Pool</h3>
          {pendingMaterials.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {pendingMaterials.map((m, index) => (
                <div key={`${m._id || 'mat'}-${index}`} className="bg-white p-6 rounded-xl border-2 border-emerald-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                        {m.categoryId?.name || m.category || "Uncategorized"}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900">{m.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">{m.description}</p>
                    <p className="text-xs text-gray-500">Submitted by {m.author} — <a href={m.contentUrl} target="_blank" className="text-blue-600 hover:underline">Link</a></p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex space-x-3">
                    <button onClick={() => handleApproveMaterial(m._id, "approved")} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-md">Approve</button>
                    <button onClick={() => handleApproveMaterial(m._id, "rejected")} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-emerald-50 rounded-2xl border border-dashed border-emerald-200">
              <p className="text-emerald-700 font-bold italic">No materials awaiting review.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Category Management</h3>
            <button
              onClick={() => {
                setIsAddingCategory(!isAddingCategory);
                setEditingCategory(null);
                setCategoryFormData({ name: "", description: "" });
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-purple-700 transition"
            >
              {isAddingCategory ? "Close Form" : "+ Add New Category"}
            </button>
          </div>

          {isAddingCategory && (
            <form onSubmit={handleCategorySubmit} className="bg-purple-50 p-6 rounded-xl border border-purple-100 space-y-4 shadow-inner">
              <h4 className="font-bold text-purple-900">{editingCategory ? "Edit Category" : "Create New Category"}</h4>
              <div className="space-y-4">
                <input
                  name="name"
                  required
                  placeholder="Category Name"
                  className="w-full p-2 border rounded shadow-sm focus:ring-1 focus:ring-purple-500"
                  onChange={handleCategoryChange}
                  value={categoryFormData.name}
                />
                <textarea
                  name="description"
                  placeholder="Category Description"
                  className="w-full p-2 border rounded shadow-sm focus:ring-1 focus:ring-purple-500"
                  rows="2"
                  onChange={handleCategoryChange}
                  value={categoryFormData.description}
                ></textarea>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 shadow-lg">
                  {editingCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <div key={`${cat.id || cat._id || 'cat'}-${index}`} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{cat.name}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description || "No description provided."}</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id || cat._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianDashboard;
