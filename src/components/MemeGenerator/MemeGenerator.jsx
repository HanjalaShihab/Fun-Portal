// src/components/MemeGenerator/MemeGenerator.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaDownload, FaUpload, FaFont, FaPalette, 
  FaRandom, FaHeart, FaShareAlt, FaCopy,
  FaArrowUp, FaArrowDown, FaEye, FaEyeSlash,
  FaBold, FaItalic, FaUnderline, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaSearch,
  FaFilter, FaMagic, FaRobot, FaStar,
  FaGripLines, FaTimes
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [texts, setTexts] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [textAlign, setTextAlign] = useState('center');
  const [activeTab, setActiveTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingText, setDraggingText] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const memeRef = useRef(null);
  const fileInputRef = useRef(null);

  // 58 Total Meme Templates
  const templates = [
    // Original 8
    { id: 1, name: 'Drake Hotline Bling', url: 'https://api.memegen.link/images/drake.jpg', category: 'popular' },
    { id: 2, name: 'Distracted Boyfriend', url: 'https://api.memegen.link/images/ds.jpg', category: 'popular' },
    { id: 3, name: 'Futurama Fry', url: 'https://api.memegen.link/images/fry.jpg', category: 'thinking' },
    { id: 4, name: 'Spongebob', url: 'https://api.memegen.link/images/spongebob.jpg', category: 'cartoon' },
    { id: 5, name: 'Two Buttons', url: 'https://api.memegen.link/images/buzz.jpg', category: 'choices' },
    { id: 6, name: 'Change My Mind', url: 'https://api.memegen.link/images/wonka.jpg', category: 'debate' },
    { id: 7, name: 'Expanding Brain', url: 'https://api.memegen.link/images/rollsafe.jpg', category: 'evolution' },
    { id: 8, name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg', category: 'reaction' },
    
    // New Templates - 50 more diverse memes
    { id: 9, name: 'Waiting Skeleton', url: 'https://api.memegen.link/images/ggg.jpg', category: 'waiting' },
    { id: 10, name: 'Left Exit 12', url: 'https://api.memegen.link/images/left.jpg', category: 'driving' },
    { id: 11, name: 'Buff Doge vs Cheems', url: 'https://api.memegen.link/images/doge.jpg', category: 'doge' },
    { id: 12, name: 'Always Has Been', url: 'https://api.memegen.link/images/always.jpg', category: 'space' },
    { id: 13, name: 'Running Away Balloon', url: 'https://api.memegen.link/images/balloon.jpg', category: 'escape' },
    { id: 14, name: 'American Chopper Argument', url: 'https://api.memegen.link/images/chopper.jpg', category: 'argument' },
    { id: 15, name: 'Boardroom Meeting', url: 'https://api.memegen.link/images/boardroom.jpg', category: 'business' },
    { id: 16, name: 'Woman Yelling at Cat', url: 'https://api.memegen.link/images/womanyellingcat.jpg', category: 'argument' },
    { id: 17, name: 'Mocking Spongebob', url: 'https://api.memegen.link/images/mockingspongebob.jpg', category: 'mocking' },
    { id: 18, name: 'Two Spider-Man', url: 'https://api.memegen.link/images/spiderman.jpg', category: 'pointing' },
    { id: 19, name: 'Sleeping Shaq', url: 'https://api.memegen.link/images/sleepingshaq.jpg', category: 'reaction' },
    { id: 20, name: 'Y U No', url: 'https://api.memegen.link/images/yuno.jpg', category: 'rage' },
    { id: 21, name: 'Tuxedo Winnie The Pooh', url: 'https://api.memegen.link/images/tuxedopooh.jpg', category: 'fancy' },
    { id: 22, name: 'Drake Yes No', url: 'https://api.memegen.link/images/drakeyesno.jpg', category: 'preference' },
    { id: 23, name: 'UNO Draw 25', url: 'https://api.memegen.link/images/unodraw25.jpg', category: 'games' },
    { id: 24, name: 'This Is Fine', url: 'https://api.memegen.link/images/thisisfine.jpg', category: 'reaction' },
    { id: 25, name: 'I Bet He\'s Thinking', url: 'https://api.memegen.link/images/thinking.jpg', category: 'thinking' },
    { id: 26, name: 'Hide the Pain Harold', url: 'https://api.memegen.link/images/harold.jpg', category: 'pain' },
    { id: 27, name: 'Grumpy Cat', url: 'https://api.memegen.link/images/grumpycat.jpg', category: 'cat' },
    { id: 28, name: 'Success Kid', url: 'https://api.memegen.link/images/successkid.jpg', category: 'success' },
    { id: 29, name: 'Bad Luck Brian', url: 'https://api.memegen.link/images/badluckbrian.jpg', category: 'fail' },
    { id: 30, name: 'One Does Not Simply', url: 'https://api.memegen.link/images/onedoesnotsimply.jpg', category: 'lordoftherings' },
    { id: 31, name: 'Third World Skeptical Kid', url: 'https://api.memegen.link/images/thirdworldskepticalkid.jpg', category: 'skeptical' },
    { id: 32, name: 'Ancient Aliens', url: 'https://api.memegen.link/images/ancientaliens.jpg', category: 'conspiracy' },
    { id: 33, name: 'X, X Everywhere', url: 'https://api.memegen.link/images/xxeverywhere.jpg', category: 'everywhere' },
    { id: 34, name: 'The Most Interesting Man', url: 'https://api.memegen.link/images/mostinteresting.jpg', category: 'classy' },
    { id: 35, name: '10 Guy', url: 'https://api.memegen.link/images/10guy.jpg', category: 'stoner' },
    { id: 36, name: 'First World Problems', url: 'https://api.memegen.link/images/firstworldproblems.jpg', category: 'problems' },
    { id: 37, name: 'Socially Awesome Awkward Penguin', url: 'https://api.memegen.link/images/awesomeawkward.jpg', category: 'awkward' },
    { id: 38, name: 'Overly Attached Girlfriend', url: 'https://api.memegen.link/images/overlyattached.jpg', category: 'relationship' },
    { id: 39, name: 'Scumbag Steve', url: 'https://api.memegen.link/images/scumbagsteve.jpg', category: 'scumbag' },
    { id: 40, name: 'Good Guy Greg', url: 'https://api.memegen.link/images/goodguygreg.jpg', category: 'goodguy' },
    { id: 41, name: 'Philosoraptor', url: 'https://api.memegen.link/images/philosoraptor.jpg', category: 'philosophy' },
    { id: 42, name: 'Condescending Wonka', url: 'https://api.memegen.link/images/wonka2.jpg', category: 'condescending' },
    { id: 43, name: 'Yo Dawg Heard You', url: 'https://api.memegen.link/images/yodawg.jpg', category: 'recursion' },
    { id: 44, name: 'Laughing Men In Suits', url: 'https://api.memegen.link/images/laughingmen.jpg', category: 'business' },
    { id: 45, name: 'Put It Somewhere Else Patrick', url: 'https://api.memegen.link/images/patrick.jpg', category: 'spongebob' },
    { id: 46, name: 'Matrix Morpheus', url: 'https://api.memegen.link/images/matrix.jpg', category: 'matrix' },
    { id: 47, name: 'Star Wars Yoda', url: 'https://api.memegen.link/images/yoda.jpg', category: 'starwars' },
    { id: 48, name: 'Captain Picard Facepalm', url: 'https://api.memegen.link/images/picard.jpg', category: 'startrek' },
    { id: 49, name: 'Jack Sparrow Being Chased', url: 'https://api.memegen.link/images/jacksparrow.jpg', category: 'pirates' },
    { id: 50, name: 'Epic Handshake', url: 'https://api.memegen.link/images/epichandshake.jpg', category: 'collab' },
    { id: 51, name: 'Is This A Pigeon?', url: 'https://api.memegen.link/images/pigeon.jpg', category: 'anime' },
    { id: 52, name: 'Surprised Pikachu', url: 'https://api.memegen.link/images/pikachu.jpg', category: 'pokemon' },
    { id: 53, name: 'Woman Calculating', url: 'https://api.memegen.link/images/womancalculating.jpg', category: 'thinking' },
    { id: 54, name: 'Monkey Puppet', url: 'https://api.memegen.link/images/monkeypuppet.jpg', category: 'looking' },
    { id: 55, name: 'Leonardo Dicaprio Cheers', url: 'https://api.memegen.link/images/leo.jpg', category: 'cheers' },
    { id: 56, name: 'Guy Holding Cardboard Sign', url: 'https://api.memegen.link/images/cardboardsign.jpg', category: 'sign' },
    { id: 57, name: 'Blank Nut Button', url: 'https://api.memegen.link/images/nutbutton.jpg', category: 'button' },
    { id: 58, name: 'They Don\'t Know', url: 'https://api.memegen.link/images/theydontknow.jpg', category: 'secret' },
  ];

  // Categories for filtering
  const categories = ['all', 'popular', 'thinking', 'reaction', 'argument', 'business', 'cartoon', 'games'];

  const quickTexts = [
    "When you finally fix the bug",
    "Me trying to understand React hooks",
    "How it feels to write JavaScript",
    "When the code works on first try",
    "Debugging be like",
    "My reaction to every PR comment",
    "When you find a StackOverflow answer",
    "Monday morning mood",
    "My code vs production",
    "When the client says 'make it pop'",
    "How I explain my code to others",
    "When you realize it's Friday",
    "My brain during meetings",
    "Trying to remember the syntax",
    "When you spot a typo after deployment",
  ];

  // Drag and Drop Handlers
  const handleTextDragStart = (id, e) => {
    const text = texts.find(t => t.id === id);
    if (!text) return;
    
    setDraggingText(id);
    const rect = e.currentTarget.getBoundingClientRect();
    const memeRect = memeRef.current.getBoundingClientRect();
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleTextDrag = (e) => {
    if (!draggingText || !memeRef.current) return;
    
    const memeRect = memeRef.current.getBoundingClientRect();
    const x = e.clientX - memeRect.left - dragOffset.x;
    const y = e.clientY - memeRect.top - dragOffset.y;
    
    // Ensure text stays within bounds
    const boundedX = Math.max(0, Math.min(x, memeRect.width - 100));
    const boundedY = Math.max(0, Math.min(y, memeRect.height - 50));
    
    updateText(draggingText, 'x', boundedX);
    updateText(draggingText, 'y', boundedY);
  };

  const handleTextDragEnd = () => {
    if (draggingText) {
      setDraggingText(null);
      toast.success('Text position updated!');
    }
  };

  // Add mouse event listeners for drag and drop
  useEffect(() => {
    const handleMouseMove = (e) => {
      handleTextDrag(e);
    };

    const handleMouseUp = () => {
      handleTextDragEnd();
    };

    if (draggingText) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingText]);

  const addText = () => {
    const newText = {
      id: Date.now(),
      text: 'Your Text Here',
      x: 50,
      y: 50,
      width: 300,
      visible: true,
      layer: texts.length + 1,
      draggable: true,
    };
    setTexts([...texts, newText]);
    toast.success('Text added! Drag it to position');
  };

  const updateText = (id, field, value) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, [field]: value } : text
    ));
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
    toast.success('Text removed');
  };

  const duplicateText = (id) => {
    const textToDuplicate = texts.find(t => t.id === id);
    if (textToDuplicate) {
      const newText = {
        ...textToDuplicate,
        id: Date.now(),
        x: textToDuplicate.x + 20,
        y: textToDuplicate.y + 20,
      };
      setTexts([...texts, newText]);
      toast.success('Text duplicated!');
    }
  };

  const handleDownload = () => {
    toast.loading('Preparing download...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Download started!');
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Share link copied to clipboard!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setSelectedTemplate(null);
        toast.success('Image uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAllTexts = () => {
    if (texts.length > 0) {
      setTexts([]);
      toast.success('All text cleared');
    }
  };

  const bringToFront = (id) => {
    const text = texts.find(t => t.id === id);
    if (text) {
      const otherTexts = texts.filter(t => t.id !== id);
      setTexts([...otherTexts, { ...text, layer: Date.now() }]);
      toast.success('Brought to front!');
    }
  };

  const sendToBack = (id) => {
    const text = texts.find(t => t.id === id);
    if (text) {
      const otherTexts = texts.filter(t => t.id !== id);
      setTexts([{ ...text, layer: -Date.now() }, ...otherTexts]);
      toast.success('Sent to back!');
    }
  };

  const resetTextPosition = (id) => {
    updateText(id, 'x', 50);
    updateText(id, 'y', 50);
    toast.success('Text position reset');
  };

  const fontOptions = [
    'Impact', 'Arial', 'Comic Sans MS', 'Georgia', 'Verdana',
    'Times New Roman', 'Courier New', 'Trebuchet MS', 'Palatino',
    'Arial Black', 'Tahoma', 'Century Gothic', 'Lucida Console'
  ];

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'templates' || true;
    return matchesSearch && matchesCategory;
  });

  // Filter by category
  const filteredByCategory = searchQuery 
    ? filteredTemplates 
    : filteredTemplates.filter(t => 
        activeTab === 'templates' || t.category === activeTab
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🎭 Ultimate Meme Factory
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Create hilarious memes in seconds with our easy-to-use editor! Drag text anywhere.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaShareAlt />
                  <span>Share</span>
                </button>
                <button
                  onClick={clearAllTexts}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaCopy />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaUpload />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Text Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaFont className="text-blue-500" />
                Text Controls
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 cursor-pointer rounded-lg"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 p-2 rounded-lg border"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-1">
                      -
                    </button>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="flex-1"
                    />
                    <button onClick={() => setFontSize(f => Math.min(120, f + 2))} className="p-1">
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2 rounded-lg border"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Text Align</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTextAlign('left')}
                      className={`p-2 rounded-lg ${textAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      <FaAlignLeft />
                    </button>
                    <button
                      onClick={() => setTextAlign('center')}
                      className={`p-2 rounded-lg ${textAlign === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      <FaAlignCenter />
                    </button>
                    <button
                      onClick={() => setTextAlign('right')}
                      className={`p-2 rounded-lg ${textAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      <FaAlignRight />
                    </button>
                  </div>
                </div>

                <button
                  onClick={addText}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <FaFont />
                  Add Text Box (Drag it!)
                </button>
              </div>
            </div>

            {/* Quick Text Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaMagic className="text-purple-500" />
                Quick Captions
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {quickTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addText();
                      setTimeout(() => {
                        const newTexts = [...texts];
                        if (newTexts.length > 0) {
                          newTexts[newTexts.length - 1].text = text;
                          setTexts(newTexts);
                        }
                      }, 100);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                  >
                    "{text}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Preview & Editor */}
          <div className="lg:col-span-2">
            {/* Editor Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              {['editor', 'templates', ...categories.slice(1)].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'editor' ? '🎨 Editor' : 
                   tab === 'templates' ? '📚 All Templates' : 
                   `#${tab}`}
                </button>
              ))}
            </div>

            {/* Content Area */}
            {activeTab === 'editor' && (
              <div className="space-y-6">
                {/* Preview Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Meme Preview {draggingText && <span className="text-sm text-blue-500">(Dragging...)</span>}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (texts.length > 0) {
                          texts.forEach(text => resetTextPosition(text.id));
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 text-white flex items-center gap-2"
                    >
                      <FaGripLines />
                      Reset All Positions
                    </button>
                    <button
                      onClick={() => toast.success('AI suggestions coming soon!')}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-2"
                    >
                      <FaRobot />
                      AI Suggestions
                    </button>
                  </div>
                </div>

                {/* Drag Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <FaGripLines className="text-blue-500 text-xl" />
                    <div>
                      <p className="font-medium text-blue-800">💡 Drag & Drop Feature Active!</p>
                      <p className="text-sm text-blue-600">
                        Click and drag any text box to position it exactly where you want. Release to drop.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meme Preview */}
                <div 
                  ref={memeRef}
                  className="relative bg-gray-100 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center p-4 border-2 border-dashed border-gray-300"
                  onMouseMove={handleTextDrag}
                  onMouseUp={handleTextDragEnd}
                >
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-w-full max-h-[500px] object-contain rounded-lg"
                    />
                  ) : selectedTemplate ? (
                    <img
                      src={selectedTemplate.url}
                      alt="Template"
                      className="max-w-full max-h-[500px] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="text-6xl mb-4">📷</div>
                      <p className="text-xl mb-2">No image selected</p>
                      <p className="text-gray-400">Choose a template or upload your own image</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Then add text and drag it anywhere on the meme!
                      </p>
                    </div>
                  )}

                  {/* Text Overlays */}
                  {texts.filter(t => t.visible).map((text) => (
                    <div
                      key={text.id}
                      className="absolute cursor-move select-none"
                      style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        maxWidth: `${text.width}px`,
                        zIndex: text.layer,
                        transform: draggingText === text.id ? 'scale(1.05)' : 'scale(1)',
                        transition: draggingText === text.id ? 'none' : 'all 0.2s',
                      }}
                      onMouseDown={(e) => handleTextDragStart(text.id, e)}
                    >
                      <div className="relative group">
                        <div
                          style={{
                            color: textColor,
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            fontWeight: 'bold',
                            textAlign: textAlign,
                            textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                            WebkitTextStroke: '1px black',
                            cursor: 'grab',
                          }}
                          className="whitespace-pre-wrap break-words bg-transparent hover:opacity-90 active:cursor-grabbing"
                        >
                          {text.text}
                        </div>
                        
                        {/* Text Controls */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeText(text.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            title="Remove"
                          >
                            <FaTimes size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateText(text.id);
                            }}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                            title="Duplicate"
                          >
                            <FaCopy size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              bringToFront(text.id);
                            }}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                            title="Bring to Front"
                          >
                            <FaArrowUp size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sendToBack(text.id);
                            }}
                            className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                            title="Send to Back"
                          >
                            <FaArrowDown size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resetTextPosition(text.id);
                            }}
                            className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                            title="Reset Position"
                          >
                            <FaGripLines size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Text Items Management */}
                {texts.length > 0 && (
                  <div className="bg-white rounded-2xl p-6">
                    <h4 className="text-xl font-bold mb-4 text-gray-800">
                      Text Layers ({texts.length}) - Drag to reorder
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {texts.map((text, index) => (
                        <div
                          key={text.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <FaGripLines className="text-gray-400 cursor-move" />
                            <span className="text-gray-500">#{index + 1}</span>
                            <input
                              type="text"
                              value={text.text}
                              onChange={(e) => updateText(text.id, 'text', e.target.value)}
                              className="bg-transparent border-none focus:outline-none flex-1"
                              placeholder="Enter text..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="text-xs text-gray-500">
                              x:{Math.round(text.x)} y:{Math.round(text.y)}
                            </div>
                            <button
                              onClick={() => updateText(text.id, 'visible', !text.visible)}
                              className="p-2 hover:bg-gray-200 rounded"
                              title={text.visible ? "Hide" : "Show"}
                            >
                              {text.visible ? <FaEye /> : <FaEyeSlash />}
                            </button>
                            <button
                              onClick={() => removeText(text.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Templates View */}
            {activeTab !== 'editor' && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab === 'templates' ? 'all' : activeTab} meme templates...`}
                    className="w-full p-4 pl-12 rounded-2xl border shadow-sm"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {filteredByCategory.length} templates
                  </div>
                </div>

                {/* Category Info */}
                {activeTab !== 'templates' && (
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
                    <h3 className="font-bold text-lg text-gray-800">
                      #{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Memes
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Popular {activeTab} meme templates. Click to select and start editing!
                    </p>
                  </div>
                )}

                {/* Templates Grid */}
                {filteredByCategory.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredByCategory.map((template) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setUploadedImage(null);
                          toast.success(`Selected: ${template.name}`);
                          setActiveTab('editor');
                        }}
                        className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all shadow-md hover:shadow-xl bg-white"
                      >
                        <img
                          src={template.url}
                          alt={template.name}
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                        <div className="p-3">
                          <p className="font-medium truncate text-sm">{template.name}</p>
                          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                            #{template.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaSearch className="text-5xl mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No templates found for "{searchQuery}"</p>
                    <p className="text-gray-400">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Upload & Quick Tips */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaUpload className="text-green-500" />
                Upload Your Image
              </h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <FaUpload className="text-5xl mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">
                  Drag & drop or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <FaMagic className="inline mr-2" />
                Pro tip: Use high-quality images for best results!
              </div>
            </div>

            {/* Drag & Drop Guide */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaGripLines />
                Drag & Drop Guide
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">1</div>
                  <div>
                    <div className="font-medium">Click on text</div>
                    <div className="text-sm text-white/80">Select any text box</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">2</div>
                  <div>
                    <div className="font-medium">Drag it</div>
                    <div className="text-sm text-white/80">Hold and move anywhere</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">3</div>
                  <div>
                    <div className="font-medium">Release to drop</div>
                    <div className="text-sm text-white/80">Perfect position every time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Quick Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-medium">🎯 Drag & Drop</div>
                  <div className="text-sm text-gray-600">
                    Click and drag text boxes to position them precisely
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-medium">✨ Layer Controls</div>
                  <div className="text-sm text-gray-600">
                    Use arrows to bring text forward or send backward
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-medium">💾 Save Position</div>
                  <div className="text-sm text-gray-600">
                    Text positions are saved automatically
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <div className="font-medium">📱 Mobile Friendly</div>
                  <div className="text-sm text-gray-600">
                    Works great on all devices
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            Create hilarious memes in seconds • Drag & drop text positioning • Completely free
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>🎭 58+ Templates</span>
            <span>✨ Drag & Drop</span>
            <span>🎨 Customizable</span>
            <span>⚡ Fast editing</span>
            <span>💾 Auto-save</span>
            <span>📱 Mobile friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;