
import { supabase } from '../config/supabase';
import { Preset } from '../types/preset.schema';

export async function fetchPresetById(id: string): Promise<Preset | null> {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching preset:', error);
    return null;
  }

  return data;
}
