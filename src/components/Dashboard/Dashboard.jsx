// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaFire, FaStar, FaTrophy, FaUsers, FaChartLine, 
  FaHeart, FaClock, FaCrown, FaBolt, FaMagic,
  FaPlay, FaPause, FaMusic, FaGamepad, FaSmile,
  FaRandom, FaPalette, FaRobot, FaRocket
} from 'react-icons/fa';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    points: 1250,
    level: 5,
    streak: 7,
    favorites: 12,
    timeSpent: 45, // minutes
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'meme', action: 'Created', title: 'Dank Meme', time: '2 min ago', points: 25 },
    { id: 2, type: 'chat', action: 'Message', title: 'Emoji Chat', time: '15 min ago', points: 10 },
    { id: 3, type: 'music', action: 'Listened', title: 'Ambient Chill', time: '30 min ago', points: 15 },
    { id: 4, type: 'puzzle', action: 'Solved', title: 'Logic Puzzle', time: '1 hour ago', points: 50 },
    { id: 5, type: 'fun', action: 'Viewed', title: 'Random Fact', time: '2 hours ago', points: 5 },
  ]);

  const [topUsers, setTopUsers] = useState([
    { id: 1, name: 'Alex', points: 3420, avatar: '👑', rank: 1 },
    { id: 2, name: 'Sam', points: 2980, avatar: '🌟', rank: 2 },
    { id: 3, name: 'Jordan', points: 2560, avatar: '⚡', rank: 3 },
    { id: 4, name: 'Taylor', points: 2340, avatar: '🎯', rank: 4 },
    { id: 5, name: 'Casey', points: 2100, avatar: '🔥', rank: 5 },
  ]);

  const [featuredContent, setFeaturedContent] = useState([
    { id: 1, type: 'meme', title: 'Meme of the Day', emoji: '🤣', views: 1240 },
    { id: 2, type: 'trivia', title: 'Daily Trivia', emoji: '🧠', views: 890 },
    { id: 3, type: 'quote', title: 'Quote Inspiration', emoji: '💭', views: 1560 },
  ]);

  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [greeting, setGreeting] = useState('');
  const [animatedEmoji, setAnimatedEmoji] = useState('🎮');
  const [backgroundParticles, setBackgroundParticles] = useState([]);

  const modules = [
    {
      id: 1,
      title: 'Meme Generator',
      description: 'Create hilarious memes with drag & drop',
      emoji: '🎭',
      color: 'from-blue-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
      path: '/meme-generator',
      stats: { users: 1240, rating: 4.8 },
      icon: FaPalette,
      featured: true,
    },
    {
      id: 2,
      title: 'Music Visualizer',
      description: 'Visualize your music in real-time',
      emoji: '🎵',
      color: 'from-purple-500 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
      path: '/music-visualizer',
      stats: { users: 980, rating: 4.9 },
      icon: FaMusic,
      featured: true,
    },
    {
      id: 3,
      title: 'Emoji Chat',
      description: 'Chat using only emojis & reactions',
      emoji: '😄',
      color: 'from-pink-500 to-yellow-500',
      gradient: 'bg-gradient-to-br from-pink-500 to-yellow-500',
      path: '/emoji-chat',
      stats: { users: 2560, rating: 4.7 },
      icon: FaSmile,
      featured: true,
    },
    {
      id: 4,
      title: 'Puzzle Room',
      description: 'Solve challenging puzzles & riddles',
      emoji: '🧩',
      color: 'from-yellow-500 to-green-500',
      gradient: 'bg-gradient-to-br from-yellow-500 to-green-500',
      path: '/puzzle-room',
      stats: { users: 870, rating: 4.6 },
      icon: FaGamepad,
      featured: false,
    },
    {
      id: 5,
      title: 'Physics Sandbox',
      description: 'Play with physics simulations',
      emoji: '⚛️',
      color: 'from-green-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-green-500 to-cyan-500',
      path: '/physics-sandbox',
      stats: { users: 1120, rating: 4.8 },
      icon: FaBolt,
      featured: false,
    },
    {
      id: 6,
      title: 'Random Fun Factory',
      description: 'Endless entertainment generator',
      emoji: '🎲',
      color: 'from-red-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-red-500 to-orange-500',
      path: '/random-fun',
      stats: { users: 1890, rating: 4.9 },
      icon: FaRandom,
      featured: true,
    },
    {
      id: 7,
      title: 'AI Art Studio',
      description: 'Generate AI-powered art & designs',
      emoji: '🎨',
      color: 'from-indigo-500 to-blue-500',
      gradient: 'bg-gradient-to-br from-indigo-500 to-blue-500',
      path: '/ai-art',
      stats: { users: 2100, rating: 4.9 },
      icon: FaMagic,
      featured: true,
      comingSoon: true,
    },
    {
      id: 8,
      title: 'Voice Assistant',
      description: 'Interactive voice-based games',
      emoji: '🤖',
      color: 'from-gray-700 to-gray-900',
      gradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
      path: '/voice-games',
      stats: { users: 760, rating: 4.5 },
      icon: FaRobot,
      featured: false,
      comingSoon: true,
    },
    {
      id: 9,
      title: 'Space Explorer',
      description: 'Explore the universe in 3D',
      emoji: '🚀',
      color: 'from-purple-700 to-pink-700',
      gradient: 'bg-gradient-to-br from-purple-700 to-pink-700',
      path: '/space-explorer',
      stats: { users: 0, rating: 0 },
      icon: FaRocket,
      featured: false,
      comingSoon: true,
    },
  ];

  // Initialize time-based greetings
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('morning');
      setGreeting('Good Morning!');
      setAnimatedEmoji('🌅');
    } else if (hour < 17) {
      setTimeOfDay('afternoon');
      setGreeting('Good Afternoon!');
      setAnimatedEmoji('☀️');
    } else {
      setTimeOfDay('evening');
      setGreeting('Good Evening!');
      setAnimatedEmoji('🌙');
    }

    // Create floating particles
    const particles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setBackgroundParticles(particles);

    // Animated emoji rotation
    const emojis = ['🎮', '✨', '🎯', '🌟', '⚡', '🎪', '🎨', '🎭'];
    let emojiIndex = 0;
    const emojiInterval = setInterval(() => {
      emojiIndex = (emojiIndex + 1) % emojis.length;
      setAnimatedEmoji(emojis[emojiIndex]);
    }, 3000);

    return () => clearInterval(emojiInterval);
  }, []);

  // Background particles animation
  useEffect(() => {
    const animateParticles = () => {
      setBackgroundParticles(prev => 
        prev.map(p => ({
          ...p,
          y: (p.y + p.speed) % 100,
          x: (p.x + Math.sin(p.y * 0.1) * 0.2) % 100,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const getTimeBasedColor = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-blue-400 via-cyan-400 to-emerald-400';
      case 'afternoon': return 'from-yellow-400 via-orange-400 to-red-400';
      case 'evening': return 'from-purple-600 via-pink-600 to-indigo-600';
      default: return 'from-blue-500 via-purple-500 to-pink-500';
    }
  };

  const quickActions = [
    { icon: FaFire, label: 'Daily Challenge', color: 'from-orange-500 to-red-500', points: 100 },
    { icon: FaStar, label: 'Rate App', color: 'from-yellow-500 to-amber-500', points: 50 },
    { icon: FaHeart, label: 'Share with Friends', color: 'from-pink-500 to-rose-500', points: 75 },
    { icon: FaTrophy, label: 'View Leaderboard', color: 'from-amber-500 to-yellow-500', points: 25 },
  ];

  const statsCards = [
    { icon: FaChartLine, label: 'Total Points', value: userStats.points, color: 'text-blue-500', change: '+125' },
    { icon: FaCrown, label: 'Level', value: userStats.level, color: 'text-purple-500', change: '+2' },
    { icon: FaFire, label: 'Day Streak', value: userStats.streak, color: 'text-orange-500', change: '🔥' },
    { icon: FaClock, label: 'Time Spent', value: `${userStats.timeSpent}m`, color: 'text-green-500', change: '+15m' },
    { icon: FaHeart, label: 'Favorites', value: userStats.favorites, color: 'text-pink-500', change: '+3' },
    { icon: FaUsers, label: 'Active Users', value: '2.4K', color: 'text-cyan-500', change: '+240' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:via-gray-800/50 dark:to-purple-900/20 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <motion.div 
                className="flex items-center gap-4 mb-4"
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-5xl"
                >
                  {animatedEmoji}
                </motion.div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    🎪 Fun Portal
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    {greeting} Ready for some fun?
                  </p>
                </div>
              </motion.div>
              
              {/* User Stats Bar */}
              <div className="flex flex-wrap gap-3 mt-6">
                {statsCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
                  >
                    <stat.icon className={`text-xl ${stat.color}`} />
                    <div>
                      <div className="font-bold text-lg">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                    <span className="text-xs font-bold text-green-500 ml-2">{stat.change}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl`}
                >
                  <action.icon className="text-lg mb-1" />
                  <div className="text-xs font-medium">{action.label}</div>
                  <div className="text-xs opacity-90">+{action.points} pts</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Featured & Leaderboard */}
          <div className="lg:col-span-2">
            {/* Featured Modules */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Featured Experiences
                </h2>
                <span className="text-sm text-gray-500">Most popular this week</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.filter(m => m.featured).map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Link to={module.path}>
                      <div className={`${module.gradient} rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden group cursor-pointer`}>
                        {module.comingSoon && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs">
                            Coming Soon
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-5xl">{module.emoji}</div>
                          <module.icon className="text-2xl opacity-80" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                        <p className="opacity-90 mb-4">{module.description}</p>
                        
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 text-sm opacity-80">
                            <span className="flex items-center gap-1">
                              <FaUsers /> {module.stats.users.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaStar /> {module.stats.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Explore</span>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              →
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* All Modules Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <FaGamepad className="text-green-500" />
                All Games & Tools
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={module.path}>
                        <div className={`bg-gradient-to-br ${module.color} rounded-2xl p-5 shadow-xl text-white cursor-pointer relative overflow-hidden group h-full`}>
                          {module.comingSoon && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 rounded-full text-xs backdrop-blur-sm">
                              Soon
                            </div>
                          )}
                          
                          <div className="text-4xl mb-3">{module.emoji}</div>
                          <h3 className="text-xl font-bold mb-1">{module.title}</h3>
                          <p className="text-sm opacity-90 mb-4">{module.description}</p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div className="text-xs opacity-75">
                              {module.stats.users > 0 ? (
                                <>
                                  {module.stats.users.toLocaleString()} users • ⭐{module.stats.rating}
                                </>
                              ) : (
                                'Coming Soon'
                              )}
                            </div>
                            <motion.div
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                            >
                              →
                            </motion.div>
                          </div>
                          
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  Top Players
                </h3>
                <span className="text-sm text-gray-500">This Week</span>
              </div>
              
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20'
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-700' : 'bg-gray-600'
                      }`}>
                        <span className="text-white font-bold">{user.rank}</span>
                      </div>
                      <div className="text-2xl">{user.avatar}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.points.toLocaleString()} pts</div>
                    </div>
                    
                    {index < 3 && (
                      <div className="text-lg">
                        {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:opacity-90 transition-opacity text-sm font-medium">
                View Full Leaderboard
              </button>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Your Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-lg">
                          {activity.type === 'meme' && '🎭'}
                          {activity.type === 'chat' && '😄'}
                          {activity.type === 'music' && '🎵'}
                          {activity.type === 'puzzle' && '🧩'}
                          {activity.type === 'fun' && '🎲'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{activity.action} <span className="font-bold">{activity.title}</span></div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-500">+{activity.points}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Featured Content */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <FaFire className="text-orange-500" />
                Trending Now
              </h3>
              
              <div className="space-y-4">
                {featuredContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{item.emoji}</div>
                      <div>
                        <div className="font-bold">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.views.toLocaleString()} views</div>
                      </div>
                    </div>
                    <button className="w-full mt-2 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
                      Try Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats & Info */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="font-bold text-lg mb-2">Lightning Fast</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Optimized for instant loading and smooth animations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-bold text-lg mb-2">Always Fresh</h4>
              <p className="text-gray-600 dark:text-gray-300">
                New content and features added regularly
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-bold text-lg mb-2">Privacy First</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Your data stays on your device, always secure
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
              <FaHeart className="text-pink-500 animate-pulse" />
              <span className="text-gray-600 dark:text-gray-300">
                Made with ❤️ for fun and learning
              </span>
              <FaBolt className="text-yellow-500" />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Built with React • Tailwind CSS • Framer Motion • Vite
            </p>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl flex items-center justify-center text-2xl z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </motion.button>
    </div>
  );
};

export default Dashboard;