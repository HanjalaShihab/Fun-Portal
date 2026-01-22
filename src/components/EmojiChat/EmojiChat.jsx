// src/components/EmojiChat/EmojiChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaSmile, FaUser, FaRobot, FaHeart, FaFire, FaThumbsUp, FaStar } from 'react-icons/fa';

const EmojiChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('EmojiMaster');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [typing, setTyping] = useState(false);
  const [usersOnline, setUsersOnline] = useState(5);
  const messagesEndRef = useRef(null);

  const emojiCategories = [
    {
      name: 'Smileys',
      emojis: ['😀', '😂', '🥰', '😎', '😜', '🤩', '😋', '🤗', '😴', '😷', '🤠', '🥳'],
    },
    {
      name: 'Gestures',
      emojis: ['👋', '👍', '👏', '🙏', '🤝', '💪', '🤘', '✌️', '🤞', '👌', '🙌', '🫰'],
    },
    {
      name: 'Objects',
      emojis: ['🎮', '🎧', '🎨', '📚', '🎭', '🎪', '🏆', '🎯', '🎲', '🧩', '🎸', '🎬'],
    },
    {
      name: 'Nature',
      emojis: ['🌞', '🌈', '🔥', '💧', '🌱', '🌺', '🐶', '🐱', '🦋', '🐳', '🦄', '🐙'],
    },
    {
      name: 'Food',
      emojis: ['🍕', '🍔', '🍦', '🍩', '🍪', '🍓', '🍉', '🍇', '🥑', '🥨', '🍿', '🧋'],
    },
  ];

  const reactions = ['❤️', '🔥', '😂', '😮', '👏', '👍', '🎉', '🤯', '✨', '💯'];

  const sampleMessages = [
    { 
      id: 1,
      user: 'Bot', 
      avatar: '🤖',
      text: 'Welcome to Emoji Chat! 🎉✨', 
      time: '10:00',
      reactions: { '❤️': 3, '🔥': 2 }
    },
    { 
      id: 2,
      user: 'Bot', 
      avatar: '🤖',
      text: 'Try sending some emojis! 😊👉', 
      time: '10:01',
      reactions: { '👍': 5 }
    },
    { 
      id: 3,
      user: 'Alice', 
      avatar: '👩',
      text: 'Hey everyone! 👋🌈', 
      time: '10:02',
      reactions: { '👋': 4 }
    },
    { 
      id: 4,
      user: 'Bob', 
      avatar: '👨',
      text: 'This is so fun! 🎮🎯🚀', 
      time: '10:03',
      reactions: { '🚀': 3, '🎮': 2 }
    },
    { 
      id: 5,
      user: 'Charlie', 
      avatar: '🧑‍💻',
      text: 'Learning React is awesome! ⚛️💻', 
      time: '10:04',
      reactions: { '💻': 3 }
    },
  ];

  useEffect(() => {
    setMessages(sampleMessages);
    // Simulate random user joining/leaving
    const interval = setInterval(() => {
      setUsersOnline(prev => Math.max(3, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerConfetti = () => {
    // Create simple confetti effect using DOM elements
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.innerHTML = ['🎉', '✨', '🎊', '🌟', '💫'][Math.floor(Math.random() * 5)];
      confetti.style.position = 'fixed';
      confetti.style.fontSize = '24px';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-50px';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      confetti.style.userSelect = 'none';
      confettiContainer.appendChild(confetti);

      // Animate confetti
      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 50}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
      });

      animation.onfinish = () => confetti.remove();
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userName,
      avatar: '😊',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setTyping(false);

    // Trigger confetti for certain emojis
    if (inputText.includes('🎉') || inputText.includes('🎊')) {
      triggerConfetti();
    }

    // Simulate typing from bot
    setTyping(true);
    setTimeout(() => {
      const botResponses = [
        'Nice! 👌',
        'Love it! ❤️',
        'Haha! 😂',
        'Awesome! 🚀',
        'Cool! 😎',
        'Interesting! 🤔',
        'Wow! 🤩',
        'Amazing! ✨',
        'Great point! 💯',
        'Well said! 👏',
        'So true! 🙌',
        'Epic! 🤘',
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: Date.now() + 1,
        user: 'Bot',
        avatar: '🤖',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMessage]);
      setTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const newReactions = { ...msg.reactions };
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        return { ...msg, reactions: newReactions };
      }
      return msg;
    }));
    
    setReaction(emoji);
    setTimeout(() => setReaction(null), 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const quickReactions = ['❤️', '😂', '😮', '👏', '🎉', '🔥', '👍', '✨'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/20 p-4 md:p-8">
      {/* Confetti Container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-40"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              😄 Emoji Chat
            </span>
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chat using only emojis! Double-click messages to react. 
            <span className="block text-sm text-gray-500 mt-1">✨ Express yourself without words!</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FaUser className="text-purple-500" />
                Your Profile
              </h3>
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  😊
                </motion.div>
                <div className="ml-4">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500 w-full"
                    maxLength={15}
                    placeholder="Your name"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-gray-500">Online</span>
                    <span className="text-sm text-purple-500 font-bold ml-auto">{usersOnline} online</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Reactions */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FaFire className="text-red-500" />
                Quick Reactions
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {quickReactions.map((emoji, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addEmoji(emoji)}
                    className="text-3xl p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all shadow-sm"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Emoji Picker */}
            <motion.div 
              className="glass-card rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaSmile className="text-yellow-500" />
                  Emoji Picker
                </h3>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                >
                  {showEmojiPicker ? 'Hide' : 'Show'}
                </button>
              </div>
              
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {emojiCategories.map((category, index) => (
                      <div key={category.name} className="mb-4">
                        <h4 className="font-medium text-gray-600 dark:text-gray-300 mb-2">
                          {category.name}
                        </h4>
                        <div className="grid grid-cols-6 gap-1">
                          {category.emojis.map((emoji, emojiIndex) => (
                            <motion.button
                              key={emojiIndex}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => addEmoji(emoji)}
                              className="text-2xl p-1 hover:bg-white/50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Live Reactions */}
            <AnimatePresence>
              {reaction && (
                <motion.div
                  key={reaction}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl pointer-events-none z-50"
                >
                  {reaction}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-3">
            <motion.div 
              className="glass-card rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Emoji Universe 🌌
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {messages.length} messages • {usersOnline} users online
                    </p>
                  </div>
                  <motion.div 
                    className="flex items-center gap-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-green-500">LIVE</span>
                  </motion.div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/30 to-transparent dark:from-gray-800/30">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.user === userName ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start gap-3 max-w-[80%]">
                        {message.user !== userName && (
                          <div className="text-2xl mt-2">{message.avatar}</div>
                        )}
                        <div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-2xl p-4 ${
                              message.user === userName
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                                : message.user === 'Bot'
                                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-700/30 dark:to-cyan-700/30 rounded-bl-none'
                                : 'bg-white/80 dark:bg-gray-700/80 rounded-bl-none'
                            } shadow-md`}
                            onDoubleClick={() => handleReaction(message.id, '❤️')}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold">
                                {message.user}
                              </span>
                              <span className="text-xs opacity-75">
                                {message.time}
                              </span>
                              {message.user === 'Bot' && (
                                <FaRobot className="text-blue-500" />
                              )}
                            </div>
                            <div className="text-3xl leading-relaxed">
                              {message.text}
                            </div>
                            
                            {/* Reactions */}
                            {message.reactions && Object.keys(message.reactions).length > 0 && (
                              <motion.div 
                                className="flex flex-wrap gap-1 mt-3"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {Object.entries(message.reactions).map(([emoji, count]) => (
                                  <motion.div
                                    key={emoji}
                                    whileHover={{ scale: 1.1 }}
                                    className="text-xs bg-white/30 dark:bg-black/30 rounded-full px-3 py-1 flex items-center gap-1"
                                  >
                                    <span className="text-lg">{emoji}</span>
                                    <span className="font-bold">{count}</span>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </motion.div>
                          
                          {/* Reaction Options */}
                          <div className="flex gap-1 mt-2 ml-1">
                            {reactions.slice(0, 5).map((emoji, idx) => (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleReaction(message.id, emoji)}
                                className="text-lg p-1 hover:bg-white/50 dark:hover:bg-gray-600 rounded-full"
                              >
                                {emoji}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        {message.user === userName && (
                          <div className="text-2xl mt-2">{message.avatar}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-gray-500 ml-4"
                  >
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm">Bot is typing...</span>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 transition-colors shadow-sm"
                  >
                    <FaSmile className="text-xl text-yellow-500" />
                  </motion.button>
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        if (e.target.value.includes('🎉')) triggerConfetti();
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your emoji message here... ✨"
                      className="w-full p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700/50 bg-white/90 dark:bg-gray-800/90 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-600 resize-none text-lg shadow-inner"
                      rows={2}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {inputText.length}/200
                      </span>
                      {inputText.length > 150 && (
                        <span className="text-xs text-red-500 animate-pulse">⚠️ Long message!</span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                    className="px-6 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </div>
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <div className="flex flex-wrap justify-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-red-500" />
                      Double-click messages to react
                    </span>
                    <span className="flex items-center gap-1">
                      <FaFire className="text-orange-500" />
                      Use 🎉 for celebration!
                    </span>
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      Press Enter to send
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats & Tips */}
            <motion.div 
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card rounded-2xl p-5 text-center shadow-lg">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-lg mb-2">Quick Reactions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Double-click messages or use reaction buttons
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center shadow-lg">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="font-bold text-lg mb-2">Special Effects</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Send 🎉 to trigger amazing visual effects!
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center shadow-lg">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-bold text-lg mb-2">Smart Bot</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Bot responds with relevant emojis
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Add this to your CSS or index.css */}
      <style jsx>{`
        .glass-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .glass-card {
          background: rgba(30, 30, 40, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default EmojiChat;