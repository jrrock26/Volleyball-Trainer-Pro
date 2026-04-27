class SpeedEstimator {
  func estimateSpeed(from poses: [Pose]) -> Double {
    PoseMath.swingSpeed(poses)
  }
}
