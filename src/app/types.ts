import { z } from 'zod';

export interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  text: string;
  segments: Segment[];
}

export interface ProcessingTime {
  step: string;
  duration: number;  // 초 단위
}

export const zodVideoInfo = z.object({
  title: z.string().optional(),
  thumbnail: z.string().optional(),
  duration: z.number().optional(),
  channel: z.string().optional(),
  upload_date: z.string().optional(),
}).passthrough();

export type ParsedVideoInfo = z.infer<typeof zodVideoInfo>;

export interface AnalysisResult {
  summary: string;
  timestamps: Array<{time: string, text: string}>;
  processingTimes: ProcessingTime[];
  totalDuration: number;
  videoInfoRaw: unknown;
}

export interface ApiResponse {
  type: 'complete' | 'error' | 'progress';
  data?: AnalysisResult;
  error?: string;
  status?: string;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  videoUrl: string;
  result: AnalysisResult;
  createdAt: number;
}
