import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Crown,
  Settings,
  Upload,
  Download,
  MoreVertical,
  UserPlus,
  Folder,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockTeams } from '../data/mockData';

const Teams = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('my-teams');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: 'my-teams', label: 'My Teams', count: mockTeams.length },
    { id: 'invitations', label: 'Invitations', count: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">Teams</h1>
            <p className="text-gray-400 text-lg">
              Collaborate with your team on shared preset libraries
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Team</span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                  <span className="ml-2 px-2 py-1 bg-gray-700 text-xs rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my-teams' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/50 border border-gray-600 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          team.role === 'owner' 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : team.role === 'admin'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {team.role === 'owner' && <Crown className="w-3 h-3 inline mr-1" />}
                          {team.role}
                        </div>
                        <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                    <p className="text-gray-400 mb-4">{team.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Folder className="w-4 h-4" />
                          <span>{team.presets.length} presets</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>5 members</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <img
                            key={i}
                            src={`https://images.pexels.com/photos/${1239291 + i}/pexels-photo-${1239291 + i}.jpeg?auto=compress&cs=tinysrgb&w=150`}
                            alt={`Member ${i}`}
                            className="w-8 h-8 rounded-full border-2 border-gray-700"
                          />
                        ))}
                        <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-700 flex items-center justify-center">
                          <span className="text-xs text-gray-300">+2</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'invitations' && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-700/50 border border-gray-600 rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {i === 1 ? 'Design Agency Pro' : 'Startup UI Team'}
                        </h3>
                        <p className="text-gray-400">
                          Invited by {i === 1 ? 'Sarah Chen' : 'Alex Rodriguez'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Decline
                      </button>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Create New Team</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Describe your team's purpose"
                  />
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Teams;