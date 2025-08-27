// editors/visualEditor.tsx

import React, { useState } from 'react';
import { Preset } from '../types/preset.schema';

interface VisualEditorProps {
  preset: Preset;
  onChange: (updated: Preset) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ preset, onChange }) => {
  const [localPreset, setLocalPreset] = useState(preset);

  const updateField = (field: string, value: string | number) => {
    const updated = {
      ...localPreset,
      instructions: {
        ...localPreset.instructions,
        [field]: value,
      },
    };
    setLocalPreset(updated);
    onChange(updated);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Visual Editor</h2>

      <div>
        <label className="block text-sm">Background Color</label>
        <input
          type="color"
          value={localPreset.instructions.backgroundColor || '#ffffff'}
          onChange={(e) => updateField('backgroundColor', e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm">Font Size</label>
        <input
          type="number"
          value={localPreset.instructions.fontSize || 16}
          onChange={(e) => updateField('fontSize', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm">Text</label>
        <input
          type="text"
          value={localPreset.instructions.text || ''}
          onChange={(e) => updateField('text', e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VisualEditor;
