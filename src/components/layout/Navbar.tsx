import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Upload,
  User,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Zap,
  Edit3,
  ShoppingBag,
  Palette,
  Layers
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { user, session } = useAuth();
  const { searchQuery, setSearchQuery } = useStore();

  const navigation = [
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Advanced Editor', href: '/advanced-editor', icon: Palette },
    { name: 'Design Editor', href: '/design-editor', icon: Edit3 },
    { name: 'Upload', href: '/upload-advanced', icon: Upload },
    { name: 'Teams', href: '/teams', icon: Layers },
    { name: 'Pricing', href: '/pricing', icon: Zap },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out. Please try again.');
    } else {
      toast.success('Signed out successfully!');
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-500 overflow-visible">
        <div className="container mx-auto px-4 relative z-50 overflow-visible">
          <div className="flex justify-between items-center w-full py-3 overflow-auto gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                DesignFlow
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary-500"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-grow max-w-xs mx-2 min-w-[120px]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search presets, creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/notifications" className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
              </Link>

              {session ? (
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={
                        user?.user_metadata?.avatar_url ||
                        `https://ui-avatars.com/api/?name=${session.user?.email || 'User'}`
                      }
                      alt={session.user?.email || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Link
                    to="/signup"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors min-w-[100px] text-center"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden py-4 border-t border-gray-700"
            >
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                      isActive(item.href)
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        
      </nav>

      {/* Profile Dropdown Outside Navbar */}
      {isProfileOpen && (
        <div className="absolute top-16 right-4 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[9999]">
          <Link
            to="/user-profile"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => setIsProfileOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/user-create-dataset"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => setIsProfileOpen(false)}
          >
            Create Dataset
          </Link>
          <Link
            to="/upload-advanced"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => setIsProfileOpen(false)}
          >
            Upload Presets
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => setIsProfileOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => {
              handleSignOut();
              setIsProfileOpen(false);
            }}
            className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
