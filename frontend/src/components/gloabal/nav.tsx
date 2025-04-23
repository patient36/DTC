"use client";
import React from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Capsules', href: '/capsules' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 backdrop-blur-lg text-white p-4 fixed top-0 left-0 w-full z-50">

      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl flex items-center font-bold tracking-wide">
          <img src="/logo.svg" alt="" className='w-10 flex items-start' />
          DTC
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="hover:text-cyan-400 transition duration-300"
            >
              {name}
            </Link>
          ))}
          <Link
            href={showLogin ? '/register' : '/login'}
            className="min-w-[70px] hover:text-blue-800 font-bold transition duration-300 bg-white rounded-full text-slate-700 px-4 py-2"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? 'Sign Up' : 'Login'}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-cyan-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2 flex flex-col">
          {navItems.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="hover:text-cyan-400 transition duration-300"
            >
              {name}
            </Link>
          ))}
          <Link
            href={showLogin ? '/register' : '/login'}
            className="min-w-[70px] hover:text-cyan-400 font-bold transition duration-300"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? 'Sign Up' : 'Login'}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
