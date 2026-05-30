import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { saveHit } from "../storage/HitStorage";

type Props = {
  navigation: any;
};

export default function RecordHitScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Camera access is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current) return;

    setRecording(true);

    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: 12
      });

      if (!video) {
        setRecording(false);
        return;
      }

      setSaving(true);

      // Save to device
      const asset = await MediaLibrary.createAssetAsync(video.uri);

      // Save to app storage
      await saveHit(asset.uri);

      setSaving(false);
      setRecording(false);

      navigation.goBack();
    } catch (err) {
      console.log("Recording error:", err);
      setRecording(false);
      setSaving(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        mode="video"
      />

      <View style={styles.controls}>
        {!recording && !saving && (
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <View style={styles.recordInner} />
          </TouchableOpacity>
        )}

        {recording && (
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Text style={styles.stopText}>STOP</Text>
          </TouchableOpacity>
        )}

        {saving && (
          <View style={styles.savingBox}>
            <Text style={styles.savingText}>Saving…</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionText: { fontSize: 18, marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16 },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  recordInner: {
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: "red",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  stopText: { color: "white", fontSize: 18, fontWeight: "bold" },
  savingBox: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  savingText: { color: "white", fontSize: 16 },
});
