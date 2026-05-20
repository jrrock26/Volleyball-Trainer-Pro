import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
  DRILL_LIBRARY,
  DrillDefinition,
  PracticeDrill,
  PrimaryRole,
} from './Drills';

type RootStackParamList = {
  PracticeBuilder: undefined;
  PracticeSchedule: { practiceDrills: PracticeDrill[] };
};

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeBuilder'>;

const DRILLS_BEFORE_WATER_BREAK = 3;
const WATER_BREAK_DURATION = 60;

const PracticeBuilder: React.FC<Props> = ({ navigation }) => {
  const [selectedDrills, setSelectedDrills] = useState<PracticeDrill[]>([]);
  const [expandedRole, setExpandedRole] = useState<PrimaryRole | null>(null);

  const [practiceLengthSeconds, setPracticeLengthSeconds] = useState(3600);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const totalTimeSeconds = useMemo(
    () => selectedDrills.reduce((sum, d) => sum + d.duration, 0),
    [selectedDrills],
  );

  const isPracticeFull = totalTimeSeconds >= practiceLengthSeconds;

  // ⭐ Helper: check if drill is already selected
  const isSelected = (drill: DrillDefinition) =>
    selectedDrills.some(d => d.name === drill.name);

  const handleSelectDrill = (drill: DrillDefinition) => {
    if (isPracticeFull) return;

    setSelectedDrills(prev => {
      const newDrill: PracticeDrill = {
        ...drill,
        id: `${drill.name}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,
      };

      const updated = [...prev, newDrill];

      const realCount = updated.filter(d => d.category !== 'break').length;
      const needsBreak =
        realCount > 0 && realCount % DRILLS_BEFORE_WATER_BREAK === 0;

      if (needsBreak) {
        const waterBreak: PracticeDrill = {
          id: `water-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: 'Water Break',
          duration: WATER_BREAK_DURATION,
          category: 'break',
          primaryRole: 'all',
          type: 'team',
          difficulty: 'beginner',
          image: null,
          instructions: [],
          steps: [],
        };
        return [...updated, waterBreak];
      }

      return updated;
    });
  };

  const handleOpenSchedule = () => {
    if (selectedDrills.length === 0) return;
    navigation.navigate('PracticeSchedule', { practiceDrills: selectedDrills });
  };

  const handleTimeConfirm = (hours: number, minutes: number) => {
    setPracticeLengthSeconds(hours * 3600 + minutes * 60);
    setTimePickerVisible(false);
  };

  const drillsByRole = useMemo(() => {
    const map: Record<PrimaryRole, DrillDefinition[]> = {
      all: [],
      setting: [],
      digging: [],
      spiking: [],
      serving: [],
    };

    DRILL_LIBRARY.forEach(d => {
      if (d.category === 'break') return;

      map.all.push(d);
      if (d.primaryRole !== 'all') {
        map[d.primaryRole].push(d);
      }
    });

    return map;
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.watermark}
        resizeMode="contain"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.lengthRow}
          onPress={() => setTimePickerVisible(true)}
        >
          <Text style={styles.lengthLabel}>Practice Length</Text>
          <View style={styles.lengthValueRow}>
            <Text style={styles.lengthValue}>
              {Math.round(practiceLengthSeconds / 60)} min
            </Text>
            <Ionicons name="time-outline" size={18} color="#3a7afe" />
          </View>
        </TouchableOpacity>

        <Text style={styles.timeSummary}>
          Total Time: {Math.round(totalTimeSeconds / 60)} /{' '}
          {Math.round(practiceLengthSeconds / 60)} min
        </Text>

        {Object.entries(drillsByRole).map(([role, drills]) => (
          <View key={role} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() =>
                setExpandedRole(prev =>
                  prev === role ? null : (role as PrimaryRole),
                )
              }
            >
              <Text style={styles.cardTitle}>{role.toUpperCase()}</Text>
              <Ionicons
                name={expandedRole === role ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#3a7afe"
              />
            </TouchableOpacity>

            {expandedRole === role && (
              <View style={styles.cardBody}>
                {/* ⭐ Hide selected drills */}
                {drills.filter(d => !isSelected(d)).length === 0 && (
                  <Text
                    style={{
                      color: '#888',
                      fontStyle: 'italic',
                      paddingVertical: 6,
                    }}
                  >
                    All drills selected
                  </Text>
                )}

                {drills
                  .filter(d => !isSelected(d))
                  .map((drill: DrillDefinition) => (
                    <TouchableOpacity
                      key={drill.name}
                      style={styles.drillRow}
                      onPress={() => handleSelectDrill(drill)}
                    >
                      <Text style={styles.drillName}>{drill.name}</Text>
                      <Text style={styles.drillDuration}>
                        {Math.round(drill.duration / 60)} min
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.scheduleButton,
            selectedDrills.length === 0 && styles.scheduleButtonDisabled,
          ]}
          disabled={selectedDrills.length === 0}
          onPress={handleOpenSchedule}
        >
          <Text style={styles.scheduleButtonText}>View Practice Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      <SimpleTimePicker
        visible={timePickerVisible}
        initialSeconds={practiceLengthSeconds}
        onCancel={() => setTimePickerVisible(false)}
        onConfirm={handleTimeConfirm}
      />
    </View>
  );
};

export default PracticeBuilder;

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
  drillRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drillName: { fontSize: 14, color: '#111' },
  drillDuration: { fontSize: 13, color: '#666' },
  scheduleButton: {
    backgroundColor: '#ff4fc3',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  scheduleButtonDisabled: { backgroundColor: '#bbb' },
  scheduleButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
