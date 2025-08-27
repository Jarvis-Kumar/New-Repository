import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Palette,
  Type,
  Layout,
  Download,
  Save,
  Undo,
  Redo,
  Eye,
  Settings,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { mockPresets } from '../data/mockData';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext'; // Import Auth

const Editor = () => {
  const { id } = useParams();
  const preset = mockPresets.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState('colors');
  const [isGenerating, setIsGenerating] = useState(false);

  const { session } = useAuth(); // Get auth session
  const navigate = useNavigate(); // For redirection

  if (!preset) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Preset not found</h1>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'ai', label: 'AI Assistant', icon: Wand2 },
  ];

  const colorPalettes = [
    { name: 'Primary', colors: ['#6366f1', '#8b5cf6', '#06b6d4'] },
    { name: 'Warm', colors: ['#f59e0b', '#ef4444', '#ec4899'] },
    { name: 'Cool', colors: ['#10b981', '#3b82f6', '#8b5cf6'] },
    { name: 'Monochrome', colors: ['#374151', '#6b7280', '#9ca3af'] },
  ];

  const fonts = [
    { name: 'Inter', category: 'Sans Serif' },
    { name: 'Roboto', category: 'Sans Serif' },
    { name: 'Playfair Display', category: 'Serif' },
    { name: 'Montserrat', category: 'Sans Serif' },
  ];

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('AI customization applied!');
    }, 3000);
  };

  const handleDownload = () => {
    if (!session) {
      toast.error('Please sign up or login to download');
      navigate('/signup');
    } else {
      toast.success('Download started!');
      // TODO: Add your download logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white mb-2">Customize Preset</h2>
          <p className="text-gray-400 text-sm">{preset.title}</p>
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
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Color Palettes</h3>
                  <div className="space-y-3">
                    {colorPalettes.map((palette) => (
                      <div
                        key={palette.name}
                        className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{palette.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          {palette.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-lg border border-gray-600"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Custom Colors</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['Primary', 'Secondary', 'Accent'].map((colorType) => (
                      <div key={colorType}>
                        <label className="block text-sm text-gray-400 mb-2">{colorType}</label>
                        <input
                          type="color"
                          className="w-full h-10 rounded-lg border border-gray-600 bg-gray-700"
                          defaultValue="#6366f1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Font Family</h3>
                  <div className="space-y-2">
                    {fonts.map((font) => (
                      <div
                        key={font.name}
                        className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium" style={{ fontFamily: font.name }}>
                              {font.name}
                            </div>
                            <div className="text-gray-400 text-sm">{font.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Font Sizes</h3>
                  <div className="space-y-3">
                    {['Heading', 'Body', 'Caption'].map((textType) => (
                      <div key={textType}>
                        <label className="block text-sm text-gray-400 mb-2">{textType}</label>
                        <input
                          type="range"
                          min="12"
                          max="48"
                          className="w-full"
                          defaultValue={textType === 'Heading' ? '32' : textType === 'Body' ? '16' : '14'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Spacing</h3>
                  <div className="space-y-3">
                    {['Padding', 'Margin', 'Gap'].map((spacingType) => (
                      <div key={spacingType}>
                        <label className="block text-sm text-gray-400 mb-2">{spacingType}</label>
                        <input
                          type="range"
                          min="0"
                          max="64"
                          className="w-full"
                          defaultValue="16"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Border Radius</h3>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    className="w-full"
                    defaultValue="8"
                  />
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">AI Customization</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Describe your brand or the style you want, and our AI will customize the preset for you.
                  </p>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="e.g., Modern tech startup with blue and green colors, clean and minimal design..."
                  />
                  <button
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="w-full mt-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Styles</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Modern', 'Classic', 'Bold', 'Minimal'].map((style) => (
                      <button
                        key={style}
                        className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700 space-y-3">
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download Customized</span>
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Undo className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Redo className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-600" />
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Zoom:</span>
              <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm">
                <option>100%</option>
                <option>75%</option>
                <option>50%</option>
                <option>25%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-800 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <img
                src={preset.preview}
                alt={preset.title}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;