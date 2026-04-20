import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const COURT_HEIGHT = width * 1.4;

type Rotation = 1 | 2 | 3 | 4 | 5 | 6;
type Formation = '6-2' | '5-1';
type DefenseZone = 'left' | 'middle' | 'right';
type Pos = { x: number; y: number };

type RotationData = {
  labels: string[];
  base: Pos[];
  receive: Pos[];
  defense: Record<DefenseZone, Pos[]>;
};

const toPx = (v: number, axis: 'x' | 'y') =>
  axis === 'x' ? v * width : v * COURT_HEIGHT;

const Z = {
  LF: { x: 0.2, y: 0.65 },
  MF: { x: 0.5, y: 0.65 },
  RF: { x: 0.8, y: 0.65 },
  LB: { x: 0.2, y: 0.9 },
  MB: { x: 0.5, y: 0.9 },
  RB: { x: 0.8, y: 0.9 },
};

// ---------------- 6-2 ----------------
const sixTwo: Record<Rotation, RotationData> = {
  1: {
    labels: ['R1', 'M1', 'O2', 'O1', 'M2', 'S1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.24, y: 0.58 },
      { x: 0.31, y: 0.50 },
      { x: 0.72, y: 0.72 },
      { x: 0.23, y: 0.78 },
      { x: 0.50, y: 0.78 },
      { x: 0.85, y: 0.85 },
    ],
    defense: {
      right: [
        { x: 0.85, y: 0.50 },
        { x: 0.75, y: 0.50 },
        { x: 0.25, y: 0.60 },
        { x: 0.20, y: 0.70 },
        { x: 0.50, y: 0.90 },
        { x: 0.85, y: 0.70 },
      ],
      middle: [
        { x: 0.75, y: 0.60 },
        { x: 0.50, y: 0.50 },
        { x: 0.15, y: 0.62 },
        { x: 0.30, y: 0.60 },
        { x: 0.52, y: 0.85 },
        { x: 0.72, y: 0.73 },
      ],
      left: [
        { x: 0.70, y: 0.62 },
        { x: 0.22, y: 0.50 },
        { x: 0.12, y: 0.50 },
        { x: 0.15, y: 0.70 },
        { x: 0.60, y: 0.80 },
        { x: 0.70, y: 0.72 },
      ],
    },
  },

  2: {
    labels: ['O1', 'R1', 'M1', 'M2', 'S1', 'O2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.15, y: 0.75 },
      { x: 0.50, y: 0.55 },
      { x: 0.65, y: 0.50 },
      { x: 0.45, y: 0.80 },
      { x: 0.55, y: 0.67 },
      { x: 0.80, y: 0.80 },
    ],
    defense: {
      right: [
        { x: 0.20, y: 0.57 },
        { x: 0.85, y: 0.52 },
        { x: 0.75, y: 0.50 },
        { x: 0.40, y: 0.85 },
        { x: 0.85, y: 0.68 },
        { x: 0.20, y: 0.70 },
      ],
      middle: [
        { x: 0.15, y: 0.67 },
        { x: 0.75, y: 0.64 },
        { x: 0.50, y: 0.50 },
        { x: 0.50, y: 0.81 },
        { x: 0.75, y: 0.75 },
        { x: 0.25, y: 0.75 },
      ],
      left: [
        { x: 0.12, y: 0.50 },
        { x: 0.75, y: 0.62 },
        { x: 0.22, y: 0.50 },
        { x: 0.60, y: 0.75 },
        { x: 0.70, y: 0.72 },
        { x: 0.12, y: 0.70 },
      ],
    },
  },

  3: {
    labels: ['M2', 'O1', 'R1', 'S1', 'O2', 'M1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.17, y: 0.54 },
      { x: 0.30, y: 0.75 },
      { x: 0.85, y: 0.54 },
      { x: 0.35, y: 0.60 },
      { x: 0.55, y: 0.75 },
      { x: 0.75, y: 0.75 },
    ],
    defense: {
      right: [
        { x: 0.70, y: 0.50 },
        { x: 0.20, y: 0.63 },
        { x: 0.80, y: 0.50 },
        { x: 0.80, y: 0.68 },
        { x: 0.20, y: 0.75 },
        { x: 0.55, y: 0.85 },
      ],
      middle: [
        { x: 0.50, y: 0.50 },
        { x: 0.37, y: 0.63 },
        { x: 0.78, y: 0.63 },
        { x: 0.70, y: 0.76 },
        { x: 0.30, y: 0.76 },
        { x: 0.50, y: 0.85 },
      ],
      left: [
        { x: 0.22, y: 0.50 },
        { x: 0.12, y: 0.50 },
        { x: 0.70, y: 0.62 },
        { x: 0.65, y: 0.72 },
        { x: 0.12, y: 0.74 },
        { x: 0.52, y: 0.80 },
      ],
    },
  },

  4: {
    labels: ['R2', 'M2', 'O1', 'O2', 'M1', 'S2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.15, y: 0.62 },
      { x: 0.30, y: 0.50 },
      { x: 0.75, y: 0.70 },
      { x: 0.18, y: 0.80 },
      { x: 0.50, y: 0.80 },
      { x: 0.85, y: 0.80 },
    ],
    defense: {
      right: [
        { x: 0.80, y: 0.50 },
        { x: 0.70, y: 0.50 },
        { x: 0.20, y: 0.62 },
        { x: 0.24, y: 0.70 },
        { x: 0.45, y: 0.75 },
        { x: 0.80, y: 0.70 },
      ],
      middle: [
        { x: 0.75, y: 0.62 },
        { x: 0.50, y: 0.50 },
        { x: 0.25, y: 0.62 },
        { x: 0.25, y: 0.75 },
        { x: 0.55, y: 0.80 },
        { x: 0.75, y: 0.75 },
      ],
      left: [
        { x: 0.75, y: 0.62 },
        { x: 0.22, y: 0.50 },
        { x: 0.12, y: 0.50 },
        { x: 0.12, y: 0.70 },
        { x: 0.53, y: 0.80 },
        { x: 0.60, y: 0.70 },
      ],
    },
  },

  5: {
    labels: ['O2', 'R2', 'M2', 'M1', 'S2', 'O1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.15, y: 0.66 },
      { x: 0.65, y: 0.60 },
      { x: 0.75, y: 0.50 },
      { x: 0.50, y: 0.80 },
      { x: 0.50, y: 0.65 },
      { x: 0.80, y: 0.80 },
    ],
    defense: {
      right: [
        { x: 0.20, y: 0.62 },
        { x: 0.82, y: 0.50 },
        { x: 0.72, y: 0.50 },
        { x: 0.45, y: 0.75 },
        { x: 0.80, y: 0.70 },
        { x: 0.23, y: 0.70 },
      ],
      middle: [
        { x: 0.20, y: 0.62 },
        { x: 0.80, y: 0.62 },
        { x: 0.50, y: 0.50 },
        { x: 0.50, y: 0.85 },
        { x: 0.70, y: 0.80 },
        { x: 0.20, y: 0.80 },
      ],
      left: [
        { x: 0.12, y: 0.50 },
        { x: 0.80, y: 0.62 },
        { x: 0.22, y: 0.50 },
        { x: 0.60, y: 0.85 },
        { x: 0.78, y: 0.70 },
        { x: 0.12, y: 0.70 },
      ],
    },
  },

  6: {
    labels: ['M1', 'O2', 'R2', 'S2', 'O1', 'M2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.12, y: 0.50 },
      { x: 0.18, y: 0.70 },
      { x: 0.85, y: 0.50 },
      { x: 0.30, y: 0.62 },
      { x: 0.50, y: 0.80 },
      { x: 0.70, y: 0.80 },
    ],
    defense: {
      right: [
        { x: 0.70, y: 0.50 },
        { x: 0.20, y: 0.62 },
        { x: 0.80, y: 0.50 },
        { x: 0.80, y: 0.70 },
        { x: 0.20, y: 0.76 },
        { x: 0.45, y: 0.80 },
      ],
      middle: [
        { x: 0.50, y: 0.50 },
        { x: 0.30, y: 0.62 },
        { x: 0.70, y: 0.62 },
        { x: 0.75, y: 0.68 },
        { x: 0.30, y: 0.70 },
        { x: 0.60, y: 0.80 },
      ],
      left: [
        { x: 0.22, y: 0.50 },
        { x: 0.12, y: 0.50 },
        { x: 0.75, y: 0.62 },
        { x: 0.75, y: 0.70 },
        { x: 0.12, y: 0.68 },
        { x: 0.60, y: 0.80 },
      ],
    },
  },
};

// ---------------- 5-1 (VERSION B) ----------------
// (UNCHANGED — same as your working version)
const fiveOne: Record<Rotation, RotationData> = {
  1: {
    labels: ['R1', 'M1', 'O2', 'O1', 'M2', 'S'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.22, y: 0.58 },
      { x: 0.25, y: 0.52 },
      { x: 0.72, y: 0.80 },
      { x: 0.22, y: 0.82 },
      { x: 0.50, y: 0.82 },
      { x: 0.78, y: 0.86 },
    ],
    defense: {
      right: [
        { x: 0.80, y: 0.52 },
        { x: 0.70, y: 0.52 },
        { x: 0.28, y: 0.60 },
        { x: 0.24, y: 0.75 },
        { x: 0.50, y: 0.90 },
        { x: 0.78, y: 0.70 },
      ],
      middle: [
        { x: 0.78, y: 0.60 },
        { x: 0.45, y: 0.52 },
        { x: 0.22, y: 0.60 },
        { x: 0.28, y: 0.75 },
        { x: 0.50, y: 0.90 },
        { x: 0.73, y: 0.75 },
      ],
      left: [
        { x: 0.60, y: 0.60 },
        { x: 0.22, y: 0.52 },
        { x: 0.12, y: 0.52 },
        { x: 0.15, y: 0.75 },
        { x: 0.50, y: 0.90 },
        { x: 0.75, y: 0.78 },
      ],
    },
  },

  2: {
    labels: ['O1', 'R1', 'M1', 'M2', 'S', 'O2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.22, y: 0.82 },
      { x: 0.55, y: 0.60 },
      { x: 0.65, y: 0.52 },
      { x: 0.45, y: 0.85 },
      { x: 0.58, y: 0.68 },
      { x: 0.85, y: 0.85 },
    ],
    defense: {
      right: [
        { x: 0.20, y: 0.55 },
        { x: 0.85, y: 0.50 },
        { x: 0.75, y: 0.50 },
        { x: 0.45, y: 0.85 },
        { x: 0.70, y: 0.70 },
        { x: 0.25, y: 0.78 },
      ],
      middle: [
        { x: 0.20, y: 0.58 },
        { x: 0.75, y: 0.55 },
        { x: 0.47, y: 0.50 },
        { x: 0.50, y: 0.87 },
        { x: 0.70, y: 0.78 },
        { x: 0.24, y: 0.78 },
      ],
      left: [
        { x: 0.12, y: 0.50 },
        { x: 0.75, y: 0.58 },
        { x: 0.22, y: 0.50 },
        { x: 0.55, y: 0.80 },
        { x: 0.73, y: 0.75 },
        { x: 0.18, y: 0.70 },
      ],
    },
  },

  3: {
    labels: ['M2', 'O1', 'R1', 'S', 'O2', 'M1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.55 },
      { x: 0.30, y: 0.73 },
      { x: 0.80, y: 0.52 },
      { x: 0.35, y: 0.65 },
      { x: 0.55, y: 0.73 },
      { x: 0.75, y: 0.73 },
    ],
    defense: {
      right: [
        { x: 0.70, y: 0.50 },
        { x: 0.25, y: 0.60 },
        { x: 0.80, y: 0.52 },
        { x: 0.73, y: 0.70 },
        { x: 0.25, y: 0.75 },
        { x: 0.53, y: 0.88 },
      ],
      middle: [
        { x: 0.47, y: 0.50 },
        { x: 0.18, y: 0.62 },
        { x: 0.82, y: 0.62 },
        { x: 0.65, y: 0.80 },
        { x: 0.35, y: 0.80 },
        { x: 0.50, y: 0.90 },
      ],
      left: [
        { x: 0.22, y: 0.52 },
        { x: 0.12, y: 0.52 },
        { x: 0.70, y: 0.62 },
        { x: 0.65, y: 0.70 },
        { x: 0.12, y: 0.74 },
        { x: 0.50, y: 0.80 },
      ],
    },
  },

  4: {
    labels: ['S', 'M2', 'O1', 'O2', 'M1', 'R2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.45, y: 0.57 },
      { x: 0.50, y: 0.50 },
      { x: 0.55, y: 0.50 },
      { x: 0.22, y: 0.80 },
      { x: 0.50, y: 0.80 },
      { x: 0.72, y: 0.80 },
    ],
    defense: {
      right: [
        { x: 0.80, y: 0.52 },
        { x: 0.70, y: 0.50 },
        { x: 0.25, y: 0.60 },
        { x: 0.20, y: 0.78 },
        { x: 0.50, y: 0.85 },
        { x: 0.75, y: 0.70 },
      ],
      middle: [
        { x: 0.78, y: 0.67 },
        { x: 0.50, y: 0.50 },
        { x: 0.35, y: 0.67 },
        { x: 0.20, y: 0.80 },
        { x: 0.50, y: 0.85 },
        { x: 0.75, y: 0.77 },
      ],
      left: [
        { x: 0.65, y: 0.65 },
        { x: 0.25, y: 0.52 },
        { x: 0.15, y: 0.52 },
        { x: 0.25, y: 0.70 },
        { x: 0.50, y: 0.85 },
        { x: 0.75, y: 0.77 },
      ],
    },
  },

  5: {
    labels: ['O2', 'S', 'M2', 'M1', 'R2', 'O1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.30, y: 0.60 },
      { x: 0.50, y: 0.60 },
      { x: 0.55, y: 0.52 },
      { x: 0.15, y: 0.85 },
      { x: 0.50, y: 0.85 },
      { x: 0.75, y: 0.85 },
    ],
    defense: {
      right: [
        { x: 0.15, y: 0.60 },
        { x: 0.75, y: 0.52 },
        { x: 0.65, y: 0.50 },
        { x: 0.50, y: 0.85 },
        { x: 0.75, y: 0.72 },
        { x: 0.15, y: 0.80 },
      ],
      middle: [
        { x: 0.20, y: 0.66 },
        { x: 0.80, y: 0.66 },
        { x: 0.52, y: 0.50 },
        { x: 0.50, y: 0.85 },
        { x: 0.80, y: 0.76 },
        { x: 0.20, y: 0.80 },
      ],
      left: [
        { x: 0.12, y: 0.52 },
        { x: 0.65, y: 0.67 },
        { x: 0.20, y: 0.52 },
        { x: 0.55, y: 0.85 },
        { x: 0.80, y: 0.75 },
        { x: 0.12, y: 0.70 },
      ],
    },
  },

  6: {
    labels: ['M1', 'O2', 'S', 'R2', 'O1', 'M2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.15, y: 0.52 },
      { x: 0.20, y: 0.62 },
      { x: 0.80, y: 0.55 },
      { x: 0.15, y: 0.85 },
      { x: 0.50, y: 0.85 },
      { x: 0.85, y: 0.85 },
    ],
    defense: {
      right: [
        { x: 0.65, y: 0.50 },
        { x: 0.15, y: 0.60 },
        { x: 0.75, y: 0.52 },
        { x: 0.80, y: 0.70 },
        { x: 0.12, y: 0.75 },
        { x: 0.50, y: 0.85 },
      ],
      middle: [
        { x: 0.50, y: 0.52 },
        { x: 0.24, y: 0.62 },
        { x: 0.65, y: 0.62 },
        { x: 0.63, y: 0.72 },
        { x: 0.20, y: 0.77 },
        { x: 0.50, y: 0.85 },
      ],
      left: [
        { x: 0.22, y: 0.52 },
        { x: 0.12, y: 0.50 },
        { x: 0.60, y: 0.62 },
        { x: 0.63, y: 0.72 },
        { x: 0.12, y: 0.68 },
        { x: 0.50, y: 0.85 },
      ],
    },
  },
};

// ---------------- COMPONENT ----------------
export default function Rotations() {
  const [rotation, setRotation] = useState<Rotation>(1);
  const [formation, setFormation] = useState<Formation>('6-2');

  // Pink highlight follows the label as it rotates
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Jersey numbers stored PER LABEL (blank by default)
  const [jerseys, setJerseys] = useState<Record<string, string>>({});

  // Modal editing
  const [editLabel, setEditLabel] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedBall, setSelectedBall] = useState<DefenseZone | null>(null);
  const [showServeBall, setShowServeBall] = useState(false);

  // ---------------- ANIMATION REFS ----------------
  const anims = useRef(
    Array(6)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
      }))
  ).current;

  const ballAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const serveBallAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // ---------------- DATA SELECTOR ----------------
  const getData = (): RotationData =>
    formation === '6-2' ? sixTwo[rotation] : fiveOne[rotation];

  const data = getData();

  // ---------------- INIT BASE POSITIONS ----------------
  useEffect(() => {
    data.base.forEach((pos, i) => {
      anims[i].x.setValue(toPx(pos.x, 'x'));
      anims[i].y.setValue(toPx(pos.y, 'y'));
    });

    setSelectedBall(null);
  }, [rotation, formation]);

  // ---------------- MOVE PLAYERS ----------------
  const movePlayers = (positions: Pos[]) => {
    positions.forEach((p, i) => {
      Animated.timing(anims[i].x, {
        toValue: toPx(p.x, 'x'),
        duration: 2000,
        useNativeDriver: false,
      }).start();

      Animated.timing(anims[i].y, {
        toValue: toPx(p.y, 'y'),
        duration: 2000,
        useNativeDriver: false,
      }).start();
    });
  };

  // ---------------- RUN RECEIVE ----------------
  const runReceive = () => {
    setSelectedBall(null);

    // Move players into receive formation
    movePlayers(data.receive);

    // Serve ball starts at RB
    serveBallAnim.setValue({
      x: toPx(0.8, 'x'),
      y: toPx(0.9, 'y'),
    });

    setShowServeBall(true);

    // Serve travels to middle return ball
    Animated.timing(serveBallAnim, {
  toValue: {
    x: width * 0.5 - 10,
    y: 125 - 10,
  },

      duration: 2500,
      useNativeDriver: false,
    }).start(() => setShowServeBall(false));
  };

  // ---------------- RUN DEFENSE ----------------
  const runDefense = (zone: DefenseZone) => {
    movePlayers(data.defense[zone]);
  };

  // ---------------- ROTATE ----------------
  const rotate = () =>
    setRotation((prev) => (prev === 6 ? 1 : ((prev + 1) as Rotation)));

  // ---------------- SELECT RETURN BALL ----------------
  const selectBall = (side: DefenseZone) => {
    setSelectedBall(side);

    // Move players into defense
    runDefense(side);

    // Ball starts at top middle
    ballAnim.setValue({
  x: width * 0.5 - 10,
  y: 125 - 10,
});


    // Ball travels to net line
    Animated.timing(ballAnim, {
     toValue: {
  x:
    side === 'left'
      ? width * 0.2 - 10
      : side === 'middle'
      ? width * 0.5 - 10
      : width * 0.8 - 10,
  y: COURT_HEIGHT / 2 - 10,
},


      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => setSelectedBall(null), 400);
    });
  };

  // ---------------- SAVE JERSEY ----------------
  const saveJersey = () => {
    if (editLabel) {
      setJerseys((prev) => ({ ...prev, [editLabel]: editValue }));
    }
    setEditLabel(null);
    setEditValue('');
  };
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
            Select Run to simulate a serve. Select a return ball to simulate a defensive transition.
          </Text>

          <Text style={styles.instructionsText}>
            Rotate will rotate players just like they would on the court.
          </Text>

          <Text style={styles.instructionsText}>
            Use the formation toggle to switch between 6–2 and 5–1.
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

      {/* ---------------- FORMATION WATERMARK ---------------- */}
      <Text style={styles.formationWatermark}>
        {formation === '6-2' ? '6–2 Formation' : '5–1 Formation'}
      </Text>

      {/* ---------------- COURT ---------------- */}
      <View style={styles.court}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.watermark}
        />

        {/* COURT LINES */}
        <View style={styles.lineLeft} />
        <View style={styles.lineRight} />
        <View style={styles.lineTop} />
        <View style={styles.lineBottom} />
        <View style={styles.net} />
        <View style={styles.attackLine} />

        {/* ---------------- PLAYERS ---------------- */}
        {data.labels.map((label: string, i: number) => {
  const isMe = selectedPlayer === label;
  const jersey = jerseys[label] || '';

  return (
    <TouchableOpacity
      key={i}
      onPress={() =>
        setSelectedPlayer(isMe ? null : label)
      }
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.player,
          isMe && styles.playerMeHighlight,
          { left: anims[i].x, top: anims[i].y },
        ]}
      >
        {/* ME LABEL */}
        {isMe && <Text style={styles.meLabel}>Me</Text>}

        {/* POSITION LABEL */}
        <Text style={styles.text}>{label}</Text>

        {/* JERSEY BADGE */}
        {jersey !== '' && (
          <View style={styles.jerseyBadge}>
            <Text style={styles.jerseyText}>{jersey}</Text>
          </View>
        )}

        {/* GEAR ICON */}
        <TouchableOpacity
          style={styles.gearButton}
          onPress={() => {
            setEditLabel(label);
            setEditValue(jersey);
          }}
        >
          <Text style={styles.gearText}>⚙️</Text>
        </TouchableOpacity>

        {/* ⭐ SERVER BADGE (BOTTOM RIGHT PLAYER) */}
        {i === 5 && (
          <View style={styles.serverBadge}>
            <Text style={styles.serverBadgeText}>S</Text>
          </View>
        )}

      </Animated.View>
    </TouchableOpacity>
  );
})}
        {/* ---------------- RETURN BALL LABEL ---------------- */}
        <Text style={styles.ballLabel}>Select return position</Text>

        {/* ---------------- RETURN BALLS ---------------- */}
        {(['left', 'middle', 'right'] as DefenseZone[]).map((side) => (
          <TouchableOpacity key={side} onPress={() => selectBall(side)}>
            <View
              style={[
                styles.returnBall,
                selectedBall === side && styles.returnBallSelected,
                {
                  left:
                    side === 'left'
                      ? 0.2 * width - 25
                      : side === 'middle'
                      ? 0.5 * width - 25
                      : 0.8 * width - 25,
                },
              ]}
            />
          </TouchableOpacity>
        ))}

        {/* ---------------- ANIMATED RETURN BALL ---------------- */}
        {selectedBall && (
          <Animated.View
            style={[
              styles.ballAnim,
              { left: ballAnim.x, top: ballAnim.y },
            ]}
          />
        )}

        {/* ---------------- ANIMATED SERVE BALL ---------------- */}
        {showServeBall && (
          <Animated.View
            style={[
              styles.ballAnim,
              { left: serveBallAnim.x, top: serveBallAnim.y },
            ]}
          />
        )}
      </View>
      {/* ---------------- JERSEY EDIT MODAL ---------------- */}
      {editLabel && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Jersey ({editLabel})</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Jersey Number"
              keyboardType="numeric"
              value={editValue}
              onChangeText={setEditValue}
            />

            <TouchableOpacity style={styles.modalSave} onPress={saveJersey}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setEditLabel(null)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ---------------- CONTROLS ---------------- */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={runReceive}>
          <Text style={styles.btnText}>Run</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={rotate}>
          <Text style={styles.btnText}>Rotate (R{rotation})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            setFormation((f) => (f === '6-2' ? '5-1' : '6-2'))
          }
        >
          <Text style={styles.btnText}>{formation}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  court: {
    width,
    height: COURT_HEIGHT,
    backgroundColor: '#fff',
  },

  watermark: {
    position: 'absolute',
    width: '35%',
    height: '35%',
    opacity: 0.25,
    alignSelf: 'center',
    top: '30%',
  },

  formationWatermark: {
    position: 'absolute',
    top: '28%',
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    opacity: 0.25,
    color: '#3b7cd0',
    zIndex: 5,
  },

  /* COURT LINES */
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

  /* PLAYER BUBBLES */
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2b6cb0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerMeHighlight: {
    borderWidth: 3,
    borderColor: '#ff69b4',
  },

  meLabel: {
    position: 'absolute',
    top: -20,
    fontSize: 14,
    fontWeight: '700',
    color: '#ff69b4',
  },

  text: {
    color: '#fff',
    fontWeight: 'bold',
  },

  jerseyBadge: {
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

  jerseyText: {
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
  },

  /* RETURN BALLS */
  ballLabel: {
    position: 'absolute',
    top: 70,
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  returnBall: {
    position: 'absolute',
    top: 100,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff69b4',
  },

  returnBallSelected: {
    shadowColor: '#ff69b4',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },

  ballAnim: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff69b4',
  },

  /* CONTROLS */
  controls: {
    flexDirection: 'row',
    marginTop: 10,
  },

  btn: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    margin: 5,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  /* INSTRUCTIONS */
  instructionsBox: {
    width: '92%',
    backgroundColor: '#f4f6f8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
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

  /* MODAL */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  modalSave: {
    backgroundColor: '#2b6cb0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  modalSaveText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },

  modalClose: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 8,
  },

  modalCloseText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
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

});

