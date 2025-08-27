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
  FileText,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  blur: number;
  hueRotate: number;
  sepia: number;
  invert: number;
}

const DesignEditor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    blur: 0,
    hueRotate: 0,
    sepia: 0,
    invert: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetInputRef = useRef<HTMLInputElement>(null);

  const filterControls = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
    { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
    { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
    { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px' },
    { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg' },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
    { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
  ];

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
    `.trim();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handlePresetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a valid JSON preset file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const filterData = json.filter || json;

        const newFilters: FilterSettings = {
          brightness: parseFloat(filterData.brightness) || 100,
          contrast: parseFloat(filterData.contrast) || 100,
          saturate: parseFloat(filterData.saturate) || 100,
          grayscale: parseFloat(filterData.grayscale) || 0,
          blur: parseFloat(filterData.blur) || 0,
          hueRotate: parseFloat(filterData.hueRotate) || 0,
          sepia: parseFloat(filterData.sepia) || 0,
          invert: parseFloat(filterData.invert) || 0,
        };

        setFilters(newFilters);
        toast.success('🎉 Preset applied successfully!');
      } catch (error) {
        toast.error('Invalid JSON format. Please check your preset file.');
        console.error('Preset parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
      sepia: 0,
      invert: 0,
    });
    toast.success('Filters reset to default');
  };

  const downloadImage = () => {
    if (!originalImage) {
      toast.error('Please upload an image first');
      return;
    }

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

    // Create download link
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `edited-design-${Date.now()}.png`;
      link.href = url;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    }, 'image/png');
  };

  const savePreset = () => {
    const preset = {
      name: `Custom Preset ${Date.now()}`,
      filter: {
        brightness: filters.brightness,
        contrast: filters.contrast,
        saturate: filters.saturate,
        grayscale: filters.grayscale,
        blur: filters.blur,
        hueRotate: filters.hueRotate,
        sepia: filters.sepia,
        invert: filters.invert,
      },
      createdAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.download = `preset-${Date.now()}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Preset saved successfully!');
  };

  const quickPresets = [
    {
      name: 'Vintage',
      filters: { brightness: 110, contrast: 120, saturate: 80, grayscale: 0, blur: 0, hueRotate: 15, sepia: 30, invert: 0 }
    },
    {
      name: 'Black & White',
      filters: { brightness: 105, contrast: 110, saturate: 0, grayscale: 100, blur: 0, hueRotate: 0, sepia: 0, invert: 0 }
    },
    {
      name: 'Vibrant',
      filters: { brightness: 115, contrast: 125, saturate: 150, grayscale: 0, blur: 0, hueRotate: 0, sepia: 0, invert: 0 }
    },
    {
      name: 'Soft Focus',
      filters: { brightness: 110, contrast: 95, saturate: 110, grayscale: 0, blur: 2, hueRotate: 0, sepia: 10, invert: 0 }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Design Editor</h1>
          <p className="text-gray-400 text-lg">
            Upload images, apply filters, and download your edited designs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Upload Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Upload Image</span>
              </h3>
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
                <span>Choose Image</span>
              </button>
            </div>

            {/* Preset Upload */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Load Preset</span>
              </h3>
              <input
                ref={presetInputRef}
                type="file"
                accept=".json"
                onChange={handlePresetUpload}
                className="hidden"
              />
              <button
                onClick={() => presetInputRef.current?.click()}
                className="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mb-3"
              >
                <Upload className="w-5 h-5" />
                <span>Load JSON</span>
              </button>
              <button
                onClick={savePreset}
                className="w-full bg-accent-600 hover:bg-accent-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Preset</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Quick Presets</span>
              </h3>
              <div className="space-y-2">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setFilters(preset.filters)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Sliders className="w-5 h-5" />
                <span>Filters</span>
              </h3>
              <div className="space-y-4">
                {filterControls.map((control) => (
                  <div key={control.key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        {control.label}
                      </label>
                      <span className="text-xs text-gray-400">
                        {filters[control.key as keyof FilterSettings]}{control.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      value={filters[control.key as keyof FilterSettings]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [control.key]: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={resetFilters}
                className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Download Section */}
            {originalImage && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <button
                  onClick={downloadImage}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Design</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Preview Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              {originalImage ? (
                <div>
                  {/* Before/After Toggle */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Preview</h3>
                    <button
                      onClick={() => setShowBefore(!showBefore)}
                      className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {showBefore ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{showBefore ? 'Hide' : 'Show'} Before</span>
                    </button>
                  </div>

                  {/* Image Preview */}
                  <div className={`grid gap-6 ${showBefore ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
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
                          src={originalImage}
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

                  {/* Filter Info */}
                  <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Applied Filters:</h5>
                    <code className="text-xs text-gray-400 break-all">
                      {generateFilterString()}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Image Uploaded</h3>
                  <p className="text-gray-400 mb-6">
                    Upload an image to start editing with filters and presets
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
          </motion.div>
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

export default DesignEditor;