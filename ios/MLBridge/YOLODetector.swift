import UIKit
import CoreML
import Vision

class YOLODetector {

  static let shared = YOLODetector()

  private let model: VNCoreMLModel

  private init() {
    let config = MLModelConfiguration()
    let mlModel = try! yolo(configuration: config).model
    model = try! VNCoreMLModel(for: mlModel)
  }

  func detectBall(in image: UIImage) -> BallResult {
    let request = VNCoreMLRequest(model: model)
    let handler = VNImageRequestHandler(cgImage: image.cgImage!)
    try? handler.perform([request])

    let detections = YOLOParser.parse(request.results)
    return BallResult(detections: detections)
  }
}
