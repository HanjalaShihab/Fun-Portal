// src/components/layout/Layout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { 
  FaHome, FaSun, FaMoon, FaUser, 
  FaCog, FaSignOutAlt, FaTrophy,
  FaMagic // Added for AI Art Studio
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, stats } = useUser();

  // Add safety checks for user data
  const safeUser = user || { 
    name: 'Guest', 
    points: 0, 
    avatar: '👤' 
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FaHome },
    { path: '/meme-generator', label: 'Meme Generator' },
    { path: '/music-visualizer', label: 'Music Visualizer' },
    { path: '/emoji-chat', label: 'Emoji Chat' },
    { path: '/puzzle-room', label: 'Puzzle Room' },
    { path: '/physics-sandbox', label: 'Physics Sandbox' },
    { path: '/random-fun', label: 'Random Fun' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                🎮
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-portal-blue via-portal-purple to-portal-pink bg-clip-text text-transparent">
                Fun Portal
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-portal-blue to-portal-purple text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {Icon && <Icon className="inline mr-2" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* User Controls */}
            <div className="flex items-center space-x-4">
              {/* User Points */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-portal-yellow/20 to-orange-500/20">
                <FaTrophy className="text-portal-yellow" />
                <span className="font-bold text-portal-yellow">{safeUser.points}</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-portal-blue to-portal-purple flex items-center justify-center">
                    <span className="text-white">{safeUser.avatar}</span>
                  </div>
                  <span className="hidden md:inline font-medium">{safeUser.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-bold">{safeUser.name}</div>
                    <div className="text-sm text-gray-500">{safeUser.points} points</div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <FaUser />
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <FaCog />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => { // Changed from 4 to 5
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-16 h-16 ${
                  location.pathname === item.path
                    ? 'text-portal-blue'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {Icon && <Icon className="text-xl" />}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="hidden md:block py-8 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built with ❤️ for fun and learning
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Final Year Project • Interactive Web Playground • {new Date().getFullYear()}
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-portal-blue">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-portal-blue">Documentation</a>
            <a href="#" className="text-gray-400 hover:text-portal-blue">About</a>
            <a href="#" className="text-gray-400 hover:text-portal-blue">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;