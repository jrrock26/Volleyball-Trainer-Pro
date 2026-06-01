import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
// @ts-ignore – expo-camera types are out of sync with runtime API
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

type Props = {
  onRecordingFinished?: (video: { path: string }) => void;
};

export function PerformanceHubCamera({ onRecordingFinished }: Props) {
  const cameraRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  async function startRecording() {
    if (!cameraRef.current) return;

    setRecording(true);

    try {
      // @ts-ignore – recordAsync exists at runtime
      const video = await cameraRef.current.recordAsync({
        quality: '1080p',
      });

      setRecording(false);

      if (video?.uri) {
        await MediaLibrary.saveToLibraryAsync(video.uri);
        onRecordingFinished?.({ path: video.uri });
      }
    } catch (err) {
      console.error('Recording error:', err);
      setRecording(false);
    }
  }

  async function stopRecording() {
    if (!cameraRef.current) return;
    try {
      // @ts-ignore – stopRecording exists at runtime
      await cameraRef.current.stopRecording();
    } catch (err) {
      console.log('stopRecording error:', err);
    }
    setRecording(false);
  }

  return (
    <View style={styles.container}>
      {/* @ts-ignore – Camera is a valid JSX component at runtime */}
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        ratio="16:9"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
