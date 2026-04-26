import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function PerformanceHubScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/performancehub.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.text}>Performance Hub Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
});
