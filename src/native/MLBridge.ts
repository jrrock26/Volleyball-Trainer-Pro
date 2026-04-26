import { NativeModules } from 'react-native';

const { MLBridge } = NativeModules;

export async function analyzeFrame(uri: string) {
  return await MLBridge.analyzeFrame(uri);
}
