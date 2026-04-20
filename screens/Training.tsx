// screens/Training.tsx

import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TRAINING_LIBRARY, TrainingBlock } from '../training/trainingLibrary';
import TrainingCardModal from './TrainingCardModal';

export default function Training() {
  const [selectedBlock, setSelectedBlock] = useState<TrainingBlock | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Library</Text>
      <Text style={styles.subtitle}>
        Stretching, plyometrics, agility, strength, and volleyball-specific work.
      </Text>

      <FlatList
        data={TRAINING_LIBRARY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => setSelectedBlock(item)}
          >
            <Text style={styles.listName}>{item.name}</Text>
            <Text style={styles.listCategory}>{item.category}</Text>
            <Text style={styles.listMeta}>
              {item.durationMinutes} min • {item.intensity.toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TrainingCardModal
        visible={!!selectedBlock}
        block={selectedBlock}
        onClose={() => setSelectedBlock(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6, color: '#111' },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 16 },
  listItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  listName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  listCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  listMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
