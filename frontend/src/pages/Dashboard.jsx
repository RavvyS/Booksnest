import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import ReaderDashboard from "./dashboard/ReaderDashboard";
import AuthorDashboard from "./dashboard/AuthorDashboard";
import LibrarianDashboard from "./dashboard/LibrarianDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user.role) {
      case "reader":
        return <ReaderDashboard />;
      case "author":
        return <AuthorDashboard />;
      case "librarian":
        return <LibrarianDashboard />;
      default:
        return <p>Unknown role: {user.role}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-10 ring-1 ring-black/5">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Dashboard</h1>
              <p className="mt-2 text-gray-500 font-medium italic">Welcome back, {user.username}!</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-50 text-blue-700 shadow-inner">
                Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </header>
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
