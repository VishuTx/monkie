import { DetectionSource } from './DetectionSource';
import { DetectionEvent, VerdictType } from '../../types/DetectionEvent';
import { detectImage } from '../../api/detectionApi';

export class ManualUploadSource implements DetectionSource {
  async submit(imageUri: string): Promise<DetectionEvent> {
    const apiResponse = await detectImage(imageUri);

    const rawPred = (apiResponse.prediction || '').trim().toLowerCase();

    // Strictly check if backend returned monkey (and not "Not a Monkey")
    const isMonkey =
      rawPred.includes('monkey') &&
      !rawPred.includes('not') &&
      !rawPred.includes('no');

    const verdict: VerdictType = isMonkey ? 'MONKEY_DETECTED' : 'NO_MONKEY';

    return {
      id: `det_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      imageUri,
      verdict,
      confidence: apiResponse.confidence,
      processingTimeMs: apiResponse.processing_time_ms,
      timestamp: apiResponse.timestamp || new Date().toISOString(),
      sourceType: 'MANUAL_UPLOAD',
      rawPrediction: apiResponse.prediction,
    };
  }
}

export const manualUploadSource = new ManualUploadSource();
