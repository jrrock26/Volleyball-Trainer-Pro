// screens/TrainingSchedule.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { TrainingBlock } from '../training/trainingLibrary';
import { RootStackParamList } from '../types/navigationTypes';

type TrainingScheduleRoute = RouteProp<RootStackParamList, 'TrainingSchedule'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function TrainingSchedule({ navigation }: { navigation: Nav }) {
  const route = useRoute<TrainingScheduleRoute>();
  const { trainingBlocks } = route.params;

  const scrollRef = useRef<ScrollView>(null);
  const [selectedBlock, setSelectedBlock] = useState<TrainingBlock | null>(null);

  // Save modal
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [trainingName, setTrainingName] = useState('');

  const schedule = trainingBlocks;

  // ------------------------------------------------------------
  // TIMERS
  // ------------------------------------------------------------
  const initialTimers: Record<string, number> = {};
  schedule.forEach((b) => {
    if (b.category !== 'break') {
      initialTimers[b.id] = b.durationMinutes * 60;
    }
  });

  const [timers, setTimers] = useState(initialTimers);
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const playDing = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/ding.mp3')
      );
      await sound.playAsync();
    } catch {}
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };

        Object.keys(running).forEach((id) => {
          if (running[id] && updated[id] > 0) {
            updated[id]--;

            if (updated[id] === 0) {
              setRunning((r) => ({ ...r, [id]: false }));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              playDing();

              const index = schedule.findIndex((b) => b.id === id);
              const next = schedule[index + 1];

              if (next && next.category !== 'break') {
                scrollRef.current?.scrollTo({
                  y: (index + 1) * 90,
                  animated: true,
                });
              }
            }
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const totalMinutes = schedule.reduce(
    (sum, b) => sum + b.durationMinutes,
    0
  );

  const categoryCounts = schedule.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ------------------------------------------------------------
  // SAVE TRAINING (modal)
  // ------------------------------------------------------------
  const confirmSaveTraining = async () => {
    const saved = await AsyncStorage.getItem('@saved_trainings');
    const parsed = saved ? JSON.parse(saved) : [];

    const newTraining = {
      id: 'training_' + Math.random().toString(36).slice(2),
      name: trainingName || `Training ${new Date().toLocaleDateString()}`,
      createdAt: Date.now(),
      blocks: schedule,
    };

    await AsyncStorage.setItem(
      '@saved_trainings',
      JSON.stringify([...parsed, newTraining])
    );

    setTrainingName('');
    setSaveModalVisible(false);
  };

  // ------------------------------------------------------------
  // HEADER (default back + home icon)
  // ------------------------------------------------------------
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../assets/images/icon.png')}
            style={{ width: 32, height: 32, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Schedule</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLine}>
          <Text style={styles.summaryLabel}>Drills: </Text>
          {schedule.length}
        </Text>

        <Text style={styles.summaryLine}>
          <Text style={styles.summaryLabel}>Total Duration: </Text>
          {totalMinutes} min
        </Text>

        {Object.entries(categoryCounts).map(([cat, count]) => (
          <Text key={cat} style={styles.summaryLine}>
            {cat}: {count}
          </Text>
        ))}
      </View>

      <ScrollView ref={scrollRef} style={{ marginTop: 16 }}>
        {schedule.map((item) => {
          if (item.category === 'break') {
            return (
              <View key={item.id} style={styles.breakCard}>
                <Text style={styles.breakText}>
                  WATER BREAK — {item.durationMinutes} MIN
                </Text>
              </View>
            );
          }

          return (
            <View key={item.id} style={styles.blockRow}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setSelectedBlock(item)}
              >
                <Text style={styles.blockName}>{item.name}</Text>
                <Text style={styles.blockMeta}>
                  {item.durationMinutes} min • {item.category} •{' '}
                  {item.intensity.toUpperCase()}
                </Text>
              </TouchableOpacity>

              <View style={styles.timerBox}>
                <Text style={styles.timerTextPink}>
                  {formatTime(timers[item.id] || 0)}
                </Text>

                <View style={styles.timerButtons}>
                  <TouchableOpacity
                    onPress={() =>
                      setRunning((prev) => ({ ...prev, [item.id]: true }))
                    }
                    style={styles.timerBtn}
                  >
                    <Text style={styles.timerBtnText}>▶</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setRunning((prev) => ({ ...prev, [item.id]: false }))
                    }
                    style={styles.timerBtn}
                  >
                    <Text style={styles.timerBtnText}>⏸</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setTimers((prev) => ({
                        ...prev,
                        [item.id]: item.durationMinutes * 60,
                      }))
                    }
                    style={styles.timerBtn}
                  >
                    <Text style={styles.timerBtnText}>⟲</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ACTION ROW */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtnBlue}
          onPress={() => setSaveModalVisible(true)}
        >
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnBlack}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionText}>Return</Text>
        </TouchableOpacity>
      </View>

      {/* BLOCK DETAILS MODAL */}
      <Modal visible={!!selectedBlock} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedBlock && (
              <>
                <Text style={styles.modalTitle}>{selectedBlock.name}</Text>

                {selectedBlock.image && (
                  <Image
                    source={selectedBlock.image}
                    style={styles.modalImage}
                  />
                )}

                <Text style={styles.modalHeader}>Instructions</Text>
                {selectedBlock.instructions.map((line, idx) => (
                  <Text key={idx} style={styles.modalText}>
                    • {line}
                  </Text>
                ))}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedBlock(null)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* SAVE NAME MODAL */}
      <Modal visible={saveModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.nameModalBox}>
            <Text style={styles.modalTitle}>Name Your Training</Text>

            <TextInput
              style={styles.nameInput}
              placeholder="Enter training name"
              placeholderTextColor="#888"
              value={trainingName}
              onChangeText={setTrainingName}
            />

            <View style={styles.nameButtonsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setTrainingName('');
                  setSaveModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={confirmSaveTraining}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#111' },

  summaryBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F6FF',
    borderWidth: 2,
    borderColor: '#3A7AFE',
  },
  summaryLabel: { fontWeight: '700', color: '#111' },
  summaryLine: { fontSize: 14, color: '#444', marginTop: 2 },

  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3A7AFE',
    padding: 10,
    marginBottom: 10,
  },
  blockName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  blockMeta: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  timerBox: {
    alignItems: 'center',
    marginLeft: 8,
  },
  timerTextPink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF4FC3',
    marginBottom: 4,
  },
  timerButtons: {
    flexDirection: 'row',
  },
  timerBtn: {
    paddingHorizontal: 6,
  },
  timerBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },

  breakCard: {
    backgroundColor: '#FF4FC355',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FF4FC3',
  },
  breakText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF007F',
    textAlign: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
  },
  actionBtnBlue: {
    backgroundColor: '#3A7AFE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionBtnBlack: {
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  modalImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 12,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF4FC3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // Save name modal
  nameModalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  nameInput: {
    borderWidth: 2,
    borderColor: '#3A7AFE',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111',
    marginTop: 10,
  },
  nameButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: {
    color: '#111',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#3A7AFE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});






