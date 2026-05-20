// components/TimeSelectorRow.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  label?: string;               // default: "Session Length"
  seconds: number;              // total seconds
  onPress: () => void;          // opens SimpleTimePicker
};

export default function TimeSelectorRow({
  label = 'Session Length',
  seconds,
  onPress,
}: Props) {
  const minutes = Math.round(seconds / 60);

  return (
    <TouchableOpacity style={styles.lengthRow} onPress={onPress}>
      <Text style={styles.lengthLabel}>{label}</Text>

      <View style={styles.lengthValueRow}>
        <Text style={styles.lengthValue}>{minutes} min</Text>
        <Ionicons name="time-outline" size={18} color="#3a7afe" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
