import React from "react";
import { View, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";

type Props = {
  route: any;
  navigation: any;
};

export default function ReplayHitScreen({ route }: Props) {
  const { hit } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: hit.videoUri }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { flex: 1 },
});
