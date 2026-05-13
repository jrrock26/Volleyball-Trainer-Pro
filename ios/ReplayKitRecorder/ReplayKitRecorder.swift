import Foundation
import ReplayKit
import Photos
import React

@objc(ReplayKitRecorder)
class ReplayKitRecorder: RCTEventEmitter, RPScreenRecorderDelegate, RPPreviewViewControllerDelegate {

  private let recorder = RPScreenRecorder.shared()
  private var isRecording = false

  // MARK: - RCTEventEmitter

  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  override func supportedEvents() -> [String]! {
    return ["onRecordingFinished", "onRecordingError"]
  }

  // MARK: - Public API (JS)

  @objc(startRecording:rejecter:)
  func startRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
    if isRecording {
      resolve("already_recording")
      return
    }

    recorder.isMicrophoneEnabled = true

    recorder.startRecording { error in
      if let error = error {
        self.sendEvent(withName: "onRecordingError", body: ["message": error.localizedDescription])
        reject("recording_error", "Failed to start recording", error)
      } else {
        self.isRecording = true
        resolve("recording_started")
      }
    }
  }

  @objc(stopRecording:rejecter:)
  func stopRecording(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    if !isRecording {
      resolve("not_recording")
      return
    }

    recorder.stopRecording { preview, error in
      self.isRecording = false

      if let error = error {
        self.sendEvent(withName: "onRecordingError", body: ["message": error.localizedDescription])
        reject("stop_error", "Failed to stop recording", error)
        return
      }

      guard let preview = preview else {
        reject("preview_error", "No preview controller returned", nil)
        return
      }

      preview.previewControllerDelegate = self

      // Present the system ReplayKit preview UI so the user can tap "Save Video"
      DispatchQueue.main.async {
        if let root = UIApplication.shared.keyWindow?.rootViewController {
          root.present(preview, animated: true, completion: nil)
        } else if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let window = scene.windows.first,
                  let rootVC = window.rootViewController {
          rootVC.present(preview, animated: true, completion: nil)
        }
      }

      // We don't get a direct file path here; the user chooses "Save Video" in the UI.
      // We still resolve to JS so you know the recording stopped.
      resolve("preview_presented")
    }
  }

  // MARK: - RPPreviewViewControllerDelegate

  func previewControllerDidFinish(_ previewController: RPPreviewViewController) {
    previewController.dismiss(animated: true, completion: nil)
    // Notify JS that the flow is done (no file path, user handled saving).
    sendEvent(withName: "onRecordingFinished", body: ["status": "closed"])
  }
}

