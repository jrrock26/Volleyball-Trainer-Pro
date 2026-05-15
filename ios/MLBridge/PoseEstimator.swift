import UIKit
import MediaPipeTasksVision

enum PoseEstimatorError: Error {
  case modelNotFound
  case landmarkerInitFailed(Error)
  case detectionFailed(Error)
}

final class PoseEstimator {

  static let shared = PoseEstimator()

  private var landmarker: PoseLandmarker?

  private init() {}

  private func prepareIfNeeded() throws {
    if landmarker != nil { return }

    guard let modelPath = Bundle.main.path(forResource: "pose_landmarker", ofType: "task") else {
      throw PoseEstimatorError.modelNotFound
    }

    do {
      let options = PoseLandmarkerOptions(modelPath: modelPath)
      landmarker = try PoseLandmarker(options: options)
    } catch {
      throw PoseEstimatorError.landmarkerInitFailed(error)
    }
  }

  func estimatePose(from image: UIImage) throws -> PoseResult {
    try prepareIfNeeded()

    guard let landmarker else {
      throw PoseEstimatorError.landmarkerInitFailed(NSError(domain: "PoseEstimator", code: -1))
    }

    do {
      let result = try landmarker.detect(image: image)
      return PoseResult.from(result)
    } catch {
      throw PoseEstimatorError.detectionFailed(error)
    }
  }
}
