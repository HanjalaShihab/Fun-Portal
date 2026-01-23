// src/components/RandomFunGenerator/RandomFunGenerator.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRandom, FaHeart, FaShareAlt, FaRedo, FaFire,
  FaStar, FaTrophy, FaSmile, FaComments, FaGamepad,
  FaCrown, FaAward, FaLightbulb, FaMagic
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const RandomFunGenerator = () => {
  const [currentType, setCurrentType] = useState('joke');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [mood, setMood] = useState('happy');
  const [animating, setAnimating] = useState(false);

  const contentTypes = [
    { id: 'joke', icon: FaSmile, label: 'Jokes', color: 'from-yellow-400 to-orange-500', emoji: '😂' },
    { id: 'trivia', icon: FaLightbulb, label: 'Trivia', color: 'from-blue-500 to-cyan-500', emoji: '🧠' },
    { id: 'quote', icon: FaComments, label: 'Quotes', color: 'from-purple-500 to-pink-500', emoji: '💭' },
    { id: 'riddle', icon: FaMagic, label: 'Riddles', color: 'from-red-500 to-pink-500', emoji: '🤔' },
    { id: 'fact', icon: FaStar, label: 'Facts', color: 'from-emerald-500 to-teal-500', emoji: '🌟' },
    { id: 'activity', icon: FaGamepad, label: 'Activities', color: 'from-pink-500 to-rose-500', emoji: '🎮' },
    { id: 'pickupline', icon: FaHeart, label: 'Pick-up Lines', color: 'from-rose-500 to-red-500', emoji: '💘' },
    { id: 'wouldyourather', icon: FaFire, label: 'Would You Rather', color: 'from-orange-500 to-yellow-500', emoji: '🔥' },
    { id: 'truthordare', icon: FaCrown, label: 'Truth or Dare', color: 'from-amber-500 to-orange-500', emoji: '👑' },
  ];

  const moods = [
    { id: 'happy', emoji: '😊', color: 'from-yellow-400 to-orange-400', types: ['joke', 'meme', 'pickupline'] },
    { id: 'curious', emoji: '🤔', color: 'from-blue-400 to-cyan-400', types: ['trivia', 'riddle', 'fact'] },
    { id: 'inspired', emoji: '✨', color: 'from-purple-400 to-pink-400', types: ['quote', 'fact'] },
    { id: 'playful', emoji: '🎮', color: 'from-green-400 to-emerald-400', types: ['activity', 'truthordare', 'wouldyourather'] },
  ];

  // Initialize
  useEffect(() => {
    const savedPoints = localStorage.getItem('funPoints');
    const savedFavorites = localStorage.getItem('funFavorites');
    
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    fetchContent('joke'); // Initial content
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('funPoints', points.toString());
    localStorage.setItem('funFavorites', JSON.stringify(favorites));
  }, [points, favorites]);

  // Update level
  useEffect(() => {
    const newLevel = Math.floor(points / 50) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      toast.success(`🎉 Level ${newLevel} Unlocked!`);
      triggerConfetti();
    }
  }, [points]);

  const fetchContent = async (type = currentType) => {
    setLoading(true);
    setAnimating(true);
    
    // Hide old content with animation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      let newContent;
      
      // Switch based on the type parameter
      const contentType = type || currentType;
      
      switch(contentType) {
        case 'joke':
          const jokes = [
            { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
            { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
            { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field!" },
            { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear!" },
          ];
          const joke = jokes[Math.floor(Math.random() * jokes.length)];
          newContent = {
            type: 'joke',
            content: joke.setup,
            answer: joke.punchline,
            emoji: '😂',
            color: 'yellow',
          };
          break;

        case 'trivia':
          const triviaList = [
            { question: "What is the only mammal that can't jump?", answer: 'Elephant' },
            { question: "How many hearts does an octopus have?", answer: '3' },
            { question: "What planet has the most moons?", answer: 'Saturn' },
            { question: "What's the smallest country in the world?", answer: 'Vatican City' },
          ];
          const trivia = triviaList[Math.floor(Math.random() * triviaList.length)];
          newContent = {
            type: 'trivia',
            content: trivia.question,
            answer: trivia.answer,
            emoji: '🧠',
            color: 'blue',
          };
          break;

        case 'quote':
          const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
          ];
          const quote = quotes[Math.floor(Math.random() * quotes.length)];
          newContent = {
            type: 'quote',
            content: quote.text,
            author: quote.author,
            emoji: '💭',
            color: 'purple',
          };
          break;

        case 'riddle':
          const riddles = [
            { question: "I speak without a mouth and hear without ears. What am I?", answer: "An echo" },
            { question: "What has keys but can't open locks?", answer: "A piano" },
            { question: "The more you take, the more you leave behind. What am I?", answer: "Footsteps" },
            { question: "What has a heart that doesn't beat?", answer: "An artichoke" },
          ];
          const riddle = riddles[Math.floor(Math.random() * riddles.length)];
          newContent = {
            type: 'riddle',
            content: riddle.question,
            answer: riddle.answer,
            emoji: '🤔',
            color: 'red',
          };
          break;

        case 'fact':
          const facts = [
            "Honey never spoils. Archaeologists have found 3,000-year-old honey that's still edible!",
            "Octopuses have three hearts. Two pump blood to the gills, one to the rest of the body.",
            "Bananas are berries, but strawberries aren't.",
            "A day on Venus is longer than a year on Venus.",
          ];
          newContent = {
            type: 'fact',
            content: facts[Math.floor(Math.random() * facts.length)],
            emoji: '🌟',
            color: 'emerald',
          };
          break;

        case 'activity':
          const activities = [
            "Do 10 jumping jacks right now!",
            "Compliment the next person you talk to",
            "Learn 3 facts about a random country",
            "Try drawing something with your non-dominant hand",
          ];
          newContent = {
            type: 'activity',
            content: activities[Math.floor(Math.random() * activities.length)],
            emoji: '🎮',
            color: 'pink',
          };
          break;

        case 'pickupline':
          const pickuplines = [
            "Are you a magician? Because whenever I look at you, everyone else disappears.",
            "Do you have a map? I keep getting lost in your eyes.",
            "Is your name Google? Because you have everything I've been searching for.",
            "Are you made of copper and tellurium? Because you're Cu-Te.",
          ];
          newContent = {
            type: 'pickupline',
            content: pickuplines[Math.floor(Math.random() * pickuplines.length)],
            emoji: '💘',
            color: 'rose',
          };
          break;

        case 'wouldyourather':
          const wyr = [
            "Would you rather have the ability to fly or be invisible?",
            "Would you rather always be 10 minutes late or 20 minutes early?",
            "Would you rather have unlimited sushi for life or unlimited tacos?",
            "Would you rather be able to talk to animals or speak all languages?",
          ];
          newContent = {
            type: 'wouldyourather',
            content: wyr[Math.floor(Math.random() * wyr.length)],
            emoji: '🔥',
            color: 'orange',
          };
          break;

        case 'truthordare':
          const tod = [
            "Truth: What's the most embarrassing thing you've done in public?",
            "Dare: Do your best impression of a celebrity.",
            "Truth: What's your biggest fear?",
            "Dare: Text your crush right now.",
          ];
          newContent = {
            type: 'truthordare',
            content: tod[Math.floor(Math.random() * tod.length)],
            emoji: '👑',
            color: 'amber',
          };
          break;
          
        default:
          // Fallback to joke
          const defaultJoke = { setup: "Why was the math book sad?", punchline: "Because it had too many problems!" };
          newContent = {
            type: 'joke',
            content: defaultJoke.setup,
            answer: defaultJoke.punchline,
            emoji: '😂',
            color: 'yellow',
          };
      }

      setContent(newContent);
      addPoints(10);
      toast.success(`New ${contentType}! +10 points`);
      
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  // Update content when currentType changes
  useEffect(() => {
    if (currentType) {
      fetchContent(currentType);
    }
  }, [currentType]);

  const addPoints = (amount) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      if (newPoints % 50 === 0) {
        triggerConfetti();
      }
      return newPoints;
    });
  };

  const toggleFavorite = () => {
    if (!content) return;
    
    const isFavorited = favorites.some(fav => 
      fav.content === content.content && fav.type === content.type
    );
    
    if (isFavorited) {
      setFavorites(favorites.filter(fav => 
        !(fav.content === content.content && fav.type === content.type)
      ));
      toast('Removed from favorites');
    } else {
      setFavorites([...favorites, { 
        ...content, 
        timestamp: new Date(),
        id: Date.now()
      }]);
      addPoints(15);
      toast.success('Added to favorites! +15 points');
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
    const moodData = moods.find(m => m.id === newMood);
    if (moodData && moodData.types.length > 0) {
      const randomType = moodData.types[Math.floor(Math.random() * moodData.types.length)];
      setCurrentType(randomType);
      // fetchContent will be called automatically by useEffect
    }
  };

  const isFavorited = content && favorites.some(fav => 
    fav.content === content.content && fav.type === content.type
  );

  // Confetti Component
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-50px',
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.3,
            ease: "easeOut"
          }}
        >
          {['✨', '🎉', '🎊', '🌟', '💫', '🎯'][Math.floor(Math.random() * 6)]}
        </motion.div>
      ))}
    </div>
  );

  const handleCategoryClick = (typeId) => {
    setCurrentType(typeId);
    // Content will update via useEffect
  };

  const handleRefreshClick = () => {
    fetchContent(currentType); // Pass currentType to ensure we get same category
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      {showConfetti && <Confetti />}
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              rotate: 360,
            }}
            transition={{
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-8xl mb-6"
          >
            🎭
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Random Fun Factory
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Click any category below to get specific content! Change mood for different recommendations.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-500/30"
            >
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-white">{points}</span>
                <span className="text-gray-300">points</span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-sm border border-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                <span className="font-bold text-white">Level {userLevel}</span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600/30 to-orange-600/30 backdrop-blur-sm border border-red-500/30"
            >
              <div className="flex items-center gap-2">
                <FaFire className="text-orange-400" />
                <span className="font-bold text-white">{streak} day streak</span>
              </div>
            </motion.div>
          </div>

          {/* Mood Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {moods.map((m) => (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoodChange(m.id)}
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                  mood === m.id
                    ? `bg-gradient-to-r ${m.color} text-white shadow-lg scale-105`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="capitalize font-medium">{m.id}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Categories */}
          <div className="lg:col-span-1">
            <motion.div 
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <FaRandom className="text-purple-400" />
                <span>Fun Categories</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {contentTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(type.id)}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                      currentType === type.id
                        ? `bg-gradient-to-br ${type.color} shadow-lg scale-105 ring-2 ring-white/50`
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-4xl">{type.emoji}</div>
                    <div className="text-sm font-medium text-center text-white">
                      {type.label}
                    </div>
                    {currentType === type.id && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Current Category Info */}
              <motion.div 
                className="mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {contentTypes.find(t => t.id === currentType)?.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-white capitalize">
                        {currentType}
                      </div>
                      <div className="text-sm text-gray-400">
                        {contentTypes.find(t => t.id === currentType)?.label}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl text-purple-400">
                    ⬅️
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Center Panel - Content Display */}
          <div className="lg:col-span-2">
            <motion.div 
              className="rounded-2xl overflow-hidden h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Content Card */}
              <div className="bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-purple-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 min-h-[500px] flex flex-col">
                {/* Content Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={animating ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-4xl"
                    >
                      {content?.emoji || contentTypes.find(t => t.id === currentType)?.emoji}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white capitalize">
                        {currentType}
                      </h3>
                      <div className="text-gray-400">
                        {contentTypes.find(t => t.id === currentType)?.label}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFavorite}
                      disabled={!content}
                      className={`p-3 rounded-full flex items-center gap-2 ${
                        isFavorited
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      <FaHeart className={isFavorited ? 'fill-current' : ''} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRefreshClick}
                      disabled={loading}
                      className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      <FaRedo className={`text-xl ${loading ? 'animate-spin' : ''}`} />
                    </motion.button>
                  </div>
                </div>

                {/* Content Display */}
                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="text-6xl"
                        >
                          🌀
                        </motion.div>
                        <div className="text-2xl font-bold text-white">
                          Loading {currentType}...
                        </div>
                      </motion.div>
                    ) : content ? (
                      <motion.div
                        key={`${currentType}-${content.content?.slice(0, 20)}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-full space-y-8"
                      >
                        {/* Content based on type */}
                        {content.type === 'joke' && (
                          <div className="text-center space-y-6">
                            <div className="text-6xl animate-bounce">😂</div>
                            <div className="text-3xl font-medium text-white">
                              "{content.content}"
                            </div>
                            <motion.div 
                              className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              {content.answer}
                            </motion.div>
                          </div>
                        )}

                        {content.type === 'trivia' && (
                          <div className="space-y-8">
                            <div className="text-center">
                              <div className="text-6xl mb-6">🧠</div>
                              <div className="text-3xl font-medium text-white mb-8">
                                {content.content}
                              </div>
                            </div>
                            <div className="text-center">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  addPoints(20);
                                  toast.success(`Answer: ${content.answer} 🎯 (+20 points)`);
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl"
                              >
                                🔍 Reveal Answer
                              </motion.button>
                            </div>
                          </div>
                        )}

                        {content.type === 'quote' && (
                          <div className="text-center space-y-8">
                            <div className="text-6xl mb-6">💭</div>
                            <div className="text-3xl md:text-4xl italic font-light leading-relaxed text-white">
                              "{content.content}"
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                              — {content.author}
                            </div>
                          </div>
                        )}

                        {content.type === 'riddle' && (
                          <div className="space-y-8">
                            <div className="text-center">
                              <div className="text-6xl mb-6 animate-pulse">🤔</div>
                              <div className="text-3xl font-medium text-white mb-8">
                                {content.content}
                              </div>
                            </div>
                            <div className="text-center">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  addPoints(15);
                                  toast.success(`Answer: ${content.answer} 🎯 (+15 points)`);
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl"
                              >
                                🤯 Reveal Answer
                              </motion.button>
                            </div>
                          </div>
                        )}

                        {/* Other content types */}
                        {['fact', 'activity', 'pickupline', 'wouldyourather', 'truthordare'].includes(content.type) && (
                          <div className="text-center space-y-8">
                            <div className="text-6xl mb-6 animate-bounce">
                              {content.emoji}
                            </div>
                            <div className="text-3xl font-medium leading-relaxed text-white">
                              {content.content}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="text-center space-y-6">
                        <div className="text-8xl animate-pulse">🎲</div>
                        <div className="text-3xl font-bold text-white">
                          Select a category to begin!
                        </div>
                        <p className="text-gray-400">
                          Click on any category button to get started
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700/50">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      onClick={() => {
                        if (content?.content) {
                          navigator.clipboard.writeText(content.content);
                          toast.success('Copied to clipboard!');
                        }
                      }}
                    >
                      📋 Copy
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                      onClick={() => {
                        if (content?.content) {
                          const shareText = `Check out this ${currentType} from Fun Portal: "${content.content}"`;
                          navigator.share?.({ 
                            title: 'Fun Portal', 
                            text: shareText 
                          }) || navigator.clipboard.writeText(shareText);
                          toast.success('Shared!');
                        }
                      }}
                    >
                      <FaShareAlt />
                    </motion.button>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Category: <span className="text-white capitalize">{currentType}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tips Section */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🎯</div>
              <h4 className="font-bold text-lg text-white">How to Use</h4>
            </div>
            <p className="text-gray-300">
              Click any category to get content of that type. Use refresh to get new items.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">💖</div>
              <h4 className="font-bold text-lg text-white">Save Favorites</h4>
            </div>
            <p className="text-gray-300">
              Click the heart to save favorites. Earn extra points for saving!
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">😊</div>
              <h4 className="font-bold text-lg text-white">Change Mood</h4>
            </div>
            <p className="text-gray-300">
              Try different moods to get recommended content types.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RandomFunGenerator;