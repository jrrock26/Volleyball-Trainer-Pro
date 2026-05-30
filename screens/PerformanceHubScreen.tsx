import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes';

export default function PerformanceHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/performancehub.png')}
        style={styles.icon}
        resizeMode="contain"
      />

      <Text style={styles.title}>Performance Hub</Text>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RecordHit')}
        >
          <Text style={styles.buttonText}>Record Live Hit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SavedHits')}
        >
          <Text style={styles.buttonText}>Saved Hits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PerformanceAnalysis')}
        >
          <Text style={styles.buttonText}>Performance Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Trends')}
        >
          <Text style={styles.buttonText}>Trends</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PersonalBests')}
        >
          <Text style={styles.buttonText}>Personal Bests</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
  },
  menu: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});
