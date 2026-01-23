// src/components/MusicVisualizer/MusicVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStop, FaMusic,
  FaVolumeUp, FaFileUpload, FaEye,
  FaPalette, FaWaveSquare, FaCircle, FaStar,
  FaFire, FaHeart, FaShareAlt,
  FaCog, FaSlidersH, FaExpand, FaCompress,
  FaSync, FaBolt, FaMagic, FaGamepad
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const MusicVisualizer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [visualizerType, setVisualizerType] = useState('bars');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [bufferLength, setBufferLength] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorScheme, setColorScheme] = useState('rainbow');
  const [sensitivity, setSensitivity] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Sample audio URLs that should work
  const sampleTracks = [
    { 
      name: 'Ambient Dreamscape', 
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artist: 'Cosmic Waves',
      duration: '3:15',
      genre: 'Ambient',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      name: 'Synthwave Pulse', 
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artist: 'Retro Future',
      duration: '2:45',
      genre: 'Synthwave',
      color: 'from-pink-500 to-purple-500'
    },
    { 
      name: 'Chill Beats', 
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      artist: 'Digital Pulse',
      duration: '3:30',
      genre: 'Electronic',
      color: 'from-green-500 to-cyan-500'
    }
  ];

  const visualizerTypes = [
    { id: 'bars', name: 'Bars', icon: FaWaveSquare, description: 'Classic frequency bars', color: 'from-blue-500 to-cyan-500' },
    { id: 'wave', name: 'Wave', icon: FaWaveSquare, description: 'Audio waveform', color: 'from-purple-500 to-pink-500' },
    { id: 'particles', name: 'Particles', icon: FaStar, description: 'Dancing particles', color: 'from-yellow-500 to-orange-500' },
    { id: 'circle', name: 'Circle', icon: FaCircle, description: 'Circular visualization', color: 'from-red-500 to-pink-500' },
    { id: 'fireworks', name: 'Fireworks', icon: FaFire, description: 'Explosive particles', color: 'from-orange-500 to-red-500' },
    { id: 'nebula', name: 'Nebula', icon: FaMagic, description: 'Swirling cosmic particles', color: 'from-indigo-500 to-purple-500' },
  ];

  const colorSchemes = [
    { id: 'rainbow', name: 'Rainbow', colors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'] },
    { id: 'ocean', name: 'Ocean', colors: ['#0066cc', '#0099ff', '#00ccff', '#66ffff', '#99ffff'] },
    { id: 'sunset', name: 'Sunset', colors: ['#ff3366', '#ff6699', '#ff9966', '#ffcc66', '#ffff66'] },
    { id: 'neon', name: 'Neon', colors: ['#00ff88', '#00ffff', '#0088ff', '#8800ff', '#ff00ff'] },
  ];

  useEffect(() => {
    // Initialize with first track
    if (!audioFile && sampleTracks[0]) {
      setAudioFile(sampleTracks[0]);
    }

    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
    }
  }, [audioFile, volume]);

  const initAudioContext = () => {
    try {
      if (!audioRef.current) return null;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const analyserNode = context.createAnalyser();
      const source = context.createMediaElementSource(audioRef.current);

      analyserNode.fftSize = 256;
      const bufferLen = analyserNode.frequencyBinCount;
      const dataArr = new Uint8Array(bufferLen);

      source.connect(analyserNode);
      analyserNode.connect(context.destination);

      setAudioContext(context);
      setAnalyser(analyserNode);
      setBufferLength(bufferLen);
      setDataArray(dataArr);

      return { context, analyserNode, dataArr, bufferLen };
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      toast.error('Audio context initialization failed');
      return null;
    }
  };

  const startVisualization = () => {
    if (!canvasRef.current || !analyser || !dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!isPlaying || !analyser) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw based on visualizer type
      switch(visualizerType) {
        case 'bars':
          drawBars(ctx, width, height);
          break;
        case 'wave':
          drawWave(ctx, width, height);
          break;
        case 'particles':
          drawParticles(ctx, width, height);
          break;
        case 'circle':
          drawCircle(ctx, width, height);
          break;
        case 'fireworks':
          drawFireworks(ctx, width, height);
          break;
        case 'nebula':
          drawNebula(ctx, width, height);
          break;
        default:
          drawBars(ctx, width, height);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Start drawing
    animationFrameRef.current = requestAnimationFrame(draw);
  };

  const getCurrentColors = () => {
    const scheme = colorSchemes.find(s => s.id === colorScheme);
    return scheme ? scheme.colors : colorSchemes[0].colors;
  };

  const drawBars = (ctx, width, height) => {
    if (!dataArray || !bufferLength) return;

    const barWidth = (width / bufferLength) * 2.5;
    const colors = getCurrentColors();
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height * sensitivity;
      const colorIndex = Math.floor((i / bufferLength) * colors.length);
      const color = colors[colorIndex];

      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}80`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  const drawWave = (ctx, width, height) => {
    if (!dataArray || !bufferLength) return;

    ctx.beginPath();
    ctx.lineWidth = 3;
    
    const sliceWidth = width / bufferLength;
    const colors = getCurrentColors();
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.strokeStyle = gradient;
    ctx.stroke();
  };

  const drawParticles = (ctx, width, height) => {
    if (!dataArray || !bufferLength) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 3;
    const colors = getCurrentColors();

    for (let i = 0; i < bufferLength; i += 2) {
      const amplitude = dataArray[i] / 255;
      const angle = (i / bufferLength) * Math.PI * 2;
      const radius = maxRadius * (0.3 + amplitude * 0.7);
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      const size = 2 + amplitude * 8;
      const colorIndex = Math.floor((i / bufferLength) * colors.length);
      const color = colors[colorIndex];

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  const drawCircle = (ctx, width, height) => {
    if (!dataArray || !bufferLength) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const colors = getCurrentColors();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < bufferLength; i += 2) {
      const amplitude = dataArray[i] / 255;
      const angle = (i / bufferLength) * Math.PI * 2;
      const pointRadius = radius + amplitude * 100 * sensitivity;
      
      const x = centerX + Math.cos(angle) * pointRadius;
      const y = centerY + Math.sin(angle) * pointRadius;
      
      const colorIndex = Math.floor((i / bufferLength) * colors.length);
      const color = colors[colorIndex];

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 5 + amplitude * 15);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}00`);

      ctx.beginPath();
      ctx.arc(x, y, 3 + amplitude * 10, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  const drawFireworks = (ctx, width, height) => {
    if (!dataArray || !bufferLength) return;

    const colors = getCurrentColors();

    for (let i = 0; i < bufferLength; i += 8) {
      const amplitude = dataArray[i] / 255;
      if (amplitude > 0.3) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particleCount = 10 + amplitude * 20;

        for (let j = 0; j < particleCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          const size = 1 + Math.random() * 3;
          const particleX = x + Math.cos(angle) * speed * 10;
          const particleY = y + Math.sin(angle) * speed * 10;

          ctx.beginPath();
          ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }
  };

  const drawNebula = (ctx, width, height) => {
    if (!dataArray || !bufferLength) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    const colors = getCurrentColors();

    // Draw background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    bgGradient.addColorStop(0, 'rgba(0, 0, 30, 0.8)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 50, 0.9)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw particles
    for (let i = 0; i < bufferLength; i += 2) {
      const amplitude = dataArray[i] / 255;
      const angle = (i / bufferLength) * Math.PI * 2 + Date.now() / 2000;
      const distance = (amplitude * 0.5 + 0.3) * maxRadius;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const colorIndex = Math.floor((i / bufferLength) * colors.length);
      const color = colors[colorIndex];
      const size = 2 + amplitude * 6;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw glow
      const glowRadius = size * 2;
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      glowGradient.addColorStop(0, `${color}80`);
      glowGradient.addColorStop(1, `${color}00`);

      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    }
  };

  const handlePlay = async () => {
    if (!audioFile || !audioRef.current) {
      toast.error('Please select a track first');
      return;
    }

    setIsLoading(true);

    try {
      if (!audioContext) {
        const audioSetup = initAudioContext();
        if (!audioSetup) {
          toast.error('Failed to initialize audio');
          return;
        }
      }

      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }

      await audioRef.current.play();
      setIsPlaying(true);
      startVisualization();
      toast.success('Playing track');
    } catch (error) {
      console.error('Playback failed:', error);
      toast.error('Failed to play audio');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      toast.info('Playback paused');
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      toast.info('Playback stopped');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioFile({ 
        name: file.name.replace(/\.[^/.]+$/, ""), 
        url,
        artist: 'Your Upload',
        duration: '--:--',
        genre: 'Custom',
        color: 'from-gray-500 to-gray-700'
      });
      handleStop();
      toast.success('File uploaded successfully');
    }
  };

  const toggleFavorite = () => {
    if (!audioFile) return;
    
    if (favorites.some(fav => fav.url === audioFile.url)) {
      setFavorites(favorites.filter(fav => fav.url !== audioFile.url));
      toast('Removed from favorites');
    } else {
      setFavorites([...favorites, audioFile]);
      toast.success('Added to favorites!');
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (audioRef.current && duration) {
      const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Start visualization when isPlaying changes
  useEffect(() => {
    if (isPlaying && analyser) {
      startVisualization();
    } else if (!isPlaying && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, visualizerType, colorScheme, sensitivity]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white p-4 md:p-8 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 50, 0],
              rotate: 360,
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
            🎵
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Music Visualizer
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform music into stunning visual experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Track Selection */}
            <motion.div 
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMusic className="text-purple-400" />
                <span>Music Library</span>
              </h3>
              
              <div className="space-y-3">
                {sampleTracks.map((track, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setAudioFile(track);
                      handleStop();
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      audioFile?.url === track.url
                        ? `bg-gradient-to-r ${track.color} shadow-lg scale-105`
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎵</div>
                      <div className="flex-1">
                        <div className="font-bold text-white truncate">{track.name}</div>
                        <div className="text-sm text-gray-300">{track.artist}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full">
                            {track.genre}
                          </span>
                          <span className="text-xs text-gray-400">{track.duration}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Upload Section */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 cursor-pointer hover:from-purple-600/40 hover:to-blue-600/40 transition-all"
                >
                  <FaFileUpload />
                  <span>Upload Your Music</span>
                </label>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Supports MP3, WAV, OGG
                </p>
              </div>
            </motion.div>

            {/* Player Controls */}
            <motion.div 
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaSlidersH className="text-blue-400" />
                <span>Player Controls</span>
              </h3>
              
              {/* Current Track */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-black/50">
                <div className="text-sm text-gray-400">Now Playing</div>
                <div className="font-bold truncate">{audioFile?.name || 'No track selected'}</div>
                <div className="text-sm text-gray-300">{audioFile?.artist || 'Select a track'}</div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                  className="p-4 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30"
                >
                  <FaStop />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={isLoading || !audioFile}
                  className={`p-6 rounded-full text-xl ${
                    isPlaying
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                      : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                  } hover:opacity-90 disabled:opacity-50`}
                >
                  {isLoading ? '🌀' : isPlaying ? <FaPause /> : <FaPlay />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFavorite}
                  className={`p-4 rounded-full ${
                    favorites.some(fav => fav.url === audioFile?.url)
                      ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-pink-400'
                      : 'bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/30'
                  }`}
                >
                  <FaHeart className={favorites.some(fav => fav.url === audioFile?.url) ? 'fill-current' : ''} />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div 
                  className="h-2 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleSeek}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
              </div>

              {/* Volume Control */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    <FaVolumeUp className="inline mr-2" />
                    Volume
                  </span>
                  <span className="text-sm text-gray-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                    }
                  }}
                  className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-purple-500"
                />
              </div>
            </motion.div>

            {/* Visualizer Types */}
            <motion.div 
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaPalette className="text-purple-400" />
                <span>Visualizer Style</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {visualizerTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVisualizerType(type.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      visualizerType === type.id
                        ? `bg-gradient-to-r ${type.color}`
                        : 'bg-gray-700/50 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="text-lg">{React.createElement(type.icon)}</div>
                    <div className="text-xs mt-1">{type.name}</div>
                  </motion.button>
                ))}
              </div>

              {/* Sensitivity Control */}
              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Sensitivity: {sensitivity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-500 [&::-webkit-slider-thumb]:to-orange-500"
                />
              </div>
            </motion.div>
          </div>

          {/* Center Panel - Visualizer */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              className="rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Visualizer Header */}
              <div className="p-6 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-b border-gray-700/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {visualizerTypes.find(v => v.id === visualizerType)?.icon ? 
                      React.createElement(visualizerTypes.find(v => v.id === visualizerType).icon, { className: "text-purple-400" }) : 
                      '🎵'
                    }
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white capitalize">
                      {visualizerTypes.find(v => v.id === visualizerType)?.name}
                    </h3>
                    <div className="text-gray-400">
                      {visualizerTypes.find(v => v.id === visualizerType)?.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-sm">
                    {isPlaying ? 'Playing' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Visualizer Canvas */}
              <div className="relative bg-black/50" style={{ height: '500px' }}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                />
                
                {/* Audio Player Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${audioFile?.color || 'from-gray-600 to-gray-700'} flex items-center justify-center text-2xl`}>
                        {isPlaying ? '🎵' : '🎧'}
                      </div>
                      <div>
                        <div className="font-bold text-xl">{audioFile?.name || 'No Track'}</div>
                        <div className="text-gray-300">{audioFile?.artist || 'Select a track'}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {bufferLength ? `${bufferLength} frequency bins` : 'Initializing...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualizer Type Selector */}
              <div className="p-4 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-t border-gray-700/50">
                <div className="flex overflow-x-auto gap-2 pb-2">
                  {visualizerTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVisualizerType(type.id)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                        visualizerType === type.id
                          ? `bg-gradient-to-r ${type.color}`
                          : 'bg-gray-700/50 hover:bg-gray-600/50'
                      }`}
                    >
                      {React.createElement(type.icon)}
                      <span>{type.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Color Schemes - Moved right under the visualization box */}
            <motion.div 
              className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <FaPalette className="text-cyan-400" />
                Color Schemes
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => setColorScheme(scheme.id)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      colorScheme === scheme.id
                        ? 'bg-gray-700/50 ring-2 ring-cyan-500/50'
                        : 'bg-gray-800/30 hover:bg-gray-700/30'
                    }`}
                  >
                    <div className="font-medium mb-2">{scheme.name}</div>
                    <div className="flex justify-center gap-1">
                      {scheme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tips Section - Now placed after the main content */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-sm border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🎨</div>
              <h4 className="font-bold text-lg">How to Use</h4>
            </div>
            <p className="text-gray-300">
              1. Select a track from the library<br/>
              2. Click play to start visualization<br/>
              3. Try different visualizer styles
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⚡</div>
              <h4 className="font-bold text-lg">Tips</h4>
            </div>
            <p className="text-gray-300">
              • Adjust sensitivity for more/less intense visuals<br/>
              • Try different color schemes<br/>
              • Upload your own music
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-sm border border-amber-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🔧</div>
              <h4 className="font-bold text-lg">Troubleshooting</h4>
            </div>
            <p className="text-gray-300">
              If visualization doesn't start:<br/>
              1. Check if track is selected<br/>
              2. Click play button<br/>
              3. Try a different track
            </p>
          </div>
        </motion.div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioFile?.url}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          toast.error('Failed to load audio file');
        }}
        className="hidden"
      />
    </div>
  );
};

export default MusicVisualizer;