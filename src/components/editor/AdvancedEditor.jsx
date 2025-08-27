  import React, { useState, useRef, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import {
    Upload,
    Download,
    RotateCcw,
    Save,
    Eye,
    EyeOff,
    Sliders,
    Image as ImageIcon,
    Wand2,
    Palette,
    Type,
    Crop,
    Filter,
    Layers,
    Settings
  } from 'lucide-react';
  import toast from 'react-hot-toast';
  import html2canvas from 'html2canvas';
  import { saveAs } from 'file-saver';
  import aiService from '../../services/aiService';
  import storageService from '../../services/storageService';

  const AdvancedEditor = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [editedImage, setEditedImage] = useState(null);
    const [showBefore, setShowBefore] = useState(true);
    const [activeTab, setActiveTab] = useState('filters');
    const [isProcessing, setIsProcessing] = useState(false);
    const [editHistory, setEditHistory] = useState([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

    const [filters, setFilters] = useState({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
      sepia: 0,
      invert: 0,
      opacity: 100
    });

    const [adjustments, setAdjustments] = useState({
      exposure: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      clarity: 0,
      vibrance: 0,
      temperature: 0,
      tint: 0
    });

    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const fileInputRef = useRef(null);

    const tabs = [
      { id: 'filters', label: 'Filters', icon: Filter },
      { id: 'adjustments', label: 'Adjustments', icon: Sliders },
      { id: 'ai', label: 'AI Tools', icon: Wand2 },
      { id: 'crop', label: 'Crop & Resize', icon: Crop },
      { id: 'text', label: 'Text & Graphics', icon: Type },
      { id: 'layers', label: 'Layers', icon: Layers }
    ];

    const filterControls = [
      { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
      { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
      { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
      { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
      { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px' },
      { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg' },
      { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
      { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
      { key: 'opacity', label: 'Opacity', min: 0, max: 100, unit: '%' }
    ];

    const adjustmentControls = [
      { key: 'exposure', label: 'Exposure', min: -100, max: 100, unit: '' },
      { key: 'highlights', label: 'Highlights', min: -100, max: 100, unit: '' },
      { key: 'shadows', label: 'Shadows', min: -100, max: 100, unit: '' },
      { key: 'whites', label: 'Whites', min: -100, max: 100, unit: '' },
      { key: 'blacks', label: 'Blacks', min: -100, max: 100, unit: '' },
      { key: 'clarity', label: 'Clarity', min: -100, max: 100, unit: '' },
      { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, unit: '' },
      { key: 'temperature', label: 'Temperature', min: -100, max: 100, unit: '' },
      { key: 'tint', label: 'Tint', min: -100, max: 100, unit: '' }
    ];

    const presetStyles = [
      {
        name: 'Vintage',
        filters: { brightness: 110, contrast: 120, saturate: 80, sepia: 30, hueRotate: 15 }
      },
      {
        name: 'Black & White',
        filters: { brightness: 105, contrast: 110, saturate: 0, grayscale: 100 }
      },
      {
        name: 'Vibrant',
        filters: { brightness: 115, contrast: 125, saturate: 150, vibrance: 20 }
      },
      {
        name: 'Soft Focus',
        filters: { brightness: 110, contrast: 95, saturate: 110, blur: 2, sepia: 10 }
      },
      {
        name: 'Cool Tone',
        filters: { brightness: 105, contrast: 110, saturate: 120, temperature: -20, tint: 10 }
      },
      {
        name: 'Warm Tone',
        filters: { brightness: 110, contrast: 105, saturate: 115, temperature: 20, tint: -5 }
      }
    ];

    // Generate filter string for CSS
    const generateFilterString = () => {
      return `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturate}%) 
        grayscale(${filters.grayscale}%) 
        blur(${filters.blur}px)
        hue-rotate(${filters.hueRotate}deg)
        sepia(${filters.sepia}%)
        invert(${filters.invert}%)
        opacity(${filters.opacity}%)
      `.trim();
    };

    // Handle image upload
    const handleImageUpload = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result;
        setOriginalImage(imageUrl);
        setEditedImage(imageUrl);
        saveToHistory('Image uploaded');
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    };

    // Save current state to history
    const saveToHistory = (action) => {
      const newState = {
        filters: { ...filters },
        adjustments: { ...adjustments },
        action,
        timestamp: Date.now()
      };
      
      const newHistory = editHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(newState);
      setEditHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    };

    // Undo/Redo functionality
    const undo = () => {
      if (currentHistoryIndex > 0) {
        const prevState = editHistory[currentHistoryIndex - 1];
        setFilters(prevState.filters);
        setAdjustments(prevState.adjustments);
        setCurrentHistoryIndex(currentHistoryIndex - 1);
        toast.success('Undone');
      }
    };

    const redo = () => {
      if (currentHistoryIndex < editHistory.length - 1) {
        const nextState = editHistory[currentHistoryIndex + 1];
        setFilters(nextState.filters);
        setAdjustments(nextState.adjustments);
        setCurrentHistoryIndex(currentHistoryIndex + 1);
        toast.success('Redone');
      }
    };

    // Apply preset style
    const applyPreset = (preset) => {
      setFilters(prev => ({ ...prev, ...preset.filters }));
      saveToHistory(`Applied ${preset.name} preset`);
      toast.success(`${preset.name} preset applied!`);
    };

    // AI-powered editing
    const handleAIEdit = async (instruction) => {
      if (!originalImage) {
        toast.error('Please upload an image first');
        return;
      }

      setIsProcessing(true);
      try {
        // Convert image to blob for AI processing
        const response = await fetch(originalImage);
        const blob = await response.blob();
        
        const editedBlob = await aiService.editImageWithClipDrop(blob, instruction);
        const editedUrl = URL.createObjectURL(editedBlob);
        
        setEditedImage(editedUrl);
        saveToHistory(`AI Edit: ${instruction}`);
        toast.success('AI editing completed!');
      } catch (error) {
        console.error('AI editing error:', error);
        toast.error('AI editing failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    // Download edited image
    const downloadImage = async () => {
      if (!originalImage) {
        toast.error('Please upload an image first');
        return;
      }

      try {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Apply filters to canvas context
        ctx.filter = generateFilterString();
        
        // Draw the image with filters applied
        ctx.drawImage(img, 0, 0);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) return;
          saveAs(blob, `edited-design-${Date.now()}.png`);
          toast.success('Image downloaded successfully!');
        }, 'image/png');
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Download failed. Please try again.');
      }
    };

    // Auto-save functionality
    useEffect(() => {
      const autoSave = () => {
        if (originalImage) {
          const editorState = {
            filters,
            adjustments,
            originalImage,
            timestamp: Date.now()
          };
          localStorage.setItem('editorAutoSave', JSON.stringify(editorState));
        }
      };

      const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
      return () => clearInterval(interval);
    }, [filters, adjustments, originalImage]);

    // Load auto-saved state on component mount
    useEffect(() => {
      const savedState = localStorage.getItem('editorAutoSave');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setFilters(parsed.filters || filters);
          setAdjustments(parsed.adjustments || adjustments);
          setOriginalImage(parsed.originalImage);
          setEditedImage(parsed.originalImage);
          toast.success('Previous session restored!');
        } catch (error) {
          console.error('Failed to restore session:', error);
        }
      }
    }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar Controls */}
      <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white mb-2">Advanced Editor</h2>
          <p className="text-gray-400 text-sm">Professional image editing tools</p>
        </div>

        {/* Upload Section */}
        <div className="p-6 border-b border-gray-700">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-gray-700">
            <nav className="flex flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600/20 text-primary-400 border-r-2 border-primary-500'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'filters' && (
              <div className="space-y-6">
                {/* Quick Presets */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Presets</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {presetStyles.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Controls */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                  <div className="space-y-4">
                    {filterControls.map((control) => (
                      <div key={control.key}>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-300">
                            {control.label}
                          </label>
                          <span className="text-xs text-gray-400">
                            {filters[control.key]}{control.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={control.min}
                          max={control.max}
                          value={filters[control.key]}
                          onChange={(e) => {
                            const newFilters = {
                              ...filters,
                              [control.key]: parseFloat(e.target.value)
                            };
                            setFilters(newFilters);
                          }}
                          onMouseUp={() => saveToHistory(`Adjusted ${control.label}`)}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adjustments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Adjustments</h3>
                <div className="space-y-4">
                  {adjustmentControls.map((control) => (
                    <div key={control.key}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-300">
                          {control.label}
                        </label>
                        <span className="text-xs text-gray-400">
                          {adjustments[control.key]}{control.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        value={adjustments[control.key]}
                        onChange={(e) => {
                          const newAdjustments = {
                            ...adjustments,
                            [control.key]: parseFloat(e.target.value)
                          };
                          setAdjustments(newAdjustments);
                        }}
                        onMouseUp={() => saveToHistory(`Adjusted ${control.label}`)}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">AI Tools</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleAIEdit('enhance the image quality and colors')}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {isProcessing ? 'Processing...' : 'Auto Enhance'}
                  </button>
                  
                  <button
                    onClick={() => handleAIEdit('remove background')}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Remove Background
                  </button>
                  
                  <button
                    onClick={() => handleAIEdit('make it look professional and clean')}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Professional Look
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom AI Instruction
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Describe what you want to change..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleAIEdit(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value.trim()) {
                          handleAIEdit(input.value);
                          input.value = '';
                        }
                      }}
                      disabled={isProcessing}
                      className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Wand2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content would go here */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-700 space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={undo}
              disabled={currentHistoryIndex <= 0}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={currentHistoryIndex >= editHistory.length - 1}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Redo
            </button>
          </div>
          
          <button
            onClick={downloadImage}
            disabled={!originalImage}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Edited Image</span>
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-white">
                {originalImage ? 'Editing Image' : 'No Image Loaded'}
              </h3>
              {editHistory.length > 0 && (
                <span className="text-sm text-gray-400">
                  {editHistory.length} edit{editHistory.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {originalImage && (
              <button
                onClick={() => setShowBefore(!showBefore)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {showBefore ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showBefore ? 'Hide' : 'Show'} Before</span>
              </button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-800 p-8 overflow-auto">
          {originalImage ? (
            <div className={`max-w-6xl mx-auto grid gap-6 ${showBefore ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {showBefore && (
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Before</h4>
                  <div className="relative">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      Original
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-lg font-medium text-white mb-3">
                  {showBefore ? 'After' : 'Edited'}
                </h4>
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={editedImage || originalImage}
                    alt="Edited"
                    style={{ filter: generateFilterString() }}
                    className="w-full h-auto rounded-lg shadow-lg transition-all duration-300"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-lg text-sm">
                    Edited
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Image Loaded</h3>
              <p className="text-gray-400 mb-6">
                Upload an image to start editing with professional tools
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Upload Your First Image
              </button>
            </div>
          )}
        </div>

        {/* Hidden Canvas for Download */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default AdvancedEditor;