import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Text,
    View
} from "react-native";

import Slider from "@react-native-community/slider";
import { RouteProp, useRoute } from "@react-navigation/native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { HitRecord } from "../types/hit";

type Params = { hit: HitRecord };

const JOINTS: [string, string][] = [
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
];

function buildPathFromSeries(
  series: { x: number; y: number }[],
  scaleX: (x: number) => number,
  scaleY: (y: number) => number
) {
  if (!series.length) return "";
  let d = `M ${scaleX(series[0].x)} ${scaleY(series[0].y)}`;
  for (let i = 1; i < series.length; i++) {
    d += ` L ${scaleX(series[i].x)} ${scaleY(series[i].y)}`;
  }
  return d;
}

export default function HitReplayScreen() {
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const hit = route.params.hit;

  const { width } = Dimensions.get("window");
  const height = width * (16 / 9);

  const [progress, setProgress] = useState(1);

  const frameIndex = Math.floor((hit.poseFrames.length - 1) * progress);
  const currentFrame = hit.poseFrames[frameIndex];

  const wristSeries = useMemo(
    () =>
      hit.poseFrames
        .map((f) => {
          const kp = f.keypoints.find((k) => k.name === "right_wrist");
          return kp ? { x: kp.x, y: kp.y } : null;
        })
        .filter(Boolean) as { x: number; y: number }[],
    [hit.poseFrames]
  );

  const scaleX = (x: number) => x * width;
  const scaleY = (y: number) => y * height;

  const get = (name: string) =>
    currentFrame.keypoints.find((k) => k.name === name) || null;

  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 40 }}>
      <Text
        style={{
          color: "#0ff",
          fontSize: 20,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Hit Replay
      </Text>

      <View
        style={{
          width,
          height,
          backgroundColor: "#111",
          alignSelf: "center",
        }}
      >
        <Svg width={width} height={height}>
          <Path
            d={buildPathFromSeries(wristSeries, scaleX, scaleY)}
            stroke="#ff69b4"
            strokeWidth={3}
            fill="none"
          />

          <Path
            d={`M ${width * 0.3} ${height * 0.7} Q ${width * 0.5} ${
              height * 0.3
            } ${width * 0.7} ${height * 0.5}`}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="none"
          />

          {JOINTS.map(([a, b], idx) => {
            const pa = get(a);
            const pb = get(b);
            if (!pa || !pb) return null;
            return (
              <Line
                key={idx}
                x1={scaleX(pa.x)}
                y1={scaleY(pa.y)}
                x2={scaleX(pb.x)}
                y2={scaleY(pb.y)}
                stroke="#0ff"
                strokeWidth={3}
              />
            );
          })}

          {currentFrame.keypoints.map((kp, idx) => (
            <Circle
              key={idx}
              cx={scaleX(kp.x)}
              cy={scaleY(kp.y)}
              r={3}
              fill="#0ff"
            />
          ))}
        </Svg>
      </View>

      <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
        <Slider
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onValueChange={setProgress}
        />
        <Text style={{ color: "#fff", marginTop: 8, textAlign: "center" }}>
          Scrub through the hit motion
        </Text>
      </View>
    </View>
  );
}

