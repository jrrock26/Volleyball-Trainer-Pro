import { PoseFrame, PoseKeypoint } from "../types/hit";

export type PoseCallback = (frame: PoseFrame) => void;

export class PoseEngine {
  private onPose: PoseCallback;

  constructor(onPose: PoseCallback) {
    this.onPose = onPose;
  }

  // Adapt this to your pose SDK's result shape
  handleResults(results: { landmarks: any[] }) {
    const now = Date.now();

    const keypoints: PoseKeypoint[] = results.landmarks.map((kp: any) => ({
      name: kp.name,
      x: kp.x,
      y: kp.y,
      z: kp.z,
      score: kp.score,
    }));

    const frame: PoseFrame = { t: now, keypoints };
    this.onPose(frame);
  }
}

