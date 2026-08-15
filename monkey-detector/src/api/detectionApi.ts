import axios from 'axios';
import Constants from 'expo-constants';
import { DetectionApiResponse } from '../types/DetectionEvent';

const getBaseUrl = (): string => {
  const configuredUrl = Constants.expoConfig?.extra?.API_BASE_URL;
  return configuredUrl || 'http://127.0.0.1:5000';
};

export const detectImage = async (imageUri: string): Promise<DetectionApiResponse> => {
  const baseUrl = getBaseUrl();
  const startTime = Date.now();

  const formData = new FormData();
  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const ext = (/\.(\w+)$/.exec(filename) || [])[1] || 'jpeg';
  const type = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  formData.append('file', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  console.log(`[DetectionAPI] POST ${baseUrl}/api/detect — file: ${filename} (${type})`);

  const response = await axios.post<DetectionApiResponse>(`${baseUrl}/api/detect`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
    timeout: 15000,
  });

  const data = response.data;
  const elapsed = Date.now() - startTime;

  console.log(
    `[DetectionAPI] Response in ${elapsed}ms — prediction: "${data.prediction}", confidence: ${data.confidence}%`
  );

  // Validate the response shape
  if (typeof data.confidence !== 'number' || !data.prediction) {
    console.error('[DetectionAPI] Unexpected response shape:', data);
    throw new Error('Invalid response from detection API');
  }

  return data;
};
