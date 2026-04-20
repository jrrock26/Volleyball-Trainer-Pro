import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { getHits } from "../storage/HitStorage";
import { HitRecord } from "../types/hit";

export default function AnalyticsScreen() {
  const [hits, setHits] = useState<HitRecord[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getHits();
      setHits(data);
    })();
  }, []);

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const swingSpeeds = hits.map((h) => h.metrics.swingSpeed);
  const contactHeights = hits.map((h) => h.metrics.contactHeight);
  const techniqueScores = hits.map((h) => h.metrics.techniqueScore);

  const drills = Array.from(new Set(hits.map((h) => h.drillType || "Unknown")));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      <Text style={{ color: "#0ff", fontSize: 24, fontWeight: "700" }}>
        Hit Analytics
      </Text>

      <Text style={{ color: "#fff", marginTop: 16 }}>Total Hits: {hits.length}</Text>

      {hits.length > 0 && (
        <>
          <Text style={{ color: "#fff", marginTop: 8 }}>
            Avg Swing Speed: {avg(swingSpeeds).toFixed(2)}
          </Text>
          <Text style={{ color: "#fff", marginTop: 8 }}>
            Avg Contact Height: {avg(contactHeights).toFixed(2)}
          </Text>
          <Text style={{ color: "#fff", marginTop: 8 }}>
            Avg Technique Score: {avg(techniqueScores).toFixed(1)} / 100
          </Text>
        </>
      )}

      {drills.map((drill) => {
        const dh = hits.filter((h) => (h.drillType || "Unknown") === drill);
        if (!dh.length) return null;
        return (
          <View key={drill} style={{ marginTop: 20 }}>
            <Text style={{ color: "#0ff", fontSize: 18, fontWeight: "700" }}>
              {drill} Drill
            </Text>
            <Text style={{ color: "#fff", marginTop: 4 }}>
              Hits: {dh.length}
            </Text>
            <Text style={{ color: "#fff", marginTop: 4 }}>
              Avg Swing Speed: {avg(dh.map((h) => h.metrics.swingSpeed)).toFixed(2)}
            </Text>
            <Text style={{ color: "#fff", marginTop: 4 }}>
              Avg Technique Score: {avg(dh.map((h) => h.metrics.techniqueScore)).toFixed(1)} / 100
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

