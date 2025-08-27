import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  User,
  Settings,
  Upload,
  Heart,
  Download,
  Star,
  Crown,
  Edit3,
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockPresets } from '../data/mockData';
import PresetCard from '../components/PresetCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('public');
  const [view, setView] = useState('public'); // public | private

  if (!user || !profile) {
    return null;
  }

  const userPresets = mockPresets.slice(0, 4);
  const favoritePresets = mockPresets.slice(2, 6);

  const TabsValue = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    TEAM: 'team'
  }

  const tabs = [
    { id: TabsValue.PUBLIC, label: 'Public Info' },
    { id: TabsValue.PRIVATE, label: 'Private Info' },
    { id: TabsValue.TEAM, label: 'Team' },
  ];

  const stats = [
    { label: 'Total Uploads', value: '24', icon: Upload },
    { label: 'Total Downloads', value: '3.2K', icon: Download },
    { label: 'Average Rating', value: '4.8', icon: Star },
    { label: 'Earnings', value: '$1,240', icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{profile.full_name}</h1>
                <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-full capitalize">
                  {profile.plan}
                </span>
              </div>
              
              <p className="text-gray-400 mb-4">
                UI/UX Designer & Creative Developer passionate about creating beautiful, functional designs.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <span>portfolio.com</span>
                </div>
              </div>
            </div>

            <Button>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-6 h-6 text-primary-400" />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl"
        >
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === TabsValue.PUBLIC && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Published Datasets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPresets.map((preset) => (
                    <PresetCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === TabsValue.PRIVATE && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-semibold text-white">Earnings</h4>
                  <p className="text-2xl font-bold text-green-400">$1,234.56</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-semibold text-white">Sales Count</h4>
                  <p className="text-2xl font-bold">123</p>
                </div>
                {/* Add more private stats here */}
              </div>
            )}

            {activeTab === TabsValue.TEAM && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <Button variant="secondary">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Team member list */}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;