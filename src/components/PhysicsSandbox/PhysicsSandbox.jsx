// src/components/PhysicsSandbox/PhysicsSandbox.jsx
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStop, FaRedo, FaTrash,
  FaCube, FaCircle, FaStar, FaBolt, FaWind,
  FaWeightHanging, FaMagnet, FaWater, FaFire,
  FaSnowflake, FaPlus, FaMinus, FaRandom,
  FaHammer, FaBomb, FaHandPointer, FaArrowsAlt,
  FaTint, FaRocket, FaExpandArrowsAlt
} from 'react-icons/fa';

const PhysicsSandbox = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedTool, setSelectedTool] = useState('box');
  const [gravity, setGravity] = useState(1);
  const [wind, setWind] = useState(0);
  const [friction, setFriction] = useState(0.1);
  const [elasticity, setElasticity] = useState(0.7);
  const [airDensity, setAirDensity] = useState(0.01);
  const [selectedBody, setSelectedBody] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseConstraint, setMouseConstraint] = useState(null);
  const [objectCount, setObjectCount] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showVelocity, setShowVelocity] = useState(false);

  // Initialize physics engine
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine with better settings
    const engine = Matter.Engine.create({
      enableSleeping: true,
      gravity: { x: wind, y: gravity, scale: 0.001 }
    });
    engineRef.current = engine;

    // Create renderer with better visuals
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: canvasRef.current.clientWidth,
        height: 600,
        wireframes: false,
        background: 'transparent',
        showSleeping: true,
        showCollisions: false,
        showVelocity: false,
        showAngleIndicator: false,
        showStats: false,
      }
    });
    renderRef.current = render;

    // Create world bounds with better aesthetics
    const boundsOptions = {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#4B5563',
        lineWidth: 2
      }
    };

    const bounds = [
      // Bottom floor
      Matter.Bodies.rectangle(
        render.options.width / 2,
        render.options.height + 25,
        render.options.width,
        50,
        boundsOptions
      ),
      // Left wall
      Matter.Bodies.rectangle(
        -25,
        render.options.height / 2,
        50,
        render.options.height,
        boundsOptions
      ),
      // Right wall
      Matter.Bodies.rectangle(
        render.options.width + 25,
        render.options.height / 2,
        50,
        render.options.height,
        boundsOptions
      ),
      // Top (optional)
      Matter.Bodies.rectangle(
        render.options.width / 2,
        -25,
        render.options.width,
        50,
        boundsOptions
      )
    ];

    // Add mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    setMouseConstraint(mouseConstraint);

    // Add all to world
    Matter.World.add(engine.world, [...bounds, mouseConstraint]);

    // Add event listeners for mouse
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      setIsDragging(true);
      setSelectedBody(event.body);
    });

    Matter.Events.on(mouseConstraint, 'mouseup', () => {
      setIsDragging(false);
      setSelectedBody(null);
    });

    // Add some interesting starting objects
    addInteractiveObjects();

    // Run the renderer
    Matter.Render.run(render);

    // Create runner with speed control
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    runner.delta = 1000 / 60 / simulationSpeed;
    Matter.Runner.run(runner, engine);

    // Handle resizing
    const handleResize = () => {
      if (render && canvasRef.current) {
        render.options.width = canvasRef.current.clientWidth;
        render.canvas.width = canvasRef.current.clientWidth;
        Matter.Render.setPixelRatio(render, window.devicePixelRatio);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  // Update physics properties
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.world.gravity.x = wind;
      engineRef.current.world.gravity.y = gravity;
      engineRef.current.world.gravity.scale = 0.001;
    }
  }, [gravity, wind]);

  // Update simulation speed
  useEffect(() => {
    if (runnerRef.current) {
      runnerRef.current.delta = 1000 / 60 / simulationSpeed;
    }
  }, [simulationSpeed]);

  const addInteractiveObjects = () => {
    const shapes = ['box', 'circle', 'star', 'triangle', 'polygon'];
    const colors = [
      '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
      '#EF4444', '#3B82F6', '#F97316', '#84CC16', '#06B6D4'
    ];

    for (let i = 0; i < 8; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const x = Math.random() * (canvasRef.current?.clientWidth - 150) + 75;
      const y = Math.random() * 200 + 50;
      const color = colors[Math.floor(Math.random() * colors.length)];

      addShape(shape, x, y, color);
    }
    setObjectCount(8);
  };

  const addShape = (shape, x, y, color = null) => {
    if (!engineRef.current) return;

    let body;
    const colors = color || [
      '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'
    ][Math.floor(Math.random() * 5)];

    const options = {
      restitution: elasticity,
      friction: friction,
      density: airDensity,
      render: {
        fillStyle: colors,
        strokeStyle: '#1F2937',
        lineWidth: 2,
        opacity: 0.9
      }
    };

    switch (shape) {
      case 'box':
        const width = 40 + Math.random() * 40;
        const height = 40 + Math.random() * 40;
        body = Matter.Bodies.rectangle(x, y, width, height, {
          ...options,
          chamfer: { radius: 5 }
        });
        break;

      case 'circle':
        const radius = 20 + Math.random() * 30;
        body = Matter.Bodies.circle(x, y, radius, options);
        break;

      case 'star':
        const starRadius = 30 + Math.random() * 20;
        const starVertices = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const r = i % 2 === 0 ? starRadius : starRadius / 2;
          starVertices.push({
            x: r * Math.cos(angle),
            y: r * Math.sin(angle)
          });
        }
        body = Matter.Bodies.fromVertices(x, y, [starVertices], options);
        break;

      case 'triangle':
        body = Matter.Bodies.polygon(x, y, 3, 25 + Math.random() * 25, options);
        break;

      case 'polygon':
        const sides = 3 + Math.floor(Math.random() * 5);
        body = Matter.Bodies.polygon(x, y, sides, 20 + Math.random() * 20, options);
        break;

      default:
        body = Matter.Bodies.rectangle(x, y, 50, 50, options);
    }

    Matter.World.add(engineRef.current.world, body);
    setObjectCount(prev => prev + 1);
  };

  const handleCanvasClick = (e) => {
    if (isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addShape(selectedTool, x, y);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      Matter.Runner.stop(runnerRef.current);
    } else {
      Matter.Runner.run(runnerRef.current, engineRef.current);
    }
    setIsPlaying(!isPlaying);
  };

  const handleClearAll = () => {
    if (engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const toRemove = bodies.filter(body => !body.isStatic && body !== mouseConstraint?.body);
      Matter.World.remove(engineRef.current.world, toRemove);
      setObjectCount(0);
    }
  };

  const handleReset = () => {
    handleClearAll();
    addInteractiveObjects();
  };

  const addExplosion = (x, y, power = 10) => {
    if (!engineRef.current) return;

    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
      if (body.isStatic) return;
      
      const dx = body.position.x - x;
      const dy = body.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        const force = (power * 1000) / (distance * distance);
        Matter.Body.applyForce(body, body.position, {
          x: (dx / distance) * force,
          y: (dy / distance) * force
        });
      }
    });
  };

  const handleExplosionClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addExplosion(x, y, 15);
  };

  const tools = [
    { id: 'box', icon: FaCube, label: 'Box', color: 'from-blue-500 to-cyan-500' },
    { id: 'circle', icon: FaCircle, label: 'Circle', color: 'from-purple-500 to-pink-500' },
    { id: 'star', icon: FaStar, label: 'Star', color: 'from-yellow-500 to-orange-500' },
    { id: 'triangle', icon: FaBolt, label: 'Triangle', color: 'from-green-500 to-emerald-500' },
    { id: 'polygon', icon: FaExpandArrowsAlt, label: 'Polygon', color: 'from-red-500 to-rose-500' },
    { id: 'explosion', icon: FaBomb, label: 'Explosion', color: 'from-gray-700 to-gray-900' },
  ];

  const properties = [
    {
      id: 'gravity',
      icon: FaWeightHanging,
      label: 'Gravity',
      value: gravity,
      setter: setGravity,
      min: 0,
      max: 2,
      step: 0.1,
      unit: 'g'
    },
    {
      id: 'wind',
      icon: FaWind,
      label: 'Wind',
      value: wind,
      setter: setWind,
      min: -1,
      max: 1,
      step: 0.1,
      unit: 'm/s'
    },
    {
      id: 'friction',
      icon: FaMagnet,
      label: 'Friction',
      value: friction,
      setter: setFriction,
      min: 0,
      max: 1,
      step: 0.05,
      unit: ''
    },
    {
      id: 'elasticity',
      icon: FaTint,
      label: 'Bounciness',
      value: elasticity,
      setter: setElasticity,
      min: 0,
      max: 1,
      step: 0.05,
      unit: ''
    },
    {
      id: 'airDensity',
      icon: FaWater,
      label: 'Air Density',
      value: airDensity,
      setter: setAirDensity,
      min: 0.001,
      max: 0.1,
      step: 0.005,
      unit: ''
    },
    {
      id: 'simulationSpeed',
      icon: FaRocket,
      label: 'Sim Speed',
      value: simulationSpeed,
      setter: setSimulationSpeed,
      min: 0.1,
      max: 3,
      step: 0.1,
      unit: 'x'
    },
  ];

  const presets = [
    {
      name: 'Zero Gravity',
      icon: '🚀',
      action: () => {
        setGravity(0);
        setWind(0);
        setFriction(0.01);
        setElasticity(0.9);
        setAirDensity(0.001);
      }
    },
    {
      name: 'High Gravity',
      icon: '⚫',
      action: () => {
        setGravity(2);
        setWind(0);
        setFriction(0.3);
        setElasticity(0.3);
        setAirDensity(0.05);
      }
    },
    {
      name: 'Wind Tunnel',
      icon: '🌬️',
      action: () => {
        setGravity(0.5);
        setWind(0.8);
        setFriction(0.1);
        setElasticity(0.7);
        setAirDensity(0.02);
      }
    },
    {
      name: 'Bouncy World',
      icon: '🏀',
      action: () => {
        setGravity(1);
        setWind(0);
        setFriction(0.05);
        setElasticity(0.95);
        setAirDensity(0.005);
      }
    },
    {
      name: 'Sticky',
      icon: '🍯',
      action: () => {
        setGravity(1);
        setWind(0);
        setFriction(0.8);
        setElasticity(0.1);
        setAirDensity(0.08);
      }
    },
    {
      name: 'Slow Motion',
      icon: '🐌',
      action: () => {
        setSimulationSpeed(0.3);
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ⚛️ Physics Playground
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create, interact, and experiment with real physics simulation. Click to add objects, drag to move them!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Tools & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tools */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                🛠️ Tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                      selectedTool === tool.id
                        ? `bg-gradient-to-r ${tool.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80'
                    }`}
                  >
                    <tool.icon className="text-xl mb-2" />
                    <div className="text-sm font-medium">{tool.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">Selected:</span> {selectedTool}
                  {selectedTool === 'explosion' ? ' - Click canvas to explode!' : ' - Click canvas to add'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                ⚙️ Controls
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePlayPause}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl" />}
                  <div className="text-sm font-medium mt-1">
                    {isPlaying ? 'Pause' : 'Play'}
                  </div>
                </button>
                <button
                  onClick={handleReset}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <FaRedo className="text-xl" />
                  <div className="text-sm font-medium mt-1">Reset</div>
                </button>
                <button
                  onClick={handleClearAll}
                  className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white flex flex-col items-center justify-center transition-all hover:scale-105 col-span-2"
                >
                  <FaTrash className="text-xl" />
                  <div className="text-sm font-medium mt-1">Clear All Objects</div>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                📊 Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Objects:</span>
                  <span className="font-bold text-xl">{objectCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className={`font-bold ${isPlaying ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isPlaying ? 'Running' : 'Paused'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Speed:</span>
                  <span className="font-bold">{simulationSpeed.toFixed(1)}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tool:</span>
                  <span className="font-bold capitalize">{selectedTool}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              {/* Canvas Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Physics Canvas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedTool === 'explosion' 
                        ? 'Click anywhere to create an explosion!' 
                        : 'Click to add objects, drag to interact'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full ${isPlaying ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {isPlaying ? 'Simulation Active' : 'Simulation Paused'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas Area */}
              <div 
                ref={canvasRef}
                onClick={selectedTool === 'explosion' ? handleExplosionClick : handleCanvasClick}
                className="w-full h-[600px] bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-blue-900/20 relative overflow-hidden cursor-crosshair"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                  }}
                />
                
                {/* Center Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-20">⚛️</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                      {selectedTool === 'explosion' ? '💥 Click to explode!' : '✨ Click to create'}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">
                      {isDragging ? 'Dragging object...' : 'Drag objects to move them'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Canvas Footer */}
              <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">👆</div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Add Objects</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Click on canvas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Drag & Drop</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Move objects around</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💥</div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Explosions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Use explosion tool</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚙️</div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Adjust Physics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Change properties</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="mt-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                  ⚖️ Physics Properties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((prop) => (
                    <div key={prop.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <prop.icon className="text-gray-600 dark:text-gray-300" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            {prop.label}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-gray-800 dark:text-white">
                          {prop.value.toFixed(2)}{prop.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={prop.min}
                        max={prop.max}
                        step={prop.step}
                        value={prop.value}
                        onChange={(e) => prop.setter(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{prop.min}{prop.unit}</span>
                        <span>{prop.max}{prop.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Presets & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Presets */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                🎮 Quick Presets
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={preset.action}
                    className="p-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-2xl mb-2">{preset.icon}</div>
                    <div className="text-sm font-medium">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-blue-500/20">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                💡 Tips & Tricks
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 font-bold">1</div>
                  <div>
                    <p className="font-medium">Create chains of objects</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Stack objects to see how they interact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-purple-500 font-bold">2</div>
                  <div>
                    <p className="font-medium">Use explosions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Click with explosion tool to create force</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-pink-500 font-bold">3</div>
                  <div>
                    <p className="font-medium">Adjust physics in real-time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Change properties while simulation runs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 font-bold">4</div>
                  <div>
                    <p className="font-medium">Try different shapes</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Each shape has unique physics properties</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-xl">
                <div className="text-3xl mb-2">⚛️</div>
                <h4 className="font-bold">Real Physics</h4>
                <p className="text-sm opacity-90">Powered by Matter.js</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-xl">
                <div className="text-3xl mb-2">🎮</div>
                <h4 className="font-bold">Interactive</h4>
                <p className="text-sm opacity-90">Drag & drop objects</p>
              </div>
            </div>

            {/* Add Random Button */}
            <button
              onClick={() => {
                const shapes = ['box', 'circle', 'star', 'triangle', 'polygon'];
                for (let i = 0; i < 3; i++) {
                  const shape = shapes[Math.floor(Math.random() * shapes.length)];
                  const x = Math.random() * (canvasRef.current?.clientWidth - 100) + 50;
                  const y = Math.random() * 200 + 50;
                  addShape(shape, x, y);
                }
              }}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-center gap-3">
                <FaRandom />
                <span>Add Random Objects</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            ⚛️ Physics Playground • Real-time physics simulation • Interactive learning tool
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Powered by Matter.js • Click, drag, and explore physics in action!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhysicsSandbox;