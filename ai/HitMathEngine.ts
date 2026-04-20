import { BallFrame, BallMetrics, HitMetrics, HitTiming, PoseFrame } from "../types/hit";

type SeriesPoint = { t: number; x: number; y: number };

export class HitMathEngine {
  private getKeypointSeries(frames: PoseFrame[], name: string): SeriesPoint[] {
    return frames
      .map((f) => {
        const kp = f.keypoints.find((k) => k.name === name);
        return kp ? { t: f.t, x: kp.x, y: kp.y } : null;
      })
      .filter(Boolean) as SeriesPoint[];
  }

  computeWristVelocity(frames: PoseFrame[]) {
    const series = this.getKeypointSeries(frames, "right_wrist");
    if (series.length < 2) return 0;
    const p1 = series[series.length - 2];
    const p2 = series[series.length - 1];
    const dt = (p2.t - p1.t) / 1000;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy) / dt;
  }

  estimatePhase(frames: PoseFrame[]): "idle" | "preSwing" | "acceleration" | "contact" | "recovery" {
    const v = this.computeWristVelocity(frames);
    if (v < 0.2) return "idle";
    if (v < 0.6) return "preSwing";
    if (v < 1.2) return "acceleration";
    if (v < 0.4) return "recovery";
    return "contact";
  }

  private computePeakVelocity(frames: PoseFrame[]) {
    const series = this.getKeypointSeries(frames, "right_wrist");
    let max = 0;
    for (let i = 1; i < series.length; i++) {
      const p1 = series[i - 1];
      const p2 = series[i];
      const dt = (p2.t - p1.t) / 1000;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const v = Math.sqrt(dx * dx + dy * dy) / dt;
      if (v > max) max = v;
    }
    return max;
  }

  private computeContactHeight(frames: PoseFrame[]) {
    const series = this.getKeypointSeries(frames, "right_wrist");
    if (!series.length) return 0;
    const contact = series[series.length - 1];
    return 1 - contact.y;
  }

  private computeJumpHeight(frames: PoseFrame[]) {
    const series = this.getKeypointSeries(frames, "right_ankle");
    if (!series.length) return 0;
    const ys = series.map((p) => p.y);
    return Math.max(...ys) - Math.min(...ys);
  }

  private computeShoulderHipSeparation(frames: PoseFrame[]) {
    const shoulders = this.getKeypointSeries(frames, "right_shoulder");
    const hips = this.getKeypointSeries(frames, "right_hip");
    if (!shoulders.length || !hips.length) return 0.1;
    const s = shoulders[shoulders.length - 1];
    const h = hips[hips.length - 1];
    return Math.abs(s.x - h.x);
  }

  private computeTiming(frames: PoseFrame[]): HitTiming {
    const start = frames[0].t;
    const end = frames[frames.length - 1].t;
    const total = end - start;
    return {
      preSwingMs: total * 0.25,
      accelerationMs: total * 0.35,
      contactMs: total * 0.05,
      followThroughMs: total * 0.35,
    };
  }

  private computeConsistency(_frames: PoseFrame[]) {
    return 0.7 + Math.random() * 0.3;
  }

  private computeBallMetrics(ballFrames: BallFrame[]): BallMetrics {
    if (ballFrames.length < 2) {
      return {
        speed: 0,
        launchAngleDeg: 0,
        distanceMeters: 0,
        overNet: false,
        inBounds: true,
      };
    }
    const first = ballFrames[0];
    const last = ballFrames[ballFrames.length - 1];
    const dt = (last.t - first.t) / 1000;
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;
    const angle = (Math.atan2(-dy, dx) * 180) / Math.PI;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const netY = 0.5;
    const overNet = last.y < netY;
    const inBounds = last.x > 0.1 && last.x < 0.9 && last.y > 0.1 && last.y < 0.9;

    return {
      speed,
      launchAngleDeg: angle,
      distanceMeters: distance,
      overNet,
      inBounds,
    };
  }

  private computeTechniqueScore({
    swingSpeed,
    contactHeight,
    separation,
    ball,
  }: {
    swingSpeed: number;
    contactHeight: number;
    separation: number;
    ball: BallMetrics;
  }) {
    let score = 0;
    if (swingSpeed > 1.0) score += 25;
    if (contactHeight > 0.6) score += 25;
    if (separation > 0.1) score += 20;
    if (ball.overNet && ball.inBounds) score += 30;
    return Math.min(100, score);
  }

  computeMetrics({
    poseFrames,
    ballFrames,
  }: {
    poseFrames: PoseFrame[];
    ballFrames: BallFrame[];
  }): HitMetrics {
    const swingSpeed = this.computePeakVelocity(poseFrames);
    const contactHeight = this.computeContactHeight(poseFrames);
    const jumpHeight = this.computeJumpHeight(poseFrames);
    const shoulderHipSeparation = this.computeShoulderHipSeparation(poseFrames);
    const timing = this.computeTiming(poseFrames);
    const ball = this.computeBallMetrics(ballFrames);
    const techniqueScore = this.computeTechniqueScore({
      swingSpeed,
      contactHeight,
      separation: shoulderHipSeparation,
      ball,
    });

    return {
      swingSpeed,
      peakWristVelocity: swingSpeed,
      contactHeight,
      jumpHeight,
      shoulderHipSeparation,
      timing,
      consistencyScore: this.computeConsistency(poseFrames),
      ball,
      techniqueScore,
    };
  }
}
