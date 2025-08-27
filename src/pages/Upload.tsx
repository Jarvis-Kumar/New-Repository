import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload as UploadIcon,
  Image,
  File,
  Tag,
  DollarSign,
  Eye,
  Save,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    price: 0,
    isPremium: false,
    format: 'figma',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const categories = [
    'UI Kits',
    'Landing Pages',
    'Social Media',
    'Mobile',
    'Code',
    'Websites',
    'Print',
    'Presentations',
    'Icons',
  ];

  const formats = [
    { value: 'figma', label: 'Figma', icon: '🎨' },
    { value: 'sketch', label: 'Sketch', icon: '💎' },
    { value: 'psd', label: 'Photoshop', icon: '🖼️' },
    { value: 'html', label: 'HTML/CSS', icon: '🌐' },
    { value: 'react', label: 'React', icon: '⚛️' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);

    // Create preview URLs for images
    fileList.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImages((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || files.length === 0) {
      toast.error('Please fill in all required fields and upload at least one file');
      return;
    }

    // Simulate upload process
    toast.loading('Uploading preset...', { id: 'upload' });
    
    setTimeout(() => {
      toast.success('Preset uploaded successfully!', { id: 'upload' });
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        tags: '',
        price: 0,
        isPremium: false,
        format: 'figma',
      });
      setFiles([]);
      setPreviewImages([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Upload Preset</h1>
          <p className="text-gray-400 text-lg">
            Share your design presets with the community and start earning
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* File Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Upload Files</h3>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Drop your files here or click to browse
              </p>
              <p className="text-gray-400 text-sm">
                Supports .fig, .sketch, .psd, .zip, .html and more
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Choose Files
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Images */}
          {previewImages.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Preview Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Basic Information</h3>
            
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
                  placeholder="ui, modern, dashboard, components"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                >
                  {formats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.icon} {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Visibility & Pricing</h3>
            
            <div className="flex items-center space-x-4 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  // checked={!formData.isPublic}
                  // onChange={() => setFormData({ ...formData, isPublic: false })}
                  className="mr-2"
                />
                <span className="text-white">Private</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  // checked={formData.isPublic}
                  // onChange={() => setFormData({ ...formData, isPublic: true })}
                  className="mr-2"
                />
                <span className="text-white">Public</span>
              </label>
            </div>

            {/* Pricing fields */}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" size="lg">
              <Save className="w-5 h-5 mr-2" />
              Upload Preset
            </Button>
            <Button type="button" variant="secondary" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Upload;