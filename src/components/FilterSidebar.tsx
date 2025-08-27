import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/mockData';

interface FilterSidebarProps {
  isVisible: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isVisible }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    sortBy,
    setSortBy,
  } = useStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-fit sticky top-24"
        >
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.toLowerCase()
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Price</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Presets' },
                  { value: 'free', label: 'Free Only' },
                  { value: 'premium', label: 'Premium Only' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriceFilter(option.value as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      priceFilter === option.value
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'popular', label: 'Most Downloaded' },
                  { value: 'rating', label: 'Highest Rated' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      sortBy === option.value
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceFilter('all');
                setSortBy('newest');
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;