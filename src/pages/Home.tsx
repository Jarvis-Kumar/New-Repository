import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Users,
  Download,
  Star,
  Palette,
  Code,
  Smartphone,
  Globe,
  Edit3,
  ShoppingBag,
  Layers,
  Wand2,
  Upload,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Palette,
      title: 'Advanced Image Editor',
      description: 'Professional-grade editing tools with real-time filters, AI enhancements, and cross-platform export.',
    },
    {
      icon: ShoppingBag,
      title: 'Design Marketplace',
      description: 'Buy and sell design presets with real payment processing and instant delivery.',
    },
    {
      icon: Wand2,
      title: 'AI-Powered Tools',
      description: 'Smart customization, background removal, and content generation using multiple AI APIs.',
    },
    {
      icon: Layers,
      title: 'Multi-Format Support',
      description: 'Upload and edit images, videos, documents, design files, and more in one platform.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team on shared preset libraries and projects.',
    },
    {
      icon: Globe,
      title: 'Cross-Platform Export',
      description: 'Generate optimized versions for Instagram, Facebook, YouTube, and more platforms.',
    },
  ];

  const stats = [
    { label: 'Active Creators', value: '50K+', icon: Users },
    { label: 'Design Presets', value: '100K+', icon: Layers },
    { label: 'Downloads', value: '1M+', icon: Download },
    { label: 'AI Edits', value: '500K+', icon: Wand2 },
  ];

  const quickActions = [
    {
      title: 'Start Editing',
      description: 'Upload images and apply professional filters',
      href: '/advanced-editor',
      icon: Palette,
      color: 'from-purple-600 to-blue-600'
    },
    {
      title: 'Browse Marketplace',
      description: 'Discover amazing design presets',
      href: '/marketplace',
      icon: ShoppingBag,
      color: 'from-green-600 to-teal-600'
    },
    {
      title: 'Upload & Sell',
      description: 'Share your designs and earn money',
      href: '/upload-advanced',
      icon: Upload,
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                Design & Edit
              </span>
              <br />
              <span className="text-white">Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The world's most advanced design platform. Upload any file, apply AI-powered edits,
              buy premium presets, and export to any platform. Built for creators, by creators.
            </p>
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    to={action.href}
                    className={`block bg-gradient-to-r ${action.color} p-6 rounded-xl hover:scale-105 transition-transform duration-300 group`}
                  >
                    <action.icon className="w-8 h-8 text-white mb-3 mx-auto" />
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-white/80 text-sm">{action.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Marketplace</span>
              </Link>
              <Link
                to="/advanced-editor"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Try Editor Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-primary-400 mr-2" />
                  <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to <span className="text-primary-400">Create</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From professional image editing to AI-powered design generation, our platform
              provides all the tools you need to bring your creative vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="text-primary-400">Marketplace</span> Preview
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover thousands of premium design presets created by professional designers
              and creators from around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Instagram Story Templates',
                price: '$15',
                downloads: '1.2K',
                rating: '4.9',
                image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'
              },
              {
                title: 'Website Landing Pages',
                price: 'Free',
                downloads: '890',
                rating: '4.7',
                image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400'
              },
              {
                title: 'Mobile UI Kit',
                price: '$35',
                downloads: '567',
                rating: '4.8',
                image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'
              }
            ].map((preset, index) => (
              <Link to={`/preset/${index}`} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={preset.image}
                      alt={preset.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      {preset.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{preset.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{preset.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{preset.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/marketplace"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>View Full Marketplace</span>
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of creators using our platform to design, edit, and sell
              amazing presets with AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/advanced-editor">
                  <Button size="lg">
                    <Palette className="w-5 h-5 mr-2" />
                    Start Creating
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" variant="secondary">
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link to="/signup?trial=true">
                    <Button size="lg">Start Free Trial</Button>
                  </Link>
                  <Link to="/advanced-editor">
                    <Button size="lg" variant="ghost">
                      Try Editor
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;