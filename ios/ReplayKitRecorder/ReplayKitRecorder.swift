import Foundation
import ReplayKit
import Photos

@objc(ReplayKitRecorder)
class ReplayKitRecorder: RCTEventEmitter, RPScreenRecorderDelegate {

  private let recorder = RPScreenRecorder.shared()
  private var isRecording = false

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onRecordingFinished"]
  }

  @objc(startRecording:rejecter:)
  func startRecording(resolve: @escaping RCTPromiseResolveBlock,
                      reject: @escaping RCTPromiseRejectBlock) {
    guard !isRecording else {
      resolve("already_recording")
      return
    }

    recorder.isMicrophoneEnabled = true

    recorder.startRecording { error in
      if let error = error {
        reject("recording_error", "Failed to start recording", error)
      } else {
        self.isRecording = true
        resolve("recording_started")
      }
    }
  }

  @objc(stopRecording:rejecter:)
  func stopRecording(resolve: @escaping RCTPromiseResolveBlock,
                     reject: @escaping RCTPromiseRejectBlock) {
    guard isRecording else {
      resolve("not_recording")
      return
    }

    recorder.stopRecording { preview, error in
      self.isRecording = false

      if let error = error {
        reject("stop_error", "Failed to stop recording", error)
        return
      }

      guard let preview = preview else {
        reject("preview_error", "No preview controller", nil)
        return
      }

      preview.previewControllerDelegate = self
      preview.loadPreview { url in
        if let url = url {
          self.saveToCameraRoll(url: url)
          self.sendEvent(withName: "onRecordingFinished", body: ["file": url.path])
          resolve(url.path)
        } else {
          reject("export_error", "Failed to export video", nil)
        }
      }
    }
  }

  private func saveToCameraRoll(url: URL) {
    PHPhotoLibrary.shared().performChanges({
      PHAssetChangeRequest.creationRequestForAssetFromVideo(atFileURL: url)
    })
  }
}

extension RPPreviewViewController {
  func loadPreview(completion: @escaping (URL?) -> Void) {
    let temp = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("replaykit_temp.mp4")

    if FileManager.default.fileExists(atPath: temp.path) {
      try? FileManager.default.removeItem(at: temp)
    }

    self.export(to: temp) { success in
      completion(success ? temp : nil)
    }
  }

  func export(to url: URL, completion: @escaping (Bool) -> Void) {
    guard let movie = self.movieURL else {
      completion(false)
      return
    }

    do {
      try FileManager.default.copyItem(at: movie, to: url)
      completion(true)
    } catch {
      completion(false)
    }
  }
}
