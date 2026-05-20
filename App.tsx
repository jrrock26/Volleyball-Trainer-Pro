import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import Training from './screens/Training';
import Rotations from './screens/Rotations';
import Drills from './screens/Drills';
import PlayDesigner from './screens/PlayDesigner';
import PlayLibrary from './screens/PlayLibrary';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ⭐ MUST be defined BEFORE App()
function PlayDesignerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlayDesignerMain"   // ⭐ MUST MATCH PlayLibrary.tsx
        component={PlayDesigner}
        options={{ title: 'Play Designer' }}
      />
      <Stack.Screen
        name="PlayLibrary"        // ⭐ MUST MATCH PlayLibrary.tsx
        component={PlayLibrary}
        options={{ title: 'Play Library' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1C2538' },
          headerTintColor: '#fff',
          tabBarStyle: { backgroundColor: '#1C2538' },
          tabBarActiveTintColor: '#FF6600',
        }}
      >
        <Tab.Screen
          name="Rotations"
          component={Rotations}
          options={{
            tabBarIcon: () => (
              <Image
                source={require('./assets/images/icon.png')}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Training"
          component={Training}
          options={{
            tabBarIcon: () => (
              <Image
                source={require('./assets/images/icon.png')}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Drills"
          component={Drills}
          options={{
            tabBarIcon: () => (
              <Image
                source={require('./assets/images/icon.png')}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Play Designer"
          component={PlayDesignerStack}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Image
                source={require('./assets/images/icon.png')}
                style={{ width: 24, height: 24 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
