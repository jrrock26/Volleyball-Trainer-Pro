// screens/PerformanceHubScreen.tsx

import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getHitHistory, type SavedHit } from "../storage/HitStorage";

const screenWidth = Dimensions.get("window").width;

export default function PerformanceHubScreen() {
  const [history, setHistory] = useState<SavedHit[]>([]);

  useEffect(() => {
    async function load() {
      const hits = await getHitHistory();
      setHistory(hits);
    }
    load();
  }, []);

  const speeds = history.map((h) => h.metrics.ballSpeedMph || 0);
  const contacts = history.map((h) => h.metrics.contactHeightMeters || 0);
  const angles = history.map((h) => h.metrics.launchAngleDeg || 0);

  const avg = (arr: number[]): number =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const bestSpeed = speeds.length ? Math.max(...speeds) : 0;
  const bestAngle = angles.length ? Math.max(...angles) : 0;
  const bestContact = contacts.length ? Math.max(...contacts) : 0;

  const avgSpeed = avg(speeds);
  const avgAngle = avg(angles);
  const avgContact = avg(contacts);

  const chartConfig = {
    backgroundGradientFrom: "#000000",
    backgroundGradientTo: "#000000",
    color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
    labelColor: () => "#aaa",
    decimalPlaces: 1,
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: "#ff0080",
    },
    propsForBackgroundLines: {
      stroke: "rgba(255,255,255,0.1)",
    },
  };

  const labels = history.map((_, idx) => `${idx + 1}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Performance Hub</Text>

      {/* SUMMARY BLOCK */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Overall Summary</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Total Recorded Hits</Text>
          <Text style={styles.value}>{history.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Best Speed</Text>
          <Text style={styles.value}>
            {bestSpeed ? `${bestSpeed.toFixed(1)} mph` : "--"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Best Contact Height</Text>
          <Text style={styles.value}>
            {bestContact ? `${bestContact.toFixed(2)} m` : "--"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Best Launch Angle</Text>
          <Text style={styles.value}>
            {bestAngle ? `${bestAngle.toFixed(1)}°` : "--"}
          </Text>
        </View>
      </View>

      {/* AVERAGES BLOCK */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Averages</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Avg Speed</Text>
          <Text style={styles.value}>
            {avgSpeed ? `${avgSpeed.toFixed(1)} mph` : "--"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Avg Contact Height</Text>
          <Text style={styles.value}>
            {avgContact ? `${avgContact.toFixed(2)} m` : "--"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Avg Launch Angle</Text>
          <Text style={styles.value}>
            {avgAngle ? `${avgAngle.toFixed(1)}°` : "--"}
          </Text>
        </View>
      </View>

      {/* SPEED TREND */}
      {history.length > 1 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Speed Trend</Text>
          <LineChart
            data={{
              labels,
              datasets: [{ data: speeds }],
            }}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* CONTACT HEIGHT TREND */}
      {history.length > 1 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Contact Height Trend</Text>
          <LineChart
            data={{
              labels,
              datasets: [{ data: contacts }],
            }}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 0, 128, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* LAUNCH ANGLE TREND */}
      {history.length > 1 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Launch Angle Trend</Text>
          <LineChart
            data={{
              labels,
              datasets: [{ data: angles }],
            }}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(0, 200, 255, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* RECENT HITS */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Recent Hits</Text>

        {history.slice(0, 5).map((hit) => (
          <View key={hit.id} style={styles.hitRow}>
            <Text style={styles.hitDate}>
              {new Date(hit.timestamp).toLocaleString()}
            </Text>

            <Text style={styles.hitMetric}>
              {hit.metrics.ballSpeedMph?.toFixed(1)} mph •{" "}
              {hit.metrics.contactHeightMeters?.toFixed(2)} m •{" "}
              {hit.metrics.launchAngleDeg?.toFixed(1)}°
            </Text>
          </View>
        ))}

        {history.length === 0 && (
          <Text style={styles.emptyText}>No hits recorded yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    color: "#0ff",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0ff",
  },
  chartCard: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0ff",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#0ff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#aaa",
    fontSize: 16,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chart: {
    borderRadius: 12,
  },
  hitRow: {
    marginBottom: 12,
  },
  hitDate: {
    color: "#0ff",
    fontSize: 14,
    marginBottom: 2,
  },
  hitMetric: {
    color: "#fff",
    fontSize: 15,
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
