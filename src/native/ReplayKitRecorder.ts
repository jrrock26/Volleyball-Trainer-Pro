import { NativeEventEmitter, NativeModules } from 'react-native';

const { ReplayKitRecorder } = NativeModules;

const emitter = new NativeEventEmitter(ReplayKitRecorder);

export function startRecording() {
  return ReplayKitRecorder.startRecording();
}

export function stopRecording() {
  return ReplayKitRecorder.stopRecording();
}

export function onRecordingFinished(callback: (file: string) => void) {
  return emitter.addListener('onRecordingFinished', (event) => {
    callback(event.file);
  });
}
