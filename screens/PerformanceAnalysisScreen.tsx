import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PerformanceAnalysisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Performance Analysis</Text>
      <Text style={styles.sub}>Detailed hit metrics coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
  },
  sub: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
});
