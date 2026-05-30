import { BallBox } from "./Types";

export async function detectBall(_frame: any): Promise<BallBox | null> {
  return {
    x: 0.4,
    y: 0.3,
    width: 0.1,
    height: 0.1,
    confidence: 0.85,
  };
}
