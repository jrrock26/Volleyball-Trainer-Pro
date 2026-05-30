import { BallBox } from "./Types";

export function computeTrajectory(boxes: BallBox[]) {
  return {
    velocity: 40 + Math.random() * 10,
    arcPeak: 12 + Math.random() * 4,
  };
}
