import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PersonalBestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Personal Bests</Text>
      <Text style={styles.sub}>Your top performance stats</Text>
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
