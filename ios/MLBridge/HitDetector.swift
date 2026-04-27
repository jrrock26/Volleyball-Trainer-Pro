class HitDetector {
  func detectHit(from poses: [Pose]) -> Bool {
    PoseMath.isHit(poses)
  }
}
