import { useCameraPermission, useMicrophonePermission } from 'react-native-vision-camera';

export function useRequestCameraPermissions() {
  const camera = useCameraPermission();
  const mic = useMicrophonePermission();

  async function request() {
    const cam = await camera.requestPermission(); // boolean
    const micp = await mic.requestPermission();   // boolean
    return cam && micp; // both must be true
  }

  return { request, camera, mic };
}
