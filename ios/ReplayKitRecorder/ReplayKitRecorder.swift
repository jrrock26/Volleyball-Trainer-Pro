import Foundation
import ReplayKit
import React

@objc(ReplayKitRecorder)
class ReplayKitRecorder: RCTEventEmitter {

    private let recorder = RPScreenRecorder.shared()
    private var isRecording = false

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return ["onRecordingStarted", "onRecordingStopped", "onRecordingError"]
    }

    @objc(startRecording:)
    func startRecording(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard !isRecording else {
            resolve("already_recording")
            return
        }

        recorder.isMicrophoneEnabled = true

        recorder.startRecording { error in
            if let error = error {
                self.sendEvent(withName: "onRecordingError", body: error.localizedDescription)
                reject("recording_error", "Failed to start recording", error)
                return
            }

            self.isRecording = true
            self.sendEvent(withName: "onRecordingStarted", body: nil)
            resolve("started")
        }
    }

    @objc(stopRecording:)
    func stopRecording(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard isRecording else {
            resolve("not_recording")
            return
        }

        recorder.stopRecording { preview, error in
            self.isRecording = false

            if let error = error {
                self.sendEvent(withName: "onRecordingError", body: error.localizedDescription)
                reject("recording_error", "Failed to stop recording", error)
                return
            }

            self.sendEvent(withName: "onRecordingStopped", body: nil)

            preview?.previewControllerDelegate = self
            if let vc = RCTPresentedViewController(), let preview = preview {
                vc.present(preview, animated: true)
            }

            resolve("stopped")
        }
    }
}

extension ReplayKitRecorder: RPPreviewViewControllerDelegate {
    func previewControllerDidFinish(_ previewController: RPPreviewViewController) {
        previewController.dismiss(animated: true)
    }
}
