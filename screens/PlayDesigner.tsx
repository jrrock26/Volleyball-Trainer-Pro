import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PlayStackParamList } from '../navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ─────────────────────────────────────────────────────────────
//   CONSTANTS & TYPES
// ─────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');
const COURT_HEIGHT = width * 1.1;

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
  name: string;
  rotation: Rotation;
  preServe: Pos[];
  activeServe: Pos[];
  defendLeft: Pos[];
  defendMiddle: Pos[];
  defendRight: Pos[];
  updatedAt: number;
  serve?: Pos[];
  playerLabels?: (string | null)[];
  playerRoles?: PlayerRole[];
};

type Props = NativeStackScreenProps<PlayStackParamList, 'PlayDesignerMain'>;

export default function PlayDesigner({ navigation, route }: Props) {

// ─────────────────────────────────────────────────────────────
//   BASE 6‑2 FORMATIONS
// ─────────────────────────────────────────────────────────────
//

const sixTwoBase: Record<Rotation, Pos[]> = {
  1: [
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.65 },
    { x: 0.8, y: 0.65 },
    { x: 0.2, y: 0.9 },
    { x: 0.5, y: 0.9 },
    { x: 0.8, y: 0.9 },
  ],
  2: [
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.65 },
    { x: 0.8, y: 0.65 },
    { x: 0.2, y: 0.9 },
    { x: 0.5, y: 0.9 },
    { x: 0.8, y: 0.9 },
  ],
  3: [
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.65 },
    { x: 0.8, y: 0.65 },
    { x: 0.2, y: 0.9 },
    { x: 0.5, y: 0.9 },
    { x: 0.8, y: 0.9 },
  ],
  4: [
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.65 },
    { x: 0.8, y: 0.65 },
    { x: 0.2, y: 0.9 },
    { x: 0.5, y: 0.9 },
    { x: 0.8, y: 0.9 },
  ],
  5: [
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.65 },
    { x: 0.8, y: 0.65 },
    { x: 0.2, y: 0.9 },
    { x: 0.5, y: 0.9 },
    { x: 0.8, y: 0.9 },
  ],
  6: [
    { x: 0.2, y: 0.65 },
    { x: 0.5, y: 0.65 },
    { x: 0.8, y: 0.65 },
    { x: 0.2, y: 0.9 },
    { x: 0.5, y: 0.9 },
    { x: 0.8, y: 0.9 },
  ],
};

const STORAGE_KEY = 'savedPlays';
const SERVER_INDEX = 5;

//
// ─────────────────────────────────────────────────────────────
//   COMPONENT START
// ─────────────────────────────────────────────────────────────
//


  //
  // STATE
  //
  const [rotation, setRotation] = useState<Rotation>(1);
  const base = sixTwoBase[rotation];

  const [preServePositions, setPreServePositions] = useState<Pos[]>(base);
  const [activeServePositions, setActiveServePositions] = useState<Pos[]>(base);
  const [defendLeftPositions, setDefendLeftPositions] = useState<Pos[]>(base);
  const [defendMiddlePositions, setDefendMiddlePositions] = useState<Pos[]>(base);
  const [defendRightPositions, setDefendRightPositions] = useState<Pos[]>(base);

  const [mode, setMode] = useState<FormationMode>('preServe');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const [playerRoles, setPlayerRoles] = useState<PlayerRole[]>([
    'OH', 'MB', 'OPP', 'S', 'MB', 'OH',
  ]);

  // NEW — replaces playerNumbers
  const [playerLabels, setPlayerLabels] = useState<(string | null)[]>([
    null, null, null, null, null, null,
  ]);

  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);

  // NEW — replaces digit1/digit2
  const [tempLabel, setTempLabel] = useState('');

  //
  // Animations
  //
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

  const ballAnim = useRef(
    new Animated.ValueXY({ x: width * 0.8, y: COURT_HEIGHT * 0.9 })
  ).current;
  const [ballVisible, setBallVisible] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  //
  // EFFECT — rotation change
  //
  useEffect(() => {
    const newBase = sixTwoBase[rotation];

    newBase.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * COURT_HEIGHT);
    });

    setPreServePositions(newBase);
    setActiveServePositions(newBase);
    setDefendLeftPositions(newBase);
    setDefendMiddlePositions(newBase);
    setDefendRightPositions(newBase);

    setStepIndex(0);
    setMode('preServe');
  }, [rotation]);

  //
  // EFFECT — load play
  //
  useEffect(() => {
    const loadFromParam = async () => {
      const name = route.params?.loadPlayName;
      if (!name) return;

      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (!json) return;

      const data: Record<string, SavedPlay> = JSON.parse(json);
      const play = data[name];
      if (!play) return;

      const baseForRotation = sixTwoBase[play.rotation];

      const pre = play.preServe ?? play.serve ?? baseForRotation;
      const active = play.activeServe ?? pre;
      const left = play.defendLeft ?? baseForRotation;
      const middle = play.defendMiddle ?? baseForRotation;
      const right = play.defendRight ?? baseForRotation;

      setRotation(play.rotation);
      setPreServePositions(pre);
      setActiveServePositions(active);
      setDefendLeftPositions(left);
      setDefendMiddlePositions(middle);
      setDefendRightPositions(right);

      // Sync animations
      pre.forEach((pos, i) => {
        anims[i].x.setValue(pos.x * width);
        anims[i].y.setValue(pos.y * COURT_HEIGHT);
      });

      // NEW — load labels + roles
      if (play.playerLabels) setPlayerLabels(play.playerLabels);
      if (play.playerRoles) setPlayerRoles(play.playerRoles);

      setStepIndex(0);
      setMode('preServe');
    };

    loadFromParam();
  }, [route.params?.loadPlayName]);

  //
  // EFFECT — mode change
  //
  useEffect(() => {
    const current = getCurrentPositions();
    current.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * COURT_HEIGHT);
    });
  }, [mode]);

  //
  // HELPERS
  //
  const getCurrentPositions = (): Pos[] => {
    switch (mode) {
      case 'preServe':
        return preServePositions;
      case 'activeServe':
        return activeServePositions;
      case 'defendLeft':
        return defendLeftPositions;
      case 'defendMiddle':
        return defendMiddlePositions;
      case 'defendRight':
        return defendRightPositions;
    }
  };

  const setCurrentPositions = (positions: Pos[]) => {
    switch (mode) {
      case 'preServe':
        setPreServePositions(positions);
        break;
      case 'activeServe':
        setActiveServePositions(positions);
        break;
      case 'defendLeft':
        setDefendLeftPositions(positions);
        break;
      case 'defendMiddle':
        setDefendMiddlePositions(positions);
        break;
      case 'defendRight':
        setDefendRightPositions(positions);
        break;
    }
  };
  const stepLabels = [
  'Step 1 of 5 — Set Pre‑Serve Formation',
  'Step 2 of 5 — Set Active Serve Formation',
  'Step 3 of 5 — Set Left Return Formation',
  'Step 4 of 5 — Set Middle Return Formation',
  'Step 5 of 5 — Set Right Return Formation',
];

const modeForStep = (step: number): FormationMode => {
  switch (step) {
    case 0:
      return 'preServe';
    case 1:
      return 'activeServe';
    case 2:
      return 'defendLeft';
    case 3:
      return 'defendMiddle';
    case 4:
    default:
      return 'defendRight';
  }
};

  //
  // DRAGGING
  //
  const responders = anims.map((anim, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const current = getCurrentPositions();
        const pos = current[index];

        const currentX = pos.x * width;
        const currentY = pos.y * COURT_HEIGHT;

        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;

        dragOffsets[index].offsetX = currentX - touchX;
        dragOffsets[index].offsetY = currentY - touchY;
      },

      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;
        const { offsetX, offsetY } = dragOffsets[index];

        anim.x.setValue(touchX + offsetX);
        anim.y.setValue(touchY + offsetY);
      },

      onPanResponderRelease: (evt) => {
        const touchX = evt.nativeEvent.pageX;
        const touchY = evt.nativeEvent.pageY;
        const { offsetX, offsetY } = dragOffsets[index];

        const finalX = touchX + offsetX;
        const finalY = touchY + offsetY;

        const newX = Math.min(1, Math.max(0, finalX / width));
        const newY = Math.min(1, Math.max(0, finalY / COURT_HEIGHT));

        const current = getCurrentPositions();
        const updated = [...current];
        updated[index] = { x: newX, y: newY };

        setCurrentPositions(updated);
      },
    })
  );
  //
  // ─────────────────────────────────────────────────────────────
  //   ANIMATE BALL — Used during Run Play
  // ─────────────────────────────────────────────────────────────
  //
  const animateBall = async (from: Pos, to: Pos, duration: number) => {
    setBallVisible(true);

    ballAnim.setValue({
      x: from.x * width,
      y: from.y * COURT_HEIGHT,
    });

    await new Promise((resolve) => {
      Animated.timing(ballAnim, {
        toValue: {
          x: to.x * width,
          y: to.y * COURT_HEIGHT,
        },
        duration,
        useNativeDriver: false,
      }).start(resolve);
    });
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   ANIMATE PLAYERS — Move all players to target formation
  // ─────────────────────────────────────────────────────────────
  //
  const animatePlayersTo = (positions: Pos[], duration: number): Promise<void> =>
    new Promise((resolve) => {
      const animations = positions.map((pos, i) =>
        Animated.parallel([
          Animated.timing(anims[i].x, {
            toValue: pos.x * width,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(anims[i].y, {
            toValue: pos.y * COURT_HEIGHT,
            duration,
            useNativeDriver: false,
          }),
        ])
      );

      Animated.parallel(animations).start(() => resolve());
    });

  //
  // ─────────────────────────────────────────────────────────────
  //   RESET PLAY
  // ─────────────────────────────────────────────────────────────
  //
  const resetPlay = () => {
    const newBase = sixTwoBase[rotation];

    setPreServePositions(newBase);
    setActiveServePositions(newBase);
    setDefendLeftPositions(newBase);
    setDefendMiddlePositions(newBase);
    setDefendRightPositions(newBase);

    newBase.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * COURT_HEIGHT);
    });

    setStepIndex(0);
    setMode('preServe');
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   ROTATION LOGIC — Clockwise rotation with libero handling
  // ─────────────────────────────────────────────────────────────
  //
  const isBackRow = (index: number) => index >= 3;

  const handleRotate = () => {
    const newRotation = rotation === 6 ? 1 : ((rotation + 1) as Rotation);
    setRotation(newRotation);

    const roles = [...playerRoles];
    const labels = [...playerLabels];

    // Handle libero
    const liberoIndex = roles.indexOf('L');
    let liberoLabel: string | null = null;

    if (liberoIndex !== -1) {
      liberoLabel = labels[liberoIndex];
      roles.splice(liberoIndex, 1);
      labels.splice(liberoIndex, 1);
    }

    // Clockwise order mapping
    const clockwiseOrder = [5, 4, 3, 0, 1, 2];

    const orderedRoles = clockwiseOrder.map((i) => roles[i] ?? null);
    const orderedLabels = clockwiseOrder.map((i) => labels[i] ?? null);

    const lastRole = orderedRoles.pop()!;
    const lastLabel = orderedLabels.pop()!;
    orderedRoles.unshift(lastRole);
    orderedLabels.unshift(lastLabel);

    clockwiseOrder.forEach((pos, idx) => {
      roles[pos] = orderedRoles[idx]!;
      labels[pos] = orderedLabels[idx]!;
    });

    // Reinsert libero
    if (liberoIndex !== -1) {
      const safeIndex = Math.max(3, Math.min(5, liberoIndex));
      roles[safeIndex] = 'L';
      labels[safeIndex] = liberoLabel;
    }

    setPlayerRoles(roles);
    setPlayerLabels(labels);
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   STEP SYSTEM
  // ─────────────────────────────────────────────────────────────
  //
  const goToNextStep = () => {
    if (stepIndex < 4) {
      const next = stepIndex + 1;
      setStepIndex(next);
      setMode(modeForStep(next));
    } else {
      openSaveModal();
    }
  };

  const goToFirstStep = () => {
    setStepIndex(0);
    setMode('preServe');
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   SAVE PLAY
  // ─────────────────────────────────────────────────────────────
  //
  const openSaveModal = () => {
    const defaultName = `Rotation ${rotation} – Custom Play`;
    setPlayName(defaultName);
    setSaveModalVisible(true);
  };

  const savePlay = async () => {
    if (!playName.trim()) return;

    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const existing: Record<string, SavedPlay> = json ? JSON.parse(json) : {};

    const key = playName.trim();

    existing[key] = {
      name: key,
      rotation,
      preServe: preServePositions,
      activeServe: activeServePositions,
      defendLeft: defendLeftPositions,
      defendMiddle: defendMiddlePositions,
      defendRight: defendRightPositions,
      updatedAt: Date.now(),

      // NEW
      playerLabels,
      playerRoles,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    setSaveModalVisible(false);
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   NAVIGATION
  // ─────────────────────────────────────────────────────────────
  //
  const goToLibrary = () => {
    navigation.navigate('PlayLibrary');
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   RUN PLAY — Full rally animation sequence
  // ─────────────────────────────────────────────────────────────
  //
  const runPlay = async () => {
    const preServe = preServePositions;
    const activeServe = activeServePositions;
    const left = defendLeftPositions;
    const middle = defendMiddlePositions;
    const right = defendRightPositions;

    const middleReturn: Pos = { x: 0.5, y: 80 / COURT_HEIGHT };

    setBallVisible(false);
    ballAnim.setValue({ x: width * 0.8, y: COURT_HEIGHT * 0.9 });

    const base = sixTwoBase[rotation];
    base.forEach((pos, i) => {
      anims[i].x.setValue(pos.x * width);
      anims[i].y.setValue(pos.y * COURT_HEIGHT);
    });

    await animatePlayersTo(preServe, 1200);
    await sleep(300);

    const serverPos = preServe[SERVER_INDEX];

    animatePlayersTo(activeServe, 1800);
    await animateBall(serverPos, middleReturn, 3000);
    await sleep(300);

    animatePlayersTo(left, 1800);
    await animateBall(middleReturn, { x: 0.2, y: 0.5 }, 2500);
    await sleep(300);
    await animateBall({ x: 0.2, y: 0.5 }, middleReturn, 2500);
    await sleep(300);

    await animatePlayersTo(middle, 2000);
    await animateBall(middleReturn, { x: 0.5, y: 0.5 }, 2500);
    await sleep(300);
    await animateBall({ x: 0.5, y: 0.5 }, middleReturn, 2500);
    await sleep(300);

    await animatePlayersTo(right, 2000);
    await animateBall(middleReturn, { x: 0.8, y: 0.5 }, 2500);
    await sleep(300);

    setBallVisible(false);
  };

  //
  // ─────────────────────────────────────────────────────────────
  //   UI — Dynamic Step Button
  // ─────────────────────────────────────────────────────────────
  //
  const renderStepAdvanceButton = () => (
    <TouchableOpacity
      style={styles.stepAdvanceBtn}
      onPress={goToNextStep}
    >
      <Text style={styles.stepAdvanceBtnText}>
        {stepIndex < 4
          ? `Go to Step ${stepIndex + 2}`
          : 'Save Full Play'}
      </Text>
    </TouchableOpacity>
  );

  //
  // ─────────────────────────────────────────────────────────────
  //   UI — Main Render
  // ─────────────────────────────────────────────────────────────
  //
  return (
    <View style={styles.container}>
      {/* ─────────────────────────────────────────────── */}
      {/* Instructions Toggle */}
      {/* ─────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────── */}
      {/* Step Label */}
      {/* ─────────────────────────────────────────────── */}
      <Text style={styles.modeText}>{stepLabels[stepIndex]}</Text>

      {/* ─────────────────────────────────────────────── */}
      {/* Dynamic Step Button */}
      {/* ─────────────────────────────────────────────── */}
      {renderStepAdvanceButton()}

      {/* ─────────────────────────────────────────────── */}
      {/* Bottom Controls */}
      {/* ─────────────────────────────────────────────── */}
      <View style={styles.controls}>
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

      {/* ─────────────────────────────────────────────── */}
      {/* Court */}
      {/* ─────────────────────────────────────────────── */}
      <View style={styles.court}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.watermark}
        />

        {/* Court Lines */}
        <View style={styles.lineLeft} />
        <View style={styles.lineRight} />
        <View style={styles.lineTop} />
        <View style={styles.lineBottom} />
        <View style={styles.net} />
        <View style={styles.attackLine} />

        {/* Return Ball Indicators */}
        <View style={styles.returnRow}>
          <View
            style={[
              styles.returnBall,
              mode === 'defendLeft' && styles.returnBallSelected,
            ]}
          />
          <View
            style={[
              styles.returnBall,
              mode === 'defendMiddle' && styles.returnBallSelected,
            ]}
          />
          <View
            style={[
              styles.returnBall,
              mode === 'defendRight' && styles.returnBallSelected,
            ]}
          />
        </View>

        {/* Ball Animation */}
        {ballVisible && (
          <Animated.View
            style={[
              styles.ball,
              {
                transform: [
                  { translateX: Animated.subtract(ballAnim.x, 10) },
                  { translateY: Animated.subtract(ballAnim.y, 10) },
                ],
              },
            ]}
          />
        )}

        {/* Players */}
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

            {/* Label Badge (Initials or Number) */}
            {playerLabels[i] && (
              <View style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>{playerLabels[i]}</Text>
              </View>
            )}

            {/* Gear Button */}
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

            {/* Server Badge */}
            {i === SERVER_INDEX && (
              <View style={styles.serverBadge}>
                <Text style={styles.serverBadgeText}>S</Text>
              </View>
            )}
          </Animated.View>
        ))}
      </View>

      {/* ─────────────────────────────────────────────── */}
      {/* Save Full Play Modal */}
      {/* ─────────────────────────────────────────────── */}
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
      {/* ─────────────────────────────────────────────── */}
      {/* Role & Label Modal */}
      {/* ─────────────────────────────────────────────── */}
      <Modal visible={roleModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Player Settings</Text>

            {/* Position Selection */}
            <Text style={[styles.modalTitle, { fontSize: 16, marginTop: 4 }]}>
              Select Position
            </Text>

            {VOLLEYBALL_POSITIONS.map((pos) => {
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

            {/* Label Input (Initials or Jersey #) */}
            <Text style={[styles.modalTitle, { fontSize: 16, marginTop: 10 }]}>
              Initials or Jersey #
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Initials or Jersey #"
              placeholderTextColor="#999"
              value={tempLabel}
              onChangeText={setTempLabel}
              maxLength={4} // user can type more but we sanitize to 2
            />

            {/* Done Button */}
            <TouchableOpacity
              style={[styles.modalCancel, { marginTop: 10 }]}
              onPress={() => {
                let label = tempLabel.trim().toUpperCase();

                // Limit to 2 characters
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

    </View>
  );
}
//
// ─────────────────────────────────────────────────────────────
//   STYLES
// ─────────────────────────────────────────────────────────────
//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
    alignItems: 'center',
  },

  //
  // Instructions
  //
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

  //
  // Step Label + Step Button
  //
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
  stepAdvanceBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  //
  // Court
  //
  court: {
    width,
    height: COURT_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 10,
    marginTop: -10,
  },
  watermark: {
    position: 'absolute',
    width: '35%',
    height: '35%',
    opacity: 0.18,
    alignSelf: 'center',
    top: '30%',
  },

  lineLeft: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: '#2b6cb0',
  },
  lineRight: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: '100%',
    backgroundColor: '#2b6cb0',
  },
  lineTop: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#2b6cb0',
  },
  lineBottom: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: '#2b6cb0',
  },
  net: {
    position: 'absolute',
    top: COURT_HEIGHT / 2,
    height: 3,
    width: '100%',
    backgroundColor: '#2b6cb0',
  },
  attackLine: {
    position: 'absolute',
    top: COURT_HEIGHT * 0.65,
    height: 2,
    width: '100%',
    backgroundColor: '#2b6cb0',
  },

  //
  // Return Ball Indicators
  //
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

  //
  // Ball Animation
  //
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

  //
  // Players
  //
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

  //
  // Bottom Controls
  //
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

  //
  // Modals
  //
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

  //
  // Role Modal Options
  //
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


