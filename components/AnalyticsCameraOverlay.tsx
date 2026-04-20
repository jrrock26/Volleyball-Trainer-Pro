// components/AnalyticsCameraOverlay.tsx
// Camera overlay component with real-time AI analytics

import { CameraView } from 'expo-camera';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useRealtimeAnalytics } from '../hooks/useRealtimeAnalytics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type PoseKeypoint = {
  name: string;
  x: number;
  y: number;
  confidence: number;
};

interface AnalyticsCameraOverlayProps {
  cameraRef: React.RefObject<CameraView | null>;
  onFrameAnalyzed?: (frame: any) => void;
  showAnalytics?: boolean;
  isRecording?: boolean;
}

export default function AnalyticsCameraOverlay({
  cameraRef,
  onFrameAnalyzed,
  showAnalytics = true,
  isRecording = false
}: AnalyticsCameraOverlayProps) {
  const { isInitialized, isAnalyzing, currentFrame, analyzeFrame, error } = useRealtimeAnalytics();
  const analysisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!cameraRef.current || !isInitialized || !isRecording) {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
      return;
    }

    analysisIntervalRef.current = setInterval(async () => {
      try {
        if (!cameraRef.current) return;

        // Capture frame from camera using takePictureAsync with base64 encoding
        const photo = await (cameraRef.current as any).takePictureAsync({
          base64: true,
          quality: 0.5,
        });

        if (photo?.base64) {
          const result = await analyzeFrame(photo.base64);
          if (result && onFrameAnalyzed) {
            onFrameAnalyzed(result);
          }
        }
      } catch (err) {
        console.error('Frame capture or analysis failed:', err);
      }
    }, 500);

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [cameraRef, isInitialized, isRecording, analyzeFrame, onFrameAnalyzed]);

  const renderPoseKeypoints = () => {
    if (!currentFrame?.pose?.keypoints) return null;

    const keypoints = (currentFrame.pose.keypoints as PoseKeypoint[]).filter((k: PoseKeypoint) => k.confidence > 0.5);

    return keypoints.map((keypoint: PoseKeypoint, index: number) => (
      <Circle
        key={index}
        cx={keypoint.x * SCREEN_WIDTH}
        cy={keypoint.y * SCREEN_HEIGHT}
        r="4"
        fill="red"
        opacity="0.8"
      />
    ));
  };

  const renderPoseSkeleton = () => {
    if (!currentFrame?.pose?.keypoints) return null;

    const keypoints = currentFrame.pose.keypoints;
    const connections = [
      ['nose', 'left_eye'], ['nose', 'right_eye'],
      ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
      ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'], ['right_knee', 'right_ankle'],
      ['left_shoulder', 'right_shoulder'], ['left_hip', 'right_hip']
    ];

    return connections.map(([start, end], index) => {
      const startPoint = (keypoints as PoseKeypoint[]).find((k: PoseKeypoint) => k.name === start);
      const endPoint = (keypoints as PoseKeypoint[]).find((k: PoseKeypoint) => k.name === end);

      if (!startPoint || !endPoint ||
          startPoint.confidence < 0.5 || endPoint.confidence < 0.5) {
        return null;
      }

      return (
        <Line
          key={index}
          x1={startPoint.x * SCREEN_WIDTH}
          y1={startPoint.y * SCREEN_HEIGHT}
          x2={endPoint.x * SCREEN_WIDTH}
          y2={endPoint.y * SCREEN_HEIGHT}
          stroke="blue"
          strokeWidth="2"
          opacity="0.7"
        />
      );
    });
  };

  const renderBallDetection = () => {
    if (!currentFrame?.ball?.detected || !currentFrame.ball.position) return null;

    const { position, confidence } = currentFrame.ball;

    return (
      <Circle
        cx={position.x * SCREEN_WIDTH}
        cy={position.y * SCREEN_HEIGHT}
        r="8"
        fill="yellow"
        stroke="black"
        strokeWidth="2"
        opacity={confidence}
      />
    );
  };

  const renderAnalyticsOverlay = () => {
    if (!showAnalytics) return null;

    return (
      <View style={styles.analyticsContainer}>
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            AI: {isInitialized ? 'Ready' : 'Loading...'}
          </Text>
          {isAnalyzing && <Text style={styles.analyzingText}>Analyzing...</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {currentFrame?.pose && (
          <View style={styles.metricsBar}>
            <Text style={styles.metricText}>
              Action: {currentFrame.pose.action}
            </Text>
            <Text style={styles.metricText}>
              Form: {currentFrame.pose.formScore?.toFixed(1)}%
            </Text>
          </View>
        )}

        {currentFrame?.ball?.speed && (
          <View style={styles.ballMetrics}>
            <Text style={styles.metricText}>
              Ball Speed: {currentFrame.ball.speed.mph} mph
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* SVG Overlay for keypoints and skeleton */}
      <Svg style={StyleSheet.absoluteFill}>
        {renderPoseSkeleton()}
        {renderPoseKeypoints()}
        {renderBallDetection()}
      </Svg>

      {/* Analytics UI Overlay */}
      {renderAnalyticsOverlay()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none', // Allow touches to pass through to camera
  },
  analyticsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  statusBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analyzingText: {
    color: 'yellow',
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
  metricsBar: {
    backgroundColor: 'rgba(0, 100, 255, 0.8)',
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ballMetrics: {
    backgroundColor: 'rgba(255, 255, 0, 0.8)',
    padding: 6,
    alignItems: 'center',
  },
  metricText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});