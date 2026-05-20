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
import { RootStackParamList } from '../types/navigationTypes';
import { PracticeDrill } from './Drills';

type SavedPractice = {
  id: string;
  name: string;              // ⭐ NEW
  createdAt: number;
  drills: PracticeDrill[];
};

export default function SavedPractices() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [saved, setSaved] = useState<SavedPractice[]>([]);

  const loadSaved = async () => {
    const data = await AsyncStorage.getItem('savedPractices');
    setSaved(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSaved);
    return unsubscribe;
  }, [navigation]);

  const deletePractice = async (id: string) => {
    Alert.alert('Delete Practice', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = saved.filter((p) => p.id !== id);
          setSaved(updated);
          await AsyncStorage.setItem('savedPractices', JSON.stringify(updated));
        },
      },
    ]);
  };

  const loadPractice = (practice: SavedPractice) => {
    navigation.navigate('PracticeSchedule', {
      practiceDrills: practice.drills,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saved Practices</Text>

      {saved.length === 0 && (
        <Text style={styles.empty}>No saved practices yet.</Text>
      )}

      {saved.map((p) => (
        <View key={p.id} style={styles.card}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => loadPractice(p)}>
            <Text style={styles.cardTitle}>
              {p.name || `Practice — ${new Date(p.createdAt).toLocaleDateString()}`}
            </Text>

            <Text style={styles.cardSub}>
              {p.drills.length} drills • Saved {new Date(p.createdAt).toLocaleString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deletePractice(p.id)}
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

