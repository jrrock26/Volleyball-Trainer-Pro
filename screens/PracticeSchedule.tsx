import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../types/navigationTypes';
import { PracticeDrill } from './Drills';

type PracticeScheduleRoute = RouteProp<
  RootStackParamList,
  'PracticeSchedule'
>;

export default function PracticeSchedule() {
  const route = useRoute<PracticeScheduleRoute>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { practiceDrills } = route.params;

  const scrollRef = useRef<ScrollView>(null);
  const [selectedDrill, setSelectedDrill] = useState<PracticeDrill | null>(null);

  // Naming modal state
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [practiceName, setPracticeName] = useState('');

  // ------------------------------------------------------------
  // INITIALIZE TIMERS
  // ------------------------------------------------------------
  const initialTimers: Record<string, number> = {};
  practiceDrills.forEach((d) => {
    if (d.category !== 'break') {
      initialTimers[d.id] = d.duration;
    }
  });

  const [timers, setTimers] = useState<Record<string, number>>(initialTimers);
  const [running, setRunning] = useState<Record<string, boolean>>({});

  // ------------------------------------------------------------
  // SOUND CUE
  // ------------------------------------------------------------
  const playDing = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/ding.mp3')
      );
      await sound.playAsync();
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  // ------------------------------------------------------------
  // COUNTDOWN TIMER + AUTO-ADVANCE
  // ------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };

        Object.keys(running).forEach((id) => {
          if (running[id] && updated[id] > 0) {
            updated[id] = updated[id] - 1;

            if (updated[id] === 0) {
              setRunning((r) => ({ ...r, [id]: false }));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              playDing();

              const index = practiceDrills.findIndex((d) => d.id === id);
              const next = practiceDrills[index + 1];

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

  const startTimer = (id: string) => {
    setRunning((prev) => ({ ...prev, [id]: true }));
  };

  const pauseTimer = (id: string) => {
    setRunning((prev) => ({ ...prev, [id]: false }));
  };

  const resetTimer = (id: string, duration: number) => {
    setRunning((prev) => ({ ...prev, [id]: false }));
    setTimers((prev) => ({ ...prev, [id]: duration }));
  };

  // ------------------------------------------------------------
  // FORMAT MM:SS
  // ------------------------------------------------------------
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ------------------------------------------------------------
  // LIVE SUMMARY COUNTDOWN
  // ------------------------------------------------------------
  const totalSeconds = practiceDrills.reduce((sum, drill) => {
    if (drill.category === 'break') return sum;
    return sum + (timers[drill.id] ?? drill.duration);
  }, 0);

  // ------------------------------------------------------------
  // CATEGORY BREAKDOWN
  // ------------------------------------------------------------
  const categoryCounts = practiceDrills.reduce((acc, drill) => {
    if (drill.category !== 'break') {
      acc[drill.category] = (acc[drill.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // ------------------------------------------------------------
  // SAVE PRACTICE (with optional name)
  // ------------------------------------------------------------
  const finalizeSavePractice = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedPractices');
      const parsed = saved ? JSON.parse(saved) : [];

      const fallbackName = `Practice — ${new Date().toLocaleDateString()}`;
      const finalName = practiceName.trim() === '' ? fallbackName : practiceName.trim();

      const newEntry = {
        id: `practice-${Date.now()}`,
        name: finalName,
        createdAt: Date.now(),
        drills: practiceDrills,
      };

      await AsyncStorage.setItem(
        'savedPractices',
        JSON.stringify([...parsed, newEntry])
      );

      setPracticeName('');
      setNameModalVisible(false);
      alert('Practice saved successfully');
    } catch (err) {
      console.log('Save Error:', err);
    }
  };

  // ------------------------------------------------------------
  // EXPORT AS PDF
  // ------------------------------------------------------------
  const handleExportPDF = async () => {
    try {
      const html = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1>Practice Schedule</h1>
            <h3>Total Duration: ${Math.round(totalSeconds / 60)} min</h3>
            <hr />

            ${practiceDrills
              .map(
                d => `
              <div style="margin-bottom: 12px;">
                <strong>${d.name}</strong><br/>
                <span>${Math.round(d.duration / 60)} min</span><br/>
                <span>Category: ${d.category}</span>
              </div>
            `
              )
              .join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      await Share.share({
        url: uri,
        message: 'Practice Schedule PDF',
      });
    } catch (err) {
      console.log('PDF Export Error:', err);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Schedule</Text>

      {/* SUMMARY */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryLine}>
          <Text style={styles.summaryLabel}>Drills: </Text>
          {practiceDrills.filter((d) => d.category !== 'break').length}
        </Text>

        <Text style={styles.summaryLine}>
          <Text style={styles.summaryLabel}>Time Remaining: </Text>
          {formatTime(totalSeconds)}
        </Text>

        <Text style={[styles.summaryHeader, { marginTop: 10 }]}>
          Categories
        </Text>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <Text key={cat} style={styles.summaryLine}>
            {cat}: {count}
          </Text>
        ))}
      </View>

      {/* DRILL LIST */}
      <ScrollView ref={scrollRef} style={{ marginTop: 16 }}>
        {practiceDrills.map((drill) => {
          if (drill.category === 'break') {
            return (
              <View key={drill.id} style={styles.breakCard}>
                <Text style={styles.breakText}>WATER BREAK — 1 MIN</Text>
              </View>
            );
          }

          return (
            <View key={drill.id} style={styles.drillRow}>
              <TouchableOpacity
                style={{ flexDirection: 'row', flex: 1 }}
                onPress={() => setSelectedDrill(drill)}
              >
                <Image source={drill.image} style={styles.drillImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.drillName}>{drill.name}</Text>
                  <Text style={styles.drillMeta}>
                    {drill.duration / 60} min • {drill.category}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* TIMER CONTROLS */}
              <View style={styles.timerBox}>
                <Text style={styles.timerTextPink}>
                  {formatTime(timers[drill.id] || 0)}
                </Text>

                <View style={styles.timerButtons}>
                  <TouchableOpacity
                    onPress={() => startTimer(drill.id)}
                    style={styles.timerBtn}
                  >
                    <Text style={styles.timerBtnText}>▶</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => pauseTimer(drill.id)}
                    style={styles.timerBtn}
                  >
                    <Text style={styles.timerBtnText}>⏸</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => resetTimer(drill.id, drill.duration)}
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

      {/* ACTION BUTTONS — SMALL + INLINE */}
<View style={styles.actionRow}>
  <TouchableOpacity style={styles.actionBtnBlue} onPress={() => setNameModalVisible(true)}>
    <Text style={styles.actionText}>Save</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.actionBtnPink} onPress={handleExportPDF}>
    <Text style={styles.actionText}>PDF</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionBtnBlack}
    onPress={() => navigation.navigate('SavedPractices')}
  >
    <Text style={styles.actionText}>Saved</Text>
  </TouchableOpacity>
</View>


      {/* DRILL MODAL */}
      <Modal visible={!!selectedDrill} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedDrill && (
              <>
                <Text style={styles.modalTitle}>{selectedDrill.name}</Text>
                <Image
                  source={selectedDrill.image}
                  style={styles.modalImage}
                />

                <Text style={styles.modalHeader}>Instructions</Text>
                {selectedDrill.instructions.map((line, idx) => (
                  <Text key={idx} style={styles.modalText}>
                    • {line}
                  </Text>
                ))}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedDrill(null)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* NAME PRACTICE MODAL */}
      <Modal visible={nameModalVisible} transparent animationType="fade">
        <View style={styles.nameOverlay}>
          <View style={styles.nameBox}>
            <Text style={styles.nameTitle}>Name this practice</Text>

            <TextInput
              style={styles.nameInput}
              placeholder="Enter practice name…"
              placeholderTextColor="#999"
              value={practiceName}
              onChangeText={setPracticeName}
            />

            <View style={styles.nameButtons}>
              <TouchableOpacity
                style={styles.nameCancel}
                onPress={() => {
                  setPracticeName('');
                  setNameModalVisible(false);
                }}
              >
                <Text style={styles.nameCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nameSave}
                onPress={finalizeSavePractice}
              >
                <Text style={styles.nameSaveText}>Save</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
  },

  summaryBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F6FF',
    borderWidth: 2,
    borderColor: '#3A7AFE',
  },

  summaryHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  summaryLabel: {
    fontWeight: '700',
    color: '#111',
  },

  summaryLine: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },

  drillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3A7AFE',
    padding: 8,
    marginBottom: 10,
  },

  drillImage: {
    width: 55,
    height: 55,
    marginRight: 10,
    resizeMode: 'contain',
  },

  drillName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  drillMeta: {
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

  saveButton: {
    backgroundColor: '#3A7AFE',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  exportButton: {
    backgroundColor: '#FF4FC3',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },

  exportText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  viewSavedButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 40,
  },

  viewSavedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // NAME MODAL
  nameOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
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

actionBtnPink: {
  backgroundColor: '#FF4FC3',
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

  nameBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  nameTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },

   nameInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      color: '#111',
      marginBottom: 16,
    },

    nameButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
    },

    nameCancel: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      marginRight: 10,
    },

    nameCancelText: {
      fontSize: 16,
      color: '#666',
      fontWeight: '600',
    },

    nameSave: {
      backgroundColor: '#3A7AFE',
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
    },

    nameSaveText: {
      fontSize: 16,
      color: 'white',
      fontWeight: '700',
    },
});
