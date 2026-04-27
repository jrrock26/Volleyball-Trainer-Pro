import CoreGraphics

struct Pose {
  let keypoints: [CGPoint]
  let timestamp: Double
}

struct PoseResult {
  let poses: [Pose]

  static func from(_ result: PoseLandmarkerResult) -> PoseResult {
    let poses = result.landmarks.map { landmarks -> Pose in
      let points = landmarks.map { CGPoint(x: CGFloat($0.x), y: CGFloat($0.y)) }
      return Pose(keypoints: points, timestamp: result.timestampMs / 1000.0)
    }
    return PoseResult(poses: poses)
  }
}

struct BallDetection {
  let center: CGPoint
  let confidence: Double
  let timestamp: Double
}

struct BallResult {
  let detections: [BallDetection]
}
