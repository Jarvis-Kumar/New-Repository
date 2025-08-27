// src/pages/presets/[id].tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preset } from '../../types/preset.schema';
import { applyAlgorithm } from '../../algorithms/applyAlgorithm';
import { fetchPresetById } from '../../lib/presets';
import VisualEditor from '../../editors/visualEditor';

const PresetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [preset, setPreset] = useState<Preset | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const data = await fetchPresetById(id);
      setPreset(data);
    };
    fetch();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    if (!uploadedFile) {
      setFile(null);
      setMediaType(null);
      return;
    }

    setFile(uploadedFile);

    // Detect media type
    const mimeType = uploadedFile.type;
    if (mimeType.startsWith('image/')) {
      setMediaType('image');
    } else if (mimeType.startsWith('video/')) {
      setMediaType('video');
    } else {
      alert('Unsupported file type');
      setMediaType(null);
    }
  };

  const handleApply = async () => {
    if (!preset || !file || !mediaType) {
      alert('Missing file or preset or media type');
      return;
    }

    try {
      const result = await applyAlgorithm({ file, type: mediaType, preset });
      setResult(result);
      alert('Algorithm applied. Output is ready.');
    } catch (error) {
      console.error('Error applying algorithm:', error);
      alert('Something went wrong.');
    }
  };

  if (!preset) return <div className="text-white">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2 text-white">{preset.name}</h1>
      <p className="text-gray-300">{preset.description}</p>

      <VisualEditor preset={preset} onChange={setPreset} />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mt-4 text-white"
      />

      <button
        onClick={handleApply}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Apply Algorithm
      </button>

      {result && (
        <div className="mt-6 bg-gray-800 text-white p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Edited Output</h2>
          <p>Output generated as Blob.</p>
          <a
            href={URL.createObjectURL(result)}
            download={`edited-${preset.name}.${mediaType === 'image' ? 'png' : 'mp4'}`}
            className="text-blue-400 underline"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
};

export default PresetDetailPage;
