import Vision
import CoreGraphics

class YOLOParser {

  static func parse(_ results: [Any]?) -> [BallDetection] {
    guard let observations = results as? [VNRecognizedObjectObservation] else {
      return []
    }

    return observations.map { obs in
      let bbox = obs.boundingBox
      let center = CGPoint(x: bbox.midX, y: bbox.midY)
      let confidence = Double(obs.confidence)
      return BallDetection(center: center, confidence: confidence, timestamp: 0.0)
    }
  }
}
