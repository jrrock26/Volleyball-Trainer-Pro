export interface Drill {
  id: string;
  name: string;
  durationSeconds: number;
  category: string;
  primaryRole: string;
  type: string;
  difficulty: string;
  image: string | null;
  instructions: string[];
  steps: string[];
}

export const DRILL_LIBRARY: Drill[] = [
  // your drills here
];
