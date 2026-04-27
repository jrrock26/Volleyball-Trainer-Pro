import CoreGraphics

class TrajectoryMapper {
  func mapTrajectory(from detections: [BallDetection]) -> [CGPoint] {
    TrajectoryMath.fitCurve(detections)
  }
}
