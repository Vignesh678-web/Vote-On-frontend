import React, { useState } from 'react';
import logo from '../Assets/logo.png';

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-3 mb-8">
  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/40">

      <img src ={logo} className='w-20 h-15'/>
    </div>
    <div>
      <h1 className="text-3xl font-bold text-green-400">Vote ON</h1>
      <p className="text-xs text-gray-400">Admin Dashboard</p>
    </div>
  </div>
);
export default Logo;