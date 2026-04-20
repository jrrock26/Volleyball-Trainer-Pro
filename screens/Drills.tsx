// Drills.tsx — CLEAN VERSION
// ------------------------------------------------------------
// Types, Helpers, DRILL_LIBRARY
// ------------------------------------------------------------

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types/navigationTypes';
import DrillCardModal from './DrillCardModal'; // ⭐ NEW

// Create a typed navigation type
type Nav = NativeStackNavigationProp<RootStackParamList>;


// ... your types and helpers above ...

export default function Drills() {
  const navigation = useNavigation<Nav>();   // ← REQUIRED
 const [selectedDrill, setSelectedDrill] = useState<PracticeDrill | null>(null);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drill Library</Text>

      <FlatList
        data={DRILL_LIBRARY}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              
  setSelectedDrill({
    ...item,
    id: item.name, // still required because PracticeDrill extends DrillDefinition
  })
}
          >
            <Text style={styles.listName}>{item.name}</Text>
            <Text style={styles.listCategory}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />
      <DrillCardModal
  visible={!!selectedDrill}
  drill={selectedDrill}
  onClose={() => setSelectedDrill(null)}
/>

    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { marginBottom: 16 },
  drillImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',   // ← FIXES HEAD CUT-OFF
  },
  name: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  category: { fontSize: 14, color: '#666' },
  listItem: {
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderColor: '#ddd',
},
listName: {
  fontSize: 18,
  fontWeight: '700',
  color: '#111',
},
listCategory: {
  fontSize: 14,
  color: '#666',
},
});
export type DrillCategory =
  | 'warmup'
  | 'ballControl'
  | 'setting'
  | 'hitting'
  | 'blocking'
  | 'defense'
  | 'serveReceive'
  | 'serving'
  | 'teamSystems'
  | 'games'
  | 'break';

export type DrillType = 'individual' | 'team' | 'both';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type PrimaryRole =
  | 'setting'
  | 'digging'
  | 'spiking'
  | 'serving'
  | 'all';

export type DrillDefinition = {
  name: string;
  category: DrillCategory;
  type: DrillType;
  difficulty: Difficulty;
  duration: number; // seconds
  primaryRole: PrimaryRole;
  image: any;
  instructions: string[];
  steps: string[];
};

export type PracticeDrill = DrillDefinition & {
  id: string;
};

export type PracticeRoleFilter =
  | 'fullTeam'
  | 'setters'
  | 'digging'
  | 'spiking'
  | 'serving'
  | 'allSkills';

// ------------------------------------------------------------
// ROLE FILTER → PRIMARY ROLE MAPPING
// ------------------------------------------------------------

export const roleFilterToPrimaryRoles = (
  role: PracticeRoleFilter,
): PrimaryRole[] => {
  switch (role) {
    case 'fullTeam':
      return ['all', 'setting', 'digging', 'spiking', 'serving'];
    case 'setters':
      return ['setting'];
    case 'digging':
      return ['digging'];
    case 'spiking':
      return ['spiking'];
    case 'serving':
      return ['serving'];
    case 'allSkills':
      return ['all'];
    default:
      return ['all'];
  }
};

// ------------------------------------------------------------
// DRILL LIBRARY (OPENING)
// ------------------------------------------------------------

export const DRILL_LIBRARY: DrillDefinition[] = [
  {
    name: 'Dynamic Full‑Body Warm‑Up',
    category: 'warmup',
    type: 'both',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Use continuous movement to gradually elevate heart rate.',
      'Focus on smooth, controlled motions rather than speed.',
      'Keep posture tall with core engaged throughout the sequence.',
      'Move through full ranges of motion without forcing stretches.',
      'Prepare joints and muscles for volleyball‑specific actions.',
    ],
    steps: [
      'Jog lightly around the court for 60 seconds.',
      'Add high knees down and back once.',
      'Add butt kicks down and back once.',
      'Finish with lateral shuffles and backpedal to center.',
    ],
  },

  {
    name: 'Ball‑Handling Warm‑Up Toss',
    category: 'warmup',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Use a single ball to activate hands and coordination.',
      'Keep eyes on the ball and maintain athletic posture.',
      'Focus on clean, controlled contacts rather than power.',
      'Stay light on your feet and ready to move.',
    ],
    steps: [
      'Toss the ball straight up and catch with both hands 10 times.',
      'Toss and catch with right hand only 10 times.',
      'Toss and catch with left hand only 10 times.',
      'Add light footwork while continuing the toss pattern.',
    ],
  },

  {
    name: 'Shadow Footwork Warm‑Up',
    category: 'warmup',
    type: 'both',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Rehearse volleyball‑specific footwork patterns without the ball.',
      'Emphasize balance, posture, and rhythm over speed.',
      'Keep hips low and chest up during all movements.',
      'Use arms naturally to support balance and power.',
    ],
    steps: [
      'Perform approach footwork (3‑step or 4‑step) without jumping.',
      'Shadow defensive shuffles left and right.',
      'Add short sprints forward and backpedals.',
      'Repeat sequence 2–3 times with increasing intensity.',
    ],
  },

  {
    name: 'Partner Mirror Movement',
    category: 'warmup',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Work in pairs to mirror each other’s movements.',
      'Focus on quick reactions and controlled footwork.',
      'Maintain low, athletic posture throughout the drill.',
      'Communicate and stay engaged with your partner.',
    ],
    steps: [
      'Partners face each other about 8–10 feet apart.',
      'One partner leads lateral, forward, and backward movements.',
      'The other partner mirrors the movement exactly.',
      'Switch leader and repeat for multiple rounds.',
    ],
  },

  {
    name: 'Triangle Movement Warm‑Up',
    category: 'warmup',
    type: 'both',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Use three cones or markers to form a triangle.',
      'Emphasize quick changes of direction and body control.',
      'Stay low and push off the outside foot when cutting.',
      'Maintain consistent tempo and clean footwork.',
    ],
    steps: [
      'Place three cones in a triangle about 8–10 feet apart.',
      'Start at one cone and sprint to the second.',
      'Shuffle to the third cone, then backpedal to the first.',
      'Repeat pattern clockwise, then counterclockwise.',
    ],
  },

  {
    name: 'Ball Control Warm‑Up Line',
    category: 'warmup',
    type: 'team',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Use simple passing to warm up arms and platforms.',
      'Focus on clean contact and accurate ball flight.',
      'Keep knees bent and shoulders forward.',
      'Communicate target and tempo with your partner.',
    ],
    steps: [
      'Form two lines facing each other about 10–12 feet apart.',
      'Pass back and forth using forearm passing only.',
      'After each pass, players take a small shuffle step.',
      'Rotate players down the line after a set number of reps.',
    ],
  },

  {
    name: 'Serve Receive Shuffle Warm‑Up',
    category: 'warmup',
    type: 'both',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Simulate serve‑receive movement without full‑speed serves.',
      'Focus on reading the toss and moving early.',
      'Stay low and balanced while shuffling to the ball.',
      'Finish each rep with a stable passing platform.',
    ],
    steps: [
      'Coach or partner tosses balls to different zones.',
      'Player shuffles to the ball and sets platform early.',
      'Catch or lightly pass the ball back to the tosser.',
      'Repeat from multiple starting positions across the back row.',
    ],
  },

  {
    name: 'Core Activation Circuit',
    category: 'warmup',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'all',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Activate core muscles to support explosive movements.',
      'Focus on quality of movement over speed.',
      'Maintain controlled breathing throughout the circuit.',
      'Avoid arching the lower back during core exercises.',
    ],
    steps: [
      'Perform 20 seconds of plank hold.',
      'Perform 20 seconds of side plank on each side.',
      'Perform 20 seconds of dead bug or hollow hold.',
      'Rest briefly and repeat the circuit 2–3 times.',
    ],
  },

  {
    name: 'Shoulder Prep with Band',
    category: 'warmup',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Use light resistance to warm up the shoulders safely.',
      'Focus on controlled range of motion and posture.',
      'Keep movements smooth and avoid jerking the band.',
      'Engage scapular muscles to support the shoulder joint.',
    ],
    steps: [
      'Perform band pull‑aparts for 10–12 reps.',
      'Perform external rotations on each arm for 10–12 reps.',
      'Perform overhead band presses for 10–12 reps.',
      'Repeat sequence 2–3 times with light resistance.',
    ],
  },

  {
    name: 'Jump Prep and Landing Mechanics',
    category: 'warmup',
    type: 'both',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/warmup.png'),
    instructions: [
      'Prepare lower body for repeated jumping.',
      'Emphasize soft, controlled landings.',
      'Keep knees tracking over toes during takeoff and landing.',
      'Maintain upright chest and engaged core.',
    ],
    steps: [
      'Perform 5–8 small squat jumps focusing on soft landings.',
      'Add lateral jumps side to side with controlled landings.',
      'Add forward and backward jumps with balance on landing.',
      'Finish with 3–5 full‑height jumps at game‑speed intensity.',
    ],
  },
  {
    name: 'Triangle Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Three players form a triangle and keep the ball in play.',
      'Use controlled touches: pass, set, or controlled hit.',
      'Maintain spacing and communicate each contact.',
      'Focus on clean ball control and predictable flight.',
    ],
    steps: [
      'Form a triangle 8–10 feet apart.',
      'Player A passes to B, B sets to C, C passes to A.',
      'Rotate roles every 60 seconds.',
      'Increase tempo as control improves.',
    ],
  },

  {
    name: 'Chaos Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Players pepper while constantly moving to new spots.',
      'Forces communication and quick adjustments.',
      'Emphasize reading ball flight and reacting early.',
      'Keep touches controlled despite movement.',
    ],
    steps: [
      'Start peppering in pairs.',
      'After each touch, players move 2–3 steps in any direction.',
      'Add random directional calls from coach.',
      'Finish with full‑speed movement pepper.',
    ],
  },

  {
    name: 'Over‑the‑Net Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Pepper across the net using pass‑set‑hit rhythm.',
      'Focus on controlled roll shots and high sets.',
      'Maintain consistent tempo and communication.',
      'Keep the ball off the floor as long as possible.',
    ],
    steps: [
      'Pair up across the net.',
      'Start with pass‑set‑roll shot.',
      'Increase tempo as control improves.',
      'Finish with controlled swings if appropriate.',
    ],
  },

  {
    name: '3‑Touch Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'all',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Players must use all three touches before sending the ball back.',
      'Encourages controlled passing and setting.',
      'Focus on predictable ball flight and clean contact.',
    ],
    steps: [
      'Partner A passes to themselves, sets to themselves, then hits to B.',
      'Partner B repeats the sequence.',
      'Keep the ball in play as long as possible.',
      'Increase tempo gradually.',
    ],
  },

  {
    name: 'Continuous Pepper to Target',
    category: 'ballControl',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Players pepper while aiming for a designated target zone.',
      'Improves directional control and accuracy.',
      'Focus on platform angle and body alignment.',
    ],
    steps: [
      'Place a target zone on the court.',
      'Players pepper while directing final contact to the target.',
      'Rotate players after each successful sequence.',
      'Increase distance or difficulty as needed.',
    ],
  },

  {
    name: 'Movement Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Players pepper while moving laterally or forward/backward.',
      'Simulates game‑speed adjustments.',
      'Focus on staying balanced while moving.',
    ],
    steps: [
      'Players pepper while shuffling left and right.',
      'Add forward/backward movement.',
      'Add coach‑called direction changes.',
      'Finish with full‑speed movement pepper.',
    ],
  },

  {
    name: 'Wall Passing Series',
    category: 'ballControl',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Use a wall to develop consistent passing technique.',
      'Focus on platform angle and clean contact.',
      'Keep feet active and posture stable.',
    ],
    steps: [
      'Pass against the wall for 20 reps.',
      'Add alternating left/right platform angles.',
      'Add movement between reps.',
      'Finish with rapid‑fire passing for 30 seconds.',
    ],
  },

  {
    name: 'Partner Short/Deep Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Partners alternate between short and deep contacts.',
      'Improves reading and footwork adjustments.',
      'Focus on early movement and stable platform.',
    ],
    steps: [
      'Partner A sends a short ball, B passes.',
      'Partner B sends a deep ball, A passes.',
      'Continue alternating short/deep.',
      'Increase tempo as control improves.',
    ],
  },

  {
    name: 'Two‑Ball Pepper',
    category: 'ballControl',
    type: 'team',
    difficulty: 'advanced',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Two balls are in play simultaneously.',
      'Forces fast decision‑making and communication.',
      'Players must stay calm under pressure.',
    ],
    steps: [
      'Start peppering with one ball.',
      'Introduce a second ball after 10 seconds.',
      'Keep both balls alive as long as possible.',
      'Reset and repeat multiple rounds.',
    ],
  },

  {
    name: 'Target Passing Competition',
    category: 'ballControl',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/ballcontrol.png'),
    instructions: [
      'Players pass to a designated target zone.',
      'Encourages accuracy and consistency.',
      'Add scoring to increase competitiveness.',
    ],
    steps: [
      'Set up a target zone with cones.',
      'Players take turns passing to the target.',
      'Award points for accuracy.',
      'Play to a set score or time limit.',
    ],
  },
  {
    name: 'Setter Triangle Footwork',
    category: 'setting',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Setter moves between three points forming a triangle.',
      'Emphasizes quick, efficient footwork to get under the ball.',
      'Focus on staying square to the target before setting.',
      'Keep hands shaped early and ready for contact.',
    ],
    steps: [
      'Place three cones in a triangle.',
      'Move to each cone in sequence using setter footwork.',
      'Square to an imaginary target at each stop.',
      'Repeat clockwise and counterclockwise.',
    ],
  },

  {
    name: 'Wall Setting Series',
    category: 'setting',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Use a wall to develop consistent hand contact.',
      'Focus on soft touch and minimal spin.',
      'Keep elbows out and hands shaped early.',
    ],
    steps: [
      'Stand 5–7 feet from a wall.',
      'Set repeatedly against the wall for 20–30 reps.',
      'Add movement left and right between reps.',
      'Finish with rapid‑fire setting for 20 seconds.',
    ],
  },

  {
    name: 'Jump Setting Rhythm Drill',
    category: 'setting',
    type: 'individual',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Develop timing and rhythm for jump setting.',
      'Focus on consistent takeoff and landing mechanics.',
      'Keep hands high and ready before leaving the ground.',
    ],
    steps: [
      'Start with stationary jump sets.',
      'Add a small approach into the jump.',
      'Add movement to the left and right.',
      'Finish with full‑speed jump setting reps.',
    ],
  },

  {
    name: 'Out‑of‑System Chase Drill',
    category: 'setting',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Setter chases down off‑target passes.',
      'Focus on footwork efficiency and balance.',
      'Deliver a hittable ball even from poor positions.',
    ],
    steps: [
      'Coach tosses balls off‑center.',
      'Setter chases and squares to target.',
      'Deliver a high, controlled set.',
      'Repeat from multiple court zones.',
    ],
  },

  {
    name: 'Setter Decision‑Making Drill',
    category: 'setting',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Setter reads blockers and chooses best attacking option.',
      'Emphasizes quick decisions under pressure.',
      'Focus on deception and tempo control.',
    ],
    steps: [
      'Coach calls out blocker positions.',
      'Setter reads the defense and selects the best set.',
      'Add live hitters for realistic decision‑making.',
      'Increase speed and complexity over time.',
    ],
  },

  {
    name: 'Setter Release Consistency Drill',
    category: 'setting',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Focus on consistent release height and trajectory.',
      'Keep hands soft and elbows slightly bent.',
      'Use legs to generate lift, not arms alone.',
    ],
    steps: [
      'Set repeatedly to a fixed target zone.',
      'Adjust hand position to maintain consistency.',
      'Add movement before each set.',
      'Finish with rapid‑fire reps.',
    ],
  },

  {
    name: 'Setter Footwork Ladder',
    category: 'setting',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Use an agility ladder to improve setter footwork.',
      'Focus on quick, precise steps.',
      'Stay balanced and ready to set immediately after exiting the ladder.',
    ],
    steps: [
      'Perform basic ladder patterns.',
      'Add lateral movement patterns.',
      'Exit the ladder and immediately set a ball.',
      'Repeat with increasing speed.',
    ],
  },

  {
    name: 'Setter/Hitter Timing Warm‑Up',
    category: 'setting',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Setter and hitter work together to sync timing.',
      'Focus on consistent tempo and approach rhythm.',
      'Setter delivers predictable, repeatable sets.',
    ],
    steps: [
      'Hitter performs approach without swinging.',
      'Setter delivers timing sets to match the approach.',
      'Add controlled swings.',
      'Increase tempo as timing improves.',
    ],
  },

  {
    name: 'Setter Target Challenge',
    category: 'setting',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Setter aims for specific target zones.',
      'Improves accuracy and consistency.',
      'Add scoring to increase competitiveness.',
    ],
    steps: [
      'Place targets at left, middle, and right front.',
      'Setter delivers sets to each target.',
      'Award points for accuracy.',
      'Play to a set score or time limit.',
    ],
  },

  {
    name: 'Setter Transition Footwork',
    category: 'setting',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/setting.png'),
    instructions: [
      'Setter practices transitioning from defense to setting.',
      'Focus on quick movement and squaring to target.',
      'Simulates real rally transitions.',
    ],
    steps: [
      'Start in defensive position.',
      'Transition quickly to setting zone.',
      'Receive a pass and deliver a set.',
      'Repeat from multiple defensive positions.',
    ],
  },
  {
    name: '3‑Step / 4‑Step Approach Mechanics',
    category: 'hitting',
    type: 'individual',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Develop consistent approach rhythm for attacking.',
      'Focus on explosive last step and balanced takeoff.',
      'Keep eyes on the ball throughout the approach.',
      'Use arms to generate upward momentum.',
    ],
    steps: [
      'Walk through the approach slowly.',
      'Add arm swing timing.',
      'Perform controlled jumps without swinging.',
      'Finish with full‑speed approaches.',
    ],
  },

  {
    name: 'Box Jump to Swing Timing',
    category: 'hitting',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Use a box to simulate explosive takeoff.',
      'Focus on timing arm swing with jump.',
      'Land softly with balanced posture.',
    ],
    steps: [
      'Stand behind a plyo box.',
      'Jump onto the box with arm swing timing.',
      'Step down and repeat.',
      'Add simulated hitting motion at the top.',
    ],
  },

  {
    name: 'Wrist Snap Wall Drill',
    category: 'hitting',
    type: 'individual',
    difficulty: 'beginner',
    duration: 180,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Develop proper wrist snap for topspin.',
      'Focus on contacting the ball high and in front.',
      'Keep elbow high and follow through downward.',
    ],
    steps: [
      'Stand 5 feet from a wall.',
      'Toss ball lightly and snap wrist into wall.',
      'Repeat 20–30 reps.',
      'Add footwork before each rep.',
    ],
  },

  {
    name: 'Line and Angle Hitting',
    category: 'hitting',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Practice hitting to specific zones: line and cross‑court.',
      'Focus on shoulder rotation and approach angle.',
      'Keep contact point high and in front.',
    ],
    steps: [
      'Coach tosses balls to hitter.',
      'Hitter attacks line for 10 reps.',
      'Hitter attacks angle for 10 reps.',
      'Alternate targets with increasing speed.',
    ],
  },

  {
    name: 'Out‑of‑System Attack Drill',
    category: 'hitting',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Simulate broken plays requiring smart attacking.',
      'Focus on controlled swings, roll shots, and tips.',
      'Read the defense before choosing attack type.',
    ],
    steps: [
      'Coach sends off‑target passes.',
      'Hitter adjusts approach and attack type.',
      'Alternate between roll shots, tips, and controlled swings.',
      'Finish with live out‑of‑system reps.',
    ],
  },

  {
    name: 'Approach Footwork Ladder',
    category: 'hitting',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Use an agility ladder to refine approach steps.',
      'Focus on quick, precise foot placement.',
      'Maintain consistent rhythm and tempo.',
    ],
    steps: [
      'Perform ladder patterns matching approach rhythm.',
      'Add arm swing timing.',
      'Exit ladder and perform approach without jumping.',
      'Finish with full approach and jump.',
    ],
  },

  {
    name: 'Hit‑to‑Self Progression',
    category: 'hitting',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Develop ball control and hand contact for attacking.',
      'Focus on controlled taps and wrist snap.',
      'Keep ball in front and maintain balance.',
    ],
    steps: [
      'Tap ball upward with open hand.',
      'Add wrist snap to create topspin.',
      'Increase height gradually.',
      'Finish with controlled mini‑swings.',
    ],
  },

  {
    name: 'Transition Hitting Drill',
    category: 'hitting',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Practice transitioning from defense to attack.',
      'Focus on quick footwork and approach timing.',
      'Simulate real rally transitions.',
    ],
    steps: [
      'Start in defensive position.',
      'Transition to hitting approach zone.',
      'Receive set and attack.',
      'Repeat from multiple defensive spots.',
    ],
  },

  {
    name: 'Controlled Swing Reps',
    category: 'hitting',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Focus on clean arm swing mechanics.',
      'Keep elbow high and follow through fully.',
      'Emphasize technique over power.',
    ],
    steps: [
      'Perform slow‑motion swings.',
      'Add full‑speed swings without ball.',
      'Add tossed ball for controlled contact.',
      'Finish with 10–15 full swings.',
    ],
  },

  {
    name: 'Tempo Hitting Drill',
    category: 'hitting',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/hitting.png'),
    instructions: [
      'Develop timing for different set tempos (1, 2, 3).',
      'Focus on adjusting approach speed.',
      'Communicate tempo with setter.',
    ],
    steps: [
      'Setter delivers slow tempo sets.',
      'Hitter adjusts approach to match.',
      'Increase tempo gradually.',
      'Finish with fast‑tempo attacks.',
    ],
  },
  {
    name: 'Mirror Blocking Footwork',
    category: 'blocking',
    type: 'team',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Players mirror each other’s blocking footwork along the net.',
      'Focus on quick lateral movement and balanced posture.',
      'Keep hands high and ready to penetrate over the net.',
    ],
    steps: [
      'Two players face the net side by side.',
      'One player leads lateral footwork along the net.',
      'The partner mirrors the movement exactly.',
      'Switch leader after each round.',
    ],
  },

  {
    name: 'Block & Transition Drill',
    category: 'blocking',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Practice blocking and immediately transitioning to offense.',
      'Focus on quick footwork after landing.',
      'Maintain balance and readiness for the next action.',
    ],
    steps: [
      'Player performs a block jump at the net.',
      'Immediately transitions off the net into approach position.',
      'Receives a set and performs a controlled swing.',
      'Repeat from multiple blocking positions.',
    ],
  },

  {
    name: 'Read‑the‑Hitter Drill',
    category: 'blocking',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Blockers read the hitter’s approach and shoulder angle.',
      'Focus on timing and penetration over the net.',
      'Develop anticipation skills for real game situations.',
    ],
    steps: [
      'Coach or hitter performs varied approaches.',
      'Blocker reads cues and times the jump.',
      'Penetrate hands over the net aggressively.',
      'Repeat with different hitters and tempos.',
    ],
  },

  {
    name: 'Penetration Timing Drill',
    category: 'blocking',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Focus on penetrating hands over the net at peak jump.',
      'Keep thumbs slightly inward and fingers spread wide.',
      'Land softly with balanced posture.',
    ],
    steps: [
      'Stand at the net in blocking stance.',
      'Jump vertically and penetrate hands forward.',
      'Hold penetration for one second.',
      'Repeat for multiple reps.',
    ],
  },

  {
    name: '2‑Person Closing Block Drill',
    category: 'blocking',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Two blockers work together to close the block.',
      'Focus on footwork timing and shoulder alignment.',
      'Communicate responsibilities clearly.',
    ],
    steps: [
      'Middle blocker starts in the center.',
      'Outside blocker starts near antenna.',
      'Both move to close the block on coach’s cue.',
      'Jump together and penetrate hands over the net.',
    ],
  },

  {
    name: 'Block Reaction Drill',
    category: 'blocking',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Blockers react to random tosses simulating unpredictable attacks.',
      'Emphasizes quick decision‑making and footwork.',
      'Focus on reading the ball early.',
    ],
    steps: [
      'Coach tosses balls to random hitting zones.',
      'Blocker reacts and moves to correct position.',
      'Perform block jump with penetration.',
      'Repeat with increasing speed.',
    ],
  },

  {
    name: 'Antenna Block Positioning',
    category: 'blocking',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Practice proper blocking position near the antenna.',
      'Focus on sealing the line and avoiding net contact.',
      'Keep shoulders square and hands angled inward.',
    ],
    steps: [
      'Stand near the antenna in blocking stance.',
      'Perform block jumps focusing on sealing the line.',
      'Add lateral movement into the block.',
      'Repeat for multiple reps.',
    ],
  },

  {
    name: 'Block Footwork Patterns',
    category: 'blocking',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Practice basic blocking footwork patterns: shuffle, crossover, swing block.',
      'Focus on balance and quick transitions.',
      'Keep hands high and ready.',
    ],
    steps: [
      'Perform shuffle steps along the net.',
      'Add crossover steps for longer distances.',
      'Practice swing block approach.',
      'Combine all patterns into one sequence.',
    ],
  },

  {
    name: 'Block Coverage Awareness',
    category: 'blocking',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Blockers learn to adjust based on hitter tendencies.',
      'Focus on sealing seams and covering angles.',
      'Communicate with back‑row defenders.',
    ],
    steps: [
      'Coach calls out hitter tendencies.',
      'Blockers adjust starting position.',
      'Perform block jump with correct angle.',
      'Repeat with different hitter profiles.',
    ],
  },

  {
    name: 'Block Timing with Setter',
    category: 'blocking',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/blocking.png'),
    instructions: [
      'Blockers time their jump based on setter release.',
      'Focus on reading setter body language.',
      'Develop anticipation for quick sets.',
    ],
    steps: [
      'Setter delivers varied tempos.',
      'Blockers read release and time jump.',
      'Add hitters for live timing.',
      'Increase speed and complexity.',
    ],
  },
  {
    name: 'Low Defensive Platform',
    category: 'defense',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Develop a stable, low defensive posture.',
      'Focus on platform angle and balance.',
      'Keep shoulders forward and hips low.',
    ],
    steps: [
      'Start in a wide, low stance.',
      'Hold platform angle for 10 seconds.',
      'Shuffle left and right while maintaining posture.',
      'React to coach’s tosses with controlled digs.',
    ],
  },

  {
    name: 'Reading the Hitter Drill',
    category: 'defense',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Defenders learn to read hitter cues.',
      'Focus on shoulder angle, approach speed, and arm swing.',
      'React early to the direction of the attack.',
    ],
    steps: [
      'Coach or hitter performs varied approaches.',
      'Defender reads cues and moves early.',
      'Dig controlled balls to target.',
      'Increase speed and unpredictability.',
    ],
  },

  {
    name: 'Pancake Reaction Drill',
    category: 'defense',
    type: 'individual',
    difficulty: 'advanced',
    duration: 180,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Train quick reactions for emergency saves.',
      'Focus on extending arm fully and keeping palm flat.',
      'Stay low and ready to dive.',
    ],
    steps: [
      'Coach rolls or tosses balls just out of reach.',
      'Player reacts and performs pancake save.',
      'Recover quickly to defensive stance.',
      'Repeat with increasing difficulty.',
    ],
  },

  {
    name: 'Digging Machine Drill',
    category: 'defense',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Continuous digging reps from controlled tosses.',
      'Focus on platform stability and ball control.',
      'Keep feet active and posture low.',
    ],
    steps: [
      'Coach tosses balls rapidly to defender.',
      'Defender digs each ball to target.',
      'Rotate players every 30–45 seconds.',
      'Increase tempo as control improves.',
    ],
  },

  {
    name: 'Deep Corner Dig Drill',
    category: 'defense',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Train defenders to dig deep corner attacks.',
      'Focus on reading trajectory and moving early.',
      'Keep platform angled toward target.',
    ],
    steps: [
      'Coach hits balls to deep corners.',
      'Defender moves early and digs to target.',
      'Alternate corners each rep.',
      'Add live hitters for advanced variation.',
    ],
  },

  {
    name: 'Chaos Defense Drill',
    category: 'defense',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Simulate unpredictable defensive situations.',
      'Forces quick reactions and communication.',
      'Focus on staying calm under pressure.',
    ],
    steps: [
      'Coach sends random balls to all zones.',
      'Defenders react and dig to target.',
      'Add multiple balls for chaos mode.',
      'Rotate players frequently.',
    ],
  },

  {
    name: 'Short Ball Reaction Drill',
    category: 'defense',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Train defenders to react quickly to short tips.',
      'Focus on forward movement and platform stability.',
      'Stay low and balanced during approach.',
    ],
    steps: [
      'Coach tosses short balls near the net.',
      'Defender moves forward and digs upward.',
      'Recover back to defensive position.',
      'Repeat with increasing speed.',
    ],
  },

  {
    name: 'Rolling and Recovery Drill',
    category: 'defense',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Practice safe rolling techniques after defensive plays.',
      'Focus on smooth transitions back to stance.',
      'Avoid landing on elbows or wrists.',
    ],
    steps: [
      'Perform controlled dive to the side.',
      'Roll safely and return to stance.',
      'Add coach‑tossed balls to dig before roll.',
      'Repeat on both sides.',
    ],
  },

  {
    name: 'Defensive Shuffle Patterns',
    category: 'defense',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Develop quick, controlled lateral movement.',
      'Focus on staying low and balanced.',
      'Keep shoulders forward and platform ready.',
    ],
    steps: [
      'Shuffle left and right for 20 seconds.',
      'Add forward/backward movement.',
      'Add coach‑called direction changes.',
      'Finish with reaction‑based shuffles.',
    ],
  },

  {
    name: 'Live Digging with Controlled Hitters',
    category: 'defense',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/defense.png'),
    instructions: [
      'Defenders dig live attacks from controlled hitters.',
      'Focus on reading approach and arm swing.',
      'Maintain stable platform and controlled dig.',
    ],
    steps: [
      'Hitter performs controlled swings.',
      'Defender reads and digs to target.',
      'Rotate defenders every 5–7 reps.',
      'Increase hitting speed gradually.',
    ],
  },
  {
    name: '3‑Person Serve‑Receive Pattern',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Three passers cover the back row in a standard pattern.',
      'Focus on communication and seam responsibility.',
      'Keep platform stable and angle toward target.',
    ],
    steps: [
      'Form three‑person passing formation.',
      'Coach serves balls to random zones.',
      'Passers call seams and move early.',
      'Rotate positions every 5–7 reps.',
    ],
  },

  {
    name: 'Rotational Serve‑Receive Patterns',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Practice serve‑receive patterns for all six rotations.',
      'Focus on movement into and out of formations.',
      'Communicate responsibilities clearly.',
    ],
    steps: [
      'Set up rotation 1 serve‑receive.',
      'Coach serves balls to different zones.',
      'Rotate to next formation after several reps.',
      'Complete all six rotations.',
    ],
  },

  {
    name: 'Short/Deep Serve Reading Drill',
    category: 'serveReceive',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Train passers to read serve trajectory early.',
      'Focus on quick movement forward and backward.',
      'Maintain stable platform on the move.',
    ],
    steps: [
      'Coach alternates short and deep serves.',
      'Passer reads toss and moves early.',
      'Pass ball to target.',
      'Increase unpredictability over time.',
    ],
  },

  {
    name: 'Pressure Passing (Score to 10)',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Passers earn points for accurate passes.',
      'Simulates game‑like pressure situations.',
      'Focus on consistency and communication.',
    ],
    steps: [
      'Coach serves balls to passers.',
      'Passers earn points for target passes.',
      'First to 10 points wins.',
      'Add consequences for errors if desired.',
    ],
  },

  {
    name: 'Target Passing with Movement',
    category: 'serveReceive',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Passer moves before receiving serve.',
      'Focus on footwork and platform stability.',
      'Simulates real serve‑receive adjustments.',
    ],
    steps: [
      'Passer starts in random position.',
      'Coach serves ball to open zone.',
      'Passer moves quickly and passes to target.',
      'Repeat with varied starting positions.',
    ],
  },

  {
    name: 'Two‑Server Pressure Drill',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Two servers alternate rapid serves.',
      'Forces passers to adjust quickly.',
      'Focus on reading and reacting under pressure.',
    ],
    steps: [
      'Two servers stand on opposite sides.',
      'Alternate serves every 3–4 seconds.',
      'Passers must stay balanced and ready.',
      'Rotate servers and passers frequently.',
    ],
  },

  {
    name: 'Serve‑Receive Shuffle Pattern',
    category: 'serveReceive',
    type: 'individual',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Passer practices shuffling into serve‑receive position.',
      'Focus on early movement and stable platform.',
      'Keep shoulders forward and hips low.',
    ],
    steps: [
      'Start in neutral stance.',
      'Shuffle into serve‑receive position.',
      'Coach tosses ball for controlled pass.',
      'Repeat from multiple angles.',
    ],
  },

  {
    name: 'Rotating Serve‑Receive Lanes',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Passers rotate through designated lanes.',
      'Focus on seam coverage and communication.',
      'Simulates real serve‑receive movement patterns.',
    ],
    steps: [
      'Divide court into three lanes.',
      'Passers rotate lanes after each serve.',
      'Coach serves balls to random lanes.',
      'Repeat with increasing speed.',
    ],
  },

  {
    name: 'Serve‑Receive Chaos Drill',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Simulate unpredictable serve‑receive situations.',
      'Forces passers to communicate and adjust quickly.',
      'Focus on reading serve trajectory early.',
    ],
    steps: [
      'Coach serves balls to random zones.',
      'Passers must call seams and move early.',
      'Add second server for chaos mode.',
      'Rotate passers frequently.',
    ],
  },

  {
    name: 'Serve‑Receive to Attack Transition',
    category: 'serveReceive',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/serveReceive.png'),
    instructions: [
      'Passers transition immediately into offensive roles.',
      'Focus on quick movement and communication.',
      'Simulates real rally flow.',
    ],
    steps: [
      'Coach serves ball.',
      'Passer receives and transitions to hitting position.',
      'Setter delivers set for controlled attack.',
      'Repeat with all passers rotating roles.',
    ],
  },
  {
    name: 'Zone Serving Accuracy',
    category: 'serving',
    type: 'individual',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Develop accuracy by serving to specific zones.',
      'Focus on consistent toss and contact point.',
      'Keep shoulders square to the target.',
    ],
    steps: [
      'Divide court into six serving zones.',
      'Serve to zone 1 for 5 reps.',
      'Serve to zone 5 for 5 reps.',
      'Rotate through all zones.',
    ],
  },

  {
    name: 'Float Serve Stability Drill',
    category: 'serving',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Focus on creating a stable float serve with minimal spin.',
      'Keep hand firm and contact ball in the center.',
      'Use consistent toss height.',
    ],
    steps: [
      'Practice float serve contact without full swing.',
      'Add full float serves to mid‑court.',
      'Serve deep floaters to corners.',
      'Finish with accuracy challenge.',
    ],
  },

  {
    name: 'Jump Serve Rhythm Drill',
    category: 'serving',
    type: 'individual',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Develop consistent rhythm for jump serving.',
      'Focus on toss height and approach timing.',
      'Land balanced and ready for next serve.',
    ],
    steps: [
      'Practice toss without hitting.',
      'Add approach and jump timing.',
      'Add controlled jump serves.',
      'Finish with full‑speed jump serves.',
    ],
  },

  {
    name: 'Short/Deep Serve Alternation',
    category: 'serving',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Alternate between short and deep serves.',
      'Focus on adjusting power and trajectory.',
      'Keep toss consistent for both serves.',
    ],
    steps: [
      'Serve short to zone 2.',
      'Serve deep to zone 1.',
      'Alternate for 10–12 reps.',
      'Increase speed and accuracy.',
    ],
  },

  {
    name: 'Serve Under Pressure (Miss = -1)',
    category: 'serving',
    type: 'individual',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Simulate pressure by adding scoring consequences.',
      'Focus on mental toughness and consistency.',
      'Maintain routine even under stress.',
    ],
    steps: [
      'Server starts at 0 points.',
      'Hit target = +1 point.',
      'Miss serve = -1 point.',
      'Play to 10 points.',
    ],
  },

  {
    name: 'Target Serving Competition',
    category: 'serving',
    type: 'team',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Players compete to hit designated targets.',
      'Encourages accuracy and consistency.',
      'Add scoring to increase competitiveness.',
    ],
    steps: [
      'Place cones in target zones.',
      'Players serve and earn points for accuracy.',
      'Rotate servers after each round.',
      'Play to a set score.',
    ],
  },

  {
    name: 'Serve Receive Disruption Drill',
    category: 'serving',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Servers aim to disrupt serve‑receive patterns.',
      'Focus on serving seams and weak passers.',
      'Develop strategic serving decisions.',
    ],
    steps: [
      'Coach assigns target passer or seam.',
      'Server attempts to disrupt formation.',
      'Rotate servers and passers.',
      'Increase difficulty with jump serves.',
    ],
  },

  {
    name: 'Deep Corner Serving',
    category: 'serving',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 240,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Serve deep to corners to pressure passers.',
      'Focus on trajectory and power control.',
      'Keep toss consistent for accuracy.',
    ],
    steps: [
      'Serve to deep zone 1 for 5 reps.',
      'Serve to deep zone 5 for 5 reps.',
      'Alternate corners for 10 reps.',
      'Finish with accuracy challenge.',
    ],
  },

  {
    name: 'Serve to Setter Drill',
    category: 'serving',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Servers aim to force the setter to take first contact.',
      'Disrupts offensive rhythm of the opponent.',
      'Focus on strategic placement and consistency.',
    ],
    steps: [
      'Coach designates setter zone.',
      'Servers aim serves at setter.',
      'Rotate servers after each round.',
      'Increase difficulty with jump serves.',
    ],
  },

  {
    name: 'Serve Placement Randomizer',
    category: 'serving',
    type: 'individual',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'serving',
    image: require('../assets/drills/serving.png'),
    instructions: [
      'Server reacts to random zone calls.',
      'Improves adaptability and accuracy.',
      'Focus on quick mental adjustments.',
    ],
    steps: [
      'Coach calls random zone numbers.',
      'Server serves immediately to called zone.',
      'Increase speed of calls.',
      'Finish with rapid‑fire sequence.',
    ],
  },
  {
    name: '6‑on‑6 Wash Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Teams must win two consecutive rallies to earn a point.',
      'Promotes consistency and competitive focus.',
      'Encourages aggressive but controlled play.',
    ],
    steps: [
      'Play a standard rally.',
      'Team that wins must win the next rally to score.',
      'If they lose, the point washes and resets.',
      'Play to a set score or time limit.',
    ],
  },

  {
    name: 'Freeball/Downball Transition Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Train transitions from freeball or downball situations.',
      'Focus on quick movement into offensive positions.',
      'Develop consistent out‑of‑system decision‑making.',
    ],
    steps: [
      'Coach sends freeball to receiving team.',
      'Team transitions into offensive formation.',
      'Execute controlled attack.',
      'Rotate roles after each sequence.',
    ],
  },

  {
    name: 'Out‑of‑System Chaos Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Simulate unpredictable out‑of‑system plays.',
      'Forces communication and smart attacking choices.',
      'Focus on controlled swings and roll shots.',
    ],
    steps: [
      'Coach sends off‑target passes.',
      'Setter or libero makes emergency set.',
      'Hitter chooses safe but effective attack.',
      'Repeat with increasing unpredictability.',
    ],
  },

  {
    name: '5‑on‑5 Continuous Rally',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Play continuous rallies with one player resting.',
      'Encourages movement and communication.',
      'Simulates real game flow with fewer players.',
    ],
    steps: [
      'Set up 5‑on‑5 teams.',
      'Play continuous rallies without stopping.',
      'Rotate resting player every few minutes.',
      'Increase tempo as players adjust.',
    ],
  },

  {
    name: 'Setter vs. Defense Decision Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Setter reads defense and chooses best attacking option.',
      'Focus on deception and tempo control.',
      'Develops high‑level decision‑making.',
    ],
    steps: [
      'Defense sets up in random formations.',
      'Setter reads blockers and back row.',
      'Choose best set based on read.',
      'Repeat with increasing speed.',
    ],
  },

  {
    name: 'Serve‑Receive to Offensive System',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Train smooth transition from serve‑receive to offense.',
      'Focus on quick movement and communication.',
      'Simulates real match flow.',
    ],
    steps: [
      'Coach serves ball.',
      'Passers receive and transition to offense.',
      'Setter delivers set based on pass quality.',
      'Execute controlled attack.',
    ],
  },

  {
    name: 'Defensive System Rotation Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Train defensive rotations based on hitter location.',
      'Focus on reading and adjusting quickly.',
      'Develops team defensive cohesion.',
    ],
    steps: [
      'Coach calls hitter location.',
      'Defense rotates into correct formation.',
      'Simulate attack and dig to target.',
      'Repeat with varied hitter positions.',
    ],
  },

  {
    name: 'Transition Off Block Touch',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Train transitions after block touches.',
      'Focus on quick movement and communication.',
      'Simulates real rally flow after a block deflection.',
    ],
    steps: [
      'Blocker performs controlled block touch.',
      'Defense reacts and transitions to offense.',
      'Setter delivers out‑of‑system or in‑system set.',
      'Execute controlled attack.',
    ],
  },

  {
    name: 'Coverage System Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Train hitters and defenders to cover attacks.',
      'Focus on positioning around the hitter.',
      'Develop awareness of coverage responsibilities.',
    ],
    steps: [
      'Hitter performs controlled swings.',
      'Teammates position in coverage zones.',
      'React to blocked or deflected balls.',
      'Rotate hitters and coverage roles.',
    ],
  },

  {
    name: 'Offense vs. Defense System Drill',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'One side runs structured offense while the other runs structured defense.',
      'Focus on reading, communication, and system discipline.',
      'Simulates real match tactical execution.',
    ],
    steps: [
      'Offense runs designated play.',
      'Defense rotates into correct formation.',
      'Play out rally to completion.',
      'Switch roles after several reps.',
    ],
  },

  {
    name: 'Tempo System Synchronization',
    category: 'teamSystems',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'setting',
    image: require('../assets/drills/teamSystems.png'),
    instructions: [
      'Train hitters and setter to synchronize tempos.',
      'Focus on approach timing and set consistency.',
      'Develop multiple tempo options (1, 2, 3).',
    ],
    steps: [
      'Setter delivers slow tempo sets.',
      'Hitter adjusts approach rhythm.',
      'Increase tempo gradually.',
      'Finish with fast‑tempo system execution.',
    ],
  },
  {
    name: 'Queen of the Court',
    category: 'games',
    type: 'team',
    difficulty: 'beginner',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Fast‑paced competitive mini‑game.',
      'Winning team moves up; losing team rotates down.',
      'Encourages aggressive but controlled play.',
    ],
    steps: [
      'Divide players into small teams.',
      'Play short rallies (1–3 points).',
      'Winners move to the “queen” court.',
      'Rotate continuously for 5–10 minutes.',
    ],
  },

  {
    name: 'Speedball Rally Game',
    category: 'games',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Continuous rallies with rapid restarts.',
      'Forces quick transitions and communication.',
      'Improves conditioning and focus.',
    ],
    steps: [
      'Coach initiates rally.',
      'As soon as rally ends, new ball is entered.',
      'Teams must reset instantly.',
      'Play for timed intervals.',
    ],
  },

  {
    name: 'Serve‑to‑Score Game',
    category: 'games',
    type: 'team',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'serving',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Teams can only score points on their serve.',
      'Encourages aggressive but consistent serving.',
      'Simulates real match pressure.',
    ],
    steps: [
      'Team serves to start rally.',
      'If serving team wins rally, they score.',
      'If not, serve switches.',
      'Play to 15 or timed limit.',
    ],
  },

  {
    name: 'Bonus Ball Game',
    category: 'games',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Certain balls are worth extra points.',
      'Forces teams to strategize and communicate.',
      'Adds fun competitive pressure.',
    ],
    steps: [
      'Coach designates “bonus balls.”',
      'Winning bonus rally = 2 points.',
      'Normal rally = 1 point.',
      'Play to a set score.',
    ],
  },

  {
    name: 'Chaos Ball Game',
    category: 'games',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Coach introduces random balls mid‑rally.',
      'Forces players to react and communicate.',
      'Simulates unpredictable match situations.',
    ],
    steps: [
      'Start normal rally.',
      'Coach tosses extra balls randomly.',
      'Teams must decide which ball to play.',
      'Play continues until one ball is dead.',
    ],
  },

  {
    name: 'Mini‑Court 2v2',
    category: 'games',
    type: 'team',
    difficulty: 'beginner',
    duration: 240,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Small‑court game emphasizing ball control.',
      'Players must cover more space.',
      'Encourages creativity and smart shots.',
    ],
    steps: [
      'Shrink court to half width.',
      'Play 2v2 rally scoring.',
      'Rotate teams every few minutes.',
      'Increase pace as players adjust.',
    ],
  },

  {
    name: '4v4 Transition Game',
    category: 'games',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Smaller teams force more touches per player.',
      'Emphasizes transition offense and defense.',
      'Improves communication and spacing.',
    ],
    steps: [
      'Play 4v4 on full court.',
      'Focus on transition after each contact.',
      'Rotate players frequently.',
      'Play timed rounds.',
    ],
  },

  {
    name: 'Serve‑Receive Battle',
    category: 'games',
    type: 'team',
    difficulty: 'intermediate',
    duration: 300,
    primaryRole: 'digging',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Teams compete to win serve‑receive rallies.',
      'Focus on passing accuracy and first‑ball contact.',
      'Simulates real match serve pressure.',
    ],
    steps: [
      'Team A serves to Team B.',
      'If Team B wins rally, they earn a point.',
      'If not, no point is awarded.',
      'Switch roles after each round.',
    ],
  },

  {
    name: 'Last Ball Wins',
    category: 'games',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'all',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Teams play multiple balls per rally.',
      'Only the final ball determines the point.',
      'Forces focus and clutch performance.',
    ],
    steps: [
      'Coach enters 2–3 balls per rally.',
      'Teams play all balls out.',
      'Final ball determines point.',
      'Play to set score.',
    ],
  },

  {
    name: 'First‑Ball Kill Challenge',
    category: 'games',
    type: 'team',
    difficulty: 'advanced',
    duration: 300,
    primaryRole: 'spiking',
    image: require('../assets/drills/games.png'),
    instructions: [
      'Offense earns points for first‑ball kills.',
      'Defense earns points for digs or block touches.',
      'Simulates high‑pressure scoring situations.',
    ],
    steps: [
      'Coach initiates freeball or downball.',
      'Offense attempts first‑ball kill.',
      'Defense scores for stopping attack.',
      'Rotate roles after each round.',
    ],
  },
]; // END OF DRILL_LIBRARY
export function generateRandomPractice(
  allowedRoles: PrimaryRole[],
  practiceLengthMinutes: number
): PracticeDrill[] {
  const totalSeconds = practiceLengthMinutes * 60;

  const pool = DRILL_LIBRARY.filter(d => allowedRoles.includes(d.primaryRole));

  const result: PracticeDrill[] = [];
  let remaining = totalSeconds;

  while (remaining > 0 && pool.length > 0) {
    const drill = pool[Math.floor(Math.random() * pool.length)];

    result.push({
      ...drill,
      id: `gen-${result.length}-${Date.now()}`,
    });

    remaining -= drill.duration;
  }

  return result;
}


// ------------------------------------------------------------
// TIME FORMATTER (OPTIONAL)
// ------------------------------------------------------------

export const formatTime = (seconds: number | null): string => {
  if (seconds === null) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};