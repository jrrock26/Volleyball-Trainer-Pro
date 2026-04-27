import CoreGraphics

class TrajectoryMath {

  static func fitCurve(_ detections: [BallDetection]) -> [CGPoint] {
    detections.map { $0.center }
  }

  static func serializeDetections(_ detections: [BallDetection]) -> [[String: Any]] {
    detections.map {
      [
        "x": $0.center.x,
        "y": $0.center.y,
        "confidence": $0.confidence,
        "timestamp": $0.timestamp
      ]
    }
  }

  static func serializePoints(_ points: [CGPoint]) -> [[String: Any]] {
    points.map { ["x": $0.x, "y": $0.y] }
  }
}
