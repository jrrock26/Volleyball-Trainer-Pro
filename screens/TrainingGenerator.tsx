// screens/TrainingGenerator.tsx

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { TRAINING_LIBRARY, TrainingBlock } from '../training/trainingLibrary';
import { RootStackParamList } from '../types/navigationTypes';

import SimpleTimePicker from '../components/SimpleTimePicker';
import TimeSelectorRow from '../components/TimeSelectorRow';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_OPTIONS: TrainingBlock['category'][] = [
  'plyometrics',
  'agility',
  'volleyballHitting',
];

export default function TrainingGenerator() {
  const navigation = useNavigation<Nav>();

  const [sessionLengthSeconds, setSessionLengthSeconds] = useState(3600);
  const [pickerVisible, setPickerVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | TrainingBlock['category']
  >('all');

  const [includeWarmups, setIncludeWarmups] = useState(true);

  // ------------------------------------------------------------
  // GENERATE TRAINING SESSION
  // ------------------------------------------------------------
  const generateTraining = (
    durationSeconds: number,
    category: 'all' | TrainingBlock['category'],
  ): TrainingBlock[] => {
    let warmups: TrainingBlock[] = [];
    let warmupTime = 0;

    // ------------------------------------------------------------
    // 1. RANDOM 3 STRETCHING WARMUPS (optional)
    // ------------------------------------------------------------
    if (includeWarmups) {
      const stretchingBlocks = TRAINING_LIBRARY.filter(
        (b) => b.category === 'stretching',
      );

      warmups = [...stretchingBlocks]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((b) => ({
          ...b,
          id: b.name + '_' + Math.random().toString(36).slice(2),
        }));

      warmupTime = warmups.reduce((sum, b) => sum + b.durationMinutes * 60, 0);
    }

    let remainingTime = durationSeconds - warmupTime;
    if (remainingTime < 0) remainingTime = 0;

    // ------------------------------------------------------------
    // 2. FILTER BY CATEGORY (strict)
    // ------------------------------------------------------------
    const filtered = TRAINING_LIBRARY.filter(
      (b) =>
        b.category !== 'stretching' &&
        b.category !== 'conditioning' &&
        (category === 'all' || b.category === category),
    );

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    // ------------------------------------------------------------
    // 3. BUILD TRAINING SESSION
    // ------------------------------------------------------------
    const result: TrainingBlock[] = [...warmups];
    let total = warmupTime;
    let blockCount = warmups.length;

    // ⭐ Insert water break immediately after warmups
    if (includeWarmups && warmups.length === 3) {
      result.push({
        id: 'water_' + Math.random().toString(36).slice(2),
        name: 'Water Break',
        category: 'break',
        intensity: 'low',
        durationMinutes: 1,
        image: null,
        instructions: ['Hydrate and recover.'],
      });
      total += 60;
      blockCount++;
    }

    // ------------------------------------------------------------
    // 4. ADD MAIN BLOCKS + WATER BREAKS EVERY 3 BLOCKS
    // ------------------------------------------------------------
    for (const block of shuffled) {
      const blockSeconds = block.durationMinutes * 60;

      if (total + blockSeconds > durationSeconds) break;

      result.push({
        ...block,
        id: block.name + '_' + Math.random().toString(36).slice(2),
      });

      total += blockSeconds;
      blockCount++;

      if (blockCount % 3 === 0 && total + 60 <= durationSeconds) {
        result.push({
          id: 'break_' + Math.random().toString(36).slice(2),
          name: 'Water Break',
          category: 'break',
          intensity: 'low',
          durationMinutes: 1,
          image: null,
          instructions: ['Hydrate and recover.'],
        });
        total += 60;
      }
    }

    return result;
  };

  const handleGenerate = () => {
    const training = generateTraining(
      sessionLengthSeconds,
      selectedCategory,
    );

    navigation.navigate('TrainingSchedule', {
      trainingBlocks: training,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Training Generator</Text>
      <Text style={styles.subtitle}>
        Choose session length, category focus, and warm‑ups.
      </Text>

      <TimeSelectorRow
        label="Session Length"
        seconds={sessionLengthSeconds}
        onPress={() => setPickerVisible(true)}
      />

      {/* Category Selector */}
      <Text style={styles.label}>Select Category</Text>
      <View style={styles.categoryRow}>
        {['all', ...CATEGORY_OPTIONS].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(cat as any)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected,
              ]}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Warm‑Up Toggle */}
      <Text style={styles.label}>Warm‑Ups</Text>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          includeWarmups ? styles.toggleOn : styles.toggleOff,
        ]}
        onPress={() => setIncludeWarmups(!includeWarmups)}
      >
        <Text style={styles.toggleText}>
          {includeWarmups ? 'Included' : 'Excluded'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateText}>Generate Training</Text>
      </TouchableOpacity>

      <SimpleTimePicker
        visible={pickerVisible}
        initialSeconds={sessionLengthSeconds}
        onCancel={() => setPickerVisible(false)}
        onConfirm={(h, m) => {
          setSessionLengthSeconds(h * 3600 + m * 60);
          setPickerVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#111', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#444', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3A7AFE',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonSelected: { backgroundColor: '#3A7AFE' },
  categoryText: { fontSize: 14, fontWeight: '700', color: '#3A7AFE' },
  categoryTextSelected: { color: 'white' },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  toggleOn: { backgroundColor: '#3A7AFE' },
  toggleOff: { backgroundColor: '#ccc' },
  toggleText: { fontSize: 14, fontWeight: '700', color: 'white' },
  generateButton: {
    backgroundColor: '#FF4FC3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  generateText: { fontSize: 18, fontWeight: '700', color: 'white' },
});


