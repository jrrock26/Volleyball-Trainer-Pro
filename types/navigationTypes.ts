import { TrainingBlock } from '@/training/trainingLibrary';
import { PracticeDrill } from '../screens/Drills';

export type RootStackParamList = {
  // Home
  Home: undefined;

  // --- Practice Hub + Practice Flow ---
  PracticeHub: undefined;
  PracticeBuilder: undefined;

  // PracticeSchedule receives an array of drills
  PracticeSchedule: { practiceDrills: PracticeDrill[] };

  // Play Generator (UI label: Practice Generator)
  PlayGenerator: undefined;

  // Drill Library
  Drills: undefined;

  // --- Play Hub + Play Flow ---
  PlayHub: undefined;

  // Play Designer (optional loadPlayId)
  PlayDesigner: { loadPlayId?: string } | undefined;

  PlayLibrary: undefined;

  // Rotations (Formations)
  Rotations: undefined;

  // --- Saved Practices ---
  SavedPractices: undefined;

  // --- Training Hub + Training Flow ---
  TrainingHub: undefined;
  Training: undefined;
  TrainingBuilder: undefined;
  TrainingGenerator: undefined;
  SavedTraining: undefined;

  // TrainingSchedule receives an array of training blocks
  TrainingSchedule: { trainingBlocks: TrainingBlock[] };

  // --- Performance Hub (placeholder only) ---
  PerformanceHub: undefined;
};




