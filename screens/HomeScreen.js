import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import React, { useCallback, useRef } from "react";

import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    View,
} from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Preload background into memory on module load
const bgModule = require("../assets/images/background.png");
Asset.fromModule(bgModule).downloadAsync();

const GlowButton = ({ img, onPress }) => {
  const anim = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.buttonWrap}
    >
      <Animated.View style={[styles.buttonInner, { transform: [{ scale }] }]}>
        <Image source={img} style={styles.buttonImage} />
        <Animated.View
          style={[styles.glow, { opacity: anim }]}
          pointerEvents="none"
        />
      </Animated.View>
    </Pressable>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={bgModule}
      style={styles.background}
      resizeMode="contain"
      imageStyle={{ width: "100%", height: "100%", resizeMode: "stretch" }}
    >
      <View style={styles.overlay}>
        <View style={styles.spacer} />

        <View style={styles.gridContainer}>
          {/* ROW 1 — Play Hub + Practice Hub */}
          <View style={styles.row}>
            <GlowButton
              img={require("../assets/images/playhub.png")}
              onPress={() => navigation.navigate("PlayHub")}
            />
            <GlowButton
              img={require("../assets/images/practicehub.png")}
              onPress={() => navigation.navigate("PracticeHub")}
            />
          </View>

          {/* ROW 2 — Training Hub + Performance Hub */}
          <View style={styles.row}>
            <GlowButton
              img={require("../assets/images/traininghub.png")}
              onPress={() => navigation.navigate("TrainingHub")}
            />
            <GlowButton
              img={require("../assets/images/performancehub.png")}
              onPress={() => navigation.navigate("PerformanceHubMenu")}
            />
          </View>
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
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
  },
  spacer: {
    flex: 0.72,
  },
  gridContainer: {
    paddingHorizontal: BUTTON_H_PAD,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: BUTTON_GAP / 2,
  },
  bottomSpacer: {
    flex: 0.05,
  },
  buttonWrap: {
    flex: 1,
    marginHorizontal: BUTTON_GAP / 2,
  },
  buttonInner: {
    width: "100%",
    aspectRatio: 754 / 511,
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ff44ff",
    backgroundColor: "rgba(255, 68, 255, 0.08)",
  },
});

