import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Rect } from "react-native-svg";
import { getHits } from "../storage/HitStorage";
import { HitRecord } from "../types/hit";

export default function CourtGameScreen() {
  const [hits, setHits] = useState<HitRecord[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getHits();
      setHits(data);
    })();
  }, []);

  const width = 320;
  const height = 160;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      <Text style={{ color: "#0ff", fontSize: 24, fontWeight: "700" }}>
        Court Game
      </Text>

      <Text style={{ color: "#fff", marginTop: 8 }}>
        Land balls over the net and in bounds.
      </Text>

      <View
        style={{
          marginTop: 20,
          alignSelf: "center",
          borderWidth: 1,
          borderColor: "#444",
        }}
      >
        <Svg width={width} height={height}>
          {/* Court background */}
          <Rect x={0} y={0} width={width} height={height} fill="#123" />

          {/* Net line */}
          <Line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="#fff"
            strokeWidth={2}
          />

          {/* Court boundaries */}
          <Rect
            x={width * 0.1}
            y={height * 0.1}
            width={width * 0.8}
            height={height * 0.8}
            stroke="#0ff"
            strokeWidth={2}
            fill="none"
          />

          {/* Ball landings */}
          {hits.map((hit, idx) => {
            const { ball } = hit.metrics;
            // Interpret normalized x,y as landing point
            const x = width * (ball.distanceMeters ? 0.1 + 0.8 * Math.random() : 0.5);
            const y = height * (ball.overNet ? 0.3 : 0.7);

            const color = ball.overNet
              ? ball.inBounds
                ? "#0f0"
                : "#ff0"
              : "#f00";

            return (
              <Circle key={idx} cx={x} cy={y} r={4} fill={color} />
            );
          })}
        </Svg>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "#fff", marginBottom: 8 }}>
          Legend:
        </Text>
        <Text style={{ color: "#0f0" }}>● Over net & in bounds</Text>
        <Text style={{ color: "#ff0" }}>● Over net but out of bounds</Text>
        <Text style={{ color: "#f00" }}>● Did not clear net</Text>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#ff69b4",
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
          Play Again (Record More Hits)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
