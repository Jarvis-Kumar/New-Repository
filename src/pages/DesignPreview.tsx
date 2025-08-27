import DownloadButton from '../components/FileActions/DownloadButton'; // make sure this path matches your structure

export default function DesignPreview() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Preview your edited design</h1>
      
      <img
        src="/design-preview.png" // replace with your actual preview image path
        alt="Preview"
        className="border rounded-lg shadow-md max-w-md mb-6"
      />
      
      <DownloadButton 
        filePath="edited/mydesign.png"  // replace with actual Supabase storage path
        fileName="MyDesign.png"
      />
    </div>
  );
}
