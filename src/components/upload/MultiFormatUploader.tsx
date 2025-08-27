import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  File,
  Image,
  Video,
  FileText,
  Archive,
  X,
  Check,
  AlertCircle,
  Eye,
  Save,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import storageService from '../../services/storageService';
import aiService from '../../services/aiService';
import { useAuth } from '../../contexts/AuthContext';

const MultiFormatUploader: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [previewImages, setPreviewImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    price: 0,
    isPremium: false,
    platforms: [] as string[],
    targetAudience: '',
    license: 'commercial'
  });

  const { session } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Image Presets',
    'Video Templates',
    'Document Layouts',
    'Social Media',
    'Web Design',
    'Print Design',
    'Mobile UI',
    'Presentations',
    'Logos & Branding',
    'Photography',
    'Illustrations',
    'Icons'
  ];

  const platforms = [
    { id: 'web', name: 'Web', icon: Globe },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'tablet', name: 'Tablet', icon: Tablet },
    { id: 'instagram', name: 'Instagram', icon: Image },
    { id: 'facebook', name: 'Facebook', icon: Image },
    { id: 'twitter', name: 'Twitter', icon: Image },
    { id: 'linkedin', name: 'LinkedIn', icon: Image },
    { id: 'youtube', name: 'YouTube', icon: Video },
    { id: 'tiktok', name: 'TikTok', icon: Video }
  ];

  const supportedFormats = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'],
    video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    document: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'],
    design: ['.psd', '.ai', '.sketch', '.fig', '.xd'],
    code: ['.html', '.css', '.js', '.json', '.xml'],
    archive: ['.zip', '.rar', '.7z', '.tar', '.gz']
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.toLowerCase().split('.').pop();
    if (!extension) return File;
    
    if (supportedFormats.image.some(ext => ext.includes(extension))) return Image;
    if (supportedFormats.video.some(ext => ext.includes(extension))) return Video;
    if (supportedFormats.document.some(ext => ext.includes(extension))) return FileText;
    if (supportedFormats.archive.some(ext => ext.includes(extension))) return Archive;
    
    return File;
  };

  const getFileCategory = (file: File) => {
    const extension = file.name.toLowerCase().split('.').pop();
    if (!extension) return 'other';

    if (supportedFormats.image.some(ext => ext.includes(extension))) return 'image';
    if (supportedFormats.video.some(ext => ext.includes(extension))) return 'video';
    if (supportedFormats.document.some(ext => ext.includes(extension))) return 'document';
    if (supportedFormats.design.some(ext => ext.includes(extension))) return 'design';
    if (supportedFormats.code.some(ext => ext.includes(extension))) return 'code';
    if (supportedFormats.archive.some(ext => ext.includes(extension))) return 'archive';
    
    return 'other';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      category: getFileCategory(file),
      uploaded: false,
      url: null
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Create preview URLs for images
    acceptedFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages(prev => [...prev, {
            id: newFiles.find(f => f.file === file)?.id,
            url: e.target?.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });

    toast.success(`${acceptedFiles.length} file(s) added successfully!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': supportedFormats.image,
      'video/*': supportedFormats.video,
      'application/*': [...supportedFormats.document, ...supportedFormats.archive],
      'text/*': supportedFormats.code
    }
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setPreviewImages(prev => prev.filter(p => p.id !== fileId));
  };

  const handleUpload = async () => {
    if (!session) {
      toast.error('You must be logged in to upload a preset.');
      navigate('/login');
      return;
    }

    if (files.length === 0) {
      toast.error('Please add at least one file');
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (fileItem) => {
        const fileName = `${Date.now()}-${fileItem.file.name}`;
        const url = await storageService.uploadToR2(fileItem.file, fileName);
        return { ...fileItem, url, uploaded: true };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(uploadedFiles);

      // Generate AI description if not provided
      let enhancedDescription = formData.description;
      if (formData.description.length < 50) {
        try {
          enhancedDescription = await aiService.generateContent(
            `Enhance this design preset description: "${formData.description}". Make it more detailed and appealing for potential buyers. Focus on the benefits and use cases.`
          );
        } catch (error) {
          console.warn('AI description enhancement failed:', error);
        }
      }

      // Create preset entry in database (mock)
      const presetData = {
        ...formData,
        description: enhancedDescription,
        files: uploadedFiles.map(f => ({
          name: f.file.name,
          url: f.url,
          size: f.file.size,
          type: f.file.type,
          category: f.category
        })),
        createdAt: new Date().toISOString(),
        status: 'published'
      };

      console.log('Preset data to save:', presetData);

      toast.success('🎉 Preset uploaded successfully and is now live in the marketplace!');
      
      // Reset form
      setFiles([]);
      setPreviewImages([]);
      setFormData({
        title: '',
        description: '',
        category: '',
        tags: '',
        price: 0,
        isPremium: false,
        platforms: [],
        targetAudience: '',
        license: 'commercial'
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!session) {
      toast.error('You must be logged in to generate versions.');
      navigate('/login');
      return;
    }

    if (!formData.platforms.length) {
      toast.error('Please select target platforms first');
      return;
    }

    toast.loading('Generating cross-platform versions...', { id: 'cross-platform' });

    try {
      // Mock cross-platform generation
      const selectedPlatforms = formData.platforms;
      const generatedVersions = [];

      for (const platformId of selectedPlatforms) {
        const platformData = platforms.find(p => p.id === platformId);
        if (platformData) {
          generatedVersions.push({
            platform: platformData.name,
            dimensions: getPlatformDimensions(platformId),
            optimizations: getPlatformOptimizations(platformId)
          });
        }
      }

      console.log('Generated versions:', generatedVersions);
      toast.success(`Generated ${generatedVersions.length} platform versions!`, { id: 'cross-platform' });

    } catch (error) {
      console.error('Cross-platform generation error:', error);
      toast.error('Failed to generate cross-platform versions', { id: 'cross-platform' });
    }
  };

  const getPlatformDimensions = (platform: any) => {
    const dimensions: { [key: string]: { width: number; height: number } } = {
      instagram: { width: 1080, height: 1080 },
      facebook: { width: 1200, height: 630 },
      twitter: { width: 1024, height: 512 },
      linkedin: { width: 1200, height: 627 },
      youtube: { width: 1280, height: 720 },
      web: { width: 1920, height: 1080 },
      mobile: { width: 375, height: 812 },
      desktop: { width: 1440, height: 900 },
      tablet: { width: 768, height: 1024 }
    };
    return dimensions[platform] || { width: 1200, height: 800 };
  };

  const getPlatformOptimizations = (platform: any) => {
    const optimizations: { [key: string]: string[] } = {
      instagram: ['square-format', 'high-contrast', 'mobile-friendly'],
      facebook: ['landscape-format', 'readable-text', 'engaging-visuals'],
      twitter: ['landscape-format', 'concise-text', 'high-contrast'],
      linkedin: ['professional-tone', 'business-appropriate', 'readable-text'],
      youtube: ['thumbnail-optimized', 'high-contrast', 'clear-branding'],
      web: ['responsive-design', 'fast-loading', 'seo-optimized'],
      mobile: ['touch-friendly', 'readable-text', 'fast-loading'],
      desktop: ['high-resolution', 'detailed-graphics', 'wide-layout'],
      tablet: ['touch-friendly', 'medium-resolution', 'balanced-layout']
    };
    return optimizations[platform] || ['general-optimization'];
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Upload Design Preset</h1>
          <p className="text-gray-400 text-lg">
            Share your design presets with the community and start earning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Upload Files</h3>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  {isDragActive ? 'Drop files here...' : 'Drop files here or click to browse'}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Supports images, videos, documents, design files, and archives
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                  {Object.values(supportedFormats).flat().map((format, index) => (
                    <span key={index} className="bg-gray-700 px-2 py-1 rounded">
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-lg font-medium text-white">Uploaded Files ({files.length})</h4>
                  {files.map((fileItem) => {
                    const IconComponent = getFileIcon(fileItem.file);
                    const preview = previewImages.find(p => p.id === fileItem.id);
                    
                    return (
                      <div
                        key={fileItem.id}
                        className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          {preview ? (
                            <img
                              src={preview.url}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <IconComponent className="w-8 h-8 text-gray-400" />
                          )}
                          <div>
                            <p className="text-white font-medium">{fileItem.file.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{(fileItem.file.size / 1024 / 1024).toFixed(2)} MB</span>
                              <span>•</span>
                              <span className="capitalize">{fileItem.category}</span>
                              {fileItem.uploaded && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center space-x-1 text-green-400">
                                    <Check className="w-4 h-4" />
                                    <span>Uploaded</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Preset Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter preset title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Describe your preset, its features, and what makes it special"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="modern, business, social media, template"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="designers, marketers, businesses"
                  />
                </div>
              </div>
            </motion.div>

            {/* Platform Targeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Platform Targeting</h3>
                <button
                  onClick={handleGenerate}
                  disabled={!formData.platforms.length}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Generate Versions
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon;
                  const isSelected = formData.platforms.includes(platform.id);
                  
                  return (
                    <button
                      key={platform.id}
                      onClick={() => {
                        const newPlatforms = isSelected
                          ? formData.platforms.filter(p => p !== platform.id)
                          : [...formData.platforms, platform.id];
                        setFormData({ ...formData, platforms: newPlatforms });
                      }}
                      className={`p-3 border rounded-lg transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={!formData.isPremium}
                      onChange={() => setFormData({ ...formData, isPremium: false, price: 0 })}
                      className="mr-2"
                    />
                    <span className="text-white">Free</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={formData.isPremium}
                      onChange={() => setFormData({ ...formData, isPremium: true })}
                      className="mr-2"
                    />
                    <span className="text-white">Premium</span>
                  </label>
                </div>

                {formData.isPremium && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* License */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">License</h3>
              
              <select
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              >
                <option value="commercial">Commercial Use</option>
                <option value="personal">Personal Use Only</option>
                <option value="attribution">Attribution Required</option>
                <option value="editorial">Editorial Use Only</option>
              </select>
            </motion.div>

            {/* Upload Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Publish Preset</span>
                  </>
                )}
              </button>

              {files.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Your preset will be instantly visible in the marketplace</span>
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

export default MultiFormatUploader;