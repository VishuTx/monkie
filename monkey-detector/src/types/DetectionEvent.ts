export type VerdictType = 'MONKEY_DETECTED' | 'NO_MONKEY';

export type DetectionSourceType = 'MANUAL_UPLOAD' | 'CAMERA' | 'AUTOMATED_STREAM';

export interface DetectionEvent {
  id: string;
  imageUri: string;
  verdict: VerdictType;
  confidence: number; // 0 to 100
  processingTimeMs: number;
  timestamp: string; // ISO 8601 string
  sourceType: DetectionSourceType;
  rawPrediction?: string;
}

export interface DetectionApiResponse {
  prediction: string;
  confidence: number;
  processing_time_ms: number;
  timestamp: string;
  error?: string;
}
