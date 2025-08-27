export interface Preset {
  id: string;
  name: string;
  type: "image" | "video" | "file";
  createdBy: string;
  createdAt: string;
  tags: string[];
  description?: string;

  // Algorithm-related fields
  algorithm: {
    steps: AlgorithmStep[];
    inputFormat: string;
    outputFormat: string;
  };

  // Instructions for the visual editor
  instructions: {
    backgroundColor?: string;
    fontSize?: number;
    text?: string;
    resize?: {
      width?: number;
      height?: number;
    };
    [key: string]: any;
  };

  // Optional AI-generated metadata
  aiMetadata?: {
    brandTone?: string;
    targetIndustry?: string;
    recommendedColors?: string[];
    recommendedFonts?: string[];
  };

  // Optional example use cases
  usageExamples?: {
    inputFileUrl?: string;
    outputPreviewUrl?: string;
  };
}

export interface AlgorithmStep {
  name: string;
  description: string;
  params: Record<string, any>;
}
