// src/components/RandomFunGenerator/RandomFunGenerator.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRandom, FaHeart, FaShareAlt, FaRedo, FaDownload,
  FaStar, FaTrophy, FaFire, FaLightbulb, FaBookmark,
  FaSmile, FaComments, FaMusic, FaImage, FaGamepad,
  FaCrown, FaBell, FaChartLine, FaAward, FaMagic
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const RandomFunGenerator = () => {
  const [currentType, setCurrentType] = useState('joke');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [mood, setMood] = useState('happy');

  const contentTypes = [
    { id: 'joke', icon: FaSmile, label: 'Jokes', color: 'from-yellow-400 to-orange-500', emoji: '😂', description: 'Get hilarious jokes!' },
    { id: 'trivia', icon: FaLightbulb, label: 'Trivia', color: 'from-blue-500 to-cyan-500', emoji: '🧠', description: 'Test your knowledge' },
    { id: 'quote', icon: FaComments, label: 'Quotes', color: 'from-purple-500 to-pink-500', emoji: '💭', description: 'Inspiring quotes' },
    { id: 'meme', icon: FaImage, label: 'Memes', color: 'from-green-500 to-emerald-500', emoji: '🖼️', description: 'Funny memes' },
    { id: 'riddle', icon: FaMagic, label: 'Riddles', color: 'from-red-500 to-pink-500', emoji: '🤔', description: 'Brain teasers' },
    { id: 'fact', icon: FaStar, label: 'Facts', color: 'from-indigo-500 to-purple-500', emoji: '🌟', description: 'Amazing facts' },
    { id: 'activity', icon: FaGamepad, label: 'Activities', color: 'from-pink-500 to-rose-500', emoji: '🎮', description: 'Fun activities' },
    { id: 'pickupline', icon: FaHeart, label: 'Pick-up Lines', color: 'from-rose-500 to-red-500', emoji: '💘', description: 'Cheesy lines' },
    { id: 'compliment', icon: FaAward, label: 'Compliments', color: 'from-teal-500 to-cyan-500', emoji: '💝', description: 'Feel-good words' },
    { id: 'wouldyourather', icon: FaFire, label: 'Would You Rather', color: 'from-orange-500 to-yellow-500', emoji: '🔥', description: 'Tough choices' },
    { id: 'truthordare', icon: FaCrown, label: 'Truth or Dare', color: 'from-amber-500 to-orange-500', emoji: '👑', description: 'Party game' },
    { id: 'challenge', icon: FaTrophy, label: 'Challenges', color: 'from-yellow-500 to-amber-500', emoji: '🏆', description: 'Daily challenges' },
  ];

  const moods = [
    { id: 'happy', emoji: '😊', color: 'from-yellow-400 to-orange-400' },
    { id: 'sad', emoji: '😢', color: 'from-blue-400 to-indigo-400' },
    { id: 'funny', emoji: '🤣', color: 'from-pink-400 to-rose-400' },
    { id: 'smart', emoji: '🤓', color: 'from-green-400 to-emerald-400' },
    { id: 'random', emoji: '🎲', color: 'from-purple-400 to-violet-400' },
  ];

  const achievementsList = [
    { id: 'first_content', name: 'First Timer!', icon: '🎯', description: 'View your first content', unlocked: false },
    { id: 'joke_master', name: 'Joke Master', icon: '😂', description: 'View 10 jokes', unlocked: false },
    { id: 'trivia_pro', name: 'Trivia Pro', icon: '🧠', description: 'Answer 5 trivia correctly', unlocked: false },
    { id: 'meme_lord', name: 'Meme Lord', icon: '👑', description: 'View 20 memes', unlocked: false },
    { id: 'streak_7', name: '7-Day Streak', icon: '🔥', description: 'Visit for 7 days straight', unlocked: false },
    { id: 'points_100', name: 'Centurion', icon: '💯', description: 'Earn 100 points', unlocked: false },
  ];

  // Initialize
  useEffect(() => {
    const savedData = {
      favorites: localStorage.getItem('funFavorites'),
      points: localStorage.getItem('funPoints'),
      streak: localStorage.getItem('funStreak'),
      achievements: localStorage.getItem('funAchievements'),
    };

    if (savedData.favorites) setFavorites(JSON.parse(savedData.favorites));
    if (savedData.points) setPoints(parseInt(savedData.points));
    if (savedData.streak) setStreak(parseInt(savedData.streak));
    if (savedData.achievements) setAchievements(JSON.parse(savedData.achievements));

    // Initialize daily challenges
    const challenges = contentTypes.slice(0, 6).map(type => ({
      type: type.id,
      target: Math.floor(Math.random() * 3) + 2,
      current: 0,
      completed: false,
      reward: 25,
      icon: type.emoji,
    }));
    setDailyChallenges(challenges);

    // Load first content
    setTimeout(() => fetchContent(), 500);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('funFavorites', JSON.stringify(favorites));
    localStorage.setItem('funPoints', points.toString());
    localStorage.setItem('funStreak', streak.toString());
    localStorage.setItem('funAchievements', JSON.stringify(achievements));
  }, [favorites, points, streak, achievements]);

  // Update level based on points
  useEffect(() => {
    const newLevel = Math.floor(points / 100) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      toast.success(`🎉 Level Up! You're now Level ${newLevel}!`);
      triggerConfetti();
    }
  }, [points]);

  const fetchContent = async () => {
    setLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    try {
      let newContent;
      const sources = [
        'Fun Factory', 'Laugh Lab', 'Brain Bank', 'Meme Mountain',
        'Quote Castle', 'Riddle Realm', 'Fact Forest', 'Challenge Chamber'
      ];
      
      // Content based on type
      switch(currentType) {
        case 'joke':
          const jokes = [
            { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
            { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
            { setup: "Why did the scarecrow win an award?", punchline: "He was outstanding in his field!" },
            { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear!" },
            { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up!" },
          ];
          const joke = jokes[Math.floor(Math.random() * jokes.length)];
          newContent = {
            type: 'joke',
            content: joke.setup,
            answer: joke.punchline,
            source: sources[0],
            category: 'Humor',
            points: 10,
          };
          break;

        case 'trivia':
          const triviaList = [
            { question: "What is the only mammal that can't jump?", options: ['Elephant', 'Rhino', 'Hippo', 'Giraffe'], answer: 'Elephant' },
            { question: "How many hearts does an octopus have?", options: ['1', '2', '3', '4'], answer: '3' },
            { question: "What planet has the most moons?", options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], answer: 'Saturn' },
            { question: "What's the smallest country in the world?", options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], answer: 'Vatican City' },
          ];
          const trivia = triviaList[Math.floor(Math.random() * triviaList.length)];
          newContent = {
            type: 'trivia',
            content: trivia.question,
            options: trivia.options,
            answer: trivia.answer,
            source: sources[2],
            category: 'General Knowledge',
            points: 15,
          };
          break;

        case 'quote':
          const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
            { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
          ];
          const quote = quotes[Math.floor(Math.random() * quotes.length)];
          newContent = {
            type: 'quote',
            content: quote.text,
            author: quote.author,
            source: sources[4],
            category: 'Inspiration',
            points: 8,
          };
          break;

        case 'meme':
          const memes = [
            { title: "When you finally fix the bug", url: "https://i.imgflip.com/30b1gx.jpg" },
            { title: "Me trying to understand React hooks", url: "https://i.imgflip.com/1ur9b0.jpg" },
            { title: "How it feels to write JavaScript", url: "https://i.imgflip.com/1bij.jpg" },
            { title: "When the code works on first try", url: "https://i.imgflip.com/2/1bij.jpg" },
          ];
          const meme = memes[Math.floor(Math.random() * memes.length)];
          newContent = {
            type: 'meme',
            content: meme.title,
            url: meme.url,
            source: sources[3],
            category: 'Humor',
            points: 12,
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
            source: sources[5],
            category: 'Puzzle',
            points: 20,
          };
          break;

        case 'fact':
          const facts = [
            "Honey never spoils. Archaeologists have found 3,000-year-old honey that's still edible!",
            "Octopuses have three hearts. Two pump blood to the gills, one to the rest of the body.",
            "Bananas are berries, but strawberries aren't.",
            "A day on Venus is longer than a year on Venus.",
            "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.",
          ];
          newContent = {
            type: 'fact',
            content: facts[Math.floor(Math.random() * facts.length)],
            source: sources[6],
            category: 'Science',
            points: 7,
          };
          break;

        case 'activity':
          const activities = [
            "Do 10 jumping jacks right now!",
            "Compliment the next person you talk to",
            "Learn 3 facts about a random country",
            "Try drawing something with your non-dominant hand",
            "Call someone you haven't spoken to in a while",
          ];
          newContent = {
            type: 'activity',
            content: activities[Math.floor(Math.random() * activities.length)],
            source: sources[1],
            category: 'Action',
            points: 25,
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
            source: sources[0],
            category: 'Romance',
            points: 5,
          };
          break;

        case 'compliment':
          const compliments = [
            "You have the best smile!",
            "You're more helpful than you realize.",
            "You're making a difference.",
            "You're a great listener.",
            "You light up the room.",
          ];
          newContent = {
            type: 'compliment',
            content: compliments[Math.floor(Math.random() * compliments.length)],
            source: sources[1],
            category: 'Kindness',
            points: 5,
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
            source: sources[2],
            category: 'Choice',
            points: 10,
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
            source: sources[5],
            category: 'Game',
            points: 15,
          };
          break;

        case 'challenge':
          const challenges = [
            "Go an entire day without complaining",
            "Learn 5 words in a new language",
            "Take a photo of something beautiful today",
            "Try a food you've never eaten before",
          ];
          newContent = {
            type: 'challenge',
            content: challenges[Math.floor(Math.random() * challenges.length)],
            source: sources[7],
            category: 'Challenge',
            points: 50,
          };
          break;

        default:
          newContent = {
            type: 'joke',
            content: "Welcome to the Fun Portal!",
            source: 'Fun Portal',
            points: 5,
          };
      }

      setContent(newContent);
      setHistory(prev => [newContent, ...prev.slice(0, 9)]); // Keep last 10
      addPoints(newContent.points || 5);
      
      // Update daily challenge progress
      setDailyChallenges(prev => prev.map(challenge => 
        challenge.type === currentType && !challenge.completed
          ? { ...challenge, current: challenge.current + 1 }
          : challenge
      ));

      checkAchievements();
      toast.success(`+${newContent.points || 5} points!`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const addPoints = (amount) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      // Celebrate milestones
      if (newPoints % 100 === 0) {
        triggerConfetti();
        toast.success(`🎉 ${newPoints} points milestone!`);
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
      addPoints(10);
      toast.success('Added to favorites! +10 points');
    }
  };

  const checkAchievements = () => {
    const newAchievements = [...achievementsList];
    
    // Check each achievement
    if (points >= 100 && !achievements.some(a => a.id === 'points_100')) {
      newAchievements.find(a => a.id === 'points_100').unlocked = true;
      toast.success('🏆 Achievement Unlocked: Centurion!');
    }
    
    if (history.filter(h => h.type === 'joke').length >= 10 && !achievements.some(a => a.id === 'joke_master')) {
      newAchievements.find(a => a.id === 'joke_master').unlocked = true;
      toast.success('🏆 Achievement Unlocked: Joke Master!');
    }
    
    setAchievements(newAchievements);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleTriviaAnswer = (selected) => {
    if (selected === content.answer) {
      addPoints(30);
      toast.success(`🎉 Correct! +30 points!`);
    } else {
      toast.error(`❌ Wrong! The answer was: ${content.answer}`);
    }
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
    // Adjust content based on mood
    const moodTypes = {
      happy: ['joke', 'meme', 'compliment'],
      sad: ['quote', 'compliment', 'activity'],
      funny: ['joke', 'pickupline', 'meme'],
      smart: ['trivia', 'fact', 'riddle'],
      random: contentTypes.map(c => c.id)
    };
    
    const availableTypes = moodTypes[newMood];
    const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    setCurrentType(randomType);
    setTimeout(() => fetchContent(), 300);
  };

  const isFavorited = content && favorites.some(fav => 
    fav.content === content.content && fav.type === content.type
  );

  // Confetti Component
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl md:text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-50px',
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, (Math.random() - 0.5) * 300],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
        >
          {['🎉', '✨', '🎊', '🌟', '💫', '🎯', '🏆', '⭐', '🎈', '🎨'][Math.floor(Math.random() * 10)]}
        </motion.div>
      ))}
    </div>
  );

  // Star Rating Component
  const StarRating = ({ rating, onRate }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {star <= rating ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 p-4 md:p-8">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              🎪 Fun Carnival
            </span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Endless entertainment, one click away! Collect points, unlock achievements, and have fun!
          </p>
          
          {/* Mood Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {moods.map((m) => (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleMoodChange(m.id)}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  mood === m.id
                    ? `bg-gradient-to-r ${m.color} text-white shadow-lg`
                    : 'bg-white dark:bg-gray-700 shadow'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="capitalize">{m.id}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{points}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Lvl {userLevel}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Level</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{streak}🔥</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{favorites.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Favorites</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{history.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Viewed</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Categories & Challenges */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <FaRandom className="text-purple-500" />
                Fun Categories
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {contentTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentType(type.id);
                      setTimeout(() => fetchContent(), 300);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                      currentType === type.id
                        ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                        : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-2xl">{type.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold">{type.label}</div>
                      <div className="text-xs opacity-75">{type.description}</div>
                    </div>
                    {currentType === type.id && (
                      <motion.div 
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaStar />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Daily Challenges */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Daily Quests
              </h3>
              <div className="space-y-3">
                {dailyChallenges.map((challenge, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-800/50 dark:to-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{challenge.icon}</span>
                        <span className="text-sm font-medium capitalize">{challenge.type}</span>
                      </div>
                      <span className="text-xs font-bold text-green-500">+{challenge.reward}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (challenge.current / challenge.target) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs">{challenge.current}/{challenge.target}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Complete all quests for bonus! 🎯
              </div>
            </motion.div>
          </div>

          {/* Center Panel - Content Display */}
          <div className="lg:col-span-2">
            <motion.div 
              className="glass-card rounded-2xl shadow-2xl overflow-hidden h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Content Header */}
              <div className="p-6 border-b border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="text-4xl"
                    >
                      {contentTypes.find(t => t.id === currentType)?.emoji || '🎲'}
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
                        {currentType}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Source: {content?.source || 'Fun Portal'}</span>
                        {content?.points && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs">
                            +{content.points} points
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={fetchContent}
                    disabled={loading}
                    className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    <FaRedo className={`text-xl ${loading ? 'animate-spin' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* Content Display */}
              <div className="p-8 min-h-[500px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-6"
                    >
                      <div className="text-7xl animate-spin">🌀</div>
                      <div>
                        <div className="text-3xl font-bold mb-2">Loading Fun...</div>
                        <div className="text-gray-500">Preparing something amazing for you!</div>
                      </div>
                    </motion.div>
                  ) : content ? (
                    <motion.div
                      key={content.content}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-8"
                    >
                      {/* Content based on type */}
                      {content.type === 'joke' && (
                        <div className="text-center space-y-6">
                          <div className="text-7xl mb-6 animate-bounce">😂</div>
                          <div className="text-3xl font-medium mb-6">
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
                            <div className="text-7xl mb-6">🧠</div>
                            <div className="text-3xl font-medium mb-8">
                              {content.content}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.options?.map((option, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleTriviaAnswer(option)}
                                className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-400 text-xl text-left shadow-lg hover:shadow-xl"
                              >
                                {String.fromCharCode(65 + index)}. {option}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {content.type === 'quote' && (
                        <div className="text-center space-y-8">
                          <div className="text-7xl mb-6">💭</div>
                          <div className="text-3xl md:text-4xl italic font-light leading-relaxed">
                            "{content.content}"
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            — {content.author}
                          </div>
                        </div>
                      )}

                      {content.type === 'meme' && (
                        <div className="space-y-8">
                          <div className="text-center">
                            <div className="text-7xl mb-4">🖼️</div>
                            <div className="text-2xl font-medium mb-6">{content.content}</div>
                          </div>
                          <div className="flex justify-center">
                            <motion.img
                              src={content.url}
                              alt="Meme"
                              className="max-w-lg rounded-2xl shadow-2xl"
                              whileHover={{ scale: 1.02 }}
                            />
                          </div>
                        </div>
                      )}

                      {content.type === 'riddle' && (
                        <div className="space-y-8">
                          <div className="text-center">
                            <div className="text-7xl mb-6 animate-pulse">🤔</div>
                            <div className="text-3xl font-medium mb-8">
                              {content.content}
                            </div>
                          </div>
                          <div className="text-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                addPoints(15);
                                alert(`Answer: ${content.answer} 🎯`);
                              }}
                              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl"
                            >
                              🔍 Reveal Answer (+15 points)
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Add similar sections for other content types */}
                      {['fact', 'activity', 'pickupline', 'compliment', 'wouldyourather', 'truthordare', 'challenge'].includes(content.type) && (
                        <div className="text-center space-y-8">
                          <div className="text-7xl mb-6">
                            {contentTypes.find(t => t.id === content.type)?.emoji}
                          </div>
                          <div className="text-3xl font-medium leading-relaxed">
                            {content.content}
                          </div>
                          <div className="text-sm text-gray-500">
                            Category: {content.category || 'Fun'}
                          </div>
                        </div>
                      )}
                      
                      {/* Rating System */}
                      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <p className="text-lg mb-3">Rate this content:</p>
                          <StarRating rating={0} onRate={(rating) => {
                            addPoints(rating * 2);
                            toast.success(`Thanks for rating! +${rating * 2} points`);
                          }} />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="text-7xl">🎲</div>
                      <div className="text-3xl font-bold">Ready for Adventure?</div>
                      <p className="text-gray-500">Select a category and click "Next Random" to begin!</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar */}
              <div className="p-6 border-t border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleFavorite}
                      disabled={!content}
                      className={`p-3 rounded-xl flex items-center gap-2 ${
                        isFavorited
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <FaHeart className={isFavorited ? 'fill-current' : ''} />
                      <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300"
                      onClick={() => navigator.share?.({ title: content?.content, text: 'Check this out!' })}
                    >
                      <FaShareAlt />
                    </motion.button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(content?.content || '')}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400"
                    >
                      Copy
                    </button>
                    <button
                      onClick={triggerConfetti}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400"
                    >
                      Celebrate! 🎉
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - History, Favorites, Achievements */}
          <div className="lg:col-span-1 space-y-6">
            {/* History */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Recent History
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-lg bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-600/50 cursor-pointer"
                      onClick={() => {
                        setCurrentType(item.type);
                        setContent(item);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {contentTypes.find(t => t.id === item.type)?.emoji}
                          </span>
                          <span className="text-sm font-medium capitalize truncate">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          +{item.points || 5}
                        </span>
                      </div>
                      <div className="text-sm truncate text-gray-600 dark:text-gray-300">
                        {item.content}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <div>No history yet</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Favorites */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FaHeart className="text-red-500" />
                Favorites ({favorites.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {favorites.length > 0 ? (
                  favorites.slice(0, 4).map((fav, index) => (
                    <motion.div
                      key={fav.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-red-500/10 hover:from-pink-500/20 hover:to-red-500/20 cursor-pointer group"
                      onClick={() => {
                        setCurrentType(fav.type);
                        setContent(fav);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize flex items-center gap-2">
                          <span className="text-lg">{contentTypes.find(t => t.id === fav.type)?.emoji}</span>
                          {fav.type}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFavorites(favorites.filter(f => f.id !== fav.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-sm truncate text-gray-600 dark:text-gray-300">
                        {fav.content}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-4xl mb-2">⭐</div>
                    <div>No favorites yet</div>
                    <div className="text-sm mt-1">Click the heart to save!</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FaAward className="text-yellow-500" />
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {achievementsList.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg text-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-700/50 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fun Stats & Tips */}
        <motion.div 
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-lg mb-2">Daily Goals</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Complete 5 categories daily for bonus points!
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-lg mb-2">Quick Tips</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Change your mood to get different types of content!
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h4 className="font-bold text-lg mb-2">Level Up</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Every 100 points = New Level + Special Rewards!
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">💎</div>
            <h4 className="font-bold text-lg mb-2">Pro Tips</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rate content for extra points and better recommendations!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Glass Effect CSS */}
      <style jsx>{`
        .glass-card {
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(209, 213, 219, 0.3);
        }
        
        .dark .glass-card {
          background-color: rgba(30, 41, 59, 0.75);
          border: 1px solid rgba(55, 65, 81, 0.3);
        }
      `}</style>
    </div>
  );
};

export default RandomFunGenerator;