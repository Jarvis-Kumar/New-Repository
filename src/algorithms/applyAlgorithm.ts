// algorithms/applyAlgorithm.ts

import { Preset } from '../types/preset.schema';


type MediaType = 'image' | 'video';

interface FileInput {
  file: File;
  type: MediaType;
  preset: Preset;
}

export const applyAlgorithm = async ({ file, type, preset }: FileInput): Promise<Blob> => {
  // Step 1: Read the file
  const fileData = await file.arrayBuffer();

  // Step 2: Parse preset instructions
  const instructions = preset.instructions;

  // Step 3: Apply changes based on media type
  if (type === 'image') {
    return applyImageChanges(fileData, instructions);
  } else if (type === 'video') {
    return applyVideoChanges(fileData, instructions);
  } else {
    throw new Error('Unsupported media type');
  }
};

// Dummy processors (replace with real ones using FFmpeg, Sharp, etc.)
async function applyImageChanges(data: ArrayBuffer, instructions: any): Promise<Blob> {
  console.log('Applying image edits with instructions:', instructions);
  return new Blob([data], { type: 'image/png' }); // dummy output
}

async function applyVideoChanges(data: ArrayBuffer, instructions: any): Promise<Blob> {
  console.log('Applying video edits with instructions:', instructions);
  return new Blob([data], { type: 'video/mp4' }); // dummy output
}
