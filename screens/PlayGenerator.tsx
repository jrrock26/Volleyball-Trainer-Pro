// screens/PlayGenerator.tsx

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

import { RootStackParamList } from '../types/navigationTypes';
import { DRILL_LIBRARY, PracticeDrill } from './Drills';

import SimpleTimePicker from '../components/SimpleTimePicker';
import TimeSelectorRow from '../components/TimeSelectorRow';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PlayGenerator() {
  const navigation = useNavigation<Nav>();

  // ⭐ Unified time system (seconds)
  const [sessionLengthSeconds, setSessionLengthSeconds] = useState(3600);
  const [pickerVisible, setPickerVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState<
    'all' | 'spiking' | 'serving' | 'digging' | 'setting'
  >('all');

  const [includeWarmups, setIncludeWarmups] = useState(true);

  // ------------------------------------------------------------
  // GENERATE PRACTICE (warmups + role filter + water breaks)
  // ------------------------------------------------------------
  const generateRandomPractice = (
    durationSeconds: number,
    role: 'all' | 'spiking' | 'serving' | 'digging' | 'setting',
  ): PracticeDrill[] => {
    // ------------------------------------------------------------
    // 1. HANDLE WARMUPS (optional)
    // ------------------------------------------------------------
    let warmups: PracticeDrill[] = [];
    let warmupTime = 0;

    if (includeWarmups) {
      warmups = DRILL_LIBRARY
        .filter((d) => d.category === 'warmup')
        .slice(0, 3)
        .map((d) => ({
          ...d,
          id: d.name + '_' + Math.random().toString(36).slice(2),
        }));

      warmupTime = warmups.reduce((sum, d) => sum + d.duration, 0);
    }

    let remainingTime = durationSeconds - warmupTime;
    if (remainingTime < 0) remainingTime = 0;

    // ------------------------------------------------------------
    // 2. FILTER DRILLS BY ROLE (excluding warmups)
    // ------------------------------------------------------------
    const filtered = DRILL_LIBRARY.filter(
      (d) =>
        d.category !== 'warmup' &&
        (role === 'all' || d.primaryRole === role),
    );

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    // ------------------------------------------------------------
    // 3. BUILD PRACTICE
    // ------------------------------------------------------------
    const result: PracticeDrill[] = [...warmups];
    let total = warmupTime;
    let drillCount = warmups.length;

    // ⭐ Insert water break immediately after warm-ups
    if (includeWarmups && warmups.length === 3) {
      const warmupBreak: PracticeDrill = {
        id: 'water_' + Math.random().toString(36).slice(2),
        name: 'Water Break',
        category: 'break',
        type: 'team',
        difficulty: 'beginner',
        duration: 60,
        primaryRole: 'all',
        image: null,
        instructions: [],
        steps: [],
      };

      result.push(warmupBreak);
      total += 60;
    }

    // ------------------------------------------------------------
    // 4. ADD REMAINING DRILLS + WATER BREAKS EVERY 3 DRILLS
    // ------------------------------------------------------------
    for (const drill of shuffled) {
      if (total + drill.duration > durationSeconds) break;

      result.push({
        ...drill,
        id: drill.name + '_' + Math.random().toString(36).slice(2),
      });

      total += drill.duration;
      drillCount++;

      // Insert water break every 3 drills (warmups count)
      if (drillCount % 3 === 0 && total + 60 <= durationSeconds) {
        result.push({
          id: 'break_' + Math.random().toString(36).slice(2),
          name: 'Water Break',
          category: 'break',
          type: 'team',
          difficulty: 'beginner',
          duration: 60,
          primaryRole: 'all',
          image: null,
          instructions: [],
          steps: [],
        });
        total += 60;
      }
    }

    return result;
  };

  const handleGenerate = () => {
    const practice = generateRandomPractice(
      sessionLengthSeconds,
      selectedRole,
    );

    navigation.navigate('PracticeSchedule', {
      practiceDrills: practice,
    });
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Practice Generator</Text>
      <Text style={styles.subtitle}>
        Choose session length, role focus, and warm‑ups.
      </Text>

      {/* ⭐ Unified Session Length Selector */}
      <TimeSelectorRow
        label="Session Length"
        seconds={sessionLengthSeconds}
        onPress={() => setPickerVisible(true)}
      />

      {/* Role Selector */}
      <Text style={styles.label}>Select Role</Text>
      <View style={styles.roleRow}>
        {['all', 'spiking', 'serving', 'digging', 'setting'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleButton,
              selectedRole === role && styles.roleButtonSelected,
            ]}
            onPress={() => setSelectedRole(role as any)}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === role && styles.roleTextSelected,
              ]}
            >
              {role.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Warm-Up Toggle */}
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

      {/* Generate Button */}
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateText}>Generate Practice</Text>
      </TouchableOpacity>

      {/* ⭐ Time Picker Modal */}
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

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: '#444',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
    marginTop: 10,
  },

  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3A7AFE',
    marginRight: 10,
    marginBottom: 10,
  },

  roleButtonSelected: {
    backgroundColor: '#3A7AFE',
  },

  roleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A7AFE',
  },

  roleTextSelected: {
    color: 'white',
  },

  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  toggleOn: {
    backgroundColor: '#3A7AFE',
  },

  toggleOff: {
    backgroundColor: '#ccc',
  },

  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },

  generateButton: {
    backgroundColor: '#FF4FC3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  generateText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});



