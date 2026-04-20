import { BallFrame, HitMetrics, PoseFrame } from "../types/hit";
import { HitMathEngine } from "./HitMathEngine";

export enum HitState {
  Idle = "Idle",
  PreSwing = "PreSwing",
  Acceleration = "Acceleration",
  Contact = "Contact",
  FollowThrough = "FollowThrough",
  Reset = "Reset",
}

export class HitDetector {
  private poseFrames: PoseFrame[] = [];
  private ballFrames: BallFrame[] = [];
  private state: HitState = HitState.Idle;
  private lastHitMetrics: HitMetrics | null = null;
  private math = new HitMathEngine();

  addPoseFrame(frame: PoseFrame) {
    this.poseFrames.push(frame);
    this.process();
  }

  addBallFrame(frame: BallFrame) {
    this.ballFrames.push(frame);
  }

  getLastHitMetrics() {
    return this.lastHitMetrics;
  }

  reset() {
    this.poseFrames = [];
    this.ballFrames = [];
    this.state = HitState.Idle;
    this.lastHitMetrics = null;
  }

  private process() {
    if (this.poseFrames.length < 5) return;

    const phase = this.math.estimatePhase(this.poseFrames);

    switch (this.state) {
      case HitState.Idle:
        if (phase === "preSwing") this.state = HitState.PreSwing;
        break;
      case HitState.PreSwing:
        if (phase === "acceleration") this.state = HitState.Acceleration;
        break;
      case HitState.Acceleration:
        if (phase === "contact") this.state = HitState.Contact;
        break;
      case HitState.Contact:
        this.lastHitMetrics = this.math.computeMetrics({
          poseFrames: this.poseFrames,
          ballFrames: this.ballFrames,
        });
        this.state = HitState.FollowThrough;
        break;
      case HitState.FollowThrough:
        if (phase === "recovery") this.state = HitState.Reset;
        break;
      case HitState.Reset:
        this.reset();
        break;
    }
  }
}


