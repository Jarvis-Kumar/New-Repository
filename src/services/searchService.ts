// services/searchService.ts
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700', // 👈 Change this to your MeiliSearch server URL
  apiKey: 'your_meilisearch_api_key', // Optional if using public access
});

const index = client.index('users'); // You can change 'users' to any index name

// Add a document to Meilisearch
export const addToSearchIndex = async (user: { id: number; name: string; email: string }) => {
  const response = await index.addDocuments([user]);
  return response;
};

// Search documents
export const searchUsers = async (query: string) => {
  const searchResults = await index.search(query);
  return searchResults;
};
