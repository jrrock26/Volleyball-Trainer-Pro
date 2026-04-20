// screens/SavedHitsScreen.tsx

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { deleteHit, getHitHistory, type SavedHit } from "../storage/HitStorage";

export default function SavedHitsScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState<SavedHit[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const hits = await getHitHistory();
    setHistory(hits);
  }

  async function handleDelete(id: string) {
    await deleteHit(id);
    load();
  }

  const renderButton = (label: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Saved Hits</Text>

      {history.length === 0 && (
        <Text style={styles.emptyText}>No saved hits yet.</Text>
      )}

      {history.map((hit) => (
        <View key={hit.id} style={styles.hitCard}>
          <Text style={styles.hitDate}>
            {new Date(hit.timestamp).toLocaleString()}
          </Text>

          <Text style={styles.hitMetric}>
            Speed: {hit.metrics.ballSpeedMph?.toFixed(1)} mph
          </Text>
          <Text style={styles.hitMetric}>
            Contact Height: {hit.metrics.contactHeightMeters?.toFixed(2)} m
          </Text>
          <Text style={styles.hitMetric}>
            Launch Angle: {hit.metrics.launchAngleDeg?.toFixed(1)}°
          </Text>

          <View style={styles.row}>
            {renderButton("Delete", () => handleDelete(hit.id))}
            {renderButton("Analyze", () =>
              navigation.navigate("PerformanceHub" as never)
            )}
          </View>
        </View>
      ))}
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
    textShadowColor: "#ff0080",
    textShadowRadius: 12,
  },

  hitCard: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#0ff",
  },

  hitDate: {
    color: "#0ff",
    fontSize: 16,
    marginBottom: 8,
  },

  hitMetric: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  buttonWrapper: {
    width: 140,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0ff",
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
});
