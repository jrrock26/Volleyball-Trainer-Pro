import { BallFrame } from "../types/hit";

export class BallTracker {
  private frames: BallFrame[] = [];

  addDetection(frame: BallFrame) {
    this.frames.push(frame);
  }

  getFrames() {
    return this.frames;
  }

  reset() {
    this.frames = [];
  }

  computeTrajectory() {
    if (this.frames.length < 2) return null;
    const first = this.frames[0];
    const last = this.frames[this.frames.length - 1];

    const dt = (last.t - first.t) / 1000;
    const dx = last.x - first.x;
    const dy = last.y - first.y;

    const speed = Math.sqrt(dx * dx + dy * dy) / dt;
    const angle = (Math.atan2(-dy, dx) * 180) / Math.PI;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return { speed, angle, distance };
  }
}


