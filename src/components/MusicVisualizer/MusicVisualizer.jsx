// src/components/MusicVisualizer/MusicVisualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStop, FaRandom,
  FaVolumeUp, FaVolumeMute, FaFileUpload
} from 'react-icons/fa';

const MusicVisualizer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [visualizerType, setVisualizerType] = useState('bars');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [source, setSource] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [bufferLength, setBufferLength] = useState(null);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const sampleTracks = [
    { name: 'Ambient Chill', url: 'https://assets.codepen.io/4358584/ambient-chill.mp3' },
    { name: 'Upbeat Electronic', url: 'https://assets.codepen.io/4358584/upbeat-electronic.mp3' },
    { name: 'Synthwave', url: 'https://assets.codepen.io/4358584/synthwave.mp3' },
  ];

  useEffect(() => {
    if (!audioFile && sampleTracks[0]) {
      setAudioFile(sampleTracks[0]);
    }
  }, []);

  useEffect(() => {
    if (isPlaying && audioContext && analyser) {
      drawVisualizer();
    }
  }, [isPlaying, visualizerType]);

  const initAudio = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = context.createAnalyser();
    const audioSrc = context.createMediaElementSource(audioRef.current);

    audioSrc.connect(analyserNode);
    analyserNode.connect(context.destination);

    analyserNode.fftSize = 256;
    const bufferLen = analyserNode.frequencyBinCount;
    const dataArr = new Uint8Array(bufferLen);

    setAudioContext(context);
    setAnalyser(analyserNode);
    setSource(audioSrc);
    setBufferLength(bufferLen);
    setDataArray(dataArr);
  };

  const drawVisualizer = () => {
    if (!analyser || !canvasRef.current || !dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!isPlaying) return;

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      switch (visualizerType) {
        case 'bars':
          drawBars(ctx, width, height, dataArray);
          break;
        case 'wave':
          drawWave(ctx, width, height, dataArray);
          break;
        case 'particles':
          drawParticles(ctx, width, height, dataArray);
          break;
        case 'circle':
          drawCircle(ctx, width, height, dataArray);
          break;
        default:
          drawBars(ctx, width, height, dataArray);
      }
    };

    draw();
  };

  const drawBars = (ctx, width, height, dataArray) => {
    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;

      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, `hsl(${barHeight * 2}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${barHeight * 2}, 100%, 20%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  const drawWave = (ctx, width, height, dataArray) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    
    const sliceWidth = width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');

    ctx.strokeStyle = gradient;
    ctx.stroke();
  };

  const drawParticles = (ctx, width, height, dataArray) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    for (let i = 0; i < bufferLength; i += 4) {
      const amplitude = dataArray[i] / 255;
      const angle = (i / bufferLength) * Math.PI * 2;
      
      const particleRadius = 2 + amplitude * 8;
      const distance = radius + amplitude * 100;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const hue = (i / bufferLength) * 360;
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.5 + amplitude * 0.5})`;
      
      ctx.beginPath();
      ctx.arc(x, y, particleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawCircle = (ctx, width, height, dataArray) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < bufferLength; i += 2) {
      const amplitude = dataArray[i] / 255;
      const angle = (i / bufferLength) * Math.PI * 2;
      
      const pointRadius = radius + amplitude * 100;
      const x = centerX + Math.cos(angle) * pointRadius;
      const y = centerY + Math.sin(angle) * pointRadius;
      
      const hue = (i / bufferLength) * 360;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 5 + amplitude * 15);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.2)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 3 + amplitude * 10, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePlay = async () => {
    if (!audioContext) {
      initAudio();
    }

    if (audioContext?.state === 'suspended') {
      await audioContext.resume();
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback failed:', error);
    }
  };

  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFile({ name: file.name, url });
      handleStop();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            🎵 Music Visualizer
          </h1>
          <p className="text-gray-300">
            Visualize your music with stunning real-time effects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Track Selection */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4">Select Track</h3>
              <div className="space-y-3">
                {sampleTracks.map((track, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAudioFile(track);
                      handleStop();
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      audioFile?.url === track.url
                        ? 'bg-gradient-to-r from-portal-blue to-portal-purple'
                        : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{track.name}</div>
                    <div className="text-sm text-gray-300">Sample Track</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4">Controls</h3>
              
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handlePlay}
                  disabled={!audioFile}
                  className={`p-4 rounded-full ${
                    isPlaying 
                      ? 'bg-gray-700' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaPlay size={20} />
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className="p-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPause size={20} />
                </button>
                <button
                  onClick={handleStop}
                  className="p-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90"
                >
                  <FaStop size={20} />
                </button>
              </div>

              {/* Volume Control */}
              <div className="mb-6">
                <label className="block mb-2">
                  <FaVolumeUp className="inline mr-2" />
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    setVolume(e.target.value);
                    if (audioRef.current) {
                      audioRef.current.volume = e.target.value;
                    }
                  }}
                  className="w-full accent-portal-blue"
                />
              </div>

              {/* Upload */}
              <div className="mb-6">
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
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <FaFileUpload />
                  Upload Your Music
                </label>
              </div>
            </motion.div>

            {/* Visualizer Types */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Visualizer Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {['bars', 'wave', 'particles', 'circle'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setVisualizerType(type)}
                    className={`p-4 rounded-xl text-center capitalize transition-all ${
                      visualizerType === type
                        ? 'bg-gradient-to-r from-portal-blue to-portal-purple'
                        : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Visualizer */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Visualizer</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm">
                    {isPlaying ? 'Playing' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative bg-black/50 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-[500px]"
                />
                
                {/* Audio Player */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-300">
                        Now Playing
                      </div>
                      <div className="font-bold truncate">
                        {audioFile?.name || 'Select a track'}
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioFile?.url}
                      onEnded={() => setIsPlaying(false)}
                      onTimeUpdate={() => {}}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Frequency Labels */}
              <div className="flex justify-between mt-4 text-sm text-gray-400">
                <span>Low</span>
                <span>Mid</span>
                <span>High</span>
              </div>
            </motion.div>

            {/* Audio Info */}
            {audioFile && (
              <motion.div 
                className="mt-6 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="font-bold mb-3">Track Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold">
                      {bufferLength || '--'}
                    </div>
                    <div className="text-sm text-gray-300">Frequency Bins</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                    <div className="text-2xl font-bold">256</div>
                    <div className="text-sm text-gray-300">FFT Size</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicVisualizer;