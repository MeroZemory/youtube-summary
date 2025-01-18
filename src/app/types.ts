export interface Segment {
  start: number;
  text: string;
}

export interface TranscriptionResponse {
  text: string;
  segments: Segment[];
} 