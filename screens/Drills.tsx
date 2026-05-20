import { Image, StyleSheet, Text, View } from 'react-native';

export default function Drills() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Drills</Text>
      <Text style={styles.text}>Skill drills coming next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C2538', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 120, height: 120, opacity: 0.3, marginBottom: 20 },
  title: { fontSize: 26, color: '#fff', fontWeight: 'bold' },
  text: { color: '#ccc', marginTop: 10 }
});