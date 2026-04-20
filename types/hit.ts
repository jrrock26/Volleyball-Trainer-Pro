export type PoseKeypoint = {
  name: string;
  x: number;
  y: number;
  z?: number;
  score?: number;
};

export type PoseFrame = {
  t: number;
  keypoints: PoseKeypoint[];
};

export type BallFrame = {
  t: number;
  x: number;
  y: number;
  z?: number;
  confidence: number;
};

export type HitTiming = {
  preSwingMs: number;
  accelerationMs: number;
  contactMs: number;
  followThroughMs: number;
};

export type BallMetrics = {
  speed: number;
  launchAngleDeg: number;
  distanceMeters: number;
  overNet: boolean;
  inBounds: boolean;
};

export type HitMetrics = {
  swingSpeed: number;
  peakWristVelocity: number;
  contactHeight: number;
  jumpHeight: number;
  shoulderHipSeparation: number;
  timing: HitTiming;
  consistencyScore: number;
  ball: BallMetrics;
  techniqueScore: number;
};

export type HitRecord = {
  id: string;
  timestamp: number;
  drillType?: string;
  poseFrames: PoseFrame[];
  ballFrames: BallFrame[];
  metrics: HitMetrics;
  videoUri?: string;
};
