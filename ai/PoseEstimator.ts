import { PoseResult } from "./Types";

export async function estimatePose(_frame: any): Promise<PoseResult> {
  // Placeholder — returns fake skeleton for now
  return {
    keypoints: Array.from({ length: 17 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      score: 0.9,
    })),
  };
}
