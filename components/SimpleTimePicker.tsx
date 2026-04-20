import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Props {
  visible: boolean;
  initialSeconds: number;
  onCancel: () => void;
  onConfirm: (hours: number, minutes: number) => void;
}

const SimpleTimePicker: React.FC<Props> = ({
  visible,
  initialSeconds,
  onCancel,
  onConfirm,
}) => {
  const initialMinutes = Math.round(initialSeconds / 60);
  const initialHours = Math.floor(initialMinutes / 60);
  const initialRemainingMinutes = initialMinutes % 60;

  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialRemainingMinutes);

  useEffect(() => {
    const mins = Math.round(initialSeconds / 60);
    setHours(Math.floor(mins / 60));
    setMinutes(mins % 60);
  }, [initialSeconds]);

  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5); // 0–55

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Select Practice Length</Text>

          <View style={styles.row}>
            {/* Hours */}
            <View style={styles.column}>
              <Text style={styles.label}>Hours</Text>
              <ScrollView style={styles.scroll}>
                {[0, 1, 2, 3, 4, 5].map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.option,
                      hours === h && styles.optionSelected,
                    ]}
                    onPress={() => setHours(h)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        hours === h && styles.optionTextSelected,
                      ]}
                    >
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Minutes */}
            <View style={styles.column}>
              <Text style={styles.label}>Minutes</Text>
              <ScrollView style={styles.scroll}>
                {minuteOptions.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.option,
                      minutes === m && styles.optionSelected,
                    ]}
                    onPress={() => setMinutes(m)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        minutes === m && styles.optionTextSelected,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onConfirm(hours, minutes)}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleTimePicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  scroll: {
    height: 150,
    width: '100%',
  },
  option: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  optionTextSelected: {
    color: '#1e88e5',
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#777',
  },
  confirmButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  confirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
