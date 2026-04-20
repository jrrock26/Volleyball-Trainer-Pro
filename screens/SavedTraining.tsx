// screens/SavedTraining.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TrainingBlock } from '../training/trainingLibrary';
import { RootStackParamList } from '../types/navigationTypes';

type SavedTraining = {
  id: string;
  name: string;
  createdAt: number;
  blocks: TrainingBlock[];
};

export default function SavedTrainingScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [saved, setSaved] = useState<SavedTraining[]>([]);

  const loadSaved = async () => {
    const data = await AsyncStorage.getItem('@saved_trainings');
    setSaved(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSaved);
    return unsubscribe;
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
              {t.blocks.length} drills • Saved{' '}
              {new Date(t.createdAt).toLocaleString()}
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







