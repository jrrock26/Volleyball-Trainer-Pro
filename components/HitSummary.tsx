import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { HitRecord } from "../types/hit";

type Props = {
  hit: HitRecord;
  onRecordAnother: () => void;
  onReplay: () => void;
};

export default function HitSummary({ hit, onRecordAnother, onReplay }: Props) {
  const { metrics } = hit;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.9)",
      }}
    >
      <Text style={{ color: "#0ff", fontSize: 20, fontWeight: "700" }}>
        Hit Summary
      </Text>
      <Text style={{ color: "#fff", marginTop: 8 }}>
        Technique Score: {metrics.techniqueScore.toFixed(0)} / 100
      </Text>
      <Text style={{ color: "#fff", marginTop: 4 }}>
        Swing Speed: {metrics.swingSpeed.toFixed(2)}
      </Text>
      <Text style={{ color: "#fff", marginTop: 4 }}>
        Contact Height: {metrics.contactHeight.toFixed(2)}
      </Text>
      <Text style={{ color: "#fff", marginTop: 4 }}>
        Ball Speed: {metrics.ball.speed.toFixed(2)}
      </Text>
      <Text style={{ color: "#fff", marginTop: 4 }}>
        Over Net: {metrics.ball.overNet ? "Yes" : "No"} | In Bounds:{" "}
        {metrics.ball.inBounds ? "Yes" : "No"}
      </Text>

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity
          onPress={onReplay}
          style={{
            flex: 1,
            marginRight: 8,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: "#444",
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            Replay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onRecordAnother}
          style={{
            flex: 1,
            marginLeft: 8,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: "#ff69b4",
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
            Record Another
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
