"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const [authBtnText, setAuthBtnText] = useState('Login')
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setAuthBtnText('Logout')
    }
    else{
      setAuthBtnText('Login')
    }
  }, [isAuthenticated])

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Capsules', href: '/capsules' },
    { name: 'About', href: '/about' },
  ];

  const handleLogout = () => {
    try {
      logout();
      toast.success('Logged out');
      setAuthBtnText('Login')
      router.push('/');
    } catch (error: any) {
      toast.error(error?.message || 'Logout failed');
    }
  };


  const authSection = isAuthenticated ? (
    <button
      onClick={() => handleLogout()}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-500 font-bold hover:bg-slate-700/50 transition-colors"
    >
      <FiLogOut className="text-amber-500" />
      <span>{authBtnText}</span>
    </button>
  ) : (
    <Link
      href="/"
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-500 font-bold hover:bg-slate-700/50 transition-colors"
    >
      <FiUser className="text-cyan-400" />
      <span>{authBtnText}</span>
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md py-2 shadow-lg' : 'bg-slate-900/80 backdrop-blur-sm py-3'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/logo.svg"
            alt="DTC Logo"
            className="w-8 h-8 transition-transform group-hover:rotate-12"
          />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            DTC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative group font-medium text-slate-300 hover:text-white transition-colors"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          <div className="h-6 w-px bg-slate-600 mx-2"></div>
          {authSection}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-white hover:bg-slate-700/50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 rounded-lg text-white hover:bg-slate-700/50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-slate-700 my-2"></div>
              <div onClick={() => setMenuOpen(false)}>
                {authSection}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;