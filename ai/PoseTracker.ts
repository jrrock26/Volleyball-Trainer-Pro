// ai/PoseTracker.ts

export type WristPoint = {
  x: number;   // pixel or normalized
  y: number;
  t: number;   // timestamp ms
};

export type PoseTrackState = {
  wristHistory: WristPoint[];
  smoothedWrist: WristPoint[];
  lastContact: WristPoint | null;
};

export class PoseTracker {
  private state: PoseTrackState;

  constructor() {
    this.state = {
      wristHistory: [],
      smoothedWrist: [],
      lastContact: null,
    };
  }

  // ---------------------------------------
  // ADD NEW WRIST LANDMARK
  // ---------------------------------------
  addWristPoint(pt: WristPoint) {
    this.state.wristHistory.push(pt);

    // Keep last 30 frames (~6 seconds at 200ms)
    if (this.state.wristHistory.length > 30) {
      this.state.wristHistory.shift();
    }

    this.applySmoothing();
    this.detectContact();
  }

  // ---------------------------------------
  // SMOOTH WRIST PATH (moving average)
  // ---------------------------------------
  private applySmoothing() {
    const window = 3;
    const hist = this.state.wristHistory;

    if (hist.length < window) return;

    const smoothed: WristPoint[] = [];

    for (let i = 0; i < hist.length; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = hist.slice(start, i + 1);

      const avgX = slice.reduce((sum, p) => sum + p.x, 0) / slice.length;
      const avgY = slice.reduce((sum, p) => sum + p.y, 0) / slice.length;

      smoothed.push({
        x: avgX,
        y: avgY,
        t: hist[i].t,
      });
    }

    this.state.smoothedWrist = smoothed;
  }

  // ---------------------------------------
  // DETECT CONTACT MOMENT
  // ---------------------------------------
  private detectContact() {
    const s = this.state.smoothedWrist;
    if (s.length < 3) return;

    const last = s[s.length - 1];
    const prev = s[s.length - 2];

    const dx = last.x - prev.x;
    const dy = last.y - prev.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Threshold tuned for 200ms frames
    if (speed > 35) {
      this.state.lastContact = last;
    }
  }

  // ---------------------------------------
  // PUBLIC GETTERS
  // ---------------------------------------
  getSmoothedWrist() {
    return this.state.smoothedWrist;
  }

  getContact() {
    return this.state.lastContact;
  }

  getLatest() {
    return this.state.smoothedWrist[this.state.smoothedWrist.length - 1] ?? null;
  }
}
