// screens/TrainingBuilder.tsx

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SimpleTimePicker from '../components/SimpleTimePicker';
import {
  TRAINING_LIBRARY,
  TrainingBlock
} from '../training/trainingLibrary';
import { RootStackParamList } from '../types/navigationTypes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DRILLS_BEFORE_WATER_BREAK = 3;

const createWaterBreak = (): TrainingBlock => ({
  id: `water-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: 'Water Break',
  durationMinutes: 1,
  category: 'break',
  intensity: 'low',
  image: null,
  instructions: [],
});

export default function TrainingBuilder() {
  const navigation = useNavigation<Nav>();

  const [selectedBlocks, setSelectedBlocks] = useState<TrainingBlock[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [sessionLengthSeconds, setSessionLengthSeconds] = useState(3600);
  const [pickerVisible, setPickerVisible] = useState(false);

  // ⭐ CATEGORY FILTER (simple, no library)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalTimeSeconds = useMemo(
    () => selectedBlocks.reduce((sum, d) => sum + d.durationMinutes * 60, 0),
    [selectedBlocks]
  );

  const isSessionFull = totalTimeSeconds >= sessionLengthSeconds;

  const isSelected = (block: TrainingBlock) =>
    selectedBlocks.some((b) => b.id === block.id);

  const handleSelectBlock = (block: TrainingBlock) => {
    if (isSessionFull) return;

    setSelectedBlocks((prev) => {
      const updated = [...prev, block];

      const realCount = updated.filter((b) => b.category !== 'break').length;

      const needsBreak =
        realCount > 0 && realCount % DRILLS_BEFORE_WATER_BREAK === 0;

      if (needsBreak) {
        return [...updated, createWaterBreak()];
      }

      return updated;
    });
  };

  const handleStartSchedule = () => {
    if (selectedBlocks.length === 0) return;
    navigation.navigate('TrainingSchedule', { trainingBlocks: selectedBlocks });
  };

  const handleTimeConfirm = (hours: number, minutes: number) => {
    setSessionLengthSeconds(hours * 3600 + minutes * 60);
    setPickerVisible(false);
  };

  // ⭐ GROUP BLOCKS BY CATEGORY (Conditioning removed)
  const blocksByCategory = useMemo(() => {
    const map: Record<string, TrainingBlock[]> = {};

    TRAINING_LIBRARY.forEach((b) => {
      if (b.category.toLowerCase() === 'conditioning') return;

      if (selectedCategory !== 'all' && b.category !== selectedCategory) return;

      if (!map[b.category]) map[b.category] = [];
      map[b.category].push(b);
    });

    return map;
  }, [selectedCategory]);

  // ⭐ Extract category list for filter buttons
  const categoryList = useMemo(() => {
    const cats = Array.from(
      new Set(
        TRAINING_LIBRARY
          .map((b) => b.category)
          .filter((c) => c.toLowerCase() !== 'conditioning')
      )
    );
    return ['all', ...cats];
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.watermark}
        resizeMode="contain"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SESSION LENGTH */}
        <TouchableOpacity
          style={styles.lengthRow}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.lengthLabel}>Session Length</Text>
          <View style={styles.lengthValueRow}>
            <Text style={styles.lengthValue}>
              {Math.round(sessionLengthSeconds / 60)} min
            </Text>
            <Ionicons name="time-outline" size={18} color="#3a7afe" />
          </View>
        </TouchableOpacity>

        <Text style={styles.timeSummary}>
          Total Time: {Math.round(totalTimeSeconds / 60)} /{' '}
          {Math.round(sessionLengthSeconds / 60)} min
        </Text>

        {/* ⭐ CATEGORY FILTER BUTTONS */}
        <View style={styles.filterRow}>
          {categoryList.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterBtn,
                selectedCategory === cat && styles.filterBtnActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === cat && styles.filterTextActive,
                ]}
              >
                {cat.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORY ACCORDIONS */}
        {Object.entries(blocksByCategory).map(([category, blocks]) => (
          <View key={category} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() =>
                setExpandedCategory((prev) =>
                  prev === category ? null : category
                )
              }
            >
              <Text style={styles.cardTitle}>{category.toUpperCase()}</Text>
              <Ionicons
                name={
                  expandedCategory === category
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color="#3a7afe"
              />
            </TouchableOpacity>

            {expandedCategory === category && (
              <View style={styles.cardBody}>
                {blocks.filter((b) => !isSelected(b)).length === 0 && (
                  <Text style={styles.allSelectedText}>
                    All drills selected
                  </Text>
                )}

                {blocks
                  .filter((b) => !isSelected(b))
                  .map((block) => (
                    <TouchableOpacity
                      key={block.id}
                      style={styles.drillRow}
                      onPress={() => handleSelectBlock(block)}
                    >
                      <Text style={styles.drillName}>{block.name}</Text>
                      <Text style={styles.drillDuration}>
                        {block.durationMinutes} min
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        ))}

        {/* START BUTTON */}
        <TouchableOpacity
          style={[
            styles.startBtn,
            selectedBlocks.length === 0 && styles.startBtnDisabled,
          ]}
          disabled={selectedBlocks.length === 0}
          onPress={handleStartSchedule}
        >
          <Text style={styles.startText}>Start Training Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* TIME PICKER */}
      <SimpleTimePicker
        visible={pickerVisible}
        initialSeconds={sessionLengthSeconds}
        onCancel={() => setPickerVisible(false)}
        onConfirm={handleTimeConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  watermark: {
    position: 'absolute',
    width: 260,
    height: 260,
    opacity: 0.06,
    top: '30%',
    left: '20%',
  },
  scrollContent: { padding: 16 },

  lengthRow: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a7afe',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lengthLabel: { fontSize: 16, fontWeight: '600', color: '#111' },
  lengthValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lengthValue: { fontSize: 16, color: '#111' },
  timeSummary: { color: '#444', marginBottom: 12 },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a7afe',
  },
  filterBtnActive: {
    backgroundColor: '#3a7afe',
  },
  filterText: {
    color: '#3a7afe',
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#fff',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a7afe',
    marginBottom: 10,
  },
  cardHeader: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  cardBody: { paddingHorizontal: 12, paddingBottom: 12 },

  allSelectedText: {
    color: '#888',
    fontStyle: 'italic',
    paddingVertical: 6,
  },

  drillRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drillName: { fontSize: 14, color: '#111' },
  drillDuration: { fontSize: 13, color: '#666' },

  startBtn: {
    backgroundColor: '#3a7afe',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  startBtnDisabled: { backgroundColor: '#bbb' },
  startText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
