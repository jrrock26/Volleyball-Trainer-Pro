import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
const volleyballImg = require('../assets/images/volleyball.png');


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
  MF: { x: 0.45, y: 0.65 },
  RF: { x: 0.7, y: 0.65 },
  LB: { x: 0.2, y: 0.9 },
  MB: { x: 0.45, y: 0.9 },
  RB: { x: 0.75, y: 1.1 },
};

// ---------------- 6-2 ----------------
const sixTwo: Record<Rotation, RotationData> = {
  1: {
    labels: ['S2', 'M1', 'O2', 'O1', 'M2', 'S1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.60 },//r1
      { x: 0.31, y: 0.57 },//m1
      { x: 0.72, y: 0.80 },//o2
      { x: 0.20, y: 0.85 },//o1
      { x: 0.47, y: 0.85 },//m2
      { x: 0.80, y: 0.95 },//s1
    ],
    defense: {
      right: [
        { x: 0.82, y: 0.55 },//r1
        { x: 0.72, y: 0.55 },//m1
        { x: 0.25, y: 0.70 },//o2
        { x: 0.20, y: 0.85 },//o1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.80, y: 0.74 },//s1
      ],
      middle: [
        { x: 0.70, y: 0.70 },//r1
        { x: 0.46, y: 0.55 },//m1
        { x: 0.24, y: 0.70 },//o2
        { x: 0.27, y: 0.85 },//o1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
      ],
      left: [
        { x: 0.65, y: 0.62 },//r1
        { x: 0.22, y: 0.55 },//m1
        { x: 0.12, y: 0.55 },//o2
        { x: 0.15, y: 0.80 },//o1
        { x: 0.50, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
      ],
    },
  },

  2: {
    labels: ['O1', 'S2', 'M1', 'M2', 'S1', 'O2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.85 },//o1
      { x: 0.50, y: 0.60 },//r1
      { x: 0.65, y: 0.55 },//m1
      { x: 0.45, y: 0.90 },//m2
      { x: 0.55, y: 0.73 },//s1
      { x: 0.75, y: 0.90 },//o2
    ],
    defense: {
      right: [
        { x: 0.20, y: 0.65 },//o1
        { x: 0.82, y: 0.55 },//r1
        { x: 0.72, y: 0.55 },//m1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.80, y: 0.74 },//s1
        { x: 0.20, y: 0.75 },//o2
      ],
      middle: [
        { x: 0.24, y: 0.70 },//o1
        { x: 0.70, y: 0.70 },//r1
        { x: 0.46, y: 0.55 },//m1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
        { x: 0.27, y: 0.85 },//o2
      ],
      left: [
        { x: 0.12, y: 0.55 },//o1
        { x: 0.65, y: 0.62 },//r1
        { x: 0.22, y: 0.55 },//m1
        { x: 0.50, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
        { x: 0.15, y: 0.80 },//o2
      ],
    },
  },

  3: {
    labels: ['M2', 'O1', 'S2', 'S1', 'O2', 'M1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.60 },//m2
      { x: 0.35, y: 0.85 },//o1
      { x: 0.80, y: 0.58 },//r1
      { x: 0.40, y: 0.70 },//s1
      { x: 0.55, y: 0.85 },//o2
      { x: 0.70, y: 0.85 },//m1
    ],
    defense: {
      right: [
        { x: 0.72, y: 0.55 },//m2
        { x: 0.25, y: 0.70 },//o1
        { x: 0.82, y: 0.55 },//r1
        { x: 0.80, y: 0.74 },//s1
        { x: 0.25, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
      ],
      middle: [
        { x: 0.46, y: 0.55 },//m2
        { x: 0.20, y: 0.70 },//o1
        { x: 0.80, y: 0.70 },//r1
        { x: 0.70, y: 0.85 },//s1
        { x: 0.27, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
      ],
      left: [
        { x: 0.22, y: 0.55 },//m2
        { x: 0.12, y: 0.55 },//o1
        { x: 0.65, y: 0.62 },//r1
        { x: 0.65, y: 0.80 },//s1
        { x: 0.12, y: 0.80 },//o2
        { x: 0.50, y: 0.95 },//m1
      ],
    },
  },

  4: {
    labels: ['S1', 'M2', 'O1', 'O2', 'M1', 'S2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.60 },//r2
      { x: 0.31, y: 0.57 },//m2
      { x: 0.72, y: 0.80 },//o1
      { x: 0.20, y: 0.85 },//o2
      { x: 0.47, y: 0.85 },//m1
      { x: 0.80, y: 0.95 },//s2 
    ],
    defense: {
      right: [
        { x: 0.82, y: 0.55 },//r2
        { x: 0.72, y: 0.55 },//m2
        { x: 0.22, y: 0.68 },//o1
        { x: 0.20, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.80, y: 0.74 },//s2
      ],
      middle: [
        { x: 0.70, y: 0.70 },//r2 
        { x: 0.46, y: 0.55 },//m2
        { x: 0.25, y: 0.70 },//o1
        { x: 0.27, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//s2
      ],
      left: [
        { x: 0.65, y: 0.62 },//r2
        { x: 0.22, y: 0.55 },//m2
        { x: 0.12, y: 0.55 },//o1
        { x: 0.15, y: 0.80 },//o2
        { x: 0.50, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//s2
      ],
    },
  },

  5: {
    labels: ['O2', 'S1', 'M2', 'M1', 'S2', 'O1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.85 },//o2
      { x: 0.50, y: 0.60 },//r2
      { x: 0.65, y: 0.55 },//m2
      { x: 0.46, y: 0.95 },//m1
      { x: 0.46, y: 0.70 },//s2
      { x: 0.72, y: 0.95 },//o1
    ],
    defense: {
      right: [
        { x: 0.22, y: 0.70 },//o2
        { x: 0.82, y: 0.55 },//r2
        { x: 0.72, y: 0.55 },//m2
        { x: 0.45, y: 0.95 },//m1
        { x: 0.80, y: 0.74 },//s2
        { x: 0.18, y: 0.85 },//o1
      ],
      middle: [
        { x: 0.24, y: 0.70 },//o2
        { x: 0.70, y: 0.70 },//r2
        { x: 0.46, y: 0.55 },//m2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//s2
        { x: 0.27, y: 0.85 },//o1
      ],
      left: [
        { x: 0.12, y: 0.55 },//o2
        { x: 0.65, y: 0.62 },//r2
        { x: 0.22, y: 0.55 },//m2
        { x: 0.50, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//s2
        { x: 0.15, y: 0.80 },//o1
      ],
    },
  },

  6: {
    labels: ['M1', 'O2', 'S1', 'S2', 'O1', 'M2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.12, y: 0.55 },//m1
      { x: 0.20, y: 0.85 },//o2
      { x: 0.85, y: 0.55 },//r2
      { x: 0.30, y: 0.70 },//s2
      { x: 0.46, y: 0.95 },//o1
      { x: 0.70, y: 0.95 },//m2
    ],
    defense: {
      right: [
        { x: 0.72, y: 0.55 },//m1
        { x: 0.25, y: 0.70 },//o2
        { x: 0.82, y: 0.55 },//r2
        { x: 0.80, y: 0.74 },//s2
        { x: 0.20, y: 0.85 },//o1
        { x: 0.40, y: 0.95 },//m2
      ],
      middle: [
        { x: 0.46, y: 0.55 },//m1
        { x: 0.24, y: 0.70 },//o2 
        { x: 0.70, y: 0.70 },//r2
        { x: 0.75, y: 0.85 },//s2
        { x: 0.30, y: 0.85 },//o1
        { x: 0.50, y: 0.95 },//m2
      ],
      left: [
        { x: 0.22, y: 0.55 },//m1
        { x: 0.12, y: 0.55 },//o2
        { x: 0.65, y: 0.62 },//r2
        { x: 0.70, y: 0.85 },//s2
        { x: 0.12, y: 0.80 },//o1
        { x: 0.50, y: 0.95 },//m2
      ],
    },
  },
};

// ---------------- 5-1 (VERSION B) ----------------
// (UNCHANGED — same as your working version)
const fiveOne: Record<Rotation, RotationData> = {
   1: {
    labels: ['S2', 'M1', 'O2', 'O1', 'M2', 'S1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.60 },//r1
      { x: 0.31, y: 0.57 },//m1
      { x: 0.72, y: 0.80 },//o2
      { x: 0.20, y: 0.85 },//o1
      { x: 0.47, y: 0.85 },//m2
      { x: 0.80, y: 0.95 },//s1
    ],
    defense: {
      right: [
        { x: 0.82, y: 0.55 },//r1
        { x: 0.72, y: 0.55 },//m1
        { x: 0.25, y: 0.70 },//o2
        { x: 0.20, y: 0.85 },//o1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.80, y: 0.74 },//s1
      ],
      middle: [
        { x: 0.70, y: 0.70 },//r1
        { x: 0.46, y: 0.55 },//m1
        { x: 0.24, y: 0.70 },//o2
        { x: 0.27, y: 0.85 },//o1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
      ],
      left: [
        { x: 0.65, y: 0.62 },//r1
        { x: 0.22, y: 0.55 },//m1
        { x: 0.12, y: 0.55 },//o2
        { x: 0.15, y: 0.80 },//o1
        { x: 0.50, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
      ],
    },
  },

  2: {
    labels: ['O1', 'S2', 'M1', 'M2', 'S1', 'O2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.85 },//o1
      { x: 0.50, y: 0.60 },//r1
      { x: 0.65, y: 0.55 },//m1
      { x: 0.45, y: 0.90 },//m2
      { x: 0.55, y: 0.73 },//s1
      { x: 0.75, y: 0.90 },//o2
    ],
    defense: {
      right: [
        { x: 0.20, y: 0.65 },//o1
        { x: 0.82, y: 0.55 },//r1
        { x: 0.72, y: 0.55 },//m1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.80, y: 0.74 },//s1
        { x: 0.20, y: 0.75 },//o2
      ],
      middle: [
        { x: 0.24, y: 0.70 },//o1
        { x: 0.70, y: 0.70 },//r1
        { x: 0.46, y: 0.55 },//m1
        { x: 0.46, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
        { x: 0.27, y: 0.85 },//o2
      ],
      left: [
        { x: 0.12, y: 0.55 },//o1
        { x: 0.65, y: 0.62 },//r1
        { x: 0.22, y: 0.55 },//m1
        { x: 0.50, y: 0.95 },//m2
        { x: 0.70, y: 0.85 },//s1
        { x: 0.15, y: 0.80 },//o2
      ],
    },
  },

  3: {
    labels: ['M2', 'O1', 'S2', 'S1', 'O2', 'M1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.60 },//m2
      { x: 0.35, y: 0.85 },//o1
      { x: 0.80, y: 0.58 },//r1
      { x: 0.40, y: 0.70 },//s1
      { x: 0.55, y: 0.85 },//o2
      { x: 0.70, y: 0.85 },//m1
    ],
    defense: {
      right: [
        { x: 0.72, y: 0.55 },//m2
        { x: 0.25, y: 0.70 },//o1
        { x: 0.82, y: 0.55 },//r1
        { x: 0.80, y: 0.74 },//s1
        { x: 0.25, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
      ],
      middle: [
        { x: 0.46, y: 0.55 },//m2
        { x: 0.20, y: 0.70 },//o1
        { x: 0.80, y: 0.70 },//r1
        { x: 0.70, y: 0.85 },//s1
        { x: 0.27, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
      ],
      left: [
        { x: 0.22, y: 0.55 },//m2
        { x: 0.12, y: 0.55 },//o1
        { x: 0.65, y: 0.62 },//r1
        { x: 0.65, y: 0.80 },//s1
        { x: 0.12, y: 0.80 },//o2
        { x: 0.50, y: 0.95 },//m1
      ],
    },
  },

  4: {
    labels: ['S1', 'M2', 'O1', 'O2', 'M1', 'S2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.35, y: 0.70 },//s1
      { x: 0.46, y: 0.55 },//m2
      { x: 0.55, y: 0.55 },//o1
      { x: 0.22, y: 0.85 },//o2
      { x: 0.46, y: 0.85 },//m1
      { x: 0.72, y: 0.85 },//r2
    ],
    defense: {
      right: [
        { x: 0.82, y: 0.55 },//s1 
        { x: 0.72, y: 0.55 },//m2
        { x: 0.25, y: 0.70 },//o1
        { x: 0.20, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.80, y: 0.74 },//r2
      ],
      middle: [
        { x: 0.70, y: 0.70 },//s1
        { x: 0.46, y: 0.55 },//m2
        { x: 0.20, y: 0.70 },//o1
        { x: 0.12, y: 0.85 },//o2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//r2
      ],
      left: [
        { x: 0.65, y: 0.62 },//s1
        { x: 0.22, y: 0.55 },//m2
        { x: 0.12, y: 0.55 },//o1
        { x: 0.15, y: 0.70 },//o2
        { x: 0.50, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//r2
      ],
    },
  },

  5: {
    labels: ['O2', 'S1', 'M2', 'M1', 'S2', 'O1'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.20, y: 0.65 },//o2
      { x: 0.46, y: 0.65 },//s1
      { x: 0.55, y: 0.55 },//m2
      { x: 0.15, y: 0.85 },//m1
      { x: 0.46, y: 0.85 },//r2
      { x: 0.75, y: 0.85 },//o1
    ],
    defense: {
      right: [
        { x: 0.25, y: 0.70 },//o2
        { x: 0.82, y: 0.55 },//s1
        { x: 0.72, y: 0.55 },//m2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.80, y: 0.74 },//r2
        { x: 0.15, y: 0.85 },//o1
      ],
      middle: [
        { x: 0.24, y: 0.70 },//o2
        { x: 0.70, y: 0.70 },//s1
        { x: 0.46, y: 0.55 },//m2
        { x: 0.46, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//r2
        { x: 0.27, y: 0.85 },//o1
      ],
      left: [
        { x: 0.12, y: 0.55 },//o2
        { x: 0.65, y: 0.62 },//s1
        { x: 0.22, y: 0.55 },//m2
        { x: 0.50, y: 0.95 },//m1
        { x: 0.70, y: 0.85 },//r2
        { x: 0.12, y: 0.80 },//o1
      ],
    },
  },

  6: {
    labels: ['M1', 'O2', 'S1', 'S2', 'O1', 'M2'],
    base: [Z.LF, Z.MF, Z.RF, Z.LB, Z.MB, Z.RB],
    receive: [
      { x: 0.12, y: 0.55 },//m1
      { x: 0.20, y: 0.60 },//o2
      { x: 0.70, y: 0.60 },//s1
      { x: 0.20, y: 0.85 },//r2
      { x: 0.46, y: 0.85 },//o1
      { x: 0.80, y: 0.85 },//m2
    ],
    defense: {
      right: [
        { x: 0.72, y: 0.55 },//m1
        { x: 0.25, y: 0.70 },//o2
        { x: 0.82, y: 0.57 },//s1
        { x: 0.70, y: 0.74 },//r2 
        { x: 0.20, y: 0.85 },//o1
        { x: 0.46, y: 0.95 },//m2
      ],
      middle: [
        { x: 0.46, y: 0.55 },//m1
        { x: 0.24, y: 0.70 },//o2
        { x: 0.70, y: 0.70 },//s1
        { x: 0.70, y: 0.85 },//r2
        { x: 0.20, y: 0.85 },//o1
        { x: 0.46, y: 0.95 },//m2 
      ],
      left: [
        { x: 0.22, y: 0.55 },//m1
        { x: 0.12, y: 0.55 },//o2
        { x: 0.65, y: 0.62 },//s1
        { x: 0.70, y: 0.85 },//r2
        { x: 0.12, y: 0.80 },//o1
        { x: 0.50, y: 0.95 },//m2
      ],
    },
  },
};

// ---------------- COMPONENT ----------------
export default function Rotations() {
  const [rotation, setRotation] = useState<Rotation>(1);
  const [formation, setFormation] = useState<Formation>('6-2');

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [jerseys, setJerseys] = useState<Record<string, string>>({});
  const [editLabel, setEditLabel] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedBall, setSelectedBall] = useState<DefenseZone | null>(null);
  const [showServeBall, setShowServeBall] = useState(false);

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
const resetPlayers = () => {
  data.base.forEach((pos, i) => {
    Animated.timing(anims[i].x, {
      toValue: toPx(pos.x, 'x'),
      duration: 1200,
      useNativeDriver: false,
    }).start();

    Animated.timing(anims[i].y, {
      toValue: toPx(pos.y, 'y'),
      duration: 1200,
      useNativeDriver: false,
    }).start();
  });
};

  // ---------------- RUN RECEIVE ----------------
  const runReceive = () => {
    setSelectedBall(null);

    movePlayers(data.receive);

    // ⭐ Serve ball starts at RB (centered)
    serveBallAnim.setValue({
      x: toPx(0.8, 'x'),
      y: toPx(1.1, 'y'),
    });

    setShowServeBall(true);

    // ⭐ Serve travels to middle return ball (centered)
    Animated.timing(serveBallAnim, {
      toValue: {
        x: width * 0.5,
        y: 125,
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

    runDefense(side);

    // ⭐ Ball starts at top middle (centered)
    ballAnim.setValue({
      x: width * 0.5,
      y: 125,
    });

    // ⭐ Ball travels to net line (centered)
    Animated.timing(ballAnim, {
      toValue: {
        x:
          side === 'left'
            ? width * 0.2
            : side === 'middle'
            ? width * 0.5
            : width * 0.8,
        y: COURT_HEIGHT / 1.9,
      },
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
  setTimeout(() => {
    setSelectedBall(null);   // ball disappears
    resetPlayers();          // ⭐ players return to base AFTER ball is invisible
  }, 400);
});
  };

  const saveLabel = () => {
  if (editLabel) {
    setJerseys(prev => ({ ...prev, [editLabel]: editValue }));
  }
  setEditLabel(null);
  setEditValue('');
};


  return (
    <View style={styles.container}>

      {/* INSTRUCTIONS PANEL */}
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

      {/* FORMATION WATERMARK */}
      <Text style={styles.formationWatermark}>
        {formation === '6-2' ? '6–2 Formation' : '5–1 Formation'}
      </Text>

      {/* COURT */}
      <ImageBackground
        source={require('../assets/images/court.png')}
        style={styles.court}
        resizeMode="cover"
      >

        {/* COURT LINES */}
        <View style={styles.lineLeft} />
        <View style={styles.lineRight} />
        <View style={styles.lineTop} />
        <View style={styles.lineBottom} />
        <View style={styles.net} />
        <View style={styles.attackLine} />

        {/* EDIT PLAYER LABEL MODAL */}
<Modal visible={!!editLabel} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Edit Player Label</Text>

      <TextInput
        style={styles.modalInput}
        placeholder="Player Label"
        autoCapitalize="characters"
        maxLength={3}
        value={editValue}
        onChangeText={setEditValue}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveLabel}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setEditLabel(null);
          setEditValue('');
        }}
      >
        <Text style={styles.closeButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


        {/* PLAYERS */}
        {data.labels.map((label: string, i: number) => {
          const isMe = selectedPlayer === label;
          const jersey = jerseys[label] || '';

          return (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedPlayer(isMe ? null : label)}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.player,
                  isMe && styles.playerMeHighlight,
                  { left: anims[i].x, top: anims[i].y },
                ]}
              >
                {isMe && <Text style={styles.meLabel}>Me</Text>}
                <Text style={styles.text}>{label}</Text>

                {jersey !== '' && (
                  <View style={styles.jerseyBadge}>
                    <Text style={styles.jerseyText}>{jersey}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.gearButton}
                  onPress={() => {
                    setEditLabel(label);
                    setEditValue(jersey);
                  }}
                >
                  <Text style={styles.gearText}>⚙️</Text>
                </TouchableOpacity>

                {i === 5 && (
                  <View style={styles.serverBadge}>
                    <Text style={styles.serverBadgeText}>S</Text>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}

        {/* RETURN BALL LABEL */}
        <Text style={styles.ballLabel}>Select Left, Middle, or Right for Return</Text>

        {/* RETURN BALLS */}
        {(['left', 'middle', 'right'] as DefenseZone[]).map((side) => (
          <TouchableOpacity key={side} onPress={() => selectBall(side)}>
            <View
              style={[
                styles.returnBall,
                selectedBall === side && styles.returnBallSelected,
                {
                  left:
                    side === 'left'
                      ? 0.2 * width - 30
                      : side === 'middle'
                      ? 0.5 * width - 30
                      : 0.8 * width - 30,
                },
              ]}
            />
          </TouchableOpacity>
        ))}

       {/* ANIMATED RETURN BALL (always rendered, opacity toggles instantly) */}
<Animated.Image
  source={volleyballImg}
  style={{
    position: 'absolute',
    width: 32,
    height: 32,
    opacity: selectedBall ? 1 : 0,   // instant load
    zIndex: 9999,
    transform: [
      { translateX: Animated.subtract(ballAnim.x, 16) },
      { translateY: Animated.subtract(ballAnim.y, 16) },
    ],
  }}
  resizeMode="contain"
/>

{/* ANIMATED SERVE BALL (always rendered, opacity toggles instantly) */}
<Animated.Image
  source={volleyballImg}
  style={{
    position: 'absolute',
    width: 32,
    height: 32,
    opacity: showServeBall ? 1 : 0,  // instant load
    zIndex: 9999,
    transform: [
      { translateX: Animated.subtract(serveBallAnim.x, 16) },
      { translateY: Animated.subtract(serveBallAnim.y, 16) },
    ],
  }}
  resizeMode="contain"
/>

      </ImageBackground>

      {/* CONTROLS */}
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
    alignItems: 'center',
  },

  court: {
    flex: 1,
  width: '100%',
  height: '100%',
  overflow: 'visible',
  },

  formationWatermark: {
    position: 'absolute',
    top: '28%',
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    opacity: 0.80,
    color: '#3b7cd0',
    zIndex: 5,
  },

  /* COURT LINES */
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
    top: COURT_HEIGHT / 1.8,
    height:1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  attackLine: {
    position: 'absolute',
    top: COURT_HEIGHT * 0.80,
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
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
    color: '#2b6cb0',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
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
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalBox: {
  width: '80%',
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 12,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 12,
  textAlign: 'center',
},

modalInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 16,
  fontSize: 16,
},

saveButton: {
  backgroundColor: '#3A7AFE',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 10,
},

saveButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},

closeButton: {
  paddingVertical: 10,
  alignItems: 'center',
},

closeButtonText: {
  fontSize: 16,
  color: '#333',
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

