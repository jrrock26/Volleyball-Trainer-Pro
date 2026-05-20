import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { formatTime } from '../screens/Drills';

type MiniTimerProps = {
  duration: number;
  remaining: number | null;
  isActive: boolean;
};

export default function MiniTimer({ duration, remaining, isActive }: MiniTimerProps) {
  return (
    <Text style={[styles.timer, isActive && styles.active]}>
      {formatTime(remaining ?? duration)}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: { color: '#666', fontSize: 14, marginTop: 4 },
  active: { color: '#3A7AFE', fontWeight: '700' },
});
