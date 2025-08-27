// utils/downloadFile.ts
import { supabase } from '../config/supabase';

// ✅ 1. Download a single file
export const downloadFile = async (path: string, fileName: string) => {
  const { data, error } = await supabase.storage
    .from('user-uploads') // ✅ Make sure this bucket name is correct
    .createSignedUrl(path, 60); // valid for 60 seconds

  if (error || !data?.signedUrl) {
    console.error('❌ Failed to get signed URL:', error?.message);
    alert('You must be logged in to download.');
    return;
  }

  const link = document.createElement('a');
  link.href = data.signedUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ✅ 2. Get all presets
export const getAllPresets = async () => {
  const { data, error } = await supabase
    .from('presets') // ✅ Make sure this is your table name
    .select('*');

  if (error) {
    console.error('❌ Failed to fetch presets:', error.message);
    return [];
  }

  return data;
};
