// src/components/PuzzleRoom/PuzzleRoom.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaUnlock, FaLightbulb, FaRedo, FaCheck } from 'react-icons/fa';
import Confetti from 'react-confetti';

const PuzzleRoom = () => {
  const [currentRoom, setCurrentRoom] = useState(1);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragItems, setDragItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const puzzles = [
    {
      id: 1,
      title: "The Locked Door",
      description: "Decode the pattern to unlock the door",
      type: "pattern",
      solution: "2413",
      hint: "Look for the numbers in ascending order of size",
      content: {
        pattern: [2, 4, 1, 3],
        shapes: ['🔺', '🟦', '🟨', '🟥'],
      }
    },
    {
      id: 2,
      title: "Secret Code",
      description: "Solve the riddle to reveal the code",
      type: "riddle",
      solution: "TIME",
      hint: "It flies without wings",
      content: {
        riddle: "I fly without wings, I cry without eyes. What am I?",
        options: ['Cloud', 'Time', 'Wind', 'Bird']
      }
    },
    {
      id: 3,
      title: "Matching Pairs",
      description: "Find all matching pairs of symbols",
      type: "matching",
      solution: 6,
      hint: "There are 6 pairs total",
      content: {
        items: ['🎭', '🎨', '🎯', '🎲', '🧩', '🎪', '🎭', '🎨', '🎯', '🎲', '🧩', '🎪']
      }
    }
  ];

  const currentPuzzle = puzzles.find(p => p.id === currentRoom);

  useEffect(() => {
    if (currentPuzzle?.type === 'matching') {
      // Initialize drag items for matching puzzle
      const items = currentPuzzle.content.items
        .map((emoji, index) => ({
          id: index,
          emoji,
          matched: false,
          flipped: false,
          position: index
        }))
        .sort(() => Math.random() - 0.5);
      
      setDragItems(items);
    }
  }, [currentRoom]);

  const handlePatternInput = (value) => {
    if (value === currentPuzzle.solution) {
      completePuzzle();
    }
  };

  const handleRiddleSelect = (option) => {
    if (option === currentPuzzle.solution) {
      completePuzzle();
    }
  };

  const handleCardFlip = (id) => {
    if (dragItems.filter(item => item.flipped && !item.matched).length >= 2) return;
    
    const updatedItems = [...dragItems];
    const itemIndex = updatedItems.findIndex(item => item.id === id);
    updatedItems[itemIndex].flipped = !updatedItems[itemIndex].flipped;
    setDragItems(updatedItems);

    // Check for matches
    const flippedItems = updatedItems.filter(item => item.flipped && !item.matched);
    if (flippedItems.length === 2) {
      if (flippedItems[0].emoji === flippedItems[1].emoji) {
        // Match found
        setTimeout(() => {
          const matchedItems = updatedItems.map(item => 
            item.flipped ? { ...item, matched: true, flipped: false } : item
          );
          setDragItems(matchedItems);
          
          // Check if all matched
          if (matchedItems.every(item => item.matched)) {
            completePuzzle();
          }
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          const resetItems = updatedItems.map(item => 
            item.flipped && !item.matched ? { ...item, flipped: false } : item
          );
          setDragItems(resetItems);
        }, 1000);
      }
    }
  };

  const completePuzzle = () => {
    const points = 100 - (hintsUsed * 20);
    setScore(prev => prev + points);
    setShowConfetti(true);
    setPuzzleCompleted(true);
    
    setTimeout(() => {
      setShowConfetti(false);
      if (currentRoom < puzzles.length) {
        setCurrentRoom(prev => prev + 1);
        setPuzzleCompleted(false);
        setHintsUsed(0);
      }
    }, 3000);
  };

  const useHint = () => {
    setHintsUsed(prev => prev + 1);
  };

  const resetPuzzle = () => {
    if (currentPuzzle.type === 'matching') {
      const resetItems = dragItems.map(item => ({
        ...item,
        flipped: false,
        matched: false
      })).sort(() => Math.random() - 0.5);
      setDragItems(resetItems);
    }
    setHintsUsed(0);
  };

  const PuzzleRenderer = () => {
    switch (currentPuzzle.type) {
      case 'pattern':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {currentPuzzle.content.shapes.join(' ')}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Enter the correct sequence (4 digits):
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePatternInput(num.toString())}
                  className="p-4 text-2xl bg-gradient-to-br from-portal-blue to-portal-purple text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );

      case 'riddle':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl mb-6 p-6 bg-gradient-to-r from-portal-purple/20 to-portal-pink/20 rounded-2xl">
                "{currentPuzzle.content.riddle}"
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentPuzzle.content.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleRiddleSelect(option)}
                  className="p-4 text-lg bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-portal-blue hover:scale-105 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Find all matching pairs
              </p>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
              {dragItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => !item.matched && handleCardFlip(item.id)}
                  className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${
                    item.matched
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : item.flipped
                      ? 'bg-gradient-to-br from-portal-blue to-portal-purple'
                      : 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800'
                  }`}
                  whileHover={{ scale: item.matched ? 1 : 1.05 }}
                  whileTap={{ scale: item.matched ? 1 : 0.95 }}
                >
                  {item.flipped || item.matched ? item.emoji : '?'}
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-4 md:p-8">
      {showConfetti && <Confetti />}
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            🧩 Puzzle Escape Room
          </h1>
          <p className="text-gray-300">
            Solve puzzles to escape the room. Room {currentRoom} of {puzzles.length}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Progress & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Progress */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4">
                Room Progress
              </h3>
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <div
                    key={puzzle.id}
                    className={`p-4 rounded-xl transition-all cursor-pointer ${
                      currentRoom === puzzle.id
                        ? 'bg-gradient-to-r from-portal-blue to-portal-purple'
                        : currentRoom > puzzle.id
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20'
                        : 'bg-gray-700/50'
                    }`}
                    onClick={() => {
                      if (currentRoom > puzzle.id) {
                        setCurrentRoom(puzzle.id);
                        setPuzzleCompleted(false);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {currentRoom > puzzle.id ? (
                        <FaCheck className="mr-3 text-green-400" />
                      ) : currentRoom === puzzle.id ? (
                        <FaLock className="mr-3" />
                      ) : (
                        <FaLock className="mr-3 opacity-50" />
                      )}
                      <div>
                        <div className="font-medium">Room {puzzle.id}</div>
                        <div className="text-sm opacity-75">{puzzle.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4">Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-portal-yellow">
                    {score}
                  </div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-portal-blue">
                    {currentRoom - 1}/{puzzles.length}
                  </div>
                  <div className="text-sm text-gray-300">Rooms Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-portal-pink">
                    {hintsUsed}
                  </div>
                  <div className="text-sm text-gray-300">Hints Used</div>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={useHint}
                  disabled={puzzleCompleted}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-portal-yellow to-orange-500 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                >
                  <FaLightbulb />
                  Use Hint ({3 - hintsUsed} left)
                </button>
                <button
                  onClick={resetPuzzle}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <FaRedo />
                  Reset Puzzle
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Puzzle */}
          <div className="lg:col-span-3">
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Puzzle Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="inline-block mb-4"
                >
                  <div className="text-6xl">
                    {puzzleCompleted ? '🏆' : '🔐'}
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">
                  {currentPuzzle.title}
                </h2>
                <p className="text-gray-300">
                  {currentPuzzle.description}
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        hintsUsed > i ? 'bg-portal-yellow' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Puzzle Content */}
              <div className="min-h-[400px] flex flex-col justify-center">
                <PuzzleRenderer />
              </div>

              {/* Completion Message */}
              <AnimatePresence>
                {puzzleCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center mt-8"
                  >
                    <div className="text-4xl mb-4">🎉 Puzzle Solved! 🎉</div>
                    <div className="text-xl text-portal-yellow">
                      +{100 - (hintsUsed * 20)} points!
                    </div>
                    <p className="text-gray-300 mt-2">
                      {currentRoom < puzzles.length
                        ? 'Moving to next room...'
                        : 'Congratulations! You escaped all rooms!'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint Display */}
              {hintsUsed > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 p-4 bg-gradient-to-r from-portal-yellow/20 to-orange-500/20 rounded-xl border border-portal-yellow/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FaLightbulb className="text-portal-yellow" />
                    <span className="font-bold">Hint:</span>
                  </div>
                  <p>{currentPuzzle.hint}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Puzzle Instructions */}
            <motion.div 
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-bold">Use Hints Wisely</h4>
                <p className="text-sm text-gray-300">
                  Each hint reduces your score
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-bold">Score System</h4>
                <p className="text-sm text-gray-300">
                  Complete quickly with fewer hints for more points
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700">
                <div className="text-2xl mb-2">🚪</div>
                <h4 className="font-bold">Escape All Rooms</h4>
                <p className="text-sm text-gray-300">
                  Solve all {puzzles.length} puzzles to escape
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleRoom;