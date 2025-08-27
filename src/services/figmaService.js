import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/apis.js';

class FigmaService {
  // Get Figma file data
  async getFigmaFile(fileKey) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.FIGMA}/files/${fileKey}`,
        {
          headers: {
            'X-Figma-Token': API_KEYS.FIGMA
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Figma API Error:', error);
      throw error;
    }
  }

  // Get Figma file images
  async getFigmaImages(fileKey, nodeIds, format = 'png', scale = 2) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.FIGMA}/images/${fileKey}`,
        {
          params: {
            ids: nodeIds.join(','),
            format,
            scale
          },
          headers: {
            'X-Figma-Token': API_KEYS.FIGMA
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Figma Images API Error:', error);
      throw error;
    }
  }

  // Parse Figma design tokens
  async parseFigmaDesignTokens(fileKey) {
    try {
      const fileData = await this.getFigmaFile(fileKey);
      const tokens = {
        colors: [],
        fonts: [],
        spacing: [],
        borderRadius: []
      };

      // Extract design tokens from Figma file
      const extractTokens = (node) => {
        if (node.fills) {
          node.fills.forEach(fill => {
            if (fill.type === 'SOLID') {
              tokens.colors.push({
                name: node.name,
                value: this.rgbToHex(fill.color)
              });
            }
          });
        }

        if (node.style && node.style.fontFamily) {
          tokens.fonts.push({
            family: node.style.fontFamily,
            size: node.style.fontSize,
            weight: node.style.fontWeight
          });
        }

        if (node.children) {
          node.children.forEach(extractTokens);
        }
      };

      fileData.document.children.forEach(extractTokens);
      return tokens;
    } catch (error) {
      console.error('Figma Token Parsing Error:', error);
      throw error;
    }
  }

  // Convert RGB to Hex
  rgbToHex(rgb) {
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }
}

export default new FigmaService();