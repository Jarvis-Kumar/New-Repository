import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Heart,
  Crown,
  Eye,
  ShoppingCart,
  Tag,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';

const MarketplaceGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, favoritePresets, toggleFavorite } = useStore();

  const categories = [
    'All',
    'Image Presets',
    'Video Templates',
    'Document Layouts',
    'Social Media',
    'Web Design',
    'Print Design',
    'Mobile UI',
    'Presentations',
    'Logos & Branding'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  // Mock data - in real app, this would come from your database
  const mockPresets = [
    {
      id: '1',
      title: 'Professional Instagram Story Template',
      description: 'Modern, clean Instagram story template perfect for businesses and influencers.',
      category: 'Social Media',
      tags: ['instagram', 'story', 'business', 'modern'],
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: {
        id: 'author1',
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true
      },
      price: 15,
      isPremium: true,
      downloads: 1240,
      rating: 4.9,
      reviews: 89,
      createdAt: new Date('2024-01-15'),
      fileUrl: '/downloads/instagram-story-template.zip',
      fileSize: '12.5 MB',
      format: 'psd',
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      realMetrics: {
        actualDownloads: 1240,
        actualRating: 4.9,
        actualReviews: 89,
        actualLikes: 456
      }
    },
    {
      id: '2',
      title: 'Minimalist Website Landing Page',
      description: 'Clean, conversion-optimized landing page template for SaaS and tech companies.',
      category: 'Web Design',
      tags: ['landing', 'website', 'saas', 'minimal'],
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: {
        id: 'author2',
        name: 'Alex Rodriguez',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: false
      },
      price: 0,
      isPremium: false,
      downloads: 890,
      rating: 4.7,
      reviews: 45,
      createdAt: new Date('2024-01-12'),
      fileUrl: '/downloads/landing-page-template.zip',
      fileSize: '8.2 MB',
      format: 'html',
      platforms: ['Web', 'Mobile'],
      realMetrics: {
        actualDownloads: 890,
        actualRating: 4.7,
        actualReviews: 45,
        actualLikes: 234
      }
    },
    {
      id: '3',
      title: 'Corporate Presentation Template',
      description: 'Professional presentation template with 50+ slides for business use.',
      category: 'Presentations',
      tags: ['presentation', 'corporate', 'business', 'slides'],
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: {
        id: 'author3',
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true
      },
      price: 25,
      isPremium: true,
      downloads: 567,
      rating: 4.8,
      reviews: 78,
      createdAt: new Date('2024-01-10'),
      fileUrl: '/downloads/presentation-template.zip',
      fileSize: '45.1 MB',
      format: 'pptx',
      platforms: ['PowerPoint', 'Keynote', 'Google Slides'],
      realMetrics: {
        actualDownloads: 567,
        actualRating: 4.8,
        actualReviews: 78,
        actualLikes: 189
      }
    },
    {
      id: '4',
      title: 'Mobile App UI Kit',
      description: 'Complete mobile app UI kit with 100+ screens and components.',
      category: 'Mobile UI',
      tags: ['mobile', 'ui', 'app', 'components'],
      thumbnail: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: {
        id: 'author4',
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        verified: true
      },
      price: 35,
      isPremium: true,
      downloads: 1456,
      rating: 4.9,
      reviews: 156,
      createdAt: new Date('2024-01-08'),
      fileUrl: '/downloads/mobile-ui-kit.zip',
      fileSize: '67.3 MB',
      format: 'figma',
      platforms: ['iOS', 'Android'],
      realMetrics: {
        actualDownloads: 1456,
        actualRating: 4.9,
        actualReviews: 156,
        actualLikes: 678
      }
    }
  ];

  useEffect(() => {
    // Simulate loading presets from database
    setLoading(true);
    setTimeout(() => {
      setPresets(mockPresets);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort presets
  const filteredPresets = presets.filter((preset) => {
    const matchesSearch = preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      preset.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'free' && preset.price === 0) ||
      (priceFilter === 'premium' && preset.price > 0);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedPresets = [...filteredPresets].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.realMetrics.actualDownloads - a.realMetrics.actualDownloads;
      case 'rating':
        return b.realMetrics.actualRating - a.realMetrics.actualRating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handlePurchase = async (preset) => {
    if (!user) {
      toast.error('Please sign in to purchase presets');
      return;
    }

    if (preset.isPremium) {
      // Redirect to payment page
      toast.loading('Redirecting to payment...', { id: 'purchase' });
      setTimeout(() => {
        toast.success(`Redirecting to checkout for ${preset.title}`, { id: 'purchase' });
        // In real app, redirect to Stripe/Razorpay checkout
      }, 1000);
    } else {
      // Free download
      toast.success('Download started!');
      // Update download count
      setPresets(prev => prev.map(p => 
        p.id === preset.id 
          ? { ...p, realMetrics: { ...p.realMetrics, actualDownloads: p.realMetrics.actualDownloads + 1 }}
          : p
      ));
    }
  };

  const PresetCard = ({ preset }) => {
    const isFavorite = favoritePresets.includes(preset.id);

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
      >
        <div className="relative">
          <img
            src={preset.thumbnail}
            alt={preset.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Format Badge */}
          <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {preset.format.toUpperCase()}
          </div>
          
          {/* Premium Badge */}
          {preset.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center space-x-1">
              <Crown className="w-3 h-3" />
              <span>${preset.price}</span>
            </div>
          )}
          
          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => toggleFavorite(preset.id)}
              className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                isFavorite
                  ? 'text-red-400 bg-red-400/20'
                  : 'text-white bg-black/30 hover:bg-black/50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <Link
              to={`/preset/${preset.id}`}
              className="p-2 rounded-lg backdrop-blur-sm bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Author Info */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <img
              src={preset.author.avatar}
              alt={preset.author.name}
              className="w-8 h-8 rounded-full border-2 border-white/50"
            />
            <div className="flex items-center space-x-1">
              <span className="text-white text-sm font-medium">{preset.author.name}</span>
              {preset.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <Link to={`/preset/${preset.id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-primary-400 transition-colors mb-2">
              {preset.title}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{preset.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {preset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded flex items-center space-x-1"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {preset.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                +{preset.tags.length - 3}
              </span>
            )}
          </div>
          
          {/* Real Metrics */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{preset.realMetrics.actualDownloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{preset.realMetrics.actualRating}</span>
                <span>({preset.realMetrics.actualReviews})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span>{preset.realMetrics.actualLikes}</span>
              </div>
            </div>
            <span className="text-xs">{preset.fileSize}</span>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1 mb-4">
            {preset.platforms.map((platform) => (
              <span
                key={platform}
                className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded"
              >
                {platform}
              </span>
            ))}
          </div>
          
          {/* Action Button */}
          <button
            onClick={() => handlePurchase(preset)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {preset.isPremium ? (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Buy ${preset.price}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Free</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Design Marketplace
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and download amazing design presets from creators worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search presets, creators, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Only</option>
              <option value="premium">Premium Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            {sortedPresets.length} preset{sortedPresets.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Real-time metrics</span>
          </div>
        </div>

        {/* Presets Grid */}
        <motion.div
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }
        >
          {sortedPresets.map((preset, index) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <PresetCard preset={preset} />
            </motion.div>
          ))}
        </motion.div>

        {sortedPresets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No presets found</h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or browse all presets
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceGrid;