import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "scrollreveal";
import Typed from "typed.js";
import headerImage from "../assets/header3.png";
import aboutImage from "../assets/about8.png";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer/Footer";

// Social Icons (using simple SVG for stability)
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
  </svg>
);
const GitHubIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.011 10.011 0 0022 12c0-5.523-4.477-10-10-10z"></path>
  </svg>
);

function Landing() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["EFFICIENCY", "SMARTLY", "INNOVATION"],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
    });

    ScrollReveal().reveal(".reveal", {
      distance: "60px",
      duration: 1000,
      easing: "ease-in-out",
      origin: "bottom",
      interval: 200,
    });

    return () => typed.destroy();
  }, []);

  const testimonials = [
    {
      name: "Mizzaka",
      text: "Great platform! Easy to use and very efficient.",
      date: "01 Jan 2025",
    },
    {
      name: "Kasun",
      text: "A fantastic tool for managing my library effortlessly.",
      date: "15 Dec 2024",
    },
    {
      name: "Dinoda",
      text: "Saved me so much time with its seamless features!",
      date: "10 Nov 2024",
    },
    {
      name: "Mithila",
      text: "Highly recommended for all book lovers!",
      date: "05 Oct 2024",
    },
    {
      name: "Milan",
      text: "The best platform for organizing my book collection!",
      date: "20 Sep 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-52 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between gap-16">
            <div className="lg:w-1/2 reveal">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tighter">
                MANAGE YOUR LIBRARY WITH <br />
                <span
                  ref={typedRef}
                  className="text-blue-600 bg-clip-text"
                ></span>
              </h1>
              <p className="mt-8 text-xl text-gray-600 leading-relaxed font-medium">
                Booksnest is your ultimate library management companion.
                Simplify borrowing, cataloging, and collaboration with our
                intuitive, premium platform designed for modern readers and
                librarians.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg text-center hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
                >
                  Get Started
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-2xl font-bold text-lg text-center hover:bg-blue-50 hover:border-blue-200 transition-all"
                >
                  Register Now
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-blue-50 text-blue-700 rounded-2xl font-bold text-lg text-center hover:bg-blue-100 transition-all"
                >
                  Sign In
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <GitHubIcon />
                </a>
              </div>
            </div>

            <div className="mt-16 lg:mt-0 lg:w-1/2 reveal">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <img
                  src={headerImage}
                  alt="Booksnest Illustration"
                  className="relative rounded-[2rem] w-full shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center gap-20">
            <div className="lg:w-1/2 reveal">
              <img
                src={aboutImage}
                alt="About Booksnest"
                className="w-4/5 mx-auto rounded-3xl"
              />
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0 reveal">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                About Us
              </h2>
              <div className="mt-6 space-y-4 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  Welcome to Booksnest, your trusted platform for seamless book
                  management and exploration! Our mission is to foster a vibrant
                  learning community by making access to knowledge easier than
                  ever.
                </p>
                <p>
                  From academic resources to fiction, manage everything in one
                  central hub. Whether you are a Reader browsing for your next
                  favorite book, an Author sharing contributions, or a Librarian
                  managing the catalog, we have you covered.
                </p>
                <p className="text-blue-600 font-bold italic">
                  Thank you for choosing Booksnest — your library at your
                  fingertips!
                </p>
              </div>
              <button className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 reveal">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                What Our Users Say...
              </h2>
              <p className="mt-2 text-gray-500 font-medium">
                Voices from our growing library community.
              </p>
            </div>
            <button className="hidden sm:block text-blue-600 font-bold hover:underline">
              See All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all reveal group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {t.date}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed text-lg">
                  “{t.text}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Form */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
          <h2 className="text-4xl font-black tracking-tight">
            Share Your Experience
          </h2>
          <p className="mt-4 text-gray-400 font-medium">
            We'd love to hear your feedback! Help us make Booksnest even better.
          </p>

          <form className="mt-12 space-y-4">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <textarea
              placeholder="Your Review"
              rows="4"
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            ></textarea>
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
