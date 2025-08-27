import React from 'react';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex gap-2">
      <button
        className={`px-4 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setViewMode('grid')}
      >
        Grid
      </button>
      <button
        className={`px-4 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setViewMode('list')}
      >
        List
      </button>
    </div>
  );
};