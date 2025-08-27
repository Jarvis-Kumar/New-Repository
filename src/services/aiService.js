import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/apis.js';

class AIService {
  // OpenAI GPT Integration
  async generateContent(prompt, type = 'text') {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.OPENAI}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.OPENAI}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  // Stability AI Image Generation
  async generateImage(prompt, style = 'photographic') {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.STABILITY_AI}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          style_preset: style
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEYS.STABILITY_AI}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data.artifacts[0].base64;
    } catch (error) {
      console.error('Stability AI Error:', error);
      throw error;
    }
  }

  // Google Vision AI Analysis
  async analyzeImage(imageBase64) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.GOOGLE_VISION}/images:annotate?key=${API_KEYS.GOOGLE_VISION}`,
        {
          requests: [
            {
              image: {
                content: imageBase64
              },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'TEXT_DETECTION' },
                { type: 'FACE_DETECTION' },
                { type: 'OBJECT_LOCALIZATION' }
              ]
            }
          ]
        }
      );
      return response.data.responses[0];
    } catch (error) {
      console.error('Google Vision API Error:', error);
      throw error;
    }
  }

  // Google Gemini AI
  async generateWithGemini(prompt) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.GOOGLE_GEMINI}/models/gemini-pro:generateContent?key=${API_KEYS.GOOGLE_GEMINI}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Google Gemini API Error:', error);
      throw error;
    }
  }

  // ClipDrop AI Image Editing
  async editImageWithClipDrop(imageFile, instruction) {
    try {
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('text', instruction);

      const response = await axios.post(
        `${API_ENDPOINTS.CLIPDROP}/text-inpainting/v1`,
        formData,
        {
          headers: {
            'x-api-key': API_KEYS.CLIPDROP_1,
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('ClipDrop API Error:', error);
      throw error;
    }
  }

  // Smart Preset Customizer
  async customizePreset(brandName, industry, presetData) {
    const prompt = `
      Customize this design preset for a ${industry} company called "${brandName}".
      Original preset: ${JSON.stringify(presetData)}
      
      Please suggest:
      1. Color scheme adjustments
      2. Font recommendations
      3. Layout modifications
      4. Brand-appropriate imagery suggestions
      
      Return as JSON with specific CSS values.
    `;

    return await this.generateWithGemini(prompt);
  }

  // Translate Design Content
  async translateText(text, targetLanguage = 'es') {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.GOOGLE_TRANSLATE}?key=${API_KEYS.GOOGLE_TRANSLATE}`,
        {
          q: text,
          target: targetLanguage,
          format: 'text'
        }
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Google Translate API Error:', error);
      throw error;
    }
  }
}

export default new AIService();