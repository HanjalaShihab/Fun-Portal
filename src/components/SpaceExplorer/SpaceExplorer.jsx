// src/components/SpaceExplorer/SpaceExplorer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, FaGlobeAmericas, FaStar, FaCompass,
  FaSun, FaMoon, FaSatellite, FaMeteor,
  FaSpaceShuttle, FaGalacticRepublic, FaSearch,
  FaVolumeUp, FaVolumeMute, FaPlay, FaPause,
  FaExpand, FaCompress, FaInfoCircle, FaGamepad,
  FaChevronLeft, FaChevronRight, FaBook,
  FaCamera, FaChartLine, FaAtom, FaArrowLeft,
  FaCrosshairs, FaEye, FaRandom, FaRoute
} from 'react-icons/fa';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const SpaceExplorer = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const animationIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentView, setCurrentView] = useState('solar-system');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [travelMode, setTravelMode] = useState(false);
  const [discoveredPlanets, setDiscoveredPlanets] = useState(new Set(['sun', 'earth', 'mars']));
  const [missionProgress, setMissionProgress] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelProgress, setTravelProgress] = useState(0);
  const [travelStartPosition, setTravelStartPosition] = useState(null);
  const [travelTargetPosition, setTravelTargetPosition] = useState(null);
  const [stars, setStars] = useState(null);

  // Planet data with realistic relative sizes (but scaled for visibility)
  const planets = [
    {
      id: 'sun',
      name: 'Sun',
      type: 'star',
      color: '#FDB813',
      radius: 20,
      distance: 0,
      orbitSpeed: 0,
      rotationSpeed: 0.001,
      facts: [
        'Contains 99.86% of the solar system\'s mass',
        'Surface temperature: 5,500°C',
        'Core temperature: 15 million°C',
        'Light takes 8 minutes to reach Earth'
      ],
      description: 'The Sun is a G-type main-sequence star that makes up about 99.86% of the mass of the Solar System.',
      discoveryYear: 'Ancient',
      temperature: '5,500°C',
      moons: 0,
      texture: 'sun'
    },
    {
      id: 'mercury',
      name: 'Mercury',
      type: 'terrestrial',
      color: '#8C7853',
      radius: 4,
      distance: 50,
      orbitSpeed: 0.004,
      rotationSpeed: 0.004,
      facts: [
        'Closest planet to the Sun',
        'No atmosphere to speak of',
        'Temperature extremes: -173°C to 427°C',
        'Smallest planet in our solar system'
      ],
      description: 'Mercury is the smallest and innermost planet in the Solar System, orbiting the Sun once every 88 Earth days.',
      discoveryYear: 'Ancient',
      temperature: '167°C',
      moons: 0,
      texture: 'mercury'
    },
    {
      id: 'venus',
      name: 'Venus',
      type: 'terrestrial',
      color: '#FFC649',
      radius: 5.5,
      distance: 70,
      orbitSpeed: 0.0015,
      rotationSpeed: 0.0001,
      facts: [
        'Hottest planet in solar system',
        'Rotates backwards',
        'A day is longer than a year',
        'Dense atmosphere of CO₂'
      ],
      description: 'Venus is the second planet from the Sun and is similar in size and mass to Earth, but with a toxic atmosphere.',
      discoveryYear: 'Ancient',
      temperature: '462°C',
      moons: 0,
      texture: 'venus'
    },
    {
      id: 'earth',
      name: 'Earth',
      type: 'terrestrial',
      color: '#6B93D6',
      radius: 6,
      distance: 100,
      orbitSpeed: 0.001,
      rotationSpeed: 0.005,
      facts: [
        'Only known planet with life',
        '71% covered by water',
        'Has one natural satellite (Moon)',
        'Thin atmosphere perfect for life'
      ],
      description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
      discoveryYear: 'Always known',
      temperature: '15°C',
      moons: 1,
      texture: 'earth'
    },
    {
      id: 'mars',
      name: 'Mars',
      type: 'terrestrial',
      color: '#FF6B3D',
      radius: 4.5,
      distance: 130,
      orbitSpeed: 0.0008,
      rotationSpeed: 0.004,
      facts: [
        'Known as the Red Planet',
        'Has two small moons',
        'Largest volcano in solar system',
        'Evidence of ancient water'
      ],
      description: 'Mars is the fourth planet from the Sun and the second-smallest planet, often called the Red Planet.',
      discoveryYear: 'Ancient',
      temperature: '-63°C',
      moons: 2,
      texture: 'mars'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      type: 'gas-giant',
      color: '#E0AA70',
      radius: 12,
      distance: 180,
      orbitSpeed: 0.0002,
      rotationSpeed: 0.01,
      facts: [
        'Largest planet in solar system',
        'Has 79 known moons',
        'Great Red Spot is a giant storm',
        'Strongest magnetic field'
      ],
      description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System, a gas giant with a mass one-thousandth that of the Sun.',
      discoveryYear: 'Ancient',
      temperature: '-108°C',
      moons: 79,
      texture: 'jupiter'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      type: 'gas-giant',
      color: '#F4D3A1',
      radius: 10,
      distance: 240,
      orbitSpeed: 0.00015,
      rotationSpeed: 0.009,
      facts: [
        'Famous for its rings',
        'Least dense planet',
        'Has 82 confirmed moons',
        'Winds can reach 1,800 km/h'
      ],
      description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter, known for its prominent ring system.',
      discoveryYear: 'Ancient',
      temperature: '-139°C',
      moons: 82,
      texture: 'saturn'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      type: 'ice-giant',
      color: '#4FD0E7',
      radius: 8,
      distance: 280,
      orbitSpeed: 0.0001,
      rotationSpeed: 0.006,
      facts: [
        'Rotates on its side',
        'Ice giant with methane atmosphere',
        'Has 13 known rings',
        'Coldest planetary atmosphere'
      ],
      description: 'Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system, discovered in 1781.',
      discoveryYear: 1781,
      temperature: '-197°C',
      moons: 27,
      texture: 'uranus'
    },
    {
      id: 'neptune',
      name: 'Neptune',
      type: 'ice-giant',
      color: '#4B70DD',
      radius: 7.5,
      distance: 320,
      orbitSpeed: 0.00008,
      rotationSpeed: 0.007,
      facts: [
        'Windiest planet',
        'Discovered mathematically',
        'Has 14 known moons',
        'Great Dark Spot storm'
      ],
      description: 'Neptune is the eighth and farthest known Solar planet from the Sun, discovered in 1846 through mathematical predictions.',
      discoveryYear: 1846,
      temperature: '-201°C',
      moons: 14,
      texture: 'neptune'
    }
  ];

  // Texture URLs for realistic planet surfaces
  const textureUrls = {
    sun: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&auto=format&fit=crop',
    mercury: 'https://solarsystem.nasa.gov/system/resources/detail_files/2493_mercury_carousel_1.jpg',
    venus: 'https://solarsystem.nasa.gov/system/resources/detail_files/2494_venus_carousel_1.jpg',
    earth: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop',
    mars: 'https://solarsystem.nasa.gov/system/resources/detail_files/2496_mars_carousel_1.jpg',
    jupiter: 'https://solarsystem.nasa.gov/system/resources/detail_files/2497_jupiter_carousel_1.jpg',
    saturn: 'https://solarsystem.nasa.gov/system/resources/detail_files/2498_saturn_carousel_1.jpg',
    uranus: 'https://solarsystem.nasa.gov/system/resources/detail_files/2499_uranus_carousel_1.jpg',
    neptune: 'https://solarsystem.nasa.gov/system/resources/detail_files/2500_neptune_carousel_1.jpg'
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000010, 50, 1000);
    sceneRef.current = scene;

    // Camera with better positioning
    const camera = new THREE.PerspectiveCamera(60, canvasRef.current.clientWidth / 600, 0.1, 5000);
    camera.position.set(0, 100, 350);
    cameraRef.current = camera;

    // Renderer with better settings
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 2000;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvasRef.current.clientWidth, 600),
      1.2, 0.4, 0.8
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.8;
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x555555, 0.8);
    scene.add(ambientLight);

    // Sun light - very bright
    const sunLight = new THREE.PointLight(0xFFD700, 5, 2000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.far = 2000;
    scene.add(sunLight);

    // Add fill light for better planet visibility
    const fillLight = new THREE.DirectionalLight(0x4477FF, 0.5);
    fillLight.position.set(100, 100, 100);
    scene.add(fillLight);

    // Create enhanced stars background (like in your previous version)
    createStarsBackground(scene);

    // Create solar system
    createSolarSystem(scene);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (isPlaying) {
        updatePlanetPositions(scene);
        if (stars) {
          stars.rotation.y += 0.00005 * speed;
        }
      }
      
      // Handle traveling animation
      if (isTraveling && travelStartPosition && travelTargetPosition) {
        handleTravelAnimation();
      }
      
      controls.update();
      composer.render();
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      camera.aspect = canvasRef.current.clientWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, 600);
      composer.setSize(canvasRef.current.clientWidth, 600);
    };

    window.addEventListener('resize', handleResize);

    // Initialize with Earth selected
    setSelectedPlanet(planets[3]);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      if (controls) controls.dispose();
      if (renderer) renderer.dispose();
      if (composer) composer.dispose();
    };
  }, []);

  const createStarsBackground = (scene) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      const radius = 800 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starsPositions[i3 + 2] = radius * Math.cos(phi);
      
      starsSizes[i] = Math.random() * 1.5 + 0.5;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 1.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    });
    
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);
    setStars(starsMesh);
  };

  const createSolarSystem = (scene) => {
    // Clear existing solar system objects
    const toRemove = [];
    scene.traverse((child) => {
      if (child.userData.isPlanet || child.userData.isOrbit || child.userData.isGrid || child.userData.isRing || child.userData.isLabel) {
        toRemove.push(child);
      }
    });
    toRemove.forEach(child => scene.remove(child));

    // Create grid if enabled
    if (showGrid) {
      const gridHelper = new THREE.GridHelper(500, 50, 0x444444, 0x222222);
      gridHelper.userData.isGrid = true;
      scene.add(gridHelper);
    }

    // Create planets and orbits
    planets.forEach((planet) => {
      // Orbit path
      if (showOrbits && planet.distance > 0) {
        const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.5, planet.distance + 0.5, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x4488FF,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3,
          depthWrite: false
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        orbit.userData.isOrbit = true;
        orbit.userData.planetId = planet.id;
        scene.add(orbit);
      }

      // Planet sphere with texture
      const geometry = new THREE.SphereGeometry(planet.radius, 64, 64);
      
      let material;
      if (planet.id === 'sun') {
        // Sun material with strong emission
        material = new THREE.MeshBasicMaterial({
          color: planet.color,
          emissive: planet.color,
          emissiveIntensity: 3
        });
      } else {
        // Planet material with texture
        const texture = new THREE.TextureLoader().load(textureUrls[planet.texture]);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        
        material = new THREE.MeshStandardMaterial({
          map: texture,
          color: planet.color,
          roughness: planet.type === 'gas-giant' ? 0.4 : 0.7,
          metalness: planet.type === 'gas-giant' ? 0.8 : 0.2
        });
      }

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = planet.distance;
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.userData.isPlanet = true;
      sphere.userData.planetData = planet;
      sphere.userData.originalPosition = { x: planet.distance, y: 0, z: 0 };
      
      // Add hover effect
      sphere.userData.originalScale = new THREE.Vector3(1, 1, 1);
      scene.add(sphere);

      // Add atmospheric glow for all planets except sun
      if (planet.id !== 'sun') {
        const glowGeometry = new THREE.SphereGeometry(planet.radius * 1.15, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: planet.color,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glow);
        glow.userData.isGlow = true;
      }

      // Add rings for Saturn
      if (planet.id === 'saturn') {
        const ringGeometry = new THREE.RingGeometry(planet.radius * 1.8, planet.radius * 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xF4D3A1,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
          depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + 0.1;
        ring.userData.isRing = true;
        ring.userData.planetId = planet.id;
        sphere.add(ring);
      }

      // Add labels if enabled
      if (showLabels) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 24px Arial';
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'center';
        context.strokeStyle = '#000000';
        context.lineWidth = 4;
        context.strokeText(planet.name, 128, 32);
        context.fillText(planet.name, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true 
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(20, 5, 1);
        sprite.position.set(0, planet.radius * 1.5, 0);
        sprite.userData.isLabel = true;
        sprite.userData.planetId = planet.id;
        sphere.add(sprite);
      }
    });
  };

  const updatePlanetPositions = (scene) => {
    scene.traverse((child) => {
      if (child.userData.isPlanet && child.userData.planetData) {
        const planet = child.userData.planetData;
        if (planet.distance > 0) {
          const time = Date.now() * 0.001 * speed;
          const angle = time * planet.orbitSpeed;
          const x = Math.cos(angle) * planet.distance;
          const z = Math.sin(angle) * planet.distance;
          
          child.position.x = x;
          child.position.z = z;
          child.rotation.y += planet.rotationSpeed * speed;
        }
      }
    });
  };

  const handleTravelAnimation = () => {
    if (!cameraRef.current || !travelStartPosition || !travelTargetPosition) return;
    
    const progress = Math.min(travelProgress + 0.02, 1);
    setTravelProgress(progress);
    
    // Ease function for smooth travel
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);
    
    // Interpolate camera position
    const currentPos = {
      x: travelStartPosition.x + (travelTargetPosition.x - travelStartPosition.x) * easedProgress,
      y: travelStartPosition.y + (travelTargetPosition.y - travelStartPosition.y) * easedProgress,
      z: travelStartPosition.z + (travelTargetPosition.z - travelStartPosition.z) * easedProgress
    };
    
    cameraRef.current.position.set(currentPos.x, currentPos.y, currentPos.z);
    
    // Update controls target
    const targetProgress = Math.min(progress + 0.1, 1);
    const targetPos = {
      x: travelTargetPosition.x * targetProgress,
      y: travelTargetPosition.y * targetProgress,
      z: travelTargetPosition.z * targetProgress
    };
    controlsRef.current.target.set(targetPos.x, targetPos.y, targetPos.z);
    
    if (progress >= 1) {
      setIsTraveling(false);
      setTravelProgress(0);
      setTravelStartPosition(null);
      setTravelTargetPosition(null);
    }
  };

  const startTravelToPlanet = (planet) => {
    if (!cameraRef.current || !planet) return;
    
    setTravelMode(true);
    setIsTraveling(true);
    setTravelProgress(0);
    
    // Set start position as current camera position
    const currentPos = cameraRef.current.position.clone();
    setTravelStartPosition(currentPos);
    
    // Calculate target position for the planet
    let targetPos;
    if (planet.distance > 0) {
      // For planets other than sun
      const distance = planet.radius * 5; // Close distance for travel
      targetPos = new THREE.Vector3(
        planet.distance + distance,
        planet.radius * 2,
        distance
      );
    } else {
      // For sun
      targetPos = new THREE.Vector3(
        0,
        planet.radius * 3,
        planet.radius * 5
      );
    }
    
    setTravelTargetPosition(targetPos);
  };

  const handleCanvasClick = (event) => {
    if (!canvasRef.current || !sceneRef.current || !cameraRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    mouseRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
    
    for (const intersect of intersects) {
      let obj = intersect.object;
      while (obj && !obj.userData.isPlanet) {
        obj = obj.parent;
      }
      
      if (obj && obj.userData.isPlanet) {
        const planet = obj.userData.planetData;
        handlePlanetClick(planet);
        return;
      }
    }
  };

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
    setIsZoomedIn(true);
    
    // Add to discovered planets
    if (!discoveredPlanets.has(planet.id)) {
      const newDiscovered = new Set(discoveredPlanets);
      newDiscovered.add(planet.id);
      setDiscoveredPlanets(newDiscovered);
      setMissionProgress((newDiscovered.size / planets.length) * 100);
    }

    // Fly to planet for close-up view
    if (cameraRef.current && controlsRef.current) {
      if (planet.distance > 0) {
        const distance = planet.radius * 5;
        cameraRef.current.position.set(
          planet.distance + distance,
          planet.radius * 2,
          distance
        );
        controlsRef.current.target.set(planet.distance, 0, 0);
        controlsRef.current.minDistance = planet.radius * 2;
        controlsRef.current.maxDistance = planet.radius * 20;
      } else {
        // For sun
        cameraRef.current.position.set(0, planet.radius * 3, planet.radius * 5);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.minDistance = planet.radius * 2;
        controlsRef.current.maxDistance = planet.radius * 30;
      }
    }
  };

  const handleZoomOut = () => {
    setIsZoomedIn(false);
    setTravelMode(false);
    setIsTraveling(false);
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 100, 350);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.minDistance = 10;
      controlsRef.current.maxDistance = 2000;
    }
  };

  const handleStartTravel = () => {
    if (!selectedPlanet) {
      // If no planet selected, pick a random one
      const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
      setSelectedPlanet(randomPlanet);
      startTravelToPlanet(randomPlanet);
    } else {
      startTravelToPlanet(selectedPlanet);
    }
  };

  const handleRandomDiscovery = () => {
    const undiscovered = planets.filter(p => !discoveredPlanets.has(p.id));
    let randomPlanet;
    
    if (undiscovered.length > 0) {
      randomPlanet = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    } else {
      // All planets discovered, pick any random one
      randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    }
    
    handlePlanetClick(randomPlanet);
  };

  const handleRandomPlanetAdventure = () => {
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    setSelectedPlanet(randomPlanet);
    startTravelToPlanet(randomPlanet);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'galaxy-view') {
      cameraRef.current.position.set(0, 300, 500);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'solar-system') {
      handleZoomOut();
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? zoomLevel * 0.8 : zoomLevel * 1.2;
    setZoomLevel(Math.max(0.1, Math.min(5, newZoom)));
    
    if (cameraRef.current) {
      cameraRef.current.fov = 60 / zoomLevel;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  useEffect(() => {
    if (sceneRef.current) {
      createSolarSystem(sceneRef.current);
    }
  }, [showOrbits, showGrid, showLabels]);

  const planetTypes = {
    'star': { color: 'from-yellow-500 to-orange-500', icon: FaSun },
    'terrestrial': { color: 'from-blue-500 to-cyan-500', icon: FaGlobeAmericas },
    'gas-giant': { color: 'from-orange-500 to-red-500', icon: FaSun },
    'ice-giant': { color: 'from-cyan-500 to-blue-500', icon: FaMoon }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/30 text-white p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              🚀 Cosmic Explorer
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Journey through our solar system. Click planets to explore, drag to rotate, scroll to zoom.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mission Control */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-cyan-500/20">
              <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                <FaSpaceShuttle /> Mission Control
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mission Progress</span>
                  <span className="font-bold text-cyan-300">{Math.round(missionProgress)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${missionProgress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Discovered</span>
                  <span className="font-bold">
                    {discoveredPlanets.size}/{planets.length}
                  </span>
                </div>
                
                {/* Moved Random Planet Adventure here */}
                <button
                  onClick={handleRandomPlanetAdventure}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaRandom />
                    Random Planet Adventure
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-blue-500/20">
              <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
                <FaCompass /> Navigation
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleViewChange('solar-system')}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                    currentView === 'solar-system' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <FaGlobeAmericas className="text-xl mb-2" />
                  <div className="text-sm">Solar System</div>
                </button>
                
                <button
                  onClick={() => handleViewChange('galaxy-view')}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                    currentView === 'galaxy-view' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <FaGalacticRepublic className="text-xl mb-2" />
                  <div className="text-sm">Galaxy View</div>
                </button>
                
                <button
                  onClick={handleStartTravel}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all col-span-2 ${
                    isTraveling 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' 
                      : travelMode
                      ? 'bg-gradient-to-r from-orange-500 to-red-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}
                >
                  {isTraveling ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Traveling...</span>
                    </div>
                  ) : (
                    <>
                      <FaRoute className="text-xl mb-2" />
                      <div className="text-sm">
                        {travelMode ? 'Exit Travel' : selectedPlanet ? `Travel to ${selectedPlanet.name}` : 'Start Travel'}
                      </div>
                    </>
                  )}
                </button>
                
                {isZoomedIn && (
                  <button
                    onClick={handleZoomOut}
                    className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex flex-col items-center justify-center transition-all col-span-2"
                  >
                    <FaArrowLeft className="text-xl mb-2" />
                    <div className="text-sm">Zoom Out</div>
                  </button>
                )}
              </div>
            </div>

            {/* Speed Control */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4 text-purple-300 flex items-center gap-2">
                <FaRocket /> Time Control
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSpeedChange(0.1)}
                    className={`px-3 py-1 rounded-lg ${speed === 0.1 ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    0.1x
                  </button>
                  <button
                    onClick={() => handleSpeedChange(1)}
                    className={`px-3 py-1 rounded-lg ${speed === 1 ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => handleSpeedChange(10)}
                    className={`px-3 py-1 rounded-lg ${speed === 10 ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    10x
                  </button>
                  <button
                    onClick={() => handleSpeedChange(100)}
                    className={`px-3 py-1 rounded-lg ${speed === 100 ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    100x
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center gap-2"
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  
                  <button
                    onClick={() => setIsSoundOn(!isSoundOn)}
                    className="p-3 rounded-xl bg-gray-800 flex items-center gap-2"
                  >
                    {isSoundOn ? <FaVolumeUp /> : <FaVolumeMute />}
                    Sound
                  </button>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-green-500/20">
              <h3 className="text-xl font-bold mb-4 text-green-300 flex items-center gap-2">
                <FaGamepad /> Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show Orbits</span>
                  <button
                    onClick={() => setShowOrbits(!showOrbits)}
                    className={`w-12 h-6 rounded-full transition-all ${showOrbits ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${showOrbits ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show Labels</span>
                  <button
                    onClick={() => setShowLabels(!showLabels)}
                    className={`w-12 h-6 rounded-full transition-all ${showLabels ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${showLabels ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show Grid</span>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-12 h-6 rounded-full transition-all ${showGrid ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${showGrid ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <button
                  onClick={handleFullscreen}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center gap-2"
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - 3D Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/30">
              {/* Canvas Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-cyan-300">
                    {selectedPlanet?.name || 'Solar System'}
                    {isTraveling && <span className="ml-2 text-sm text-orange-400">🚀 Traveling...</span>}
                    {isZoomedIn && !isTraveling && <span className="ml-2 text-sm text-green-400">🔍 Zoomed In</span>}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedPlanet?.type ? `${selectedPlanet.type.charAt(0).toUpperCase() + selectedPlanet.type.slice(1)} • ` : ''}
                    {selectedPlanet?.distance ? `${selectedPlanet.distance} AU from Sun` : 'Central Star'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {isTraveling && (
                    <div className="text-sm text-orange-300">
                      Travel: {Math.round(travelProgress * 100)}%
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleZoom('out')}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={() => handleZoom('in')}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">
                    Zoom: {zoomLevel.toFixed(1)}x
                  </div>
                </div>
              </div>

              {/* 3D Canvas */}
              <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-950 to-black">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="w-full h-full rounded-b-xl cursor-pointer"
                />
                
                {/* Overlay Hints */}
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                  <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full">
                    <span className="text-sm text-cyan-300">🖱️ Click planets to zoom</span>
                    <span className="text-sm text-blue-300">📱 Drag to rotate</span>
                    <span className="text-sm text-purple-300">🎯 Scroll to zoom</span>
                  </div>
                </div>

                {/* Travel Indicator */}
                {isTraveling && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-500/30 animate-pulse">
                      <div className="flex items-center gap-2">
                        <FaRocket className="text-orange-300" />
                        <span className="text-sm text-orange-300">Traveling to {selectedPlanet?.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Zoom In Indicator */}
                {isZoomedIn && !isTraveling && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                      <div className="flex items-center gap-2">
                        <FaEye className="text-green-300" />
                        <span className="text-sm text-green-300">Viewing {selectedPlanet?.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Click Hint */}
                {!isZoomedIn && !isTraveling && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="text-center">
                      <div className="text-4xl mb-2 animate-bounce">👆</div>
                      <p className="text-lg font-bold text-cyan-300">Click any planet to explore</p>
                      <p className="text-sm text-gray-400">Planets have realistic textures</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Planet Quick Select */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-300">Quick Select</h4>
                  <span className="text-sm text-gray-400">{planets.length} celestial bodies</span>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {planets.map((planet) => {
                    const PlanetIcon = planetTypes[planet.type]?.icon || FaGlobeAmericas;
                    const isDiscovered = discoveredPlanets.has(planet.id);
                    
                    return (
                      <button
                        key={planet.id}
                        onClick={() => handlePlanetClick(planet)}
                        className={`flex-shrink-0 p-3 rounded-xl flex flex-col items-center transition-all ${
                          selectedPlanet?.id === planet.id
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                            : isDiscovered
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-900/50 opacity-50'
                        }`}
                        title={isDiscovered ? planet.name : 'Undiscovered'}
                      >
                        <PlanetIcon className={`text-xl ${!isDiscovered && 'opacity-50'}`} />
                        <div className={`text-xs mt-2 font-medium ${isDiscovered ? '' : 'opacity-50'}`}>
                          {isDiscovered ? planet.name : '???'}
                        </div>
                        {!isDiscovered && (
                          <div className="text-xs mt-1 text-yellow-400">🔒</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Stats & Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <FaChartLine className="text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="font-bold">System Stats</h4>
                    <p className="text-sm text-gray-400">Solar System Overview</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Planets</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Moons</span>
                    <span className="font-bold">214+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Asteroids</span>
                    <span className="font-bold">1.3M+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">View</span>
                    <span className={`font-bold ${isZoomedIn ? 'text-green-400' : isTraveling ? 'text-orange-400' : 'text-blue-400'}`}>
                      {isTraveling ? 'Traveling' : isZoomedIn ? 'Planet View' : 'System View'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <FaAtom className="text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-bold">Physics</h4>
                    <p className="text-sm text-gray-400">Real-time simulation</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time Speed</span>
                    <span className="font-bold">{speed}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Simulation</span>
                    <span className={`font-bold ${isPlaying ? 'text-green-400' : 'text-yellow-400'}`}>
                      {isPlaying ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">View Mode</span>
                    <span className="font-bold capitalize">{currentView.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Orbits</span>
                    <span className={`font-bold ${showOrbits ? 'text-green-400' : 'text-gray-400'}`}>
                      {showOrbits ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <FaCamera className="text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-bold">Camera</h4>
                    <p className="text-sm text-gray-400">View Controls</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Zoom Level</span>
                    <span className="font-bold">{zoomLevel.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mode</span>
                    <span className={`font-bold ${isTraveling ? 'text-orange-400' : isZoomedIn ? 'text-green-400' : 'text-blue-400'}`}>
                      {isTraveling ? 'Traveling' : isZoomedIn ? 'Planet View' : 'System View'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fullscreen</span>
                    <span className={`font-bold ${isFullscreen ? 'text-blue-400' : 'text-gray-400'}`}>
                      {isFullscreen ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sound</span>
                    <span className={`font-bold ${isSoundOn ? 'text-green-400' : 'text-gray-400'}`}>
                      {isSoundOn ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Planet Info */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatePresence mode="wait">
              {selectedPlanet ? (
                <motion.div
                  key={selectedPlanet.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-blue-500/20"
                >
                  {/* Planet Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative"
                      style={{ 
                        background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color} 20%, ${selectedPlanet.color}44)`,
                        boxShadow: `0 0 40px ${selectedPlanet.color}80, inset 0 0 20px ${selectedPlanet.color}40`
                      }}
                    >
                      {selectedPlanet.id === 'sun' ? (
                        <FaSun className="text-3xl text-yellow-100" />
                      ) : selectedPlanet.type === 'gas-giant' ? (
                        <FaSun className="text-3xl text-orange-100" />
                      ) : (
                        <FaGlobeAmericas className="text-3xl text-white" />
                      )}
                      {(isZoomedIn || isTraveling) && (
                        <div className={`absolute -top-1 -right-1 w-4 h-4 ${isTraveling ? 'bg-orange-400' : 'bg-green-400'} rounded-full animate-ping`} />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold">{selectedPlanet.name}</h3>
                        {(isZoomedIn || isTraveling) && (
                          <span className={`text-xs ${isTraveling ? 'bg-orange-500/20 text-orange-300' : 'bg-green-500/20 text-green-300'} px-2 py-1 rounded-full`}>
                            {isTraveling ? '🚀 Traveling To' : '🔍 Currently Viewing'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          selectedPlanet.type === 'star' ? 'bg-yellow-500/20 text-yellow-300' :
                          selectedPlanet.type === 'terrestrial' ? 'bg-blue-500/20 text-blue-300' :
                          selectedPlanet.type === 'gas-giant' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {selectedPlanet.type.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">
                          Discovered: {selectedPlanet.discoveryYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Planet Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Radius</div>
                      <div className="text-xl font-bold">
                        {selectedPlanet.radius} units
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Distance</div>
                      <div className="text-xl font-bold">
                        {selectedPlanet.distance > 0 ? `${selectedPlanet.distance} AU` : 'Center'}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Temperature</div>
                      <div className="text-xl font-bold">{selectedPlanet.temperature}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400">Moons</div>
                      <div className="text-xl font-bold">{selectedPlanet.moons}</div>
                    </div>
                  </div>

                  {/* Planet Description */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3 text-gray-300 flex items-center gap-2">
                      <FaBook /> Description
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {selectedPlanet.description}
                    </p>
                  </div>

                  {/* Interesting Facts */}
                  <div>
                    <h4 className="font-bold mb-3 text-gray-300 flex items-center gap-2">
                      <FaInfoCircle /> Interesting Facts
                    </h4>
                    <div className="space-y-3">
                      {selectedPlanet.facts.map((fact, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-blue-300">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-400">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Status */}
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Exploration Difficulty</span>
                      <span className="font-bold text-yellow-400">
                        {'⭐'.repeat(selectedPlanet.difficulty)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Discovery Status</span>
                      <span className={`font-bold ${discoveredPlanets.has(selectedPlanet.id) ? 'text-green-400' : 'text-yellow-400'}`}>
                        {discoveredPlanets.has(selectedPlanet.id) ? 'Discovered' : 'Undiscovered'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-blue-500/20">
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4 animate-pulse">🌌</div>
                    <h3 className="text-xl font-bold mb-2">Select a Celestial Body</h3>
                    <p className="text-gray-400">Click on any planet or star to learn more about it</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Realistic planet textures • Click to zoom • Interactive exploration
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* View Controls */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4 text-purple-300 flex items-center gap-2">
                <FaCrosshairs /> View Controls
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (isZoomedIn) {
                      handleZoomOut();
                    } else if (selectedPlanet) {
                      handlePlanetClick(selectedPlanet);
                    }
                  }}
                  className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 ${
                    isZoomedIn
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}
                >
                  {isZoomedIn ? <FaArrowLeft /> : <FaEye />}
                  <span className="font-bold">
                    {isZoomedIn ? 'Zoom Out to System' : 'Zoom to Planet'}
                  </span>
                </button>
                
                <button
                  onClick={handleRandomDiscovery}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center gap-3"
                >
                  <FaSearch />
                  <span className="font-bold">Discover Random Planet</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleViewChange('solar-system')}
                    className={`p-3 rounded-xl flex flex-col items-center ${
                      currentView === 'solar-system' 
                        ? 'bg-cyan-500/20 border border-cyan-500/30' 
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <FaGlobeAmericas />
                    <span className="text-xs mt-1">System</span>
                  </button>
                  
                  <button
                    onClick={() => handleViewChange('galaxy-view')}
                    className={`p-3 rounded-xl flex flex-col items-center ${
                      currentView === 'galaxy-view' 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <FaGalacticRepublic />
                    <span className="text-xs mt-1">Galaxy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Educational Tips */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-cyan-500/20">
              <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                🎓 Learning Tips
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-cyan-400 font-bold text-lg">1</div>
                  <div>
                    <p className="font-medium">Click to Explore</p>
                    <p className="text-sm text-gray-400">Click any planet to zoom in and examine details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 font-bold text-lg">2</div>
                  <div>
                    <p className="font-medium">Travel Mode</p>
                    <p className="text-sm text-gray-400">Use "Start Travel" to fly to selected planets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-purple-400 font-bold text-lg">3</div>
                  <div>
                    <p className="font-medium">Discover Planets</p>
                    <p className="text-sm text-gray-400">Track your progress discovering all planets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Features */}
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-orange-500/20">
              <h3 className="text-xl font-bold mb-4 text-orange-300 flex items-center gap-2">
                ✨ System Features
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-cyan-300">⭐</span>
                  </div>
                  <div>
                    <div className="font-medium">8,000 Stars</div>
                    <div className="text-xs text-gray-400">Realistic starfield background</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-300">🪐</span>
                  </div>
                  <div>
                    <div className="font-medium">Real Textures</div>
                    <div className="text-xs text-gray-400">NASA imagery for all planets</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-300">🚀</span>
                  </div>
                  <div>
                    <div className="font-medium">Smooth Travel</div>
                    <div className="text-xs text-gray-400">Animated travel between planets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-400">
            🚀 Cosmic Explorer • Interactive 3D Solar System • Educational Experience
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Three.js • Real NASA textures • Click planets to zoom • Smooth travel animation • Explore the cosmos!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpaceExplorer;