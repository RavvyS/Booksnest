import React, { useState, useEffect } from "react";
import materialService from "../../services/materialService";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";

const AuthorDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchMyMaterials();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id || data[0]._id }));
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchMyMaterials = async () => {
    try {
      const data = await materialService.getAllApproved(); // Simplified, ideally backend has "my-materials"
      setMaterials(data.filter(m => m.status === "approved" || m.status === "pending"));
    } catch (error) {
      toast.error("Failed to fetch your materials");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materialService.create(formData);
      toast.success("Material submitted for review!");
      setIsAdding(false);
      setFormData({
        title: "",
        description: "",
        contentUrl: "",
        categoryId: categories.length > 0 ? (categories[0].id || categories[0]._id) : ""
      });
      fetchMyMaterials();
    } catch (error) {
      toast.error("Failed to submit material");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-emerald-900">Author Portal</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${isAdding ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
        >
          {isAdding ? "Cancel" : "+ New Material"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-emerald-50 p-8 rounded-2xl shadow-inner border border-emerald-100 space-y-4">
          <h3 className="text-lg font-bold text-emerald-800 mb-2 underline decoration-emerald-300">Submit New Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700">Title</label>
              <input
                name="title"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-sm"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to SDG 4"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-emerald-700">Category</label>
              <select
                name="categoryId"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-sm"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c, index) => (
                  <option key={`${c.id || c._id || 'cat'}-${index}`} value={c.id || c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-emerald-700">Content URL</label>
            <input
              name="contentUrl"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-sm"
              value={formData.contentUrl}
              onChange={handleChange}
              placeholder="https://example.com/resource"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-emerald-700">Description</label>
            <textarea
              name="description"
              required
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-sm"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief overview..."
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md">
            Submit Resource
          </button>
        </form>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">My Submissions</h3>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((m, index) => (
              <div key={`${m._id || 'mat'}-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{m.title}</p>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-tighter">
                    {m.categoryId?.name || m.category || "Uncategorized"}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${m.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-200">
            <p className="text-emerald-700 italic">No materials found. Submit your first resource!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;
