
import React, { useState } from 'react';
import logo from '../../src/assets/Salesbill/Logo.png'

const Navbar = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#E8EFEF] p-4 shadow-md h-[88px] md:fixed w-full flex items-center z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          {/* <span className="text-blue-600">Rap</span>ID */}
          <img src={logo} alt="" />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => toggleSidebar()}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;