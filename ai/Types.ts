export type PoseKeypoint = {
  x: number;
  y: number;
  score: number;
};

export type PoseResult = {
  keypoints: PoseKeypoint[];
};

export type BallBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
};

export type HitMetrics = {
  hitSpeed: number;
  jumpHeight: number;
  contactHeight: number;
  approachSpeed: number;
  consistencyScore: number;
};
