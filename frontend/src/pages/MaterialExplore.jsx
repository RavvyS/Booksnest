import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import materialService from "../services/materialService";
import categoryService from "../services/categoryService";
import MaterialCard from "../components/common/MaterialCard";
import Navbar from "../components/layout/Navbar";
import { toast } from "react-toastify";

const MaterialExplore = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");

  useEffect(() => {
    setSelectedCategory(categoryParam || "all");
  }, [categoryParam]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materialsData, catsData] = await Promise.all([
        materialService.getAllApproved(selectedCategory === "all" ? "" : selectedCategory),
        categoryService.getAll(),
      ]);
      setMaterials(materialsData);
      setCategories(catsData);
    } catch (error) {
      toast.error("Failed to load materials or categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <header className="bg-white shadow-sm border-b py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight flex items-center">
              <span className="mr-2">Learning Resources</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">Approved</span>
            </h1>
            <p className="text-gray-500 mt-1">Discover curated knowledge for your growth.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search resources..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex overflow-x-auto pb-2 sm:pb-0 space-x-2 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1 text-sm font-medium rounded-full border transition-all ${selectedCategory === "all" ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"}`}
              >
                All
              </button>
              {categories.map((cat, index) => (
                <button
                  key={`${cat.id || cat._id || 'cat'}-${index}`}
                  onClick={() => setSelectedCategory(cat.id || cat._id)}
                  className={`px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${selectedCategory === (cat.id || cat._id) ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material, index) => (
              <MaterialCard key={`${material._id || 'mat'}-${index}`} material={material} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-emerald-200 shadow-sm">
            <svg className="mx-auto h-12 w-12 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="mt-2 text-xl font-medium text-gray-900">No resources found</h2>
            <p className="mt-1 text-gray-500">Try a different category or search term.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MaterialExplore;
