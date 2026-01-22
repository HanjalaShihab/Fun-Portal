// src/components/PhysicsSandbox/PhysicsSandbox.jsx
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStop, FaRedo, 
  FaCube, FaCircle, FaStar, FaBolt,
  FaWind, FaWeightHanging, FaMagnet
} from 'react-icons/fa';

const PhysicsSandbox = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedTool, setSelectedTool] = useState('box');
  const [gravity, setGravity] = useState(1);
  const [wind, setWind] = useState(0);
  const [friction, setFriction] = useState(0.1);
  const [elasticity, setElasticity] = useState(0.7);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    
    // Create renderer
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: canvasRef.current.clientWidth,
        height: 600,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,
        showVelocity: false
      }
    });

    // Create bounds
    const bounds = Matter.Bodies.rectangle(
      render.options.width / 2,
      render.options.height,
      render.options.width,
      50,
      {
        isStatic: true,
        render: {
          fillStyle: '#4B5563'
        }
      }
    );

    const leftWall = Matter.Bodies.rectangle(
      0,
      render.options.height / 2,
      50,
      render.options.height,
      {
        isStatic: true,
        render: { fillStyle: '#4B5563' }
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      render.options.width,
      render.options.height / 2,
      50,
      render.options.height,
      {
        isStatic: true,
        render: { fillStyle: '#4B5563' }
      }
    );

    // Add all bodies to world
    Matter.World.add(engine.world, [bounds, leftWall, rightWall]);

    // Run the renderer
    Matter.Render.run(render);

    // Run the engine
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Add some initial objects
    addRandomObjects();

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.world.gravity.y = gravity;
      engineRef.current.world.gravity.x = wind;
    }
  }, [gravity, wind]);

  const addRandomObjects = () => {
    const shapes = ['box', 'circle', 'star', 'triangle'];
    
    for (let i = 0; i < 10; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const x = Math.random() * (canvasRef.current?.clientWidth - 100) + 50;
      const y = Math.random() * 200 + 50;
      
      addShape(shape, x, y);
    }
  };

  const addShape = (shape, x, y) => {
    if (!engineRef.current) return;

    let body;
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    switch (shape) {
      case 'box':
        body = Matter.Bodies.rectangle(x, y, 60, 60, {
          restitution: elasticity,
          friction: friction,
          render: {
            fillStyle: colors[Math.floor(Math.random() * colors.length)]
          }
        });
        break;
      case 'circle':
        body = Matter.Bodies.circle(x, y, 30, {
          restitution: elasticity,
          friction: friction,
          render: {
            fillStyle: colors[Math.floor(Math.random() * colors.length)]
          }
        });
        break;
      case 'star':
        const starVertices = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? 40 : 20;
          starVertices.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)
          });
        }
        body = Matter.Bodies.fromVertices(x, y, [starVertices], {
          restitution: elasticity,
          friction: friction,
          render: {
            fillStyle: colors[Math.floor(Math.random() * colors.length)]
          }
        });
        break;
      default:
        body = Matter.Bodies.polygon(x, y, 3, 35, {
          restitution: elasticity,
          friction: friction,
          render: {
            fillStyle: colors[Math.floor(Math.random() * colors.length)]
          }
        });
    }

    Matter.World.add(engineRef.current.world, body);
  };

  const handleCanvasClick = (e) => {
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

  const handleReset = () => {
    if (engineRef.current) {
      // Clear all bodies except walls and bounds
      const bodies = Matter.Composite.allBodies(engineRef.current.world);
      const toRemove = bodies.filter(body => !body.isStatic);
      Matter.World.remove(engineRef.current.world, toRemove);
      
      // Add new random objects
      addRandomObjects();
    }
  };

  const tools = [
    { id: 'box', icon: FaCube, label: 'Box' },
    { id: 'circle', icon: FaCircle, label: 'Circle' },
    { id: 'star', icon: FaStar, label: 'Star' },
    { id: 'triangle', icon: FaBolt, label: 'Triangle' },
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
    },
    {
      id: 'elasticity',
      icon: FaBolt,
      label: 'Bounciness',
      value: elasticity,
      setter: setElasticity,
      min: 0,
      max: 1,
      step: 0.05,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            ⚛️ Physics Sandbox
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Drag shapes, adjust physics, and watch them interact!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tools */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedTool === tool.id
                        ? 'bg-gradient-to-r from-portal-blue to-portal-purple text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <tool.icon className="mx-auto mb-2" />
                    <div className="text-sm">{tool.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Click on canvas to add {selectedTool}
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Controls
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePlayPause}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  } text-white`}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                  <div className="text-sm mt-1">
                    {isPlaying ? 'Pause' : 'Play'}
                  </div>
                </button>
                <button
                  onClick={handleReset}
                  className="p-4 rounded-xl bg-gradient-to-r from-portal-blue to-portal-purple text-white flex flex-col items-center justify-center"
                >
                  <FaRedo />
                  <div className="text-sm mt-1">Reset</div>
                </button>
              </div>
            </motion.div>

            {/* Physics Properties */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Physics Properties
              </h3>
              <div className="space-y-4">
                {properties.map((prop) => (
                  <div key={prop.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <prop.icon />
                        <span>{prop.label}</span>
                      </div>
                      <span className="font-mono">{prop.value.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={prop.min}
                      max={prop.max}
                      step={prop.step}
                      value={prop.value}
                      onChange={(e) => prop.setter(parseFloat(e.target.value))}
                      className="w-full accent-portal-blue"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Presets */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Quick Presets
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setGravity(0);
                    setWind(0);
                    setFriction(0);
                    setElasticity(1);
                  }}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:opacity-90"
                >
                  Zero Gravity
                </button>
                <button
                  onClick={() => {
                    setGravity(2);
                    setWind(0);
                    setFriction(0.5);
                    setElasticity(0.3);
                  }}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:opacity-90"
                >
                  High Gravity
                </button>
                <button
                  onClick={() => {
                    setGravity(1);
                    setWind(0.5);
                    setFriction(0.1);
                    setElasticity(0.9);
                  }}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:opacity-90"
                >
                  Windy
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Canvas */}
          <div className="lg:col-span-3">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Physics Canvas
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">
                      {isPlaying ? 'Simulation Running' : 'Simulation Paused'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div 
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-[600px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 cursor-crosshair relative overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <div className="text-4xl mb-2">⚛️</div>
                    <p>Click to add objects</p>
                    <p className="text-sm">Drag objects around</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">👆</div>
                    <div className="font-medium">Click</div>
                    <div className="text-sm text-gray-500">Add objects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="font-medium">Drag</div>
                    <div className="text-sm text-gray-500">Move objects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="font-medium">Adjust</div>
                    <div className="text-sm text-gray-500">Physics settings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-medium">Experiment</div>
                    <div className="text-sm text-gray-500">Try different combos</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div className="text-2xl text-portal-blue mb-2">📊</div>
                <h4 className="font-bold">Real-time Physics</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Powered by Matter.js
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div className="text-2xl text-portal-purple mb-2">🎮</div>
                <h4 className="font-bold">Interactive</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click and drag objects
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div className="text-2xl text-portal-pink mb-2">⚙️</div>
                <h4 className="font-bold">Customizable</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Adjust physics properties
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div className="text-2xl text-portal-yellow mb-2">🎯</div>
                <h4 className="font-bold">Educational</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learn physics concepts
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsSandbox;