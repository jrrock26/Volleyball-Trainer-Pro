import { StyleSheet } from "react-native";
import { PoseEngine } from "../ai/PoseEngine";

// Replace this with your real pose camera component
// e.g. QuickPoseCamera, MoveNetCamera, etc.
type Props = {
  poseEngine: PoseEngine;
};

export default function PoseCameraOverlay({ poseEngine }: Props) {
  // Example shape: onResults({ landmarks: [...] })
  // Replace with your SDK's callback
  const handleResults = (results: { landmarks: any[] }) => {
    poseEngine.handleResults(results);
  };

  // TODO: swap this with your real pose camera
  // For now, it's just a placeholder view.
  return null;
}

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
});
