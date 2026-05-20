// screens/TrainingCardModal.tsx

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
import { TrainingBlock } from '../training/trainingLibrary';

type Props = {
  visible: boolean;
  block: TrainingBlock | null;
  onClose: () => void;
};

export default function TrainingCardModal({ visible, block, onClose }: Props) {
  if (!block) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{block.name}</Text>

            <Image source={block.image} style={styles.image} />

            <Text style={styles.meta}>
              {block.category.toUpperCase()} • {block.durationMinutes} min •{' '}
              {block.intensity.toUpperCase()}
            </Text>

            <Text style={styles.header}>Instructions</Text>
            {block.instructions.map((line, idx) => (
              <Text key={idx} style={styles.text}>
                • {line}
              </Text>
            ))}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
    textAlign: 'center',
  },
  meta: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
    color: '#111',
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 8,
  },
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#3A7AFE',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

