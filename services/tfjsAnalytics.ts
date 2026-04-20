// services/tfjsAnalytics.ts
// TensorFlow.js-based AI analytics service for on-device ML

import * as cocoSsd from '@tensorflow-models/coco-ssd';
import type { Tensor3D } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { loadTFLiteModel } from '@tensorflow/tfjs-tflite';
import { Asset } from 'expo-asset';


interface PoseResult {
  keypoints: Array<{
    name: string;
    x: number;
    y: number;
    confidence: number;
  }>;
  angles: Record<string, number>;
  action: string;
  formScore: number;
}

interface BallResult {
  detected: boolean;
  position: { x: number; y: number } | null;
  speed: { mph: number; kmh: number } | null;
  trajectory: string | null;
  confidence: number;
}

interface AnalysisResult {
  pose: PoseResult | null;
  ball: BallResult | null;
  timestamp: number;
}

class TFJSAnalyticsService {
  private moveNetModel: any = null;
  private cocoSsdModel: any = null;
  private backendInitialized = false;
  private isInitialized = false;
  private lastBallPosition: { x: number; y: number } | null = null;
  private lastBallTimestamp: number | null = null;

  private async ensureBackend(): Promise<void> {
    if (this.backendInitialized) return;

    await tf.ready();
    await tf.setBackend('rn-webgl');
    await tf.ready();

    this.backendInitialized = true;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.ensureBackend();

      const moveNetAsset = Asset.fromModule(require('../models/movenet_lightning.tflite'));
      await moveNetAsset.downloadAsync();
      this.moveNetModel = await loadTFLiteModel(moveNetAsset.localUri || moveNetAsset.uri);

      this.cocoSsdModel = await cocoSsd.load();
      this.isInitialized = true;
      console.log('TF.js models loaded successfully');
    } catch (error) {
      console.error('Failed to load TF.js models:', error);
      throw error;
    }
  }

  async analyzeFrame(imageTensor: Tensor3D): Promise<AnalysisResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const timestamp = Date.now();

    try {
      const poseResult = await this.runPoseDetection(imageTensor);
      const ballResult = await this.runBallDetection(imageTensor, timestamp);

      return {
        pose: poseResult,
        ball: ballResult,
        timestamp,
      };
    } catch (error) {
      console.error('Frame analysis failed:', error);
      return {
        pose: null,
        ball: null,
        timestamp,
      };
    }
  }

  private async runPoseDetection(imageTensor: tf.Tensor3D): Promise<PoseResult | null> {
    if (!this.moveNetModel) return null;

    try {
      // Preprocess image for MoveNet (expects 192x192 or 256x256)
      const resized = tf.image.resizeBilinear(imageTensor, [192, 192]);
      const normalized = resized.div(255.0);

      // Add batch dimension
      const batched = normalized.expandDims(0);

      // Run inference
      const output = this.moveNetModel.predict(batched) as tf.Tensor;

      // Process MoveNet output (17 keypoints)
      const keypoints = this.processMoveNetOutput(output);

      // Calculate angles and form analysis
      const angles = this.calculateJointAngles(keypoints);
      const action = this.classifyAction(keypoints);
      const formScore = this.calculateFormScore(keypoints, angles);

      // Cleanup tensors
      tf.dispose([resized, normalized, batched, output]);

      return {
        keypoints,
        angles,
        action,
        formScore
      };
    } catch (error) {
      console.error('Pose detection failed:', error);
      return null;
    }
  }

  private async runBallDetection(imageTensor: Tensor3D, timestamp: number): Promise<BallResult | null> {
    if (!this.cocoSsdModel) return null;

    try {
      const predictions = await this.cocoSsdModel.detect(imageTensor as any);
      const ballPrediction = predictions.find((prediction: any) => {
        const className = String(prediction.class || '').toLowerCase();
        return className === 'sports ball' || className.includes('ball');
      });

      if (!ballPrediction) {
        this.lastBallPosition = null;
        this.lastBallTimestamp = null;
        return {
          detected: false,
          position: null,
          speed: null,
          trajectory: null,
          confidence: 0,
        };
      }

      const [x, y, w, h] = ballPrediction.bbox;
      const normalizedX = (x + w / 2) / imageTensor.shape[1];
      const normalizedY = (y + h / 2) / imageTensor.shape[0];
      const position = { x: normalizedX, y: normalizedY };
      const confidence = ballPrediction.score ?? 0;

      let speed = null;
      let trajectory = null;

      if (this.lastBallPosition && this.lastBallTimestamp) {
        const dt = Math.max((timestamp - this.lastBallTimestamp) / 1000, 0.001);
        const dx = position.x - this.lastBallPosition.x;
        const dy = position.y - this.lastBallPosition.y;
        const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
        speed = {
          mph: Number((velocity * 50).toFixed(1)),
          kmh: Number((velocity * 80.5).toFixed(1)),
        };
        if (Math.abs(dx) > Math.abs(dy)) {
          trajectory = dx > 0 ? 'right' : 'left';
        } else {
          trajectory = dy > 0 ? 'down' : 'up';
        }
      }

      this.lastBallPosition = position;
      this.lastBallTimestamp = timestamp;

      return {
        detected: true,
        position,
        speed,
        trajectory,
        confidence,
      };
    } catch (error) {
      console.error('Ball detection failed:', error);
      return {
        detected: false,
        position: null,
        speed: null,
        trajectory: null,
        confidence: 0,
      };
    }
  }

  private processMoveNetOutput(output: tf.Tensor): Array<{name: string, x: number, y: number, confidence: number}> {
    // MoveNet Lightning output shape: [1, 1, 17, 3] (y, x, confidence)
    const keypoints: Array<{name: string, x: number, y: number, confidence: number}> = [];

    const keypointNames = [
      'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
      'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
      'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
      'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
    ];

    const data = output.dataSync();
    for (let i = 0; i < 17; i++) {
      const y = data[i * 3];
      const x = data[i * 3 + 1];
      const confidence = data[i * 3 + 2];

      keypoints.push({
        name: keypointNames[i],
        x,
        y,
        confidence
      });
    }

    return keypoints;
  }

  private calculateJointAngles(keypoints: Array<{name: string, x: number, y: number, confidence: number}>): Record<string, number> {
    // Calculate key joint angles for volleyball form analysis
    const angles: Record<string, number> = {};

    // Elbow angle (shoulder-elbow-wrist)
    angles.right_elbow = this.calculateAngle(
      keypoints.find(k => k.name === 'right_shoulder')!,
      keypoints.find(k => k.name === 'right_elbow')!,
      keypoints.find(k => k.name === 'right_wrist')!
    );

    angles.left_elbow = this.calculateAngle(
      keypoints.find(k => k.name === 'left_shoulder')!,
      keypoints.find(k => k.name === 'left_elbow')!,
      keypoints.find(k => k.name === 'left_wrist')!
    );

    // Knee angle (hip-knee-ankle)
    angles.right_knee = this.calculateAngle(
      keypoints.find(k => k.name === 'right_hip')!,
      keypoints.find(k => k.name === 'right_knee')!,
      keypoints.find(k => k.name === 'right_ankle')!
    );

    angles.left_knee = this.calculateAngle(
      keypoints.find(k => k.name === 'left_hip')!,
      keypoints.find(k => k.name === 'left_knee')!,
      keypoints.find(k => k.name === 'left_ankle')!
    );

    return angles;
  }

  private calculateAngle(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}): number {
    // Calculate angle at p2 between points p1, p2, p3
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    const cosAngle = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  }

  private classifyAction(keypoints: Array<{name: string, x: number, y: number, confidence: number}>): string {
    // Simple action classification based on pose
    // This is a placeholder - you'd need more sophisticated logic
    const rightWrist = keypoints.find(k => k.name === 'right_wrist');
    const leftWrist = keypoints.find(k => k.name === 'left_wrist');

    if (rightWrist && rightWrist.confidence > 0.5) {
      if (rightWrist.y < 0.5) return 'overhead_hit';
      if (rightWrist.x > 0.7) return 'forearm_pass';
    }

    return 'unknown';
  }

  private calculateFormScore(keypoints: Array<{name: string, x: number, y: number, confidence: number}>, angles: Record<string, number>): number {
    // Calculate form score based on ideal volleyball positions
    let score = 0;
    let maxScore = 0;

    // Check elbow angles (ideal ~90-120 degrees for hitting)
    if (angles.right_elbow) {
      maxScore += 10;
      if (angles.right_elbow >= 90 && angles.right_elbow <= 120) score += 10;
      else if (angles.right_elbow >= 80 && angles.right_elbow <= 130) score += 7;
    }

    // Check knee bend (should be bent for power)
    if (angles.right_knee) {
      maxScore += 10;
      if (angles.right_knee < 150) score += 10; // More bent = better
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }

  dispose(): void {
    if (this.moveNetModel) {
      this.moveNetModel.dispose();
    }
    this.isInitialized = false;
  }
}

// Singleton instance
export const tfjsAnalytics = new TFJSAnalyticsService();

function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  throw new Error('Base64 decoding not available. Use atob in browser environment.');
}

export async function imageBase64ToTensor(imageBase64: string): Promise<tf.Tensor3D> {
  const imageData = base64ToUint8Array(imageBase64);
  return decodeJpeg(imageData, 3) as tf.Tensor3D;
}
