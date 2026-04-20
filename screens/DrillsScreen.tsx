// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RootStackParamList = {
  DrillsScreen: undefined;
  PracticeBuilder: undefined;
  PlayGenerator: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'DrillsScreen'>;

const DrillsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <Text style={styles.headerTitle}>Practice Hub</Text>
        <Text style={styles.headerSubtitle}>
          Build practices or generate plays instantly
        </Text>

        {/* Practice Builder Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PracticeBuilder')}
        >
          <View style={styles.cardLeft}>
            <Ionicons name="construct-outline" size={32} color="#1e88e5" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Practice Builder</Text>
              <Text style={styles.cardSubtitle}>
                Create a custom practice with drills
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#888" />
        </TouchableOpacity>

        {/* Play Generator Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PlayGenerator')}
        >
          <View style={styles.cardLeft}>
            <Ionicons name="flash-outline" size={32} color="#ff6b81" />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Play Generator</Text>
              <Text style={styles.cardSubtitle}>
                Generate a full practice automatically
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#888" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default DrillsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b10',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#cccccc',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // No shadow (your choice B)
    shadowOpacity: 0,
    elevation: 0,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111111',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
});
