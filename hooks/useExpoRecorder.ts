import { useRef, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export function useExpoRecorder() {
  const cameraRef = useRef<any>(null);
  const overlayRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  async function startRecording() {
    setIsRecording(true);

    const video = await cameraRef.current.recordAsync({
      quality: '1080p',
    });

    setVideoUri(video.uri);
    return video.uri;
  }

  async function stopRecording() {
    if (!cameraRef.current) return null;

    cameraRef.current.stopRecording();
    setIsRecording(false);

    return videoUri;
  }

  async function captureOverlay() {
    if (!overlayRef.current) return null;
    return await captureRef(overlayRef.current, {
      format: 'png',
      quality: 1,
    });
  }

  async function saveToGallery(uri: string) {
    await MediaLibrary.saveToLibraryAsync(uri);
  }

  return {
    cameraRef,
    overlayRef,
    isRecording,
    startRecording,
    stopRecording,
    captureOverlay,
    saveToGallery,
  };
}
