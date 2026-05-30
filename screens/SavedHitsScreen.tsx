import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { getSavedHits, deleteHit, SavedHit } from "../storage/HitStorage";

type Props = {
  navigation: any;
};

export default function SavedHitsScreen({ navigation }: Props) {
  const [hits, setHits] = useState<SavedHit[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const data = await getSavedHits();
      setHits(data);

      const t: Record<string, string> = {};
      for (const hit of data) {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(hit.videoUri, {
            time: 500,
          });
          t[hit.id] = uri;
        } catch {}
      }
      setThumbs(t);
    };

    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: SavedHit }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("ReplayHit", { hit: item })}
    >
      <Image source={{ uri: thumbs[item.id] }} style={styles.thumb} />

      <View style={{ flex: 1 }}>
        <Text style={styles.time}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={async () => {
          await deleteHit(item.id);
          const updated = await getSavedHits();
          setHits(updated);
        }}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No saved hits yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "white" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  thumb: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  time: { fontSize: 16, fontWeight: "500" },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: { color: "white", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 40, fontSize: 18 },
});
