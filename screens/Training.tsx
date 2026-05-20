import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// THEME
const PRIMARY = '#2b6cb0'; // volleyball blue
const ACCENT = '#ff69b4';  // pink
const BG_LIGHT = '#ffffff';

const STORAGE_KEY_HISTORY = 'training_history_clean_v1';

type Category = 'Stretch' | 'Agility' | 'Plyometric' | 'Volleyball Drill';

type Exercise = {
  id: string;
  name: string;
  category: Category;
  durationMinutes: number;
  cues: string[];
  icon: string;
};

type WorkoutItem = Exercise & { order: number };

type HistoryDay = {
  date: string;
  totalMinutes: number;
  completedIds: string[];
};

// EXERCISE LIBRARY
const EXERCISES: Exercise[] = [
  // Stretching (warmup)
  {
    id: 'stretch-hamstring',
    name: 'Seated Hamstring Stretch',
    category: 'Stretch',
    durationMinutes: 3,
    cues: ['Sit tall.', 'Reach toward toes.', 'Hold gentle tension.'],
    icon: '🧘‍♂️',
  },
  {
    id: 'stretch-hip-flexor',
    name: 'Half-Kneeling Hip Flexor',
    category: 'Stretch',
    durationMinutes: 3,
    cues: ['Kneel tall.', 'Shift hips forward.', 'Feel front hip stretch.'],
    icon: '🧘‍♀️',
  },
  {
    id: 'stretch-shoulder',
    name: 'Cross-Body Shoulder Stretch',
    category: 'Stretch',
    durationMinutes: 2,
    cues: ['Arm across chest.', 'Pull gently.', 'Relax shoulders.'],
    icon: '🤸‍♂️',
  },

  // Agility
  {
    id: 'agility-shuffle',
    name: 'Lateral Shuffle',
    category: 'Agility',
    durationMinutes: 4,
    cues: ['Stay low.', 'Shuffle side-to-side.', 'Touch markers.'],
    icon: '⚡',
  },
  {
    id: 'agility-ladder',
    name: 'Imaginary Ladder 2-In',
    category: 'Agility',
    durationMinutes: 3,
    cues: ['Quick feet.', 'Stay light.', 'Rhythm and control.'],
    icon: '🏃‍♂️',
  },

  // Plyometric
  {
    id: 'plyo-squat-jumps',
    name: 'Squat Jumps',
    category: 'Plyometric',
    durationMinutes: 4,
    cues: ['Explode upward.', 'Land soft.', 'Reset each rep.'],
    icon: '🦘',
  },
  {
    id: 'plyo-lateral-hops',
    name: 'Lateral Line Hops',
    category: 'Plyometric',
    durationMinutes: 3,
    cues: ['Hop side-to-side.', 'Quick feet.', 'Stay balanced.'],
    icon: '↔️',
  },

  // Volleyball Drills
  {
    id: 'vb-approach',
    name: '3-Step Approach Reps',
    category: 'Volleyball Drill',
    durationMinutes: 5,
    cues: ['Left-right-left.', 'Arm swing.', 'Explosive finish.'],
    icon: '🏐',
  },
  {
    id: 'vb-wall-passing',
    name: 'Wall Passing',
    category: 'Volleyball Drill',
    durationMinutes: 5,
    cues: ['Platform steady.', 'Consistent target.', 'Controlled reps.'],
    icon: '🏐',
  },
];

const TARGET_MINUTES = 45;

const TrainingScreen = () => {
  const [workout, setWorkout] = useState<WorkoutItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryDay>>({});

  // Load history
  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY_HISTORY);
      if (json) setHistory(JSON.parse(json));
    };
    load();
  }, []);

  // Timer
  useEffect(() => {
    if (!activeId || remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeId, remainingSeconds]);

  // Auto-complete
  useEffect(() => {
    if (remainingSeconds === 0 && activeId) {
      setCompletedIds((prev) =>
        prev.includes(activeId) ? prev : [...prev, activeId]
      );
      setActiveId(null);
    }
  }, [remainingSeconds, activeId]);

  // Save history when complete
  useEffect(() => {
    if (workout.length > 0 && completedIds.length === workout.length) {
      saveHistory();
    }
  }, [completedIds, workout]);

  const saveHistory = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const totalMinutes = workout.reduce((s, w) => s + w.durationMinutes, 0);

    const updated = {
      ...history,
      [today]: {
        date: today,
        totalMinutes,
        completedIds,
      },
    };

    setHistory(updated);
    await AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  };

  // Workout generator
  const generateWorkout = () => {
    const stretches = EXERCISES.filter((e) => e.category === 'Stretch');
    const others = EXERCISES.filter((e) => e.category !== 'Stretch');

    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const selected: Exercise[] = [];
    let total = 0;

    // Warmup
    for (const ex of shuffle(stretches)) {
      if (total + ex.durationMinutes > 12) break;
      selected.push(ex);
      total += ex.durationMinutes;
    }

    // Fill remaining
    for (const ex of shuffle(others)) {
      if (total >= TARGET_MINUTES) break;
      if (selected.find((s) => s.id === ex.id)) continue;
      if (total + ex.durationMinutes > TARGET_MINUTES + 5) continue;
      selected.push(ex);
      total += ex.durationMinutes;
    }

    // Guarantee 45 minutes
    while (total < TARGET_MINUTES) {
      const ex = others[Math.floor(Math.random() * others.length)];
      if (selected.find((s) => s.id === ex.id)) continue;
      selected.push(ex);
      total += ex.durationMinutes;
    }

    setWorkout(
      selected.map((ex, idx) => ({ ...ex, order: idx + 1 }))
    );
    setActiveId(null);
    setRemainingSeconds(0);
    setCompletedIds([]);
  };

  useEffect(() => {
    generateWorkout();
  }, []);

  // Weekly snapshot
  const weeklySnapshot = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { weekday: 'short' });
      days.push({ label, done: !!history[key] });
    }

    return days;
  }, [history]);

  return (
    <View style={styles.container}>
      {/* Watermark */}
      <View pointerEvents="none" style={styles.watermarkContainer}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.watermark}
        />
      </View>

      {/* Header */}
      <Text style={styles.header}>Daily Volleyball Training</Text>

      {/* Weekly Snapshot */}
      <View style={styles.weekRow}>
        {weeklySnapshot.map((d, idx) => (
          <View
            key={idx}
            style={[styles.weekDot, d.done && styles.weekDotActive]}
          >
            <Text style={[styles.weekDotLabel, d.done && styles.weekDotLabelActive]}>
              {d.label[0]}
            </Text>
          </View>
        ))}
      </View>

      {/* Regenerate */}
      <TouchableOpacity style={styles.regenButton} onPress={generateWorkout}>
        <Text style={styles.regenText}>Regenerate Workout</Text>
      </TouchableOpacity>

      {/* Workout List */}
      <FlatList
        data={workout}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => {
          const isActive = activeId === item.id;
          const isCompleted = completedIds.includes(item.id);
          const seconds = item.durationMinutes * 60;

          return (
            <View style={[styles.card, isCompleted && styles.cardCompleted]}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  setModalExercise(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.icon}>{item.icon}</Text>
              </TouchableOpacity>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                  {item.order}. {item.name}
                </Text>
                <Text style={styles.cardCategory}>{item.category}</Text>

                {item.cues.map((cue, idx) => (
                  <Text key={idx} style={styles.cue}>• {cue}</Text>
                ))}

                <View style={styles.timerRow}>
                  {isActive ? (
                    <>
                      <TouchableOpacity
                        style={styles.stopButton}
                        onPress={() => {
                          setActiveId(null);
                          setRemainingSeconds(0);
                        }}
                      >
                        <Text style={styles.stopText}>Stop</Text>
                      </TouchableOpacity>
                      <Text style={styles.timerText}>
                        {Math.floor(remainingSeconds / 60)
                          .toString()
                          .padStart(2, '0')}
                        :
                        {(remainingSeconds % 60).toString().padStart(2, '0')}
                      </Text>
                    </>
                  ) : isCompleted ? (
                    <Text style={styles.completed}>✔ Completed</Text>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => {
                          setActiveId(item.id);
                          setRemainingSeconds(seconds);
                        }}
                      >
                        <Text style={styles.startText}>Start</Text>
                      </TouchableOpacity>
                      <Text style={styles.timerText}>
                        {item.durationMinutes.toString().padStart(2, '0')}:00
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalExercise && (
              <>
                <Text style={styles.modalIcon}>{modalExercise.icon}</Text>
                <Text style={styles.modalTitle}>{modalExercise.name}</Text>
                <Text style={styles.modalCategory}>{modalExercise.category}</Text>
                {modalExercise.cues.map((cue, idx) => (
                  <Text key={idx} style={styles.modalCue}>• {cue}</Text>
                ))}
              </>
            )}

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TrainingScreen;

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
    paddingTop: 20,
  },
  watermarkContainer: {
    position: 'absolute',
    top: 140,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    opacity: 0.06,
  },
  watermark: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  weekDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  weekDotActive: {
    backgroundColor: ACCENT,
  },
  weekDotLabel: {
    color: '#555',
    fontWeight: '600',
  },
  weekDotLabelActive: {
    color: '#fff',
  },
  regenButton: {
    backgroundColor: PRIMARY,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  regenText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardCompleted: {
    opacity: 0.45,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#edf2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  cardCategory: {
    fontSize: 13,
    color: PRIMARY,
    marginBottom: 6,
  },
  cue: {
    fontSize: 13,
    color: '#555',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  startButton: {
    backgroundColor: ACCENT,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  startText: {
    color: '#fff',
    fontWeight: '700',
  },
  stopButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  stopText: {
    color: '#fff',
    fontWeight: '700',
  },
  timerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  completed: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalCategory: {
    fontSize: 14,
    color: PRIMARY,
    marginBottom: 10,
  },
  modalCue: {
    fontSize: 14,
    color: '#444',
  },
  modalClose: {
    marginTop: 16,
    backgroundColor: ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '700',
  },
});


