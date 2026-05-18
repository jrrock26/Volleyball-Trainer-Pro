import UIKit
import CoreML
import Vision

class YOLODetector {

    static let shared = YOLODetector()

    private let model: VNCoreMLModel

    private init() {
        let config = MLModelConfiguration()
        config.computeUnits = .all

        // IMPORTANT: Your generated CoreML class name is literally "model"
        let coreMLModel = try! model(configuration: config).model

        self.model = try! VNCoreMLModel(for: coreMLModel)
    }

    func detectBall(in image: UIImage) -> BallResult {
        let request = VNCoreMLRequest(model: model)
        request.imageCropAndScaleOption = .scaleFill

        let handler = VNImageRequestHandler(cgImage: image.cgImage!, orientation: .up)
        try? handler.perform([request])

        let detections = YOLOParser.parse(request.results)
        return BallResult(detections: detections)
    }
}
