import Foundation
import React

@objc(MLBridge)
class MLBridge: NSObject {

  @objc(analyzeFrame:resolver:rejecter:)
  func analyzeFrame(uri: String,
                    resolver: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {

    MLProcessor.shared.processFrame(uri: uri) { result in
      switch result {
      case .success(let payload):
        resolver(payload)
      case .failure(let error):
        rejecter("ML_ERROR", error.localizedDescription, error)
      }
    }
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
