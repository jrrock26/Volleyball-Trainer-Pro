// screens/SavedTraining.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { TrainingBlock } from '../training/trainingLibrary';

type SavedTraining = {
  id: string;
  name: string;
  createdAt: number;
  blocks: TrainingBlock[];
};

type Props = {
  navigation: NavigationScreenProp<any, any>;
};

export default function SavedTrainingScreen({ navigation }: Props) {
  const [saved, setSaved] = useState<SavedTraining[]>([]);

  const loadSaved = async () => {
    const data = await AsyncStorage.getItem('@saved_trainings');
    setSaved(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const sub = navigation.addListener('willFocus', loadSaved);
    return () => {};
  }, [navigation]);

  const deleteTraining = async (id: string) => {
    Alert.alert('Delete Training', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = saved.filter((t) => t.id !== id);
          setSaved(updated);
          await AsyncStorage.setItem('@saved_trainings', JSON.stringify(updated));
        },
      },
    ]);
  };

  const loadTraining = (training: SavedTraining) => {
    navigation.navigate('TrainingSchedule', {
      trainingBlocks: training.blocks,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saved Training</Text>

      {saved.length === 0 && (
        <Text style={styles.empty}>No saved trainings yet.</Text>
      )}

      {saved.map((t) => (
        <View key={t.id} style={styles.card}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => loadTraining(t)}>
            <Text style={styles.cardTitle}>
              {t.name || `Training — ${new Date(t.createdAt).toLocaleDateString()}`}
            </Text>

            <Text style={styles.cardSub}>
              {t.blocks.length} drills • Saved {new Date(t.createdAt).toLocaleString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteTraining(t.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },

  empty: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3A7AFE',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  cardSub: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF4FC3',
    borderRadius: 8,
    marginLeft: 10,
  },

  deleteText: {
    color: 'white',
    fontWeight: '700',
  },
});
