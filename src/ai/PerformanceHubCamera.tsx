import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

type Props = {
  onRecordingFinished?: (video: { path: string }) => void;
};

export function PerformanceHubCamera({ onRecordingFinished }: Props) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  if (!device) return null;

  async function startRecording() {
    if (!cameraRef.current) return;

    setRecording(true);

    cameraRef.current.startRecording({
      onRecordingFinished: (video: { path: string }) => {
        setRecording(false);
        onRecordingFinished?.(video);
      },
      onRecordingError: (error: any) => {
        console.error('Recording error:', error);
        setRecording(false);
      }
    });
  }

  async function stopRecording() {
    if (!cameraRef.current) return;
    await cameraRef.current.stopRecording();
    setRecording(false);
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' }
});
