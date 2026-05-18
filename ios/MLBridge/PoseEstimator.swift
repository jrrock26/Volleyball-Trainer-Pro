import UIKit
import MediaPipeTasksVision

class PoseEstimator {

    static let shared = PoseEstimator()

    private let landmarker: PoseLandmarker?

    private init() {
        // Load model safely
        guard let modelPath = Bundle.main.path(forResource: "pose_landmarker", ofType: "task") else {
            print("❌ PoseEstimator: pose_landmarker.task not found in bundle")
            landmarker = nil
            return
        }

        do {
            let options = PoseLandmarkerOptions(modelPath: modelPath)
            landmarker = try PoseLandmarker(options: options)
        } catch {
            print("❌ PoseEstimator: Failed to initialize PoseLandmarker:", error)
            landmarker = nil
        }
    }

    func estimatePose(from image: UIImage) -> PoseResult {
        guard let landmarker = landmarker else {
            print("❌ PoseEstimator: Landmarker not initialized")
            return PoseResult.empty
        }

        do {
            let result = try landmarker.detect(image: image)
            return PoseResult.from(result)
        } catch {
            print("❌ PoseEstimator: Detection failed:", error)
            return PoseResult.empty
        }
    }
}
