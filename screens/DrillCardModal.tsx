// screens/DrillCardModal.tsx

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

export default function DrillCardModal({ visible, drill, onClose }: Props) {
  if (!drill) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{drill.name}</Text>

            <Image source={drill.image} style={styles.image} />

            <Text style={styles.header}>Instructions</Text>
            {drill.instructions.map((line, idx) => (
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
    marginBottom: 12,
    color: '#111',
    textAlign: 'center',
  },

  header: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
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
    marginBottom: 10,
  },

  closeBtn: {
    marginTop: 20,
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
