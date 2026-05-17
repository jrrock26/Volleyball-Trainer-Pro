// App.js

import 'react-native-gesture-handler'; // MUST be first

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

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

const RootStack = createStackNavigator(
  {
    // HOME
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Home',
      },
    },

    // PLAY HUB
    PlayHub: {
      screen: PlayHubScreen,
      navigationOptions: {
        title: 'Play Hub',
      },
    },

    // PERFORMANCE HUB
    PerformanceHub: {
      screen: PerformanceHubScreen,
      navigationOptions: {
        title: 'Performance Hub',
      },
    },

    // PLAY GENERATOR
    PlayGenerator: {
      screen: PlayGenerator,
      navigationOptions: {
        title: 'Play Generator',
      },
    },

    // SAVED TRAINING
    SavedTraining: {
      screen: SavedTraining,
      navigationOptions: {
        title: 'Saved Training',
      },
    },

    // PRACTICE HUB
    PracticeHub: {
      screen: PracticeHub,
      navigationOptions: {
        title: 'Practice Hub',
      },
    },

    PracticeBuilder: {
      screen: PracticeBuilder,
      navigationOptions: {
        title: 'Practice Builder',
      },
    },

    PracticeSchedule: {
      screen: PracticeSchedule,
      navigationOptions: {
        title: 'Practice Schedule',
      },
    },

    SavedPractices: {
      screen: SavedPractices,
      navigationOptions: {
        title: 'Saved Practices',
      },
    },

    // TRAINING
    TrainingHub: {
      screen: TrainingHub,
      navigationOptions: {
        title: 'Training Hub',
      },
    },

    Training: {
      screen: Training,
      navigationOptions: {
        title: 'Training',
      },
    },

    TrainingBuilder: {
      screen: TrainingBuilder,
      navigationOptions: {
        title: 'Training Builder',
      },
    },

    TrainingGenerator: {
      screen: TrainingGenerator,
      navigationOptions: {
        title: 'Training Generator',
      },
    },

    TrainingSchedule: {
      screen: TrainingSchedule,
      navigationOptions: {
        title: 'Training Schedule',
      },
    },

    // DRILLS
    Drills: {
      screen: Drills,
      navigationOptions: {
        title: 'Drills',
      },
    },

    // PLAY DESIGNER
    PlayDesigner: {
      screen: PlayDesigner,
      navigationOptions: {
        title: 'Play Designer',
      },
    },

    // PLAY LIBRARY
    PlayLibrary: {
      screen: PlayLibrary,
      navigationOptions: {
        title: 'Play Library',
      },
    },

    // ROTATIONS
    Rotations: {
      screen: Rotations,
      navigationOptions: {
        title: 'Formations',
      },
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTitleAlign: 'center',
    },
  }
);

export default createAppContainer(RootStack);
