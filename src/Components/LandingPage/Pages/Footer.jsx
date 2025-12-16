import React from "react";
import logo from "../Components/Assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-green-500/20 py-12 px-8">
      {/* Footer container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* --- Logo & App Name --- */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="VoteON Logo"
              className="w-14 h-14 object-contain"
            />
            {/* Bigger logo + readable name */}
            <span className="text-2xl font-bold text-white">
              Vote<span className="text-green-400">ON</span>
            </span>
          </div>

          {/* --- Center Text / Description --- */}
          <p className="text-gray-400 text-center md:text-left text-base leading-relaxed max-w-lg">
            © 2025 VoteON. All rights reserved. <br className="md:hidden" />
            Empowering democracy through technology.
          </p>

          {/* --- Footer Links --- */}
          <div className="flex gap-8">
            <a
              href="#privacy"
              className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
            >
              Terms of Service
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
