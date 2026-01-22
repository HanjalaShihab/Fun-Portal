// src/components/MemeGenerator/MemeGenerator.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { 
  FaDownload, FaUpload, FaFont, FaPalette, 
  FaUndo, FaRandom, FaSave 
} from 'react-icons/fa';

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [texts, setTexts] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState('Impact');
  const memeRef = useRef(null);

  const templates = [
    { id: 1, url: 'https://api.memegen.link/images/ds/hello/world.png', name: 'Hello World' },
    { id: 2, url: 'https://api.memegen.link/images/both/left_text/right_text.png', name: 'Two Panels' },
    { id: 3, url: 'https://api.memegen.link/images/fry/not_sure_if/meme_or_template.png', name: 'Futurama Fry' },
  ];

  const addText = () => {
    const newText = {
      id: Date.now(),
      text: 'Your Text Here',
      x: 50,
      y: 50,
      width: 200,
      isDragging: false,
    };
    setTexts([...texts, newText]);
  };

  const updateText = (id, field, value) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, [field]: value } : text
    ));
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const handleDownload = async () => {
    if (!memeRef.current) return;
    
    try {
      toast.loading('Creating your meme...');
      const canvas = await html2canvas(memeRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'my-meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.dismiss();
      toast.success('Meme downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download meme');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setSelectedTemplate(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎭 Meme Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Drag text, upload images, and create hilarious memes!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                <FaPalette className="inline mr-2" />
                Text Controls
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2 rounded-lg border dark:bg-gray-700"
                  >
                    <option value="Impact">Impact</option>
                    <option value="Arial">Arial</option>
                    <option value="Comic Sans MS">Comic Sans</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                <button
                  onClick={addText}
                  className="w-full bg-gradient-to-r from-portal-blue to-portal-purple text-white p-3 rounded-lg font-bold hover:opacity-90 transition-all"
                >
                  <FaFont className="inline mr-2" />
                  Add Text Box
                </button>
              </div>
            </motion.div>

            {/* Templates */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                <FaRandom className="inline mr-2" />
                Templates
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedTemplate?.id === template.id 
                        ? 'border-portal-blue' 
                        : 'border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setUploadedImage(null);
                    }}
                  >
                    <img
                      src={template.url}
                      alt={template.name}
                      className="w-full h-24 object-cover hover:scale-105 transition-transform"
                    />
                    <p className="text-center text-sm p-2">{template.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upload Section */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                <FaUpload className="inline mr-2" />
                Upload Your Image
              </h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <FaUpload className="text-4xl mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Click to upload image
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Center Panel - Preview */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Preview
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90"
                  >
                    <FaDownload />
                    Download Meme
                  </button>
                </div>
              </div>

              {/* Meme Preview */}
              <div 
                ref={memeRef}
                className="relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center"
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="max-w-full max-h-[500px] object-contain"
                  />
                ) : selectedTemplate ? (
                  <img
                    src={selectedTemplate.url}
                    alt="Template"
                    className="max-w-full max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-2xl mb-2">📷</p>
                    <p>Select a template or upload an image</p>
                  </div>
                )}

                {/* Text Overlays */}
                <AnimatePresence>
                  {texts.map((text) => (
                    <motion.div
                      key={text.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute cursor-move"
                      style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        maxWidth: `${text.width}px`,
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', text.id);
                        updateText(text.id, 'isDragging', true);
                      }}
                      onDragEnd={(e) => {
                        const rect = e.currentTarget.parentElement.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        updateText(text.id, 'x', x);
                        updateText(text.id, 'y', y);
                        updateText(text.id, 'isDragging', false);
                      }}
                    >
                      <div className="relative group">
                        <textarea
                          value={text.text}
                          onChange={(e) => updateText(text.id, 'text', e.target.value)}
                          style={{
                            color: textColor,
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            background: 'transparent',
                            border: 'none',
                            textShadow: '2px 2px 0 #000, -2px -2px 0 #000',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            resize: 'none',
                            overflow: 'hidden',
                          }}
                          className="outline-none bg-transparent text-center w-full"
                          rows="2"
                        />
                        <button
                          onClick={() => removeText(text.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Text Items List */}
              {texts.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold mb-3">Text Items</h4>
                  <div className="space-y-2">
                    {texts.map((text) => (
                      <div
                        key={text.id}
                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                      >
                        <span className="truncate">{text.text}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeText(text.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;