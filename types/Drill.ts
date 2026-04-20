// /types/Drill.ts

export interface DrillDefinition {
  id: string;                // unique ID for each drill
  name: string;              // you use "name", not "title"
  category: string;          // warmup, defense, offense, etc.
  type: string;              // 'team' | 'individual' | 'both'
  difficulty: string;        // beginner | intermediate | advanced
  duration: number;          // in seconds
  primaryRole: string;       // all | digging | spiking | serving | setting
  image: any;                // require() asset
  instructions: string[];    // bullet points
  steps: string[];           // numbered steps (can be empty)
}

