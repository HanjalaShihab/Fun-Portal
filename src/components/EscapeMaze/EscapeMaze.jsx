// src/components/EscapeMaze/EscapeMaze.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const EscapeMaze = () => {
  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [playerPosition, setPlayerPosition] = useState({ 
    x: 0, 
    y: 1.6, 
    z: 0,
    rotation: 0 
  });
  const [foundClues, setFoundClues] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [hintVisible, setHintVisible] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [viewMode, setViewMode] = useState('first-person');
  const [fullscreen, setFullscreen] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);
  const [currentRoom, setCurrentRoom] = useState('Entrance Hall');
  
  // Refs
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(null);
  
  // House rooms configuration
  const rooms = {
    1: [
      { name: 'Entrance Hall', x: 0, z: 0, width: 8, depth: 6, clues: [1] },
      { name: 'Living Room', x: -10, z: 0, width: 12, depth: 10, clues: [2, 3] },
      { name: 'Kitchen', x: 10, z: 0, width: 10, depth: 8, clues: [4] },
      { name: 'Dining Room', x: 0, z: -9, width: 8, depth: 8, clues: [5] },
    ],
    2: [
      { name: 'Master Bedroom', x: -8, z: 0, width: 12, depth: 10, clues: [7, 8] },
      { name: 'Bedroom 1', x: 8, z: 0, width: 8, depth: 8, clues: [9] },
      { name: 'Bedroom 2', x: 8, z: -10, width: 8, depth: 8, clues: [10] },
      { name: 'Study', x: -12, z: -10, width: 6, depth: 8, clues: [11, 12] },
    ]
  };

  const clues = [
    { id: 1, name: "Front Door Note", text: "The key is hidden where time stands still", room: "Entrance Hall" },
    { id: 2, name: "Family Photo", text: "The family photo shows a date: 07-23-1998", room: "Living Room" },
    { id: 3, name: "Bookmark", text: "Bookmark at page 42 in the red book", room: "Living Room" },
    { id: 4, name: "Refrigerator Note", text: "Grocery list mentions '4 eggs, 2 milk, 1 bread'", room: "Kitchen" },
    { id: 5, name: "Table Setting", text: "Place settings for 4 people, but one has a broken glass", room: "Dining Room" },
    { id: 6, name: "Garden Marker", text: "Gardening calendar marked on July 23", room: "Garden" },
    { id: 7, name: "Alarm Clock", text: "Alarm set for 3:15 AM", room: "Master Bedroom" },
    { id: 8, name: "Journal", text: "Journal entry mentions 'the safe combination is my birth year'", room: "Master Bedroom" },
    { id: 9, name: "Homework", text: "Math homework shows equations with numbers 7, 23, 42", room: "Bedroom 1" },
    { id: 10, name: "Music Box", text: "Music box plays a tune that stops at note 42", room: "Bedroom 2" },
    { id: 11, name: "Computer Monitor", text: "Computer screen saver shows bouncing numbers", room: "Study" },
    { id: 12, name: "Safe", text: "Wall safe needs a 4-digit combination", room: "Study" },
  ];

  // Initialize Three.js Scene
  const initThreeJS = useCallback(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightsOn ? 0x87CEEB : 0x111111);
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
    camera.rotation.y = playerPosition.rotation;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, lightsOn ? 0.6 : 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, lightsOn ? 0.8 : 0.3);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Build House
    buildHouse(scene, currentFloor);

    // Animation loop
    const animate = () => {
      if (!renderer || !scene || !camera) return;
      
      // Update camera based on view mode
      updateCamera();
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [lightsOn, currentFloor, playerPosition]);

  // Update camera position and rotation
  const updateCamera = () => {
    if (!cameraRef.current) return;
    
    if (viewMode === 'first-person') {
      cameraRef.current.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
      cameraRef.current.rotation.y = playerPosition.rotation;
      cameraRef.current.rotation.x = 0;
    } else if (viewMode === 'orbit') {
      const radius = 15;
      const angle = Date.now() * 0.0005;
      cameraRef.current.position.set(
        Math.sin(angle) * radius,
        10,
        Math.cos(angle) * radius
      );
      cameraRef.current.lookAt(0, 0, 0);
    } else if (viewMode === 'top-down') {
      cameraRef.current.position.set(0, 30, 0);
      cameraRef.current.rotation.x = -Math.PI / 2;
    }
  };

  // Build House Structure
  const buildHouse = (scene, floorLevel) => {
    // Clear previous house
    while(scene.children.length > 3) { 
      scene.remove(scene.children[3]); 
    }

    const materials = {
      floor: new THREE.MeshStandardMaterial({ 
        color: 0x8b7355,
        roughness: 0.8,
        metalness: 0.2 
      }),
      wall: new THREE.MeshStandardMaterial({ 
        color: 0xf5f5dc,
        roughness: 0.7,
        metalness: 0.1 
      }),
      ceiling: new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0 
      }),
    };

    // Ground floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMesh = new THREE.Mesh(floorGeometry, materials.floor);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    floorMesh.position.y = floorLevel === 2 ? 4 : 0;
    scene.add(floorMesh);

    // Build walls for each room
    rooms[floorLevel].forEach(room => {
      // Room floor
      const roomFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(room.width, room.depth),
        new THREE.MeshStandardMaterial({ color: 0x8b7355 })
      );
      roomFloor.rotation.x = -Math.PI / 2;
      roomFloor.position.set(room.x, floorLevel === 2 ? 4 : 0.1, room.z);
      roomFloor.receiveShadow = true;
      scene.add(roomFloor);

      // Room walls
      const wallHeight = 4;
      const wallThickness = 0.2;
      const halfWidth = room.width / 2;
      const halfDepth = room.depth / 2;

      // Front wall
      const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(room.width, wallHeight, wallThickness),
        materials.wall
      );
      frontWall.position.set(
        room.x,
        wallHeight / 2 + (floorLevel === 2 ? 4 : 0),
        room.z - halfDepth
      );
      frontWall.castShadow = true;
      scene.add(frontWall);

      // Back wall
      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(room.width, wallHeight, wallThickness),
        materials.wall
      );
      backWall.position.set(
        room.x,
        wallHeight / 2 + (floorLevel === 2 ? 4 : 0),
        room.z + halfDepth
      );
      backWall.castShadow = true;
      scene.add(backWall);

      // Left wall
      const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, room.depth),
        materials.wall
      );
      leftWall.position.set(
        room.x - halfWidth,
        wallHeight / 2 + (floorLevel === 2 ? 4 : 0),
        room.z
      );
      leftWall.castShadow = true;
      scene.add(leftWall);

      // Right wall
      const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeight, room.depth),
        materials.wall
      );
      rightWall.position.set(
        room.x + halfWidth,
        wallHeight / 2 + (floorLevel === 2 ? 4 : 0),
        room.z
      );
      rightWall.castShadow = true;
      scene.add(rightWall);

      // Add furniture based on room type
      addRoomFurniture(scene, room, floorLevel);
    });

    // Add clues
    addClues(scene, floorLevel);
  };

  const addRoomFurniture = (scene, room, floorLevel) => {
    const yPos = floorLevel === 2 ? 4 : 0;
    
    if (room.name.includes('Living Room')) {
      // Sofa
      const sofaGeometry = new THREE.BoxGeometry(3, 1, 1.5);
      const sofaMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
      sofa.position.set(room.x - 3, yPos + 0.5, room.z);
      sofa.castShadow = true;
      scene.add(sofa);

      // Coffee table
      const tableGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
      const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.position.set(room.x, yPos + 0.05, room.z);
      table.castShadow = true;
      scene.add(table);

    } else if (room.name.includes('Kitchen')) {
      // Fridge
      const fridgeGeometry = new THREE.BoxGeometry(0.8, 2, 0.6);
      const fridgeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
      fridge.position.set(room.x + 3, yPos + 1, room.z);
      fridge.castShadow = true;
      scene.add(fridge);

      // Kitchen table
      const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
      const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.position.set(room.x, yPos + 0.05, room.z - 2);
      table.castShadow = true;
      scene.add(table);

    } else if (room.name.includes('Master Bedroom')) {
      // Bed
      const bedGeometry = new THREE.BoxGeometry(2, 0.5, 1.8);
      const bedMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const bed = new THREE.Mesh(bedGeometry, bedMaterial);
      bed.position.set(room.x, yPos + 0.25, room.z);
      bed.castShadow = true;
      scene.add(bed);

      // Wardrobe
      const wardrobeGeometry = new THREE.BoxGeometry(1, 2, 0.6);
      const wardrobeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const wardrobe = new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
      wardrobe.position.set(room.x + 4, yPos + 1, room.z);
      wardrobe.castShadow = true;
      scene.add(wardrobe);
    }
  };

  const addClues = (scene, floorLevel) => {
    clues.forEach(clue => {
      const room = rooms[floorLevel].find(r => clues.find(c => c.id === clue.id && c.room === r.name));
      if (!room) return;

      const found = foundClues.find(fc => fc.id === clue.id);
      if (found) return;

      const yPos = floorLevel === 2 ? 4 : 0;
      
      // Create clue object
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0.8
      });
      const clueMesh = new THREE.Mesh(geometry, material);
      clueMesh.position.set(
        room.x + (Math.random() - 0.5) * (room.width - 1),
        yPos + 1,
        room.z + (Math.random() - 0.5) * (room.depth - 1)
      );
      clueMesh.userData = { clueId: clue.id };
      scene.add(clueMesh);

      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(clueMesh.position);
      scene.add(glow);
    });
  };

  // Timer
  const startTimer = () => {
    if (timeRef.current) clearInterval(timeRef.current);
    
    timeRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timeRef.current);
          alert("Time's up! The house has locked down.");
          startGame();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Game Initialization
  const startGame = () => {
    setGameStarted(true);
    setCurrentFloor(1);
    setPlayerPosition({ x: 0, y: 1.6, z: 0, rotation: 0 });
    setFoundClues([]);
    setInventory([]);
    setTimeLeft(600);
    setCurrentRoom('Entrance Hall');
    startTimer();
    
    // Initialize Three.js
    setTimeout(() => {
      initThreeJS();
    }, 100);
  };

  // Keyboard Controls
  const keysRef = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key.toLowerCase()] = true;

      if (gameStarted && !gameCompleted) {
        const speed = 0.1;
        let newX = playerPosition.x;
        let newZ = playerPosition.z;
        let newRotation = playerPosition.rotation;

        switch(e.key.toLowerCase()) {
          case 'w':
            newX += Math.sin(newRotation) * speed;
            newZ += Math.cos(newRotation) * speed;
            break;
          case 's':
            newX -= Math.sin(newRotation) * speed;
            newZ -= Math.cos(newRotation) * speed;
            break;
          case 'a':
            newRotation -= 0.05;
            break;
          case 'd':
            newRotation += 0.05;
            break;
          case 'arrowleft':
            newRotation -= 0.05;
            break;
          case 'arrowright':
            newRotation += 0.05;
            break;
          case ' ':
            checkForClue();
            break;
          case 'h':
            setHintVisible(true);
            setTimeout(() => setHintVisible(false), 3000);
            break;
          case 'v':
            setViewMode(prev => 
              prev === 'first-person' ? 'orbit' : 
              prev === 'orbit' ? 'top-down' : 'first-person'
            );
            break;
          case 'l':
            setLightsOn(!lightsOn);
            initThreeJS();
            break;
          case '1':
            setCurrentFloor(1);
            setPlayerPosition(prev => ({ ...prev, y: 1.6 }));
            initThreeJS();
            break;
          case '2':
            setCurrentFloor(2);
            setPlayerPosition(prev => ({ ...prev, y: 5.6 }));
            initThreeJS();
            break;
          case 'f':
            toggleFullscreen();
            break;
        }

        // Update room based on position
        updateCurrentRoom(newX, newZ);

        setPlayerPosition({
          x: newX,
          y: playerPosition.y,
          z: newZ,
          rotation: newRotation
        });
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameCompleted, playerPosition, currentFloor, lightsOn]);

  const updateCurrentRoom = (x, z) => {
    const currentRooms = rooms[currentFloor];
    const room = currentRooms.find(r => {
      const halfWidth = r.width / 2;
      const halfDepth = r.depth / 2;
      return (
        x >= r.x - halfWidth &&
        x <= r.x + halfWidth &&
        z >= r.z - halfDepth &&
        z <= r.z + halfDepth
      );
    });
    
    if (room && room.name !== currentRoom) {
      setCurrentRoom(room.name);
    }
  };

  const checkForClue = () => {
    const roomClues = clues.filter(clue => {
      const room = rooms[currentFloor].find(r => r.name === clue.room);
      return room && !foundClues.find(fc => fc.id === clue.id);
    });

    if (roomClues.length > 0) {
      const clue = roomClues[0];
      setFoundClues(prev => [...prev, clue]);
      setInventory(prev => [...prev, {
        id: clue.id,
        name: clue.name,
        description: clue.text
      }]);

      alert(`Found: ${clue.name}\n\n${clue.text}`);
      
      // Rebuild scene to remove the found clue
      initThreeJS();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setFullscreen(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              House Escape: The Mysterious Mansion
            </h1>
            <p className="text-gray-400">Explore, discover clues, and escape before time runs out!</p>
          </div>
          
          {gameStarted && !gameCompleted && (
            <div className="flex items-center gap-4">
              <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700">
                <div className="text-sm text-gray-400">Time Remaining</div>
                <div className={`text-2xl font-bold ${
                  timeLeft < 120 ? 'text-red-400 animate-pulse' : 'text-green-400'
                }`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700">
                <div className="text-sm text-gray-400">Floor</div>
                <div className="text-2xl font-bold text-cyan-400">F{currentFloor}</div>
              </div>
            </div>
          )}
        </div>

        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 max-w-4xl w-full text-center">
              <div className="text-6xl mb-6">🏠</div>
              <h2 className="text-3xl font-bold mb-6">Explore the 3D Mansion</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">🎮 Controls</h3>
                  <ul className="space-y-2">
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded mr-2">W</kbd> Move forward</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded mr-2">S</kbd> Move backward</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded mr-2">A/D</kbd> Turn left/right</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded mr-2">Space</kbd> Interact</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded mr-2">V</kbd> Change view</li>
                    <li><kbd className="px-2 py-1 bg-gray-700 rounded mr-2">F</kbd> Fullscreen</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-400">🎯 Objective</h3>
                  <p className="text-gray-300 mb-4">
                    Explore the mansion, find 12 hidden clues, solve the mystery, and escape!
                  </p>
                  <div className="text-left space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Find glowing yellow clues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Explore both floors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Escape in 10 minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-4 text-xl rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all font-bold animate-pulse"
              >
                🚪 Enter the Mansion
              </button>
            </div>
          </div>
        ) : gameCompleted ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 max-w-2xl w-full text-center">
              <div className="text-6xl mb-6">🏆</div>
              <h2 className="text-4xl font-bold mb-6">Escape Successful!</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                  <div className="text-3xl text-yellow-400 font-bold mb-2">
                    Time Remaining: {formatTime(timeLeft)}
                  </div>
                  <p className="text-gray-300">You found all clues and escaped!</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-sm text-gray-400">Clues Found</div>
                    <div className="text-2xl font-bold">{foundClues.length}/12</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-sm text-gray-400">Floors Explored</div>
                    <div className="text-2xl font-bold">2/2</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <div className="text-sm text-gray-400">Time Used</div>
                    <div className="text-2xl font-bold">{formatTime(600 - timeLeft)}</div>
                  </div>
                </div>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-all font-bold"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Panel */}
              <div className="space-y-6">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">📍 Current Location</h3>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-cyan-400">{currentRoom}</div>
                    <div className="text-gray-400">Floor {currentFloor}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                        <div className="text-sm text-gray-400">Position</div>
                        <div className="font-mono">
                          X:{playerPosition.x.toFixed(1)} Z:{playerPosition.z.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                        <div className="text-sm text-gray-400">View</div>
                        <div className="font-bold capitalize">{viewMode}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">🔍 Found Clues</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {foundClues.length === 0 ? (
                      <p className="text-gray-400 italic">No clues found yet</p>
                    ) : (
                      foundClues.map(clue => (
                        <div key={clue.id} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="font-bold text-yellow-400">{clue.name}</div>
                          <p className="text-sm text-gray-300 mt-1">{clue.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400">
                      {foundClues.length} / 12 clues found
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${(foundClues.length / 12) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setHintVisible(true)}
                      className="py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition-all"
                    >
                      💡 Hint
                    </button>
                    <button
                      onClick={() => setViewMode(prev => 
                        prev === 'first-person' ? 'orbit' : 
                        prev === 'orbit' ? 'top-down' : 'first-person'
                      )}
                      className="py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition-all col-span-2"
                    >
                      {fullscreen ? '📺 Exit Fullscreen' : '📺 Fullscreen'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Game Area */}
              <div className="lg:col-span-3">
                <div 
                  ref={containerRef}
                  className={`relative rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl ${
                    fullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
                  }`}
                  style={{ 
                    height: fullscreen ? '100vh' : '600px',
                    width: fullscreen ? '100vw' : 'auto'
                  }}
                >
                  <div ref={mountRef} className="w-full h-full" />
                  
                  {/* Game Overlay */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                    <div className="font-bold">🎮 Controls Active</div>
                    <div className="text-sm text-gray-400">Use WASD to move, Space to interact</div>
                  </div>

                  {hintVisible && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 rounded-xl border border-cyan-500/50 max-w-md text-center">
                        <div className="text-3xl mb-4">💡</div>
                        <h3 className="text-xl font-bold mb-3">Hint</h3>
                        <p className="text-gray-300">
                          Look for glowing yellow spheres. Move close and press Space to collect clues!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-xl font-bold mb-4">🎯 Current Objectives</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          foundClues.length >= 12 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>Find all 12 clues ({foundClues.length}/12)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          currentFloor === 2 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>Explore upstairs (press 2)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          timeLeft > 300 ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>Escape before time runs out</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-xl font-bold mb-4">🏠 House Map</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {rooms[currentFloor].map(room => (
                        <div 
                          key={room.name}
                          className={`p-3 rounded-lg text-center ${
                            currentRoom === room.name 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50' 
                              : 'bg-gray-800/50'
                          }`}
                        >
                          <div className="font-bold">{room.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {room.clues.length} clue{room.clues.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-xl font-bold mb-4">📊 Game Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Time Played</span>
                        <span className="font-bold">{formatTime(600 - timeLeft)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Clues/Minute</span>
                        <span className="font-bold">
                          {((foundClues.length / (600 - timeLeft)) * 60).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Rooms Visited</span>
                        <span className="font-bold">
                          {rooms[currentFloor].filter(r => r.name === currentRoom).length + foundClues.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Footer */}
            <div className="mt-6 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { key: 'W', label: 'Forward' },
                  { key: 'S', label: 'Backward' },
                  { key: 'A/D', label: 'Turn' },
                  { key: 'Space', label: 'Interact' },
                  { key: 'V', label: 'View Mode' },
                  { key: '1/2', label: 'Floor' },
                  { key: 'F', label: 'Fullscreen' },
                  { key: 'H', label: 'Hint' },
                ].map((control, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                    <kbd className="px-2 py-1 bg-gray-700 rounded">{control.key}</kbd>
                    <span className="text-sm text-gray-300">{control.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EscapeMaze;