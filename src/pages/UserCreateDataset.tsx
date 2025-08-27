import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

type DatasetType = "Image" | "Video" | "Audio" | "Text" | "Mixed";

type ProcessedFile = {
  filename: string;
  url: string; // e.g. /uploads/processed/abc.jpg
};

function CreateDatasetPage() {
  const [datasetType, setDatasetType] = useState<DatasetType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("v1");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Preprocessing states (moved from PreprocessTools to top level)
  const [resize, setResize] = useState(false);
  const [compress, setCompress] = useState(true);
  const [normalize, setNormalize] = useState(false);
  const [crop, setCrop] = useState(false);
  const [deduplicate, setDeduplicate] = useState(true);
  const [format, setFormat] = useState("jpg");

  // ✅ NEW: backend base URL (change with Vite env if you want)
  const API_BASE =
    (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const [processed, setProcessed] = useState<ProcessedFile[]>([]); // ✅ NEW: show processed previews

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  };

  const handlePublish = async () => {
    if (!title || files.length === 0 || !datasetType) {
      toast.error("Please fill all fields and add files!");
      return;
    }

    const preprocessOptions = {
      resize,
      compress,
      normalize,
      crop,
      deduplicate,
      format,
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("datasetType", datasetType);
    formData.append("version", version);
    formData.append("preprocessOptions", JSON.stringify(preprocessOptions));
    files.forEach((file) => formData.append("files", file));

    try {
      toast.loading("Uploading...");
      // ✅ IMPORTANT: post to your backend port (5000), not the frontend
      const res = await axios.post(`http://localhost:5000/api/datasets`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percent);
        },
      });
      toast.dismiss();
      toast.success("Dataset published successfully!");
      console.log("Response:", res.data);

      // ✅ NEW: show processed files preview if backend returns them
      if (res.data?.processedFiles) {
        setProcessed(res.data.processedFiles);
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-20 text-white">
      <Toaster position="top-right" />
      <h2 className="text-4xl font-bold text-indigo-400">Create Dataset</h2>

      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-indigo-500/30">
        <div className="mb-4 font-semibold">Choose Dataset Type</div>
        <div className="flex gap-3 flex-wrap">
          {(["Image", "Video", "Audio", "Text", "Mixed"] as DatasetType[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => setDatasetType(t)}
                className={`px-4 py-3 rounded-lg transition font-semibold ${
                  datasetType === t
                    ? "bg-gradient-to-r from-pink-500 to-yellow-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>

        <div className="mt-6">
          <div className="mb-2 font-semibold">Upload Files</div>
          <label className="block rounded-lg border-2 border-dashed border-gray-700 p-6 text-center cursor-pointer hover:border-pink-400 transition">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            Drag & drop files here or click to browse
            <div className="mt-2 text-xs text-gray-400">
              Connect Google Drive, Dropbox or upload from device
            </div>
          </label>

          {files.length > 0 && (
            <div className="mt-3 bg-gray-800 rounded-xl p-3">
              <div className="text-sm font-semibold">Files to upload</div>
              <ul className="text-sm mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{f.name}</span>
                    <span className="text-xs text-gray-400">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </li>
                ))}
              </ul>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 font-semibold">Preprocessing & Tools</div>
            <div className="bg-gray-800 rounded-xl p-4 space-y-3 border border-white/50">
              <label className="flex items-center justify-between">
                <div>Resize images</div>
                <input
                  type="checkbox"
                  checked={resize}
                  onChange={() => setResize((s) => !s)}
                  className="w-5 h-5 appearance-none rounded border border-gray-400 bg-gray-500 checked:bg-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>Auto-compress</div>
                <input
                  type="checkbox"
                  checked={compress}
                  onChange={() => setCompress((s) => !s)}
                  className="w-5 h-5 appearance-none rounded border border-gray-400 bg-gray-500 checked:bg-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>Normalize color</div>
                <input
                  type="checkbox"
                  checked={normalize}
                  onChange={() => setNormalize((s) => !s)}
                  className="w-5 h-5 appearance-none rounded border border-gray-400 bg-gray-500 checked:bg-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>Crop to aspect ratio</div>
                <input
                  type="checkbox"
                  checked={crop}
                  onChange={() => setCrop((s) => !s)}
                  className="w-5 h-5 appearance-none rounded border border-gray-400 bg-gray-500 checked:bg-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>Remove duplicates</div>
                <input
                  type="checkbox"
                  checked={deduplicate}
                  onChange={() => setDeduplicate((s) => !s)}
                  className="w-5 h-5 appearance-none rounded border border-gray-400 bg-gray-500 checked:bg-blue-500"
                />
              </label>
              <div className="flex items-center gap-2">
                <div className="text-sm">Change format</div>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="ml-auto rounded-lg p-2 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 transition border border-white/90"
                >
                  <option value="jpg">JPG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WEBP</option>
                </select>
              </div>
              <div className="text-xs text-gray-400">
                Crop, normalize, and deduplicate options available after upload.
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 font-semibold">Labeling & Annotation</div>
            <LabelingTool />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 font-semibold">Version & Publish</div>
          <div className="flex gap-3 flex-wrap">
            <input
              className="rounded-lg p-3 bg-gray-800 text-white placeholder-gray-400 flex-1 focus:ring-2 focus:ring-pink-500 transition border border-white/60"
              placeholder="Dataset title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition border border-white/50">
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
            >
              Publish
            </button>
          </div>
        </div>

        {/* ✅ NEW: Show processed images from backend */}
        {processed.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 font-semibold">Processed results</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {processed.map((p, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg p-2 border border-white/10"
                >
                  <img
                    src={`${API_BASE}${p.url}`}
                    alt={p.filename}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="text-xs mt-1 truncate">{p.filename}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">
          Pro tip: Use clear labels and good preview images to increase downloads.
        </div>
      </div>
    </div>
  );
}

function LabelingTool() {
  const [labels, setLabels] = useState<string[]>(["sunset", "landscape"]);
  const [tag, setTag] = useState("");

  function addTag() {
    if (!tag.trim()) return;
    setLabels((l) => [...l, tag.trim()]);
    setTag("");
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-5 border border-white/50">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg p-2 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition border border-white/60"
          placeholder="Add label/tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button
          onClick={addTag}
          className="px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
        >
          Add
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {labels.map((l, i) => (
          <div
            key={i}
            className="text-xs bg-gray-700 px-3 py-1 rounded-full border border-white/20"
          >
            {l}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400">
        You can bulk label using CSV or use an annotation UI for bounding boxes
        / masks (pro feature).
      </div>
    </div>
  );
}

export default CreateDatasetPage;
