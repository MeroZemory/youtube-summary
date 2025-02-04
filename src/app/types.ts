export interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  text: string;
  segments: Segment[];
}

export interface VideoResult {
  summary: string;
  timestamps: Array<{time: string, text: string}>;
  processingTimes: Array<{step: string, duration: number}>;
}

export interface ApiResponse {
  type: 'complete' | 'error' | 'progress';
  data?: VideoResult;
  error?: string;
  status?: string;
} 