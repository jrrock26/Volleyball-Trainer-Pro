import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Recording from 'react-native-record-screen';

import * as MediaLibrary from 'expo-media-library';

const volleyballImg = require('../assets/images/volleyball.png');

const { width } = Dimensions.get('window');
const COURT_HEIGHT = width * 1.1; // kept ONLY for styles

type Pos = { x: number; y: number };
type Rotation = 1 | 2 | 3 | 4 | 5 | 6;

type FormationMode =
  | 'preServe'
  | 'activeServe'
  | 'defendLeft'
  | 'defendMiddle'
  | 'defendRight';

const VOLLEYBALL_POSITIONS = ['OH', 'OPP', 'MB', 'S', 'DS', 'L'] as const;
type PlayerRole = (typeof VOLLEYBALL_POSITIONS)[number];

type SavedPlay = {
  id: string;
  name: string;
  rotation: Rotation;
  preServe: Pos[];
  activeServe: Pos[];
  defendLeft: Pos[];
  defendMiddle: Pos[];
  defendRight: Pos[];
  updatedAt: number;
  playerLabels?: (string | null)[];
  playerRoles?: PlayerRole[];
};

type PlayStackParamList = {
  PlayDesigner: { loadPlayId?: string } | undefined;
  PlayLibrary: undefined;
};

type Props = NativeStackScreenProps<PlayStackParamList, 'PlayDesigner'>;

const sixTwoBase: Record<Rotation, Pos[]> = {
  1: [
    { x: 0.2, y: 0.55 },
    { x: 0.45, y: 0.55 },
    { x: 0.68, y: 0.55 },
    { x: 0.2, y: 0.8 },
    { x: 0.45, y: 0.8 },
    { x: 0.68, y: 0.8 },
  ],
  2: [
    { x: 0.2, y: 0.55 },
    { x: 0.45, y: 0.55 },
    { x: 0.68, y: 0.55 },
    { x: 0.2, y: 0.8 },
    { x: 0.45, y: 0.8 },
    { x: 0.68, y: 0.8 },
  ],
  3: [
    { x: 0.2, y: 0.55 },
    { x: 0.45, y: 0.55 },
    { x: 0.68, y: 0.55 },
    { x: 0.2, y: 0.8 },
    { x: 0.45, y: 0.8 },
    { x: 0.68, y: 0.8 },
  ],
  4: [
    { x: 0.2, y: 0.55 },
    { x: 0.45, y: 0.55 },
    { x: 0.68, y: 0.55 },
    { x: 0.2, y: 0.8 },
    { x: 0.45, y: 0.8 },
    { x: 0.68, y: 0.8 },
  ],
  5: [
    { x: 0.2, y: 0.55 },
    { x: 0.45, y: 0.55 },
    { x: 0.68, y: 0.55 },
    { x: 0.2, y: 0.8 },
    { x: 0.45, y: 0.8 },
    { x: 0.68, y: 0.8 },
  ],
  6: [
    { x: 0.2, y: 0.55 },
    { x: 0.45, y: 0.55 },
    { x: 0.68, y: 0.55 },
    { x: 0.2, y: 0.8 },
    { x: 0.45, y: 0.8 },
    { x: 0.68, y: 0.8 },
  ],
};

const STORAGE_KEY = 'savedPlays';
const SERVER_INDEX = 5;

const cloneBase = (rot: Rotation): Pos[] =>
  sixTwoBase[rot].map(p => ({ ...p }));

const clonePositions = (positions: Pos[]): Pos[] =>
  positions.map(p => ({ ...p }));

export default function PlayDesigner({ navigation, route }: Props) {

  // ⭐ REAL measured court height
  const [courtHeight, setCourtHeight] = useState(COURT_HEIGHT);

  const [rotation, setRotation] = useState<Rotation>(1);

  const [preServePositions, setPreServePositions] = useState<Pos[]>(cloneBase(1));
  const [activeServePositions, setActiveServePositions] = useState<Pos[]>(cloneBase(1));
  const [defendLeftPositions, setDefendLeftPositions] = useState<Pos[]>(cloneBase(1));
  const [defendMiddlePositions, setDefendMiddlePositions] = useState<Pos[]>(cloneBase(1));
  const [defendRightPositions, setDefendRightPositions] = useState<Pos[]>(cloneBase(1));

  const [mode, setMode] = useState<FormationMode>('preServe');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const [playerRoles, setPlayerRoles] = useState<PlayerRole[]>([
    'OH', 'MB', 'OPP', 'S', 'MB', 'OH',
  ]);

  const [playerLabels, setPlayerLabels] = useState<(string | null)[]>([
    null, null, null, null, null, null,
  ]);

  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [tempLabel, setTempLabel] = useState('');

  const anims = useRef(
    Array(6)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
      }))
  ).current;

  const dragOffsets = useRef(
    Array(6)
      .fill(0)
      .map(() => ({ offsetX: 0, offsetY: 0 }))
  ).current;

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [playName, setPlayName] = useState('');

  const [validationVisible, setValidationVisible] = useState(false);

  const ballAnim = useRef(
    new Animated.ValueXY({ x: width * 0.8, y: COURT_HEIGHT * 0.9 })
  ).current;
  // ⭐ ADD THESE TWO LINES RIGHT HERE
const spinAnim = useRef(new Animated.Value(0)).current;

const spin = spinAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});
  const [ballVisible, setBallVisible] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);

  const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const stepLabels = [
    'Step 1 of 5 — Set Pre‑Serve Formation',
    'Step 2 of 5 — Set Active Serve Formation',
    'Step 3 of 5 — Set Left Return Formation',
    'Step 4 of 5 — Set Middle Return Formation',
    'Step 5 of 5 — Set Right Return Formation',
  ];

  const modeForStep = (step: number): FormationMode => {
    switch (step) {
      case 0: return 'preServe';
      case 1: return 'activeServe';
      case 2: return 'defendLeft';
      case 3: return 'defendMiddle';
      case 4:
      default: return 'defendRight';
    }
  };

  // ⭐ PATCH: use courtHeight everywhere
  useEffect(() => {
    if (route.params?.loadPlayId) return;

    const base = cloneBase(rotation);

    setPreServePositions(cloneBase(rotation));
    setActiveServePositions(cloneBase(rotation));
    setDefendLeftPositions(cloneBase(rotation));
    setDefendMiddlePositions(cloneBase(rotation));
    setDefendRightPositions(cloneBase(rotation));

    base.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * courtHeight);
    });

    setStepIndex(0);
    setMode('preServe');
  }, [rotation, route.params?.loadPlayId, courtHeight]);

  useEffect(() => {
    const loadFromParam = async () => {
      const id = route.params?.loadPlayId;
      if (!id) return;

      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) return;

      const data: Record<string, SavedPlay> = JSON.parse(json);
      const play = data[id];
      if (!play) return;

      setRotation(play.rotation);

      const pre = clonePositions(play.preServe);
      const active = clonePositions(play.activeServe);
      const left = clonePositions(play.defendLeft);
      const middle = clonePositions(play.defendMiddle);
      const right = clonePositions(play.defendRight);

      setPreServePositions(pre);
      setActiveServePositions(active);
      setDefendLeftPositions(left);
      setDefendMiddlePositions(middle);
      setDefendRightPositions(right);

      if (play.playerLabels) setPlayerLabels([...play.playerLabels]);
      if (play.playerRoles) setPlayerRoles([...play.playerRoles]);

      pre.forEach((pos, i) => {
        anims[i].x.setValue(pos.x * width);
        anims[i].y.setValue(pos.y * courtHeight);
      });

      setStepIndex(0);
      setMode('preServe');
    };

    loadFromParam();
  }, [route.params?.loadPlayId, courtHeight]);

  useEffect(() => {
    const current = getCurrentPositions();
    current.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * courtHeight);
    });
  }, [mode, courtHeight]);
    const getCurrentPositions = (): Pos[] => {
    switch (mode) {
      case 'preServe': return preServePositions;
      case 'activeServe': return activeServePositions;
      case 'defendLeft': return defendLeftPositions;
      case 'defendMiddle': return defendMiddlePositions;
      case 'defendRight': return defendRightPositions;
    }
  };

  const setCurrentPositions = (positions: Pos[]) => {
    const cloned = clonePositions(positions);
    switch (mode) {
      case 'preServe': setPreServePositions(cloned); break;
      case 'activeServe': setActiveServePositions(cloned); break;
      case 'defendLeft': setDefendLeftPositions(cloned); break;
      case 'defendMiddle': setDefendMiddlePositions(cloned); break;
      case 'defendRight': setDefendRightPositions(cloned); break;
    }
  };

  const responders = anims.map((anim, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        const current = getCurrentPositions();
        const pos = current[index];

        const currentX = pos.x * width;
        const currentY = pos.y * courtHeight;

        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;

        dragOffsets[index].offsetX = currentX - touchX;
        dragOffsets[index].offsetY = currentY - touchY;
      },

      onPanResponderMove: evt => {
        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;
        const { offsetX, offsetY } = dragOffsets[index];

        anim.x.setValue(touchX + offsetX);
        anim.y.setValue(touchY + offsetY);
      },

      onPanResponderRelease: evt => {
        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;
        const { offsetX, offsetY } = dragOffsets[index];

        const finalX = touchX + offsetX;
        const finalY = touchY + offsetY;

        const newX = Math.min(1, Math.max(0, finalX / width));
        const newY = Math.min(1, Math.max(0, finalY / courtHeight));

        const current = getCurrentPositions();
        const updated = [...current];
        updated[index] = { x: newX, y: newY };

        setCurrentPositions(updated);
      },
    })
  );

  const animateBall = async (from: Pos, to: Pos, duration: number) => {
    setBallVisible(true);

    ballAnim.setValue({
      x: from.x * width,
      y: from.y * courtHeight,
    });

    await new Promise(resolve => {
      Animated.timing(ballAnim, {
        toValue: {
          x: to.x * width,
          y: to.y * courtHeight,
        },
        duration,
        useNativeDriver: false,
      }).start(() => resolve(null));
    });
  };
  

  const animatePlayersTo = (positions: Pos[], duration: number): Promise<void> =>
    new Promise(resolve => {
      const animations = positions.map((pos, i) =>
        Animated.parallel([
          Animated.timing(anims[i].x, {
            toValue: pos.x * width,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(anims[i].y, {
            toValue: pos.y * courtHeight,
            duration,
            useNativeDriver: false,
          }),
        ])
      );

      Animated.parallel(animations).start(() => resolve());
    });

  const resetPlay = () => {
    const base = cloneBase(rotation);

    setPreServePositions(cloneBase(rotation));
    setActiveServePositions(cloneBase(rotation));
    setDefendLeftPositions(cloneBase(rotation));
    setDefendMiddlePositions(cloneBase(rotation));
    setDefendRightPositions(cloneBase(rotation));

    base.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * courtHeight);
    });

    setStepIndex(0);
    setMode('preServe');
  };

  const isBackRow = (index: number) => index >= 3;

  const handleRotate = () => {
    const newRotation = rotation === 6 ? 1 : ((rotation + 1) as Rotation);
    setRotation(newRotation);

    const roles = [...playerRoles];
    const labels = [...playerLabels];

    const liberoIndex = roles.indexOf('L');
    let liberoLabel: string | null = null;

    if (liberoIndex !== -1) {
      liberoLabel = labels[liberoIndex];
      roles.splice(liberoIndex, 1);
      labels.splice(liberoIndex, 1);
    }

    const clockwiseOrder = [5, 4, 3, 0, 1, 2];

    const orderedRoles = clockwiseOrder.map(i => roles[i] ?? null);
    const orderedLabels = clockwiseOrder.map(i => labels[i] ?? null);

    const lastRole = orderedRoles.pop()!;
    const lastLabel = orderedLabels.pop()!;
    orderedRoles.unshift(lastRole);
    orderedLabels.unshift(lastLabel);

    clockwiseOrder.forEach((pos, idx) => {
      roles[pos] = orderedRoles[idx]!;
      labels[pos] = orderedLabels[idx]!;
    });

    if (liberoIndex !== -1) {
      const safeIndex = Math.max(3, Math.min(5, liberoIndex));
      roles[safeIndex] = 'L';
      labels[safeIndex] = liberoLabel;
    }

      setPlayerRoles(roles);
  setPlayerLabels(labels);
  };

  const goToNextStep = () => {
    if (stepIndex < 4) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setMode(modeForStep(next));
    } else {
      openSaveModal();
    }
  };

  const openSaveModal = () => {
    const defaultName = `Rotation ${rotation} – Custom Play`;
    setPlayName(defaultName);
    setSaveModalVisible(true);
  };

  const validateFormations = () => {
    const formations = [
      preServePositions,
      activeServePositions,
      defendLeftPositions,
      defendMiddlePositions,
      defendRightPositions,
    ];

    const allValid = formations.every(f => f.length === 6);

    if (!allValid) {
      setValidationVisible(true);
      return false;
    }

    return true;
  };

  const savePlay = async () => {
    const rawName = playName.trim();
    if (!rawName) return;

    if (!validateFormations()) return;

    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const existing: Record<string, SavedPlay> = json ? JSON.parse(json) : {};

    let pre = clonePositions(preServePositions);
    let active = clonePositions(activeServePositions);
    let left = clonePositions(defendLeftPositions);
    let middle = clonePositions(defendMiddlePositions);
    let right = clonePositions(defendRightPositions);

    const base = cloneBase(rotation);
    const isSame = (a: Pos[], b: Pos[]) =>
      a.length === b.length &&
      a.every((p, i) => p.x === b[i].x && p.y === b[i].y);

    if (isSame(active, base)) active = clonePositions(pre);
    if (isSame(left, base)) left = clonePositions(pre);
    if (isSame(middle, base)) middle = clonePositions(pre);
    if (isSame(right, base)) right = clonePositions(pre);

    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    existing[id] = {
      id,
      name: rawName,
      rotation,
      preServe: pre,
      activeServe: active,
      defendLeft: left,
      defendMiddle: middle,
      defendRight: right,
      updatedAt: Date.now(),
      playerLabels: [...playerLabels],
      playerRoles: [...playerRoles],
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    setSaveModalVisible(false);
  };

  const goToLibrary = () => {
    navigation.replace('PlayLibrary');
  };

  // ⭐ runPlay restored to original working version (NO SPIN)
  const runPlay = async () => {
    const pre = clonePositions(preServePositions);
    const active = clonePositions(activeServePositions);
    const left = clonePositions(defendLeftPositions);
    const middle = clonePositions(defendMiddlePositions);
    const right = clonePositions(defendRightPositions);

    

    // Start visually at pre-serve
    pre.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * courtHeight);
    });

    // Server start
    const serverPos = pre[SERVER_INDEX];
    const serverBallStart: Pos = { x: serverPos.x, y: serverPos.y };

    // ⭐ FIXED middleReturn (Option B)
    const middleReturn: Pos = { x: 0.5, y: 50 / courtHeight };

    const leftNet: Pos = { x: 0.2, y: 0.48 };
    const middleNet: Pos = { x: 0.5, y: 0.48 };
    const rightNet: Pos = { x: 0.8, y: 0.48 };

    // Reset ball
    setBallVisible(true);

    ballAnim.setValue({
      x: serverBallStart.x * width,
      y: serverBallStart.y * courtHeight,
    });

    // 1) Pre-serve settle
    await animatePlayersTo(pre, 1950);
    await sleep(450);

    // 2) Serve → middleReturn
    await Promise.all([
      animateBall(serverBallStart, middleReturn, 3000),
      animatePlayersTo(active, 1650),
    ]);
    await sleep(450);

    // 3) middleReturn → leftNet
    await Promise.all([
      animateBall(middleReturn, leftNet, 2760),
      animatePlayersTo(left, 1650),
    ]);
    await sleep(350);

    // 4) leftNet → middleReturn
    await animateBall(leftNet, middleReturn, 2300);
    await sleep(400);

    // 5) middleReturn → middleNet
    await Promise.all([
      animateBall(middleReturn, middleNet, 2760),
      animatePlayersTo(middle, 1840),
    ]);
    await sleep(350);

    // 6) middleNet → middleReturn
    await animateBall(middleNet, middleReturn, 2300);
    await sleep(400);

    // 7) middleReturn → rightNet
    await Promise.all([
      animateBall(middleReturn, rightNet, 3000),
      animatePlayersTo(right, 1840),
    ]);
    await sleep(450);

    // 8) Return to base
    const base = cloneBase(rotation);
    await animatePlayersTo(base, 2000);
    await sleep(400);

    setBallVisible(false);
  };

  // ⭐ Correct standalone recordPlay function
const recordPlay = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission required to save video');
    return;
  }

  await Recording.startRecording();

  // Run the animation
  runPlay();

  setTimeout(async () => {
    const result = await Recording.stopRecording();

    // TS types are wrong — cast to any
    const uri = (result as any).outputURL || (result as any).video;

    if (uri) {
      await MediaLibrary.saveToLibraryAsync(uri);
      alert('Saved to camera roll!');
    } else {
      alert('Recording failed');
    }
  }, 5000);
};

  
  const renderStepAdvanceButton = () => (
    <TouchableOpacity
      style={styles.stepAdvanceBtn}
      onPress={goToNextStep}
    >
      <Text style={styles.stepAdvanceBtnText}>
        {stepIndex < 4 ? `Go to Step ${stepIndex + 2}` : 'Save Full Play'}
      </Text>
    </TouchableOpacity>
  );

  return (

  <View style={styles.container}>

    {/* ---------------- INSTRUCTIONS PANEL ---------------- */}
    {showInstructions ? (
      <View style={styles.instructionsBox}>
        <View style={styles.instructionsHeader}>
          <Text style={styles.instructionsTitle}>📘 Instructions</Text>
          <TouchableOpacity onPress={() => setShowInstructions(false)}>
            <Text style={styles.instructionsHide}>Hide</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.instructionsText}>
          Drag and drop players to desired positions for each step.
        </Text>
        <Text style={styles.instructionsText}>
          Step 1: Set <Text style={{ fontWeight: '700' }}>Pre‑Serve Formation</Text>.
        </Text>
        <Text style={styles.instructionsText}>
          Step 2: Set <Text style={{ fontWeight: '700' }}>Active Serve Formation</Text>.
        </Text>
        <Text style={styles.instructionsText}>
          Steps 3–5: Set <Text style={{ fontWeight: '700' }}>Left, Middle, Right Return</Text> formations.
        </Text>
        <Text style={styles.instructionsText}>
          Use the <Text style={{ fontWeight: '700' }}>gear icon</Text> to change player roles and assign initials or jersey #.
        </Text>
        <Text style={styles.instructionsText}>
          Use the <Text style={{ fontWeight: '700' }}>Rotate</Text> button to rotate the formation clockwise.
        </Text>
        <Text style={styles.instructionsText}>
          Save stores the full play (all 5 formations) for this rotation.
        </Text>
      </View>
    ) : (
      <TouchableOpacity
        style={styles.instructionsCollapsed}
        onPress={() => setShowInstructions(true)}
      >
        <Text style={styles.instructionsCollapsedText}>📘 Show Instructions</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
  style={{
    backgroundColor: '#ff3366',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  }}
  onPress={recordPlay}
>
  <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
    Record Play
  </Text>
</TouchableOpacity>

    {/* ---------------- COURT ---------------- */}
    <ImageBackground
      source={require('../assets/images/court.png')}
      style={styles.court}
      resizeMode="cover"
      onLayout={e => setCourtHeight(e.nativeEvent.layout.height)}
    >

      {/* COURT LINES */}
      <View style={styles.lineLeft} />
      <View style={styles.lineRight} />
      <View style={styles.lineTop} />
      <View style={styles.lineBottom} />
      <View style={styles.net} />
      <View style={styles.attackLine} />

      {/* RETURN BALL ROW */}
      <View style={styles.returnRow}>

        {/* Left hidden */}
        <View
          style={[styles.returnBall, { opacity: 0 }]}
          pointerEvents="none"
        />

        {/* Middle visible */}
        <View
          style={[
            styles.returnBall,
            mode === 'defendMiddle' && styles.returnBallSelected
          ]}
        />

        {/* Right hidden */}
        <View
          style={[styles.returnBall, { opacity: 0 }]}
          pointerEvents="none"
        />

      </View>

      {/* STEP LABEL + ADVANCE BUTTON */}
      <View style={styles.stepOverlay}>
        <Text style={styles.stepOverlayText}>{stepLabels[stepIndex]}</Text>
        {renderStepAdvanceButton()}
      </View>

     {/* ANIMATED BALL — always rendered, instant load */}
<Animated.Image
  source={volleyballImg}
  style={{
    position: 'absolute',
    width: 32,
    height: 32,
    opacity: ballVisible ? 1 : 0,   // instant load
    zIndex: 9999,
    transform: [
      { translateX: Animated.subtract(ballAnim.x, 16) },
      { translateY: Animated.subtract(ballAnim.y, 16) },
    ],
  }}
  resizeMode="contain"
/>






      {/* PLAYERS */}
      {playerRoles.map((role, i) => (
        <Animated.View
          key={i}
          {...responders[i].panHandlers}
          style={[
            styles.player,
            role === 'L' && styles.liberoPlayer,
            { left: anims[i].x, top: anims[i].y },
          ]}
        >
          <Text style={styles.playerLabel}>{role}</Text>

          {playerLabels[i] && (
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>{playerLabels[i]}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.gearButton}
            onPress={() => {
              setSelectedPlayerIndex(i);
              setTempLabel(playerLabels[i] || '');
              setRoleModalVisible(true);
            }}
          >
            <Text style={styles.gearText}>⚙️</Text>
          </TouchableOpacity>

          {i === SERVER_INDEX && (
            <View style={styles.serverBadge}>
              <Text style={styles.serverBadgeText}>S</Text>
            </View>
          )}
        </Animated.View>
      ))}

    </ImageBackground>

    {/* ---------------- BOTTOM CONTROLS ---------------- */}
    <View style={styles.bottomControls}>
      <TouchableOpacity style={styles.controlBtn} onPress={runPlay}>
        <Text style={styles.controlBtnText}>Run</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlBtn} onPress={goToLibrary}>
        <Text style={styles.controlBtnText}>Load</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlBtn} onPress={resetPlay}>
        <Text style={styles.controlBtnText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlBtn} onPress={handleRotate}>
        <Text style={styles.controlBtnText}>Rotate {rotation}</Text>
      </TouchableOpacity>
    </View>

    {/* SAVE MODAL */}
    <Modal visible={saveModalVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Save Full Play</Text>

          <TextInput
            style={styles.modalInput}
            value={playName}
            onChangeText={setPlayName}
            placeholder="Play name"
            placeholderTextColor="#999"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setSaveModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalSave} onPress={savePlay}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* ROLE / LABEL MODAL */}
    <Modal visible={roleModalVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Player Settings</Text>

          <Text style={[styles.modalTitle, { fontSize: 16, marginTop: 4 }]}>
            Select Position
          </Text>

          {VOLLEYBALL_POSITIONS.map(pos => {
            if (selectedPlayerIndex === null) return null;

            const anotherLiberoExists =
              playerRoles.includes('L') &&
              playerRoles[selectedPlayerIndex] !== 'L';

            const disabled =
              (pos === 'L' && !isBackRow(selectedPlayerIndex)) ||
              (pos === 'L' && anotherLiberoExists);

            return (
              <TouchableOpacity
                key={pos}
                disabled={disabled}
                onPress={() => {
                  if (selectedPlayerIndex !== null) {
                    const updated = [...playerRoles];
                    updated[selectedPlayerIndex] = pos;
                    setPlayerRoles(updated);
                  }
                }}
                style={[
                  styles.roleOption,
                  disabled && { opacity: 0.3 },
                ]}
              >
                <Text style={styles.roleOptionText}>{pos}</Text>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.modalTitle, { fontSize: 16, marginTop: 10 }]}>
            Initials or Jersey #
          </Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Initials or Jersey #"
            placeholderTextColor="#999"
            value={tempLabel}
            onChangeText={setTempLabel}
            maxLength={4}
          />

          <TouchableOpacity
            style={[styles.modalCancel, { marginTop: 10 }]}
            onPress={() => {
              let label = tempLabel.trim().toUpperCase();
              label = label.slice(0, 2);

              if (selectedPlayerIndex !== null) {
                const updated = [...playerLabels];
                updated[selectedPlayerIndex] = label.length > 0 ? label : null;
                setPlayerLabels(updated);
              }

              setTempLabel('');
              setRoleModalVisible(false);
            }}
          >
            <Text style={styles.modalCancelText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* VALIDATION MODAL */}
    <Modal visible={validationVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Incomplete Play</Text>
          <Text style={{ textAlign: 'center', marginBottom: 20, color: '#333' }}>
            Please complete all 5 formation steps before saving.
          </Text>

          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setValidationVisible(false)}
          >
            <Text style={styles.modalCancelText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 6,
    alignItems: 'center',
  },

  instructionsBox: {
    width: '92%',
    backgroundColor: '#f4f6f8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2b6cb0',
  },
  instructionsHide: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  instructionsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  instructionsCollapsed: {
    width: '92%',
    backgroundColor: '#f4f6f8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  instructionsCollapsedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2b6cb0',
  },

  modeText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#2b6cb0',
  },

  stepAdvanceBtn: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  stepOverlay: {
    position: 'absolute',
    top: 110,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },

  stepOverlayText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },

  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  stepAdvanceBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  court: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  lineLeft: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: 'transparent',
  },
  lineRight: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: '100%',
    backgroundColor: 'transparent',
  },
  lineTop: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
  lineBottom: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
  net: {
    position: 'absolute',
    top: COURT_HEIGHT / 2,
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
  attackLine: {
    position: 'absolute',
    top: COURT_HEIGHT * 0.65,
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
  },

  returnRow: {
    position: 'absolute',
    top: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  returnBall: {
    width: 36,
    height: 36,
    borderRadius: 25,
    backgroundColor: '#ff69b4',
    shadowColor: '#ff69b4',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  returnBallSelected: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 1,
  },

  ball: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ff69b4',
    shadowColor: '#ff69b4',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },

  player: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 27,
    backgroundColor: '#2b6cb0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  liberoPlayer: {
    backgroundColor: '#FFD700',
  },
  playerLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  numberBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#2b6cb0',
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2b6cb0',
  },

  gearButton: {
    position: 'absolute',
    bottom: -6,
    left: -6,
  },
  gearText: {
    fontSize: 20,
    color: '#2b6cb0',
  },

  serverBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#ff69b4',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff69b4',
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  serverBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  controlBtn: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  controlBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2b6cb0',
  },
  modalTitle: {
    color: '#2b6cb0',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f4f6f8',
    color: '#333',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    backgroundColor: '#888',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSave: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  roleOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  roleOptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#2b6cb0',
    fontWeight: '600',
  },
});
