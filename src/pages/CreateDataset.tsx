import React, { useState } from "react";

interface DatasetForm {
  title: string;
  description: string;
  tags: string;
  price: string;
  file: File | null;
  preview: File | null;
  datasetType: string;
  fileSource: string;
}

const CreateDataset: React.FC = () => {
  const [form, setForm] = useState<DatasetForm>({
    title: "",
    description: "",
    tags: "",
    price: "Free",
    file: null,
    preview: null,
    datasetType: 'image',
    fileSource: 'device',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, preview: e.target.files[0] });
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary: Show success message
    setSubmitSuccess(true);

    // TODO: In real use, send form data to backend (Firebase, Supabase, etc.)
    console.log("Submitted dataset:", form);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-dark-800 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">📁 Create New Dataset</h1>

      {submitSuccess ? (
        <div className="bg-green-100 text-green-800 p-4 rounded-md">
          🎉 Dataset submitted successfully! You can now view it on your homepage.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dataset Type */}
          <div>
            <label className="block font-medium mb-2 text-white">Dataset Type</label>
            <div className="flex space-x-4">
              {['Image', 'Video', 'Audio', 'Text', 'Mixed'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, datasetType: type.toLowerCase() })}
                  className={`px-4 py-2 rounded-lg ${
                    form.datasetType === type.toLowerCase()
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* File Source */}
          <div>
            <label className="block font-medium mb-2 text-white">Add Files From</label>
            <div className="flex space-x-4">
              {['Device', 'Google Drive', 'Dropbox'].map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setForm({ ...form, fileSource: source.toLowerCase().replace(' ', '-') })}
                  className={`px-4 py-2 rounded-lg ${
                    form.fileSource === source.toLowerCase().replace(' ', '-')
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          {/* Preprocessing Tools */}
          <div>
            <label className="block font-medium mb-2 text-white">Preprocessing Tools</label>
            <div className="flex items-center space-x-4">
              <label><input type="checkbox" className="mr-2" /> Resize</label>
              <label><input type="checkbox" className="mr-2" /> Compress</label>
              <label><input type="checkbox" className="mr-2" /> Clean</label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              🚀 Publish Dataset
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              💾 Save Draft
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateDataset;
