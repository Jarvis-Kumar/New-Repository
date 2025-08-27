import React, { useState, useEffect } from 'react';
import { getAllPresets, downloadFile } from '../utils/downloadFile';
import PresetCard from '../components/PresetCard';
import { Input } from '../components/ui/Input';
import { ViewToggle } from '../components/ui/ViewToggle';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthAction } from '../hooks/useAuthAction'; // ✅ Correct import

const Gallery = () => {
  const [presets, setPresets] = useState<any[]>([]);
  const [filteredPresets, setFilteredPresets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

const { trigger, AuthModalComponent } = useAuthAction(() => {
  // ✅ This runs when the user is logged in
  console.log("User is authenticated. Proceeding...");
});


  const debouncedQuery = useDebounce(searchQuery, 300);

  // ✅ Fetch presets on first load
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const allPresets = await getAllPresets();
        setPresets(allPresets);
      } catch (error) {
        console.error('Error fetching presets:', error);
      }
    };

    fetchPresets();
  }, []);

  // ✅ Filter presets by search query
  useEffect(() => {
    const query = debouncedQuery.toLowerCase();
    const results = presets.filter(
      (preset) =>
        preset.title?.toLowerCase().includes(query) ||
        preset.description?.toLowerCase().includes(query)
    );
    setFilteredPresets(results);
  }, [debouncedQuery, presets]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm"
        />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <div
        className={`grid gap-6 ${
          viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
        }`}
      >
        {filteredPresets.map((preset) => (
          <div key={preset.id} className="space-y-2">
            <PresetCard preset={preset} viewMode={viewMode} />

            {/* ✅ Protected Download Button */}
            <button
              onClick={() =>
                requireAuthAction({
                  action: 'download',
                  from: window.location.href,
                  callback: () => {
                    if (preset.file_url) {
                      downloadFile(preset.file_url, `${preset.title || 'download'}.png`);
                    } else {
                      alert('No file available to download.');
                    }
                  },
                })
              }
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl text-sm"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
