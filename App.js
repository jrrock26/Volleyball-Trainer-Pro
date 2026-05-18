import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Buffer } from "buffer";
global.Buffer = Buffer;

import HeaderHomeButton from './components/HeaderHomeButton';

// PERFORMANCE HUB
import PerformanceHubScreen from './screens/PerformanceHubScreen';

// CORE APP SCREENS
import Drills from './screens/Drills';
import HomeScreen from './screens/HomeScreen';
import PlayDesigner from './screens/PlayDesigner';
import PlayLibrary from './screens/PlayLibrary';

// PLAY HUB
import PlayGenerator from './screens/PlayGenerator';
import PlayHubScreen from './screens/PlayHubScreen';

// PRACTICE
import PracticeBuilder from './screens/PracticeBuilder';
import PracticeHub from './screens/PracticeHub';
import PracticeSchedule from './screens/PracticeSchedule';
import SavedPractices from './screens/SavedPractices';
import SavedTraining from './screens/SavedTraining';

// TRAINING
import Training from './screens/Training';
import TrainingBuilder from './screens/TrainingBuilder';
import TrainingGenerator from './screens/TrainingGenerator';
import TrainingHub from './screens/TrainingHub';
import TrainingSchedule from './screens/TrainingSchedule';

// ROTATIONS
import Rotations from './screens/Rotations';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        {/* HOME */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />

        {/* PLAY HUB */}
        <Stack.Screen
          name="PlayHub"
          component={PlayHubScreen}
          options={{
            title: 'Play Hub',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        {/* PERFORMANCE HUB */}
        <Stack.Screen
          name="PerformanceHub"
          component={PerformanceHubScreen}
          options={{
            title: 'Performance Hub',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        {/* PLAY GENERATOR */}
        <Stack.Screen
          name="PlayGenerator"
          component={PlayGenerator}
          options={{
            title: 'Play Generator',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        {/* SAVED TRAINING */}
        <Stack.Screen
          name="SavedTraining"
          component={SavedTraining}
          options={{
            headerShown: true,
            title: 'Saved Training',
          }}
        />

        {/* PRACTICE HUB */}
        <Stack.Screen
          name="PracticeHub"
          component={PracticeHub}
          options={{
            title: 'Practice Hub',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        <Stack.Screen name="PracticeBuilder" component={PracticeBuilder} />
        <Stack.Screen name="PracticeSchedule" component={PracticeSchedule} />
        <Stack.Screen name="SavedPractices" component={SavedPractices} />

        {/* TRAINING HUB */}
        <Stack.Screen name="TrainingHub" component={TrainingHub} />
        <Stack.Screen name="Training" component={Training} />
        <Stack.Screen name="TrainingBuilder" component={TrainingBuilder} />
        <Stack.Screen name="TrainingGenerator" component={TrainingGenerator} />
        <Stack.Screen name="TrainingSchedule" component={TrainingSchedule} />

        {/* DRILLS */}
        <Stack.Screen
          name="Drills"
          component={Drills}
          options={{
            title: 'Drills',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        {/* PLAY DESIGNER */}
        <Stack.Screen
          name="PlayDesigner"
          component={PlayDesigner}
          options={{
            title: 'Play Designer',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        {/* PLAY LIBRARY */}
        <Stack.Screen
          name="PlayLibrary"
          component={PlayLibrary}
          options={{
            title: 'Play Library',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

        {/* ROTATIONS */}
        <Stack.Screen
          name="Rotations"
          component={Rotations}
          options={{
            title: 'Formations',
            headerRight: () => <HeaderHomeButton />,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
