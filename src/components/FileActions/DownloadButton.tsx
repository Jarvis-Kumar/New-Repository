// /src/components/DownloadButton.tsx
import { createClient } from '@supabase/supabase-js';
import { Button } from '../ui/Button'; // Import the new Button component

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function DownloadButton({
  filePath,
  fileName,
}: {
  filePath: string;
  fileName: string;
}) {
  const handleDownload = async () => {
    const { data, error } = await supabase.storage
      .from('your-bucket-name') // replace with your actual bucket name
      .download(filePath);

    if (error) {
      alert('Download failed');
      console.error(error);
      return;
    }

    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="default">
      Download
    </Button>
  );
}
