
export interface ContentPlan {
  place: string;
  emotion: string;
  historyFacts: string;
  synopsis: string;
  contentType: string;
  keyMessage: string;
  targetAudience: string;
  visualPrompt: string; // Description for image generation
  socialCaption: string; // The "Nano Banana" style text
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export interface GeneratedImage {
  imageUrl: string;
}

export type MediaType = 'image' | 'video';

export enum AppStep {
  INPUT = 'INPUT',
  PLANNING = 'PLANNING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
