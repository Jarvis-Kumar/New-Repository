import React from 'react';
import { useParams } from 'react-router-dom';

const PresetDetail = () => {
  const { id } = useParams();

  // Fetch preset details based on id

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-4">Preset Detail Page</h1>
        <p className="text-gray-400">Details for preset {id}</p>
      </div>
    </div>
  );
};

export default PresetDetail;