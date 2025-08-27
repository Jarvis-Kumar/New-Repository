// 📁 File: src/pages/DatasetDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sampleDataset } from '../data/sampleDataset'; // adjust path if needed

const dataset = sampleDataset; // use it for testing

// Placeholder imports (replace with your actual DB/API logic)
// import { getDatasetById, addFavorite, removeFavorite, postComment, getUserById } from '../api';

const DatasetDetail: React.FC = () => {
  const { datasetId } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [similar, setSimilar] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with your DB/API call
    fetch(`/api/datasets/${datasetId}`)
      .then(res => res.json())
      .then(data => {
        setDataset(data);
        setDownloads(data.downloads || 0);
        setComments(data.comments || []);
        setRating(data.rating || 0);
        // fetchSimilarByTags(data.tags); // Optional
      });
  }, [datasetId]);

  const handleFavorite = () => {
    // Toggle logic
    setIsFavorited(!isFavorited);
    // TODO: API call to Firebase or DB
  };

  const handleBuy = () => {
    // TODO: Stripe API logic
    alert(`Redirecting to purchase flow for $${dataset.price}`);
  };

  const handleCustomize = () => {
    // TODO: Open AI customization tool or editor with dataset
    navigate(`/editor/${datasetId}`);
  };

  const handlePreview = () => {
    navigate(`/preview/${datasetId}`);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() === '') return;
    // TODO: Post to DB
    setComments(prev => [...prev, { user: 'CurrentUser', text: comment }]);
    setComment('');
  };

  const handleShare = () => {
    const shareURL = `${window.location.origin}/dataset/${datasetId}`;
    navigator.clipboard.writeText(shareURL);
    alert('Link copied to clipboard!');
  };

  if (!dataset) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <img src={dataset.thumbnail} alt={dataset.title} className="rounded-xl w-full lg:w-1/2" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{dataset.title}</h1>
          <p className="text-gray-600 mb-4">{dataset.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <button onClick={handleBuy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Buy for ${dataset.price}
            </button>
            <button onClick={handleCustomize} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Customize with AI
            </button>
            <button onClick={handlePreview} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
              Live Preview
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button onClick={handleFavorite} className="text-xl">
              {isFavorited ? '❤️' : '🤍'}
            </button>
            <button onClick={handleShare} className="text-sm underline text-blue-500">
              Share
            </button>
            <Link to={`/profile/${dataset.creatorId}`} className="ml-auto text-sm text-purple-600">
              View {dataset.creatorName}'s Profile ↗
            </Link>
          </div>

          <p className="text-sm text-gray-500">Downloads: {downloads}</p>
          <p className="text-sm text-yellow-600">Rating: ⭐ {rating.toFixed(1)} / 5</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Comments</h2>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment..."
              className="w-full border rounded p-2 mb-2"
            ></textarea>
            <button onClick={handleCommentSubmit} className="bg-indigo-600 text-white px-4 py-1 rounded">
              Post
            </button>

            <ul className="mt-4 space-y-2">
              {comments.map((c, idx) => (
                <li key={idx} className="border p-2 rounded">
                  <strong>{c.user}</strong>: {c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Similar Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {similar.map((item, i) => (
            <Link to={`/dataset/${item.id}`} key={i} className="border rounded p-4">
              <img src={item.thumbnail} alt={item.title} className="rounded mb-2" />
              <p>{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
