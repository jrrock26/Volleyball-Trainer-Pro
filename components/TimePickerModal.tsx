import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TimePickerModalProps {
  visible: boolean;
  initialSeconds: number;
  onCancel: () => void;
  onConfirm: (hours: number, minutes: number) => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialSeconds,
  onCancel,
  onConfirm,
}) => {
  const initialMinutes = Math.round(initialSeconds / 60);
  const initialHours = Math.floor(initialMinutes / 60);
  const initialRemainingMinutes = initialMinutes % 60;

  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialRemainingMinutes);

  useEffect(() => {
    const mins = Math.round(initialSeconds / 60);
    setHours(Math.floor(mins / 60));
    setMinutes(mins % 60);
  }, [initialSeconds]);

  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5); // 0–55

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Select Practice Length</Text>

          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hours</Text>
              <Picker
                selectedValue={hours}
                onValueChange={setHours}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {[0, 1, 2, 3, 4, 5].map(h => (
                  <Picker.Item key={h} label={`${h}`} value={h} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Minutes</Text>
              <Picker
                selectedValue={minutes}
                onValueChange={setMinutes}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {minuteOptions.map(m => (
                  <Picker.Item key={m} label={`${m}`} value={m} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm(hours, minutes)}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 4,
  },
  picker: {
    width: Platform.OS === 'ios' ? undefined : 120,
    height: Platform.OS === 'ios' ? 160 : undefined,
  },
  pickerItem: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#777777',
  },
  confirmButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  confirmText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
