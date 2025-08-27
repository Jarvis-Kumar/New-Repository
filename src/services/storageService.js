import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/apis.js';

class StorageService {
  // Cloudflare R2 Storage
  async uploadToR2(file, fileName) {
    try {
      // First, get a presigned URL for upload
      const presignedResponse = await axios.post(
        `${API_ENDPOINTS.CLOUDFLARE_R2}/r2/buckets/design-presets/objects/${fileName}/presigned-url`,
        {
          method: 'PUT',
          expires: 3600
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.CLOUDFLARE}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const presignedUrl = presignedResponse.data.result.url;

      // Upload file to R2 using presigned URL
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      return `https://design-presets.r2.dev/${fileName}`;
    } catch (error) {
      console.error('Cloudflare R2 Upload Error:', error);
      throw error;
    }
  }

  // Get file from R2
  async getFromR2(fileName) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.CLOUDFLARE_R2}/r2/buckets/design-presets/objects/${fileName}`,
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.CLOUDFLARE}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Cloudflare R2 Get Error:', error);
      throw error;
    }
  }

  // Delete file from R2
  async deleteFromR2(fileName) {
    try {
      await axios.delete(
        `${API_ENDPOINTS.CLOUDFLARE_R2}/r2/buckets/design-presets/objects/${fileName}`,
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.CLOUDFLARE}`
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Cloudflare R2 Delete Error:', error);
      throw error;
    }
  }
}

export default new StorageService();