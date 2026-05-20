import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { RootStackParamList } from '../types/navigationTypes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Preload all images into memory on module load
const bgModule = require('../assets/images/background.png');
const btnPlayDesigner = require('../assets/images/playdesigner.png');
const btnFormations = require('../assets/images/formations.png');

Asset.fromModule(bgModule).downloadAsync();
Asset.fromModule(btnPlayDesigner).downloadAsync();
Asset.fromModule(btnFormations).downloadAsync();

const GlowButton = ({ img, onPress }: { img: any; onPress: () => void }) => {
  const anim = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  }, [anim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
  }, [anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={styles.buttonWrap}>
      <Animated.View style={[styles.buttonInner, { transform: [{ scale }] }]}>
        <Image source={img} style={styles.buttonImage} />
        <Animated.View style={[styles.glow, { opacity: anim }]} pointerEvents="none" />
      </Animated.View>
    </Pressable>
  );
};

export default function PlayHubScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <ImageBackground
      source={bgModule}
      style={styles.background}
      resizeMode="contain"
      imageStyle={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
    >
      <View style={styles.overlay}>
        <View style={styles.spacer} />

        <View style={styles.row}>
          <GlowButton
            img={btnPlayDesigner}
            onPress={() => navigation.navigate('PlayDesigner')}
          />
          <GlowButton
            img={btnFormations}
            onPress={() => navigation.navigate('Rotations')}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </View>
    </ImageBackground>
  );
}

const BUTTON_GAP = 6;
const BUTTON_H_PAD = 12;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
  },
  spacer: {
    flex: 0.72,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: BUTTON_GAP / 2,
    paddingHorizontal: BUTTON_H_PAD,
  },
  bottomSpacer: {
    flex: 0.05,
  },
  buttonWrap: {
    flex: 1,
    marginHorizontal: BUTTON_GAP / 2,
  },
  buttonInner: {
    width: '100%',
    aspectRatio: 487 / 285,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#ff44ff',
    backgroundColor: 'rgba(255, 68, 255, 0.08)',
  },
});
