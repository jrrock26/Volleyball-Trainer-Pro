  import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


type Pos = { x: number; y: number };
type Rotation = 1 | 2 | 3 | 4 | 5 | 6;

type SavedPlay = {
  id: string;   // <-- REQUIRED
  name: string;
  rotation: Rotation;
  preServe: Pos[];
  activeServe: Pos[];
  defendLeft: Pos[];
  defendMiddle: Pos[];
  defendRight: Pos[];
  updatedAt: number;
  serve?: Pos[];
};

type PlayStackParamList = {
  PlayDesigner: { loadPlayId?: string } | undefined;
  PlayLibrary: undefined;
};


type Props = NativeStackScreenProps<PlayStackParamList, 'PlayLibrary'>;

const STORAGE_KEY = 'savedPlays';

type GroupedPlays = {
  rotation: Rotation;
  plays: SavedPlay[];
};

export default function PlayLibrary({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<GroupedPlays[]>([]);

  const loadPlays = async () => {
    setLoading(true);
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const data: Record<string, SavedPlay> = JSON.parse(json);

      const plays: SavedPlay[] = Object.entries(data)
        .map(([id, play]) => ({
          ...play,
          id, // <-- guaranteed
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt);

      const grouped: Record<Rotation, SavedPlay[]> = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      };

      plays.forEach((p) => {
        grouped[p.rotation].push(p);
      });

      const result: GroupedPlays[] = (Object.keys(grouped) as unknown as Rotation[])
        .map((r) => ({
          rotation: r,
          plays: grouped[r],
        }))
        .filter((g) => g.plays.length > 0);

      setGroups(result);
    } catch (e) {
      console.warn('Error loading plays', e);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    loadPlays();
  });

  return unsubscribe;
}, [navigation]);

  const handleLoadPlay = (play: SavedPlay) => {
  navigation.replace('PlayDesigner', { loadPlayId: play.id });
};


  const handleDeletePlay = (play: SavedPlay) => {
    Alert.alert(
      'Delete Play',
      `Are you sure you want to delete "${play.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const json = await AsyncStorage.getItem(STORAGE_KEY);
              if (!json) return;

              const data: Record<string, SavedPlay> = JSON.parse(json);

              delete data[play.id]; // <-- now valid

              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              loadPlays();
            } catch (e) {
              console.warn('Error deleting play', e);
            }
          },
        },
      ]
    );
  };

  const renderPlayItem = (play: SavedPlay) => {
    const date = new Date(play.updatedAt);
    const timestamp = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return (
      <View style={styles.playRow}>
        <TouchableOpacity
          style={styles.playInfo}
          onPress={() => handleLoadPlay(play)}
        >
          <Text style={styles.playName}>{play.name}</Text>
          <Text style={styles.playMeta}>
            Rotation {play.rotation} • Last updated {timestamp}
          </Text>
        </TouchableOpacity>
       

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeletePlay(play)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGroup = ({ item }: { item: GroupedPlays }) => (
    <View style={styles.groupBox}>
      <Text style={styles.groupTitle}>Rotation {item.rotation}</Text>
      {item.plays.map((p) => (
        <View key={p.id}>{renderPlayItem(p)}</View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Play Library</Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2b6cb0" />
          <Text style={styles.loadingText}>Loading plays…</Text>
        </View>
      ) : groups.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No saved plays yet</Text>
          <Text style={styles.emptyText}>
            Build a full play in Play Builder and tap "Save Full Play" to see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(g) => `rotation-${g.rotation}`}
          renderItem={renderGroup}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
  style={styles.footerBtn}
  onPress={() => navigation.replace('PlayDesigner')}
>
  <Text style={styles.footerBtnText}>Back to Play Builder</Text>
</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', 
    paddingTop: 20, 
    paddingHorizontal: 16 },

  headerTitle: { fontSize: 22, fontWeight: '700', color: '#2b6cb0', marginBottom: 12, textAlign: 'center' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, fontSize: 15, color: '#555' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center' },
  listContent: { paddingBottom: 80 },
  groupBox: { marginBottom: 18, backgroundColor: '#f4f6f8', borderRadius: 12, padding: 10 },
  groupTitle: { fontSize: 16, fontWeight: '700', color: '#2b6cb0', marginBottom: 6 },
  playRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ddd' },
  playInfo: { flex: 1 },
  playName: { fontSize: 15, fontWeight: '700', color: '#222' },
  playMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  deleteBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#e53e3e', marginLeft: 8 },
  deleteText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footer: { position: 'absolute', bottom: 16, left: 0, right: 0, alignItems: 'center' },
  footerBtn: { backgroundColor: '#2b6cb0', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  footerBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});