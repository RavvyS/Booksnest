import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black text-blue-600 tracking-tighter">
              Booksnest
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed">
              Empowering a community of readers, authors, and librarians through
              innovation and a shared love for knowledge.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all border border-gray-100">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all border border-gray-100">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          {/* Site Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Home</Link></li>
              <li><Link to="/books" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Browse Books</Link></li>
              <li><Link to="/materials" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Learning Resources</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Join Us</Link></li>
            </ul>
          </div>

          {/* More Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Policies</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Borrowing Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Address */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Office</h3>
            <div className="text-gray-500 font-medium space-y-1">
              <p>127, Pitipana,</p>
              <p>Thalagala Rd, Homagama,</p>
              <p>Sri Lanka.</p>
              <div className="pt-4">
                <p className="text-blue-600 font-bold">contact@booksnest.com</p>
                <p className="+94 11 234 5678">+94 11 234 5678</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 font-bold text-sm tracking-wide">
            BOOKSNEST © 2024. CREATED WITH ❤️ FOR THE COMMUNITY.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
