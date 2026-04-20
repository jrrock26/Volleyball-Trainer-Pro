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
import { PracticeDrill } from './Drills';

type Props = {
  visible: boolean;
  drill: PracticeDrill | null;
  onClose: () => void;
};

const DrillModal: React.FC<Props> = ({ visible, drill, onClose }) => {
  if (!drill) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.watermark}
            resizeMode="contain"
          />

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{drill.name}</Text>
            <Text style={styles.duration}>
              {Math.round(drill.duration / 60)} min
            </Text>

            {drill.image && (
              <Image source={drill.image} style={styles.drillImage} />
            )}

            {drill.instructions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Instructions</Text>
                {drill.instructions.map((line, idx) => (
                  <Text key={idx} style={styles.bodyText}>
                    • {line}
                  </Text>
                ))}
              </>
            )}

            {drill.steps.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Steps</Text>
                {drill.steps.map((line, idx) => (
                  <Text key={idx} style={styles.bodyText}>
                    {idx + 1}. {line}
                  </Text>
                ))}
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DrillModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#3a7afe',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    width: 220,
    height: 220,
    opacity: 0.06,
    top: '30%',
    left: '20%',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  duration: { fontSize: 14, color: '#444', marginBottom: 10 },
 
  drillImage: {
  width: '100%',
  height: undefined,
  aspectRatio: 1,     // forces perfect square
  resizeMode: 'contain',

  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginTop: 10,
    marginBottom: 4,
  },
  bodyText: { fontSize: 14, color: '#444', marginBottom: 2 },
  closeButton: {
    backgroundColor: '#ff4fc3',
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
