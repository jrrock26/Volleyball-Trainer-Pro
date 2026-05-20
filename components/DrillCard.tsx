import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DrillDefinition } from '../screens/Drills';

type Props = {
  drill: DrillDefinition;
  onClose: () => void;
  onAdd?: () => void;   // kept for compatibility, not used
  onStart?: () => void; // kept for compatibility, not used
};

export default function DrillCard({ drill, onClose }: Props) {
  return (
    <Modal transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            <Image source={drill.image} style={styles.image} resizeMode="cover" />
            <Text style={styles.title}>{drill.name}</Text>
            <Text style={styles.category}>
              {drill.category} • {drill.difficulty}
            </Text>

            <Text style={styles.sectionHeader}>Instructions</Text>
            {drill.instructions.map((line, idx) => (
              <Text key={idx} style={styles.bodyText}>
                • {line}
              </Text>
            ))}

            <Text style={styles.sectionHeader}>Steps</Text>
            {drill.steps.map((step, idx) => (
              <Text key={idx} style={styles.bodyText}>
                {idx + 1}. {step}
              </Text>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Return to Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    maxHeight: '85%',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  category: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 8 },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginTop: 10,
    marginBottom: 4,
  },
  bodyText: { fontSize: 13, color: '#333', marginBottom: 2 },
  closeBtn: {
    marginTop: 8,
    backgroundColor: '#FF4FC3',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});

