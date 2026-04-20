import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BallTracker } from "../ai/BallTracker";
import { HitDetector } from "../ai/HitDetector";
import { PoseEngine } from "../ai/PoseEngine";
import AnalyticsCameraOverlay from "../components/AnalyticsCameraOverlay";
import HitSummary from "../components/HitSummary";
import { saveHit } from "../storage/HitStorage";
import { BallFrame, HitRecord } from "../types/hit";

export default function RecordHitScreen() {
  const navigation = useNavigation();

  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [lastHit, setLastHit] = useState<HitRecord | null>(null);
  const [videoUri, setVideoUri] = useState<string | undefined>(undefined);

  const cameraRef = useRef<CameraView | null>(null);
  const hitDetectorRef = useRef(new HitDetector());
  const ballTrackerRef = useRef(new BallTracker());
  const poseFramesRef = useRef<any[]>([]);

  const poseEngineRef = useRef(
    new PoseEngine((frame) => {
      poseFramesRef.current.push(frame);
      hitDetectorRef.current.addPoseFrame(frame);

      const metrics = hitDetectorRef.current.getLastHitMetrics();
      if (metrics && recording) {
        stopRecordingAndSave(metrics);
      }
    })
  );

  const startRecording = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Camera Permission Required");
        return;
      }
    }

    if (!cameraRef.current) return;

    hitDetectorRef.current.reset();
    ballTrackerRef.current.reset();
    poseFramesRef.current = [];
    setLastHit(null);
    setVideoUri(undefined);

    setRecording(true);

    const video = await cameraRef.current.recordAsync({
      maxDuration: 10,
    
    });

    if (video?.uri) {
      setVideoUri(video.uri);
    }
  };

  const stopRecordingAndSave = async (metrics: any) => {
    if (cameraRef.current) {
      try {
        cameraRef.current.stopRecording();
      } catch {}
    }

    setRecording(false);

    const hit: HitRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      drillType: "spike",
      poseFrames: poseFramesRef.current,
      ballFrames: ballTrackerRef.current.getFrames(),
      metrics,
      videoUri,
    };

    await saveHit(hit);
    setLastHit(hit);
  };

  const handleBallDetection = (ball: { x: number; y: number; confidence: number }) => {
    const frame: BallFrame = {
      t: Date.now(),
      x: ball.x,
      y: ball.y,
      confidence: ball.confidence,
    };
    ballTrackerRef.current.addDetection(frame);
    hitDetectorRef.current.addBallFrame(frame);
  };

  const handleClose = () => {
    if (recording) {
      Alert.alert(
        "Exit Recording?",
        "A hit is currently being recorded. Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", style: "destructive", onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleReplay = () => {
    if (!lastHit) return;
    // @ts-ignore
    navigation.navigate("HitReplay", { hit: lastHit });
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        mode="video"
        onCameraReady={() => console.log("Camera ready")}
      />

      {/* AI Analytics Overlay */}
      <AnalyticsCameraOverlay
        cameraRef={cameraRef}
        onFrameAnalyzed={(frame) => {
          // Integrate with existing pose/ball tracking
          if (frame.pose) {
            poseEngineRef.current.handleResults(frame.pose);
          }
          if (frame.ball) {
            handleBallDetection(frame.ball);
          }
        }}
        showAnalytics={true}
        isRecording={recording}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Hit Analyzer</Text>
        <View style={styles.statusDot} />
      </View>

      {!recording && !lastHit && (
        <View style={styles.bottomCenter}>
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Text style={styles.recordText}>Start Hit Recording</Text>
          </TouchableOpacity>
        </View>
      )}

      {recording && (
        <View style={styles.recordingBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording...</Text>
        </View>
      )}

      {lastHit && (
        <HitSummary
          hit={lastHit}
          onRecordAnother={() => {
            setLastHit(null);
            setVideoUri(undefined);
          }}
          onReplay={handleReplay}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  header: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  close: { color: "#fff", fontSize: 28, fontWeight: "700" },
  title: { color: "#0ff", fontSize: 18, fontWeight: "700" },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#0f0" },
  bottomCenter: { position: "absolute", bottom: 40, alignSelf: "center" },
  recordButton: {
    backgroundColor: "#ff69b4",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
  },
  recordText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  recordingBadge: {
    position: "absolute",
    top: 40,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#f00", marginRight: 6 },
  recordingText: { color: "#fff", fontWeight: "600" },
});
