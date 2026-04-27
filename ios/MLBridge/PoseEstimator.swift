import UIKit
import MediaPipeTasksVision

class PoseEstimator {

  static let shared = PoseEstimator()

  private let landmarker: PoseLandmarker

  private init() {
    let modelPath = Bundle.main.path(forResource: "pose_landmarker", ofType: "task")!
    let options = PoseLandmarkerOptions(modelPath: modelPath)
    landmarker = try! PoseLandmarker(options: options)
  }

  func estimatePose(from image: UIImage) -> PoseResult {
    let result = try! landmarker.detect(image: image)
    return PoseResult.from(result)
  }
}
