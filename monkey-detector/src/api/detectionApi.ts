import axios from 'axios';
import Constants from 'expo-constants';
import { DetectionApiResponse } from '../types/DetectionEvent';

const getBaseUrl = (): string => {
  const configuredUrl = Constants.expoConfig?.extra?.API_BASE_URL;

  if (configuredUrl && !configuredUrl.includes('127.0.0.1') && !configuredUrl.includes('localhost')) {
    return configuredUrl;
  }

  // Automatically extract host IP from Expo's Metro connection (e.g. "192.168.31.72:8081")
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000`;
    }
  }

  return configuredUrl || 'http://192.168.31.72:5000';
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
