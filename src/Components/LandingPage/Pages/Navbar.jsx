import React from 'react';
import logo from '../Components/Assets/logo.png';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-green-500/20 z-50">
      <div className="w-7xl py-2 px-2" >
        <div className="flex items-center justify-between">
          
          {/* --- Logo + Brand Name --- */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="VoteON Logo"
              className="w-20 h-20 object-contain"
            />
            <span className="text-5xl font-extrabold text-white tracking-tight">
              Vote<span className="text-green-400">ON</span>
            </span>
          </div>

          {/* --- Navigation Links --- */}
          <div className="hidden md:flex items-center gap-10">
            <a
              href="#reviews"
              className="text-gray-300 hover:text-green-400 transition-colors font-semibold text-lg"
            >
              REVIEWS
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-green-400 transition-colors font-semibold text-lg"
            >
              CONTACT
            </a>
          </div>

          {/* --- Auth Button --- */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/UserLogin')}
              className="bg-green-500 text-white font-semibold text-lg px-6 py-2 rounded-lg border border-green-500 hover:bg-green-600 hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
