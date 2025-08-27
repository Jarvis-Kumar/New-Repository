import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Download,
  Star,
  Crown,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { Preset, useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { Preset as PresetType } from '../types/preset.schema'; // ✅ renamed


interface PresetCardProps {
  preset: Preset;
  viewMode?: 'grid' | 'list';
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, viewMode = 'grid' }) => {
  const {
    favoritePresets,
    toggleFavorite,
    user,
    setPostAuthAction,
  } = useStore();

  const navigate = useNavigate();
  const isFavorite = favoritePresets.includes(preset.id);

  const formatTypeIcon = {
    figma: '🎨',
    sketch: '💎',
    psd: '🖼️',
    html: '🌐',
    react: '⚛️',
  };

  const handleDownload = () => {
    if (!user) {
      setPostAuthAction('download', preset.fileUrl);
      navigate('/auth'); // Redirect to login/signup page
      return;
    }
    window.open(preset.fileUrl, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
      >
        <div className="flex gap-6">
          <div className="relative">
            <img
              src={preset.thumbnail}
              alt={preset.title}
              className="w-32 h-24 object-cover rounded-lg"
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatTypeIcon[preset.format]} {preset.format.toUpperCase()}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link to={`/preset/${preset.id}`}>
                  <h3 className="text-xl font-semibold text-white hover:text-primary-400 transition-colors">
                    {preset.title}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-2">{preset.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <img
                      src={preset.author.avatar}
                      alt={preset.author.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{preset.author.name}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDistanceToNow(preset.createdAt)} ago</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {preset.isPremium && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">${preset.price}</span>
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(preset.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite
                      ? 'text-red-400 bg-red-400/10'
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{preset.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{preset.rating}</span>
                </div>
                <span>{preset.fileSize}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/preset/${preset.id}`}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Link>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-sm text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

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

        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatTypeIcon[preset.format]} {preset.format.toUpperCase()}
        </div>

        {preset.isPremium && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>${preset.price}</span>
          </div>
        )}

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
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center space-x-2">
          <img
            src={preset.author.avatar}
            alt={preset.author.name}
            className="w-8 h-8 rounded-full border-2 border-white/50"
          />
          <span className="text-white text-sm font-medium">{preset.author.name}</span>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/preset/${preset.id}`}>
          <h3 className="text-lg font-semibold text-white hover:text-primary-400 transition-colors mb-2">
            {preset.title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{preset.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {preset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {preset.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              +{preset.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{preset.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{preset.rating}</span>
            </div>
          </div>
          <span className="text-xs">{preset.fileSize}</span>
        </div>

        <button
          onClick={handleDownload}
          className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{preset.isPremium ? `Buy $${preset.price}` : 'Download Free'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default PresetCard;
