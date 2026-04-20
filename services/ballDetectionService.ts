// This is a placeholder for your real ball detection.
// You can call your server here or on-device model.

export type BallDetection = {
  x: number; // normalized 0–1
  y: number; // normalized 0–1
  confidence: number;
};

export async function analyzeBallFrame(_frame: any): Promise<BallDetection | null> {
  // TODO: implement real ball detection
  return null;
}
