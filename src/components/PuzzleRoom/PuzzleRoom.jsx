// src/components/PuzzleRoom/PuzzleRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLock, FaLightbulb, FaRedo, FaCheck,
  FaBrain, FaClock, FaTrophy, FaFire,
  FaPuzzlePiece, FaDoorOpen, FaChevronRight
} from 'react-icons/fa';
import Confetti from 'react-confetti';

const PuzzleRoom = () => {
  const [currentRoom, setCurrentRoom] = useState(1);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [playerName] = useState('Analyst');
  const [achievements, setAchievements] = useState([]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [puzzleHistory, setPuzzleHistory] = useState([]);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [memorySequence, setMemorySequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [showSequence, setShowSequence] = useState(true);
  const [cipherInput, setCipherInput] = useState('');

  const puzzles = [
    {
      id: 1,
      title: "Quantum Entanglement",
      description: "Solve the quantum state superposition",
      type: "quantum",
      difficulty: "Beginner",
      solution: "√2",
      hint: "The probability amplitudes must sum to 1",
      icon: '⚛️',
      timeBonus: 50,
      content: {
        state: "|ψ⟩ = (|0⟩ + |1⟩)/√2",
        question: "What is the normalization constant?",
        options: ['1', '√2', '2', '1/√2']
      }
    },
    {
      id: 2,
      title: "Cryptographic Cypher",
      description: "Decrypt the Vigenère cipher with key 'KEY'",
      type: "cipher",
      difficulty: "Beginner",
      solution: "ENIGMA",
      hint: "Each letter is shifted according to the key 'KEY'",
      icon: '🔐',
      timeBonus: 60,
      content: {
        encrypted: "MJQXZ",
        key: "KEY",
        alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        options: ['ENIGMA', 'CIPHER', 'SECRET', 'RIDDLE']
      }
    },
    {
      id: 3,
      title: "Neural Network Weights",
      description: "Adjust weights to achieve target output",
      type: "neural",
      difficulty: "Intermediate",
      solution: "0.8",
      hint: "Use sigmoid activation: σ(z) = 1/(1+e^-z)",
      icon: '🧠',
      timeBonus: 70,
      content: {
        inputs: [1, 0.5],
        weights: [0.6, '?'],
        bias: -0.5,
        target: 0.55,
        activation: "sigmoid",
        options: ['0.8', '0.7', '0.9', '1.0']
      }
    },
    {
      id: 4,
      title: "Tensor Manipulation",
      description: "Calculate the tensor contraction result",
      type: "tensor",
      difficulty: "Intermediate",
      solution: "14",
      hint: "Sum over repeated indices: Tⁱʲ Sⱼₖ = Rⁱₖ",
      icon: '📐',
      timeBonus: 80,
      content: {
        T: [[1, 2], [3, 4]],
        S: [[2, 0], [1, 2]],
        operation: "T·S trace",
        options: ['14', '12', '16', '18']
      }
    },
    {
      id: 5,
      title: "Fourier Transform",
      description: "Identify the frequency domain representation",
      type: "fourier",
      difficulty: "Advanced",
      solution: "sinc",
      hint: "Rectangular window in time domain becomes sinc in frequency",
      icon: '📈',
      timeBonus: 90,
      content: {
        timeDomain: "rect(t/T)",
        question: "What is its Fourier Transform?",
        options: ['sinc', 'delta', 'gaussian', 'exponential']
      }
    },
    {
      id: 6,
      title: "Genetic Algorithm",
      description: "Select the fittest chromosome",
      type: "genetic",
      difficulty: "Intermediate",
      solution: "1010",
      hint: "Fitness = number of 1s * 2 - number of transitions",
      icon: '🧬',
      timeBonus: 100,
      content: {
        chromosomes: ['1010', '1100', '0011', '1110'],
        fitness: "f(x) = 2*ones(x) - transitions(x)",
        options: ['1010', '1100', '0011', '1110']
      }
    },
    {
      id: 7,
      title: "Quantum Circuit",
      description: "What is the output state?",
      type: "quantum-circuit",
      difficulty: "Advanced",
      solution: "|00⟩",
      hint: "Hadamard creates superposition, CNOT entangles, measure collapses",
      icon: '⚡',
      timeBonus: 110,
      content: {
        circuit: "H ⊗ I → CNOT → Measure",
        initialState: "|00⟩",
        options: ['|00⟩', '|01⟩', '|10⟩', '|11⟩']
      }
    },
    {
      id: 8,
      title: "Blockchain Hash",
      description: "Find the nonce for valid proof-of-work",
      type: "blockchain",
      difficulty: "Intermediate",
      solution: "12345",
      hint: "SHA256(prev_hash + nonce) must start with '0000'",
      icon: '⛓️',
      timeBonus: 120,
      content: {
        prevHash: "0000abcd...",
        target: "0000",
        algorithm: "SHA256",
        options: ['12345', '54321', '67890', '98765']
      }
    },
    {
      id: 9,
      title: "Differential Equation",
      description: "Solve the simple harmonic oscillator",
      type: "differential",
      difficulty: "Advanced",
      solution: "cos(2t)",
      hint: "d²x/dt² + ω²x = 0 has sinusoidal solutions",
      icon: '∫',
      timeBonus: 130,
      content: {
        equation: "d²x/dt² + 4x = 0",
        initial: "x(0)=1, x'(0)=0",
        options: ['cos(2t)', 'sin(2t)', 'e^{2t}', 'e^{-2t}']
      }
    },
    {
      id: 10,
      title: "Bayesian Inference",
      description: "Calculate the posterior probability",
      type: "probability",
      difficulty: "Intermediate",
      solution: "0.75",
      hint: "Use Bayes theorem: P(A|B) = P(B|A)P(A)/P(B)",
      icon: '📊',
      timeBonus: 140,
      content: {
        prior: "P(A)=0.6",
        likelihood: "P(B|A)=0.8",
        evidence: "P(B)=0.64",
        options: ['0.75', '0.70', '0.80', '0.85']
      }
    },
    {
      id: 11,
      title: "Graph Theory",
      description: "Find the minimum spanning tree weight",
      type: "graph",
      difficulty: "Intermediate",
      solution: "15",
      hint: "Use Kruskal's algorithm, add smallest edges without cycles",
      icon: '🕸️',
      timeBonus: 150,
      content: {
        vertices: 5,
        edges: "AB=5, AC=3, AD=6, BC=4, BD=7, CD=8, CE=9, DE=2",
        options: ['15', '16', '17', '18']
      }
    },
    {
      id: 12,
      title: "Compiler Optimization",
      description: "Optimize the assembly code sequence",
      type: "compiler",
      difficulty: "Advanced",
      solution: "5",
      hint: "Look for redundant loads and common subexpressions",
      icon: '💻',
      timeBonus: 160,
      content: {
        code: "LOAD R1, A\nLOAD R2, B\nADD R3, R1, R2\nSTORE R3, C\nLOAD R4, A\nLOAD R5, B",
        question: "Minimum instructions after optimization?",
        options: ['5', '6', '7', '8']
      }
    },
    {
      id: 13,
      title: "Relativity Paradox",
      description: "Solve the twin paradox time dilation",
      type: "relativity",
      difficulty: "Advanced",
      solution: "10",
      hint: "Δt' = Δt/γ, γ = 1/√(1-v²/c²), v=0.6c",
      icon: '⏱️',
      timeBonus: 170,
      content: {
        scenario: "Twin travels at 0.6c for 8 years",
        earthTime: "? years passed on Earth",
        options: ['10', '12', '14', '16']
      }
    },
    {
      id: 14,
      title: "Topology Problem",
      description: "Identify the homeomorphic surface",
      type: "topology",
      difficulty: "Advanced",
      solution: "torus",
      hint: "Surface with one hole, genus 1",
      icon: '🌀',
      timeBonus: 180,
      content: {
        description: "Surface obtained by identifying opposite edges of square",
        options: ['torus', 'sphere', 'klein bottle', 'projective plane']
      }
    },
    {
      id: 15,
      title: "Music Theory",
      description: "Analyze the chord progression",
      type: "music-theory",
      difficulty: "Intermediate",
      solution: "ii-V-I",
      hint: "Dm7-G7-Cmaj7 is classic jazz progression",
      icon: '🎵',
      timeBonus: 190,
      content: {
        progression: "Dm7 → G7 → Cmaj7",
        key: "C major",
        options: ['ii-V-I', 'I-IV-V', 'vi-ii-V', 'iii-vi-ii']
      }
    },
    {
      id: 16,
      title: "Organic Chemistry",
      description: "Predict the reaction product",
      type: "organic",
      difficulty: "Advanced",
      solution: "aldehyde",
      hint: "Ozonolysis of alkenes with reductive workup",
      icon: '⚗️',
      timeBonus: 200,
      content: {
        reaction: "R-CH=CH-R' + O₃ → ? (reductive workup)",
        options: ['aldehyde', 'ketone', 'alcohol', 'acid']
      }
    },
    {
      id: 17,
      title: "Game Theory",
      description: "Find the Nash equilibrium",
      type: "game-theory",
      difficulty: "Intermediate",
      solution: "B,B",
      hint: "No player can improve payoff by unilaterally changing strategy",
      icon: '♟️',
      timeBonus: 210,
      content: {
        matrix: "A/B: (3,3),(0,5)/(5,0),(1,1)",
        strategies: ["A","B"],
        options: ['A,A', 'A,B', 'B,A', 'B,B']
      }
    },
    {
      id: 18,
      title: "Linguistics Puzzle",
      description: "Identify the phonological rule",
      type: "linguistics",
      difficulty: "Intermediate",
      solution: "final devoicing",
      hint: "Voiced obstruents become voiceless at word end",
      icon: '🔤',
      timeBonus: 220,
      content: {
        data: "/bɛd/ → [bɛt], /dɒg/ → [dɒk]",
        language: "German",
        options: ['final devoicing', 'vowel raising', 'consonant harmony', 'metathesis']
      }
    },
    {
      id: 19,
      title: "Astrophysics",
      description: "Calculate black hole temperature",
      type: "astrophysics",
      difficulty: "Advanced",
      solution: "6e-8",
      hint: "Hawking temperature: T = ħc³/(8πGMk)",
      icon: '⭐',
      timeBonus: 230,
      content: {
        mass: "Solar mass",
        constants: "ħ, c, G, k given",
        options: ['6e-8 K', '1e-6 K', '1e-4 K', '1e-2 K']
      }
    },
    {
      id: 20,
      title: "Epistemic Logic",
      description: "Solve the muddy children puzzle",
      type: "logic",
      difficulty: "Expert",
      solution: "3",
      hint: "After n statements of 'I don't know', children with mud deduce",
      icon: '🤔',
      timeBonus: 500,
      content: {
        puzzle: "n children, k have mud on forehead. After k-1 rounds of 'I don't know', all muddy children know",
        question: "If 3rd statement reveals knowledge, how many muddy?",
        options: ['3', '4', '5', '6']
      }
    }
  ];

  const currentPuzzle = puzzles.find(p => p.id === currentRoom) || puzzles[0];
  const timerRef = useRef(null);

  // Initialize timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          unlockAchievement('⌛ Time\'s Up!', 'You ran out of time on this puzzle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentRoom]);

  // Initialize puzzle specific states
  useEffect(() => {
    if (currentPuzzle?.type === 'memory') {
      const symbols = ['α', 'β', 'γ', 'δ', 'ε'];
      const seq = Array.from({ length: 4 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
      setMemorySequence(seq);
      setPlayerSequence([]);
      setShowSequence(true);
      setTimeout(() => setShowSequence(false), 3000);
    }

    setCipherInput('');
  }, [currentRoom]);

  const handlePuzzleSubmit = (value) => {
    if (value.toString() === currentPuzzle.solution) {
      completePuzzle();
    } else {
      setStreak(0);
      setCombo(1);
      unlockAchievement('❌ Incorrect', 'Try a different approach');
    }
  };

  const handleOptionSelect = (option) => {
    handlePuzzleSubmit(option);
  };

  const handleCipherDecrypt = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const key = 'KEY'.repeat(Math.ceil(currentPuzzle.content.encrypted.length / 3));
    let decrypted = '';
    
    for (let i = 0; i < currentPuzzle.content.encrypted.length; i++) {
      const encryptedChar = currentPuzzle.content.encrypted[i];
      const keyChar = key[i];
      const shift = alphabet.indexOf(keyChar);
      
      let decryptedIndex = alphabet.indexOf(encryptedChar) - shift;
      if (decryptedIndex < 0) decryptedIndex += 26;
      
      decrypted += alphabet[decryptedIndex];
    }
    
    if (decrypted === currentPuzzle.solution) {
      completePuzzle();
    } else {
      setStreak(0);
    }
  };

  const completePuzzle = () => {
    const timeBonus = Math.floor(timeLeft / 10) * currentPuzzle.timeBonus;
    const hintPenalty = hintsUsed * 25;
    const streakBonus = streak * 50;
    const comboBonus = Math.floor(combo) * 20;

    const points = 100 + timeBonus - hintPenalty + streakBonus + comboBonus;

    setScore(prev => prev + Math.max(points, 50));
    setStreak(prev => prev + 1);
    setShowConfetti(true);
    setPuzzleCompleted(true);

    setPuzzleHistory(prev => [...prev, {
      id: currentRoom,
      name: currentPuzzle.title,
      score: points,
      time: 300 - timeLeft,
      hints: hintsUsed
    }]);

    if (streak >= 3) unlockAchievement('🔥 Hot Streak!', `Solved ${streak} puzzles in a row!`);
    if (hintsUsed === 0) unlockAchievement('🎯 Flawless Victory', 'Solved without hints!');
    if (timeLeft > 200) unlockAchievement('⚡ Speed Runner', 'Solved in under 2 minutes!');

    setTimeout(() => {
      setShowConfetti(false);
      if (currentRoom < puzzles.length) {
        setCurrentRoom(prev => prev + 1);
        setPuzzleCompleted(false);
        setHintsUsed(0);
        setTimeLeft(300);
        setCipherInput('');
      } else {
        setShowCompletionScreen(true);
        unlockAchievement('🏆 Puzzle Master', 'Completed all puzzles!');
      }
    }, 3000);
  };

  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      setShowHintModal(true);
      setTimeout(() => setShowHintModal(false), 3000);
    }
  };

  const resetPuzzle = () => {
    setHintsUsed(0);
    setStreak(0);
    setCipherInput('');
  };

  const unlockAchievement = (title, description) => {
    const id = Date.now();
    const newAchievement = {
      id,
      title,
      description,
      icon: ['🏆', '🎯', '🌟', '⚡', '🔓'][Math.floor(Math.random() * 5)]
    };

    setAchievements(prev => [newAchievement, ...prev.slice(0, 4)]);
    setShowAchievement(newAchievement);

    setTimeout(() => {
      setShowAchievement(null);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PuzzleRenderer = () => {
    switch (currentPuzzle.type) {
      case 'quantum':
      case 'fourier':
      case 'differential':
      case 'probability':
      case 'graph':
      case 'relativity':
      case 'topology':
      case 'music-theory':
      case 'organic':
      case 'game-theory':
      case 'linguistics':
      case 'astrophysics':
      case 'logic':
      case 'tensor':
      case 'blockchain':
      case 'compiler':
      case 'genetic':
      case 'quantum-circuit':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">
                {currentPuzzle.icon}
              </div>
              <div className="text-xl p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl mb-6">
                {currentPuzzle.content.question || currentPuzzle.content.equation || 
                 currentPuzzle.content.scenario || currentPuzzle.content.description}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {currentPuzzle.content.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="p-6 text-lg bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 hover:border-blue-500 hover:scale-105 transition-all"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-mono">{option}</div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'cipher':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">
                🔐
              </div>
              <div className="text-xl p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl mb-6">
                Encrypted: <span className="font-mono">{currentPuzzle.content.encrypted}</span>
              </div>
              <p className="text-lg text-gray-300 mb-4">
                Key: <span className="font-mono">{currentPuzzle.content.key}</span>
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={cipherInput}
                  onChange={(e) => setCipherInput(e.target.value.toUpperCase())}
                  className="flex-1 p-4 bg-gray-800 rounded-xl text-center text-xl font-mono"
                  placeholder="Enter decrypted text"
                  maxLength={6}
                />
                <button
                  onClick={handleCipherDecrypt}
                  className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold"
                >
                  Decrypt
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentPuzzle.content.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'neural':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">
                🧠
              </div>
              <div className="text-xl p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl mb-6">
                Inputs: [{currentPuzzle.content.inputs.join(', ')}]<br/>
                Target output: {currentPuzzle.content.target}<br/>
                Activation: {currentPuzzle.content.activation}
              </div>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-4 gap-8 items-center mb-8">
                {currentPuzzle.content.inputs.map((input, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                      {input}
                    </div>
                    <div className="text-sm">x{i+1}</div>
                  </div>
                ))}
                
                <div className="col-span-4 text-center my-4">
                  <div className="text-lg">Weights: [{currentPuzzle.content.weights[0]}, ?]</div>
                  <div className="text-sm text-gray-400">Bias: {currentPuzzle.content.bias}</div>
                </div>
                
                <div className="col-span-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-gray-700">
                    ?
                  </div>
                  <div className="text-lg">Output</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {currentPuzzle.content.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 hover:border-blue-500"
                  >
                    Weight: {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">
                🎵
              </div>
              <p className="text-xl text-gray-300 mb-6">
                {showSequence ? 'Memorize the sequence...' : 'Repeat the sequence'}
              </p>
              <div className="mb-8">
                {showSequence ? (
                  <div className="text-4xl flex justify-center gap-4">
                    {memorySequence.map((symbol, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.5 }}
                        className="text-6xl font-mono bg-gradient-to-br from-purple-600 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center"
                      >
                        {symbol}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-2xl text-gray-500">
                    Your turn! Click symbols in correct order
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
              {['α', 'β', 'γ', 'δ', 'ε'].map((symbol) => (
                <motion.button
                  key={symbol}
                  onClick={() => {
                    if (!showSequence) {
                      const newSeq = [...playerSequence, symbol];
                      setPlayerSequence(newSeq);
                      if (newSeq.length === memorySequence.length) {
                        if (newSeq.join('') === memorySequence.join('')) {
                          completePuzzle();
                        } else {
                          setPlayerSequence([]);
                          setStreak(0);
                        }
                      }
                    }
                  }}
                  disabled={showSequence}
                  className={`p-6 text-4xl font-mono rounded-2xl ${
                    showSequence ? 'opacity-50' : 'hover:scale-105'
                  } bg-gradient-to-br from-gray-800 to-gray-900`}
                  whileHover={!showSequence ? { scale: 1.05 } : {}}
                >
                  {symbol}
                </motion.button>
              ))}
            </div>
            {playerSequence.length > 0 && (
              <div className="text-center">
                <div className="text-lg text-gray-400">Your sequence:</div>
                <div className="text-2xl mt-2 font-mono">{playerSequence.join(' ')}</div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-8 text-center">
            <div className="text-8xl mb-6">
              {currentPuzzle.icon}
            </div>
            <p className="text-2xl text-gray-300">
              {currentPuzzle.description}
            </p>
            <div className="text-xl text-gray-400">
              Select the correct answer from the options below.
            </div>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {currentPuzzle.content.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 hover:border-blue-500 font-mono"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  const CompletionScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="text-9xl mb-8"
          >
            🧠
          </motion.div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Intellectual Conquest!
          </h2>
          <p className="text-2xl text-gray-300 mb-8">
            You've mastered {puzzles.length} advanced puzzles!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-4">🏆</div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{score}</div>
            <div className="text-gray-400">Total Score</div>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-4">⚡</div>
            <div className="text-3xl font-bold text-orange-400 mb-2">{streak}</div>
            <div className="text-gray-400">Highest Streak</div>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {puzzleHistory.length > 0 ? 
                `${Math.round((puzzleHistory.filter(p => p.hints === 0).length / puzzleHistory.length) * 100)}%` 
                : '100%'}
            </div>
            <div className="text-gray-400">Hintless Completion</div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setCurrentRoom(1);
              setShowCompletionScreen(false);
              setScore(0);
              setStreak(0);
              setHintsUsed(0);
              setPuzzleHistory([]);
              resetPuzzle();
            }}
            className="px-8 py-4 text-xl bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Begin New Journey
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8 relative overflow-hidden">
      {showConfetti && <Confetti />}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              rotate: 360,
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <FaBrain className="text-cyan-400 animate-pulse" />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Intellectual Labyrinth
              </span>
            </h1>
            <p className="text-gray-400">
              Chamber {currentRoom} • {currentPuzzle.difficulty} • {currentPuzzle.title}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
              <FaTrophy className="text-yellow-400" />
              <span className="font-bold">{score}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
              <FaClock className="text-red-400" />
              <span className={`font-bold ${timeLeft < 60 ? 'animate-pulse text-red-400' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
              <FaFire className="text-orange-400" />
              <span className="font-bold">{streak} streak</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Player Profile */}
            <motion.div
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center text-2xl">
                  🔬
                </div>
                <div>
                  <h3 className="font-bold text-xl">{playerName}</h3>
                  <p className="text-gray-400 text-sm">Cognitive Explorer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">IQ Estimate:</span>
                  <span className="font-bold text-cyan-400">{Math.min(180, 120 + Math.floor(score/10))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="font-bold text-green-400">
                    {puzzleHistory.length > 0 ? 
                      `${Math.min(100, Math.round((puzzleHistory.filter(p => p.score > 50).length / puzzleHistory.length) * 100))}%` 
                      : '100%'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaDoorOpen className="text-cyan-400" />
                Progress Map
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {puzzles.map((puzzle) => (
                  <div
                    key={puzzle.id}
                    className={`p-4 rounded-xl transition-all cursor-pointer ${
                      currentRoom === puzzle.id
                        ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 ring-2 ring-cyan-400'
                        : currentRoom > puzzle.id
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20'
                        : 'bg-gray-700/20'
                    }`}
                    onClick={() => {
                      if (currentRoom > puzzle.id || puzzle.id === 1) {
                        setCurrentRoom(puzzle.id);
                        setPuzzleCompleted(false);
                        setHintsUsed(0);
                        resetPuzzle();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentRoom > puzzle.id ? 'bg-green-500/20' :
                        currentRoom === puzzle.id ? 'bg-cyan-500/20' : 'bg-gray-700/30'
                      }`}>
                        <span className="text-xl">{puzzle.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">#{puzzle.id}</div>
                        <div className="text-sm text-gray-400 truncate">{puzzle.title}</div>
                      </div>
                      {currentRoom > puzzle.id ? (
                        <FaCheck className="text-green-400" />
                      ) : currentRoom === puzzle.id ? (
                        <FaLock className="text-cyan-400" />
                      ) : (
                        <FaLock className="opacity-50" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                Cognitive Milestones
              </h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((ach) => (
                  <div key={ach.id} className="p-3 bg-gray-700/30 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{ach.title}</div>
                      <div className="text-xs text-gray-400 truncate">{ach.description}</div>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Solve puzzles to unlock achievements
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Main Puzzle Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Puzzle Card */}
            <motion.div
              className="bg-gradient-to-br from-gray-800/40 to-black/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />

              {/* Puzzle Header */}
              <div className="text-center mb-10 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block mb-6"
                >
                  <div className="text-8xl">
                    {currentPuzzle.icon}
                  </div>
                </motion.div>
                <h2 className="text-4xl font-bold mb-3">
                  {currentPuzzle.title}
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  {currentPuzzle.description}
                </p>

                {/* Difficulty Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-800">
                  <span className={`w-2 h-2 rounded-full ${
                    currentPuzzle.difficulty === 'Beginner' ? 'bg-green-500' :
                    currentPuzzle.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                    currentPuzzle.difficulty === 'Advanced' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`} />
                  <span className="font-medium">{currentPuzzle.difficulty}</span>
                </div>
              </div>

              {/* Puzzle Content */}
              <div className="min-h-[400px] flex flex-col justify-center">
                <PuzzleRenderer />
              </div>

              {/* Controls */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={useHint}
                  disabled={hintsUsed >= 3 || puzzleCompleted}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 flex items-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  <FaLightbulb />
                  Use Hint ({3 - hintsUsed} left)
                </button>
                <button
                  onClick={resetPuzzle}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 flex items-center gap-3 hover:opacity-90 transition-all"
                >
                  <FaRedo />
                  Reset Puzzle
                </button>
                <button
                  onClick={() => {
                    if (currentRoom < puzzles.length) {
                      setCurrentRoom(prev => prev + 1);
                      setPuzzleCompleted(false);
                      setHintsUsed(0);
                      setTimeLeft(300);
                      resetPuzzle();
                    }
                  }}
                  disabled={currentRoom === puzzles.length || !puzzleCompleted}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  <FaChevronRight />
                  Next Challenge
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${hintsUsed > i ? 'bg-yellow-500' : 'bg-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">Hints Used</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(timeLeft / 300) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFire className={`text-orange-400 ${streak > 2 ? 'animate-pulse' : ''}`} />
                  <span className="text-sm text-gray-400">Streak: {streak}</span>
                </div>
              </div>
            </motion.div>

            {/* Hint Modal */}
            <AnimatePresence>
              {showHintModal && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-500/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaLightbulb className="text-yellow-400 text-2xl" />
                    <div>
                      <div className="font-bold">Hint #{hintsUsed}:</div>
                      <p className="text-gray-300">{currentPuzzle.hint}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Achievement Notification */}
            <AnimatePresence>
              {showAchievement && (
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="fixed top-24 right-6 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl p-4 shadow-2xl z-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{showAchievement.icon}</div>
                    <div>
                      <div className="font-bold">Milestone Reached!</div>
                      <div className="text-sm opacity-90">{showAchievement.title}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Solutions */}
            {puzzleHistory.length > 0 && (
              <motion.div
                className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaBrain className="text-cyan-400" />
                  Recent Solutions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {puzzleHistory.slice(-3).map((puzzle, index) => (
                    <div key={index} className="p-4 bg-gray-700/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">#{puzzle.id}</div>
                        <div className="text-green-400 font-bold">+{puzzle.score}</div>
                      </div>
                      <div className="text-sm text-gray-400 truncate">{puzzle.name}</div>
                      <div className="flex justify-between text-xs mt-2 text-gray-500">
                        <span>{puzzle.time}s</span>
                        <span>{puzzle.hints} hint{puzzle.hints !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Screen */}
      <AnimatePresence>
        {showCompletionScreen && <CompletionScreen />}
      </AnimatePresence>
    </div>
  );
};

export default PuzzleRoom;