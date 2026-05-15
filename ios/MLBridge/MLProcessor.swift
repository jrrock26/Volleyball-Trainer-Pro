import Foundation
import UIKit

class MLProcessor {

  static let shared = MLProcessor()

  private let poseEstimator = PoseEstimator.shared
  private let yoloDetector = YOLODetector.shared
  private let hitDetector = HitDetector()
  private let speedEstimator = SpeedEstimator()
  private let trajectoryMapper = TrajectoryMapper()
  private let frameExtractor = FrameExtractor()

  enum MLError: Error {
    case invalidURI
    case imageLoadFailed
  }

  func processFrame(uri: String,
                    completion: @escaping (Result<[String: Any], Error>) -> Void) {

    DispatchQueue.global(qos: .userInitiated).async {

      // Load image
      guard let url = URL(string: uri) else {
        completion(.failure(MLError.invalidURI))
        return
      }

      guard let image = UIImage(contentsOfFile: url.path) else {
        completion(.failure(MLError.imageLoadFailed))
        return
      }

      // Pose estimation (SAFE)
      let poseResult: PoseResult
      do {
        poseResult = try self.poseEstimator.estimatePose(from: image)
      } catch {
        completion(.failure(error))
        return
      }

      // Ball detection (CoreML, safe)
      let ballResult = self.yoloDetector.detectBall(in: image)

      // Derived analytics
      let poses = poseResult.poses
      let detections = ballResult.detections

      let hit = self.hitDetector.detectHit(from: poses)
      let speed = self.speedEstimator.estimateSpeed(from: poses)
      let trajectory = self.trajectoryMapper.mapTrajectory(from: detections)

      let payload: [String: Any] = [
        "poses": PoseMath.serialize(poses),
        "ballDetections": TrajectoryMath.serializeDetections(detections),
        "hitDetected": hit,
        "swingSpeed": speed,
        "trajectory": TrajectoryMath.serializePoints(trajectory)
      ]

      completion(.success(payload))
    }
  }
}
