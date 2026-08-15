import { DetectionEvent } from '../../types/DetectionEvent';

export interface DetectionSource {
  submit(imageUri: string): Promise<DetectionEvent>;
}
