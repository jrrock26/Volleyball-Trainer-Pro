// components/Timer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimerProps {
  duration: number; // in seconds
}

export default function Timer({ duration }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  // Animate the circular ring
  const animateRing = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: duration * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  // Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;


    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    progress.setValue(0);
  };

  // Start timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      animateRing();
    }
  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
    progress.stopAnimation();
  };

  // Convert seconds → MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Interpolate progress for ring stroke offset
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // adjust based on circle circumference
  });

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <View style={styles.glow} />

        <Animated.View
          style={[
            styles.ring,
            {
              borderColor: 'white',
              shadowColor: '#4da6ff', // blue glow start
            },
          ]}
        />

        <Animated.View
          style={[
            styles.ringProgress,
            {
              borderColor: 'white',
              shadowColor: '#ff69b4', // pink glow end
              opacity: progress,
            },
          ]}
        />

        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.buttonsRow}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startTimer}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={pauseTimer}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const RING_SIZE = 140;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: RING_SIZE + 30,
    height: RING_SIZE + 30,
    borderRadius: (RING_SIZE + 30) / 2,
    backgroundColor: 'transparent',
    shadowColor: '#4da6ff',
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 6,
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  ringProgress: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 6,
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  button: {
    backgroundColor: '#4da6ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
