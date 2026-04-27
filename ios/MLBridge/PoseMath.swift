import CoreGraphics

class PoseMath {

  static func isHit(_ poses: [Pose]) -> Bool {
    // Placeholder heuristic
    return !poses.isEmpty
  }

  static func swingSpeed(_ poses: [Pose]) -> Double {
    // Placeholder: compute speed from wrist/hand movement over time
    return 0.0
  }

  static func serialize(_ poses: [Pose]) -> [[String: Any]] {
    poses.map { pose in
      [
        "timestamp": pose.timestamp,
        "keypoints": pose.keypoints.map { ["x": $0.x, "y": $0.y] }
      ]
    }
  }
}
