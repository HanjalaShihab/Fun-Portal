// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaRocket, FaGamepad, FaMusic, FaSmile,
  FaPalette, FaPuzzlePiece, FaAtom, FaDice,
  FaStar, FaBolt, FaFire, FaMagic,
  FaCompass, FaGlobe, FaUsers, FaHeart,
  FaChevronRight, FaRegMoon, FaRegSun
} from 'react-icons/fa';

const Dashboard = () => {
  const [animatedEmoji, setAnimatedEmoji] = useState('🚀');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [theme] = useState('dark');
  const [stars, setStars] = useState([]);
  const [comets, setComets] = useState([]);
  const containerRef = useRef(null);

  const modules = [
    {
      id: 1,
      title: 'Meme Generator',
      description: 'Create hilarious memes with drag & drop',
      emoji: '🎭',
      color: 'from-blue-500/90 to-purple-600/90',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      iconColor: 'text-blue-300',
      path: '/meme-generator',
      icon: FaPalette,
      features: ['Drag & Drop', '150+ Templates', 'Instant Share'],
      popular: true,
      glow: 'blue',
    },
    {
      id: 2,
      title: 'Music Visualizer',
      description: 'Visualize music with amazing effects',
      emoji: '🎵',
      color: 'from-purple-500/90 to-pink-600/90',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      iconColor: 'text-purple-300',
      path: '/music-visualizer',
      icon: FaMusic,
      features: ['Real-time', '3D Effects', 'Custom Colors'],
      glow: 'purple',
    },
    {
      id: 3,
      title: 'Puzzle Room',
      description: 'Challenge your brain with puzzles',
      emoji: '🧩',
      color: 'from-yellow-500/90 to-green-500/90',
      bgColor: 'rgba(234, 179, 8, 0.1)',
      iconColor: 'text-yellow-300',
      path: '/puzzle-room',
      icon: FaPuzzlePiece,
      features: ['Brain Games', 'Daily Challenges', 'Multiplayer'],
      glow: 'yellow',
    },
    {
      id: 4,
      title: 'Physics Sandbox',
      description: 'Play with gravity and simulations',
      emoji: '⚛️',
      color: 'from-green-500/90 to-cyan-500/90',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      iconColor: 'text-green-300',
      path: '/physics-sandbox',
      icon: FaAtom,
      features: ['Interactive', 'Educational', 'Fun'],
      new: true,
      glow: 'green',
    },
    {
      id: 5,
      title: 'Random Fun',
      description: 'Discover random games & activities',
      emoji: '🎲',
      color: 'from-red-500/90 to-orange-500/90',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      iconColor: 'text-red-300',
      path: '/random-fun',
      icon: FaDice,
      features: ['Surprise', 'Quick Play', 'Endless'],
      popular: true,
      glow: 'red',
    },
    {
      id: 6,
      title: 'Emoji Chat',
      description: 'Express yourself with emojis',
      emoji: '😄',
      color: 'from-pink-500/90 to-yellow-500/90',
      bgColor: 'rgba(236, 72, 153, 0.1)',
      iconColor: 'text-pink-300',
      path: '/emoji-chat',
      icon: FaSmile,
      features: ['Social', 'Fun', 'Creative'],
      glow: 'pink',
    },
    {
      id: 7,
      title: 'Space Explorer',
      description: 'Journey through the cosmos in 3D',
      emoji: '🚀',
      color: 'from-indigo-900/90 via-purple-800/90 to-blue-900/90',
      bgColor: 'rgba(67, 56, 202, 0.1)',
      iconColor: 'text-cyan-300',
      path: '/space-explorer',
      icon: FaRocket,
      features: ['3D Graphics', 'Educational', 'Immersive'],
      comingSoon: true,
      glow: 'cyan',
    },
  ];

  // Initialize space background
  useEffect(() => {
    // Generate stars
    const starsArray = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 3 + 1,
    }));
    setStars(starsArray);

    // Generate comets
    const cometsArray = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
    }));
    setComets(cometsArray);

    // Mouse move effect
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Emoji animation
  useEffect(() => {
    const emojis = ['🚀', '🎮', '✨', '🎲', '🎨', '🌟', '⚡', '🎯', '🌌', '🪐'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % emojis.length;
      setAnimatedEmoji(emojis[index]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Floating nebula particles
  const [nebulaParticles, setNebulaParticles] = useState([]);
  
  useEffect(() => {
    const particlesArray = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 20,
      opacity: Math.random() * 0.15 + 0.05,
      color: `rgba(${Math.floor(Math.random() * 100) + 100}, 
              ${Math.floor(Math.random() * 100) + 50}, 
              ${Math.floor(Math.random() * 100) + 200}, `,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
    }));
    setNebulaParticles(particlesArray);
  }, []);

  // Random quote generator
  const quotes = [
    "Creativity is intelligence having fun.",
    "Play is the highest form of research.",
    "The universe is full of magical things.",
    "Adventure is out there!",
    "Explore the impossible.",
    "Fun is the spark of innovation.",
  ];
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 relative overflow-hidden"
    >
      {/* Space Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {stars.map(star => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.5, star.opacity],
            }}
            transition={{
              duration: star.twinkleSpeed,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Nebula Clouds */}
        {nebulaParticles.map(particle => (
          <motion.div
            key={`nebula-${particle.id}`}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${particle.color}${particle.opacity}) 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, particle.speedX * 100],
              y: [0, particle.speedY * 100],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Comets */}
        {comets.map(comet => (
          <motion.div
            key={`comet-${comet.id}`}
            className="absolute"
            style={{
              left: `${comet.x}%`,
              top: `${comet.y}%`,
            }}
            animate={{
              x: [0, window.innerWidth],
              y: [0, window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: comet.speed * 10,
              repeat: Infinity,
              repeatDelay: Math.random() * 10 + 5,
            }}
          >
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm" />
          </motion.div>
        ))}

        {/* Mouse Follow Glow */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            left: `${mousePosition.x - 50}%`,
            top: `${mousePosition.y - 50}%`,
          }}
          animate={{
            left: `${mousePosition.x - 50}%`,
            top: `${mousePosition.y - 50}%`,
          }}
          transition={{ type: "spring", mass: 0.5, stiffness: 50 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Theme Toggle */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 shadow-2xl"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {theme === 'dark' ? (
            <FaRegSun className="text-yellow-300 text-xl" />
          ) : (
            <FaRegMoon className="text-indigo-300 text-xl" />
          )}
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-16 pt-8"
        >
          {/* Animated Title with Gradient Flow */}
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-8xl mb-4 relative"
            >
              {animatedEmoji}
              <motion.div
                className="absolute inset-0 blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {animatedEmoji}
              </motion.div>
            </motion.div>
            
            <motion.div
              className="absolute -inset-4 blur-3xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 relative"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Welcome to FunPortal
            </span>
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.h1>

          {/* Animated Quote */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto italic"
            >
              "{currentQuote}"
            </motion.p>
          </AnimatePresence>

          {/* Interactive Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { value: '7+', label: 'Worlds', icon: '🌌', color: 'from-blue-500/30 to-cyan-500/30' },
              { value: '∞', label: 'Possibilities', icon: '✨', color: 'from-purple-500/30 to-pink-500/30' },
              { value: '100%', label: 'Free', icon: '🎯', color: 'from-pink-500/30 to-orange-500/30' },
              { value: '24/7', label: 'Fun', icon: '⚡', color: 'from-yellow-500/30 to-green-500/30' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${stat.color} backdrop-blur-lg border border-white/10 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <div className="text-white font-bold text-xl">{stat.value}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Modules with Parallax */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 relative"
        >
          {/* Section Header with Animation */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <FaCompass className="text-cyan-400 text-4xl animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold text-center">
                <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  Explore Interactive Worlds
                </span>
              </h2>
              <FaGlobe className="text-purple-400 text-4xl" />
            </div>
            <p className="text-gray-400 text-center max-w-2xl">
              Dive into immersive experiences where creativity meets technology
            </p>
          </motion.div>

          {/* Module Grid with Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                onHoverStart={() => setHoveredCard(module.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Card Glow Effect */}
                <div 
                  className={`absolute -inset-0.5 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500 ${
                    module.glow === 'blue' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                    module.glow === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    module.glow === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-green-500' :
                    module.glow === 'green' ? 'bg-gradient-to-r from-green-500 to-cyan-500' :
                    module.glow === 'red' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                    module.glow === 'pink' ? 'bg-gradient-to-r from-pink-500 to-yellow-500' :
                    'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                />
                
                <Link to={module.path}>
                  <div 
                    className={`relative bg-gradient-to-br ${module.color} backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl h-full border border-white/20 overflow-hidden`}
                    style={{ 
                      background: `linear-gradient(135deg, ${module.bgColor}, rgba(0,0,0,0.3))`,
                    }}
                  >
                    
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, ${module.iconColor.replace('text-', '')} 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                      }} />
                    </div>

                    {/* Badges with Animation */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      {module.popular && (
                        <motion.span 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          whileHover={{ scale: 1.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-xs font-bold rounded-full backdrop-blur-sm shadow-lg"
                        >
                          <span className="flex items-center gap-2">
                            <FaFire className="animate-pulse" /> Popular
                          </span>
                        </motion.span>
                      )}
                      {module.new && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-green-500/90 to-cyan-500/90 text-xs font-bold rounded-full backdrop-blur-sm shadow-lg"
                        >
                          <span className="flex items-center gap-2">
                            <FaBolt className="animate-bounce" /> New
                          </span>
                        </motion.span>
                      )}
                      {module.comingSoon && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-gray-700/90 to-gray-900/90 text-xs font-bold rounded-full backdrop-blur-sm shadow-lg border border-gray-600/50"
                        >
                          <span className="flex items-center gap-2">
                            <FaRocket className="animate-bounce" /> Coming Soon
                          </span>
                        </motion.span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon & Emoji with Animation */}
                      <div className="flex items-start justify-between mb-8">
                        <motion.div
                          animate={hoveredCard === module.id ? { 
                            scale: 1.2,
                            rotate: [0, 10, -10, 0],
                          } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-6xl"
                        >
                          {module.emoji}
                        </motion.div>
                        <motion.div
                          animate={hoveredCard === module.id ? { 
                            scale: 1.3,
                            rotate: 360,
                          } : { scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <module.icon className={`text-4xl ${module.iconColor} drop-shadow-lg`} />
                        </motion.div>
                      </div>

                      {/* Title with Gradient Underline */}
                      <h3 className="text-3xl font-bold mb-4">
                        {module.title}
                        <motion.div 
                          className="h-1 bg-gradient-to-r from-white/50 to-transparent rounded-full mt-2"
                          initial={{ width: 0 }}
                          animate={{ width: hoveredCard === module.id ? '100%' : '50%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </h3>
                      
                      <p className="text-gray-200 mb-8 text-lg">{module.description}</p>

                      {/* Features with Stagger Animation */}
                      <div className="space-y-3 mb-10">
                        {module.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3"
                          >
                            <motion.div
                              animate={hoveredCard === module.id ? { 
                                scale: [1, 1.2, 1],
                              } : {}}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                              <FaStar className="text-yellow-400" />
                            </motion.div>
                            <span className="text-sm opacity-90">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Explore Button with Arrow Animation */}
                      <motion.div
                        className="flex items-center justify-between mt-auto pt-6 border-t border-white/20"
                        animate={{ 
                          x: hoveredCard === module.id ? [0, 5, 0] : 0
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity,
                          repeatDelay: 0.5 
                        }}
                      >
                        <span className="text-sm opacity-80 font-medium">Begin Adventure</span>
                        <motion.div
                          animate={hoveredCard === module.id ? { 
                            x: [0, 10, 0],
                          } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="flex items-center gap-2 text-xl"
                        >
                          <span>→</span>
                          <FaChevronRight className="text-lg" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Particle Effect on Hover */}
                    {hoveredCard === module.id && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-white"
                            initial={{ 
                              x: '50%', 
                              y: '50%',
                              opacity: 1,
                              scale: 0 
                            }}
                            animate={{ 
                              x: `${Math.random() * 100}%`,
                              y: `${Math.random() * 100}%`,
                              opacity: 0,
                              scale: 1
                            }}
                            transition={{ duration: 0.8 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl p-8 backdrop-blur-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
            
            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-4 mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-sm"
              >
                <FaHeart className="text-red-400 text-3xl animate-pulse" />
                <h3 className="text-3xl font-bold text-white">Why Choose FunPortal?</h3>
                <FaMagic className="text-yellow-400 text-3xl" />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🎨', title: 'Creative Freedom', desc: 'Unleash your imagination with powerful creative tools', color: 'from-blue-500/30 to-purple-500/30' },
                  { icon: '🧠', title: 'Learn & Play', desc: 'Educational experiences disguised as pure fun', color: 'from-purple-500/30 to-pink-500/30' },
                  { icon: '🌟', title: 'Endless Updates', desc: 'New worlds and features added regularly', color: 'from-pink-500/30 to-orange-500/30' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} backdrop-blur-lg border border-white/10`}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-4"
                    >
                      {item.icon}
                    </motion.div>
                    <h4 className="font-bold text-white text-xl mb-3">{item.title}</h4>
                    <p className="text-gray-300">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action with Particles */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
            }}
            className="inline-block p-8 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 mb-8"
          >
            <div className="flex items-center gap-6 mb-4">
              <FaUsers className="text-cyan-400 text-3xl" />
              <p className="text-xl text-white font-semibold">
                Join our community of creators and explorers
              </p>
              <FaGamepad className="text-purple-400 text-3xl" />
            </div>
            <p className="text-gray-400 text-lg">
              Start your journey today - no sign up required!
            </p>
          </motion.div>
          
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-500 flex items-center justify-center gap-3"
          >
            <span>Made with ❤️</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <span>For creative minds everywhere</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full" />
            <span>{new Date().getFullYear()}</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ 
          scale: 1.2,
          rotate: 360,
          transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.8 }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl flex items-center justify-center text-2xl z-50 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ↑
        </motion.span>
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-300/50 blur-sm group-hover:blur-md transition-all duration-300" />
      </motion.button>

      {/* Audio Visualizer (Placeholder) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/50 backdrop-blur-lg border border-white/10">
          <FaMusic className="text-purple-400" />
          <div className="flex items-center gap-1">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
                animate={{ height: [5, 20, 5] }}
                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.1 }}
                style={{ height: '10px' }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;