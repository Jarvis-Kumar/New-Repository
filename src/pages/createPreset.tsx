import React, { useState } from 'react';
import { Preset } from '../types/preset.schema';
import VisualEditor  from '../editors/visualEditor';
import { supabase } from '../config/supabase';

const CreatePresetPage = () => {
  const [preset, setPreset] = useState<Preset>({
    id: crypto.randomUUID(),
    name: '',
    type: 'image',
    createdBy: 'user-id',
    createdAt: new Date().toISOString(),
    tags: [],
    description: '',
    instructions: {},
    algorithm: {
      steps: [],
      inputFormat: '',
      outputFormat: ''
    },
  });

  const handleSave = async () => {
    const { data, error } = await supabase.from('presets').insert([preset]);
    if (error) console.error('Error saving preset:', error);
    else alert('Preset saved!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Preset</h1>
      <input
        className="border p-2 w-full mb-3"
        placeholder="Preset Name"
        value={preset.name}
        onChange={(e) => setPreset({ ...preset, name: e.target.value })}
      />
      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        value={preset.description}
        onChange={(e) => setPreset({ ...preset, description: e.target.value })}
      />
      <VisualEditor preset={preset} onChange={setPreset} />
      <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Save Preset
      </button>
    </div>
  );
};

export default CreatePresetPage;
