// screens/PersonalBestsScreen.tsx

import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getHitHistory, type SavedHit } from "../storage/HitStorage";

export default function PersonalBestsScreen() {
  const [history, setHistory] = useState<SavedHit[]>([]);

  useEffect(() => {
    async function load() {
      const hits = await getHitHistory();
      setHistory(hits);
    }
    load();
  }, []);

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hits recorded yet.</Text>
      </View>
    );
  }

  // Extract metrics
  const speeds = history.map((h) => h.metrics.ballSpeedMph || 0);
  const contacts = history.map((h) => h.metrics.contactHeightMeters || 0);
  const angles = history.map((h) => h.metrics.launchAngleDeg || 0);
  const clearances = history.map((h) => h.metrics.netClearanceMeters || 0);

  // Compute bests
  const bestSpeed = Math.max(...speeds);
  const bestContact = Math.max(...contacts);
  const bestAngle = Math.max(...angles);
  const bestClearance = Math.max(...clearances);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Personal Bests</Text>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Fastest Hit</Text>
        <Text style={styles.metricValue}>{bestSpeed.toFixed(1)} mph</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Highest Contact Point</Text>
        <Text style={styles.metricValue}>{bestContact.toFixed(2)} m</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Best Launch Angle</Text>
        <Text style={styles.metricValue}>{bestAngle.toFixed(1)}°</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metricLabel}>Best Net Clearance</Text>
        <Text style={styles.metricValue}>{bestClearance.toFixed(2)} m</Text>
      </View>

      <Text style={styles.note}>
        Personal bests update automatically as you record more hits.
      </Text>
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
  card: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0ff",
    alignItems: "center",
  },
  metricLabel: {
    color: "#aaa",
    fontSize: 18,
    marginBottom: 6,
  },
  metricValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  note: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 18,
  },
});
