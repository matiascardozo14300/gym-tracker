import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp
} from '@react-navigation/bottom-tabs';

import HomeScreen from './components/home/HomeScreen';
import ExerciseSelectionScreen from './components/exerciseSelection/ExerciseSelectionScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import { initDatabase } from './services/database';

import HomeIcon from './assets/icons/home.svg';
import ClockIcon from './assets/icons/clock.svg';
import ChartIcon from './assets/icons/chart.svg';
import SettingsIcon from './assets/icons/settings.svg';

export type RootStackParamList = {
	Tabs: { screen: keyof RootTabParamList };
	ExerciseSelection: { workoutType: string };
};

export type RootTabParamList = {
	Home: undefined;
	Settings: undefined;
	History: undefined;
	Statistics: undefined;
};

type RootStackNavProp = NativeStackNavigationProp<RootStackParamList>;
type RootTabNavProp = BottomTabNavigationProp<RootTabParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function MainTabs() {
	return (
		<Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <HomeIcon width={size} height={size} fill={color} />;
            case 'History':
              return <ClockIcon width={size} height={size} fill={color} />;
            case 'Statistics':
              return <ChartIcon width={size} height={size} fill={color} />;
            case 'Settings':
              return <SettingsIcon width={size} height={size} fill={color} />;
            default:
              return null;
          }
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
	);
}

export default function App() {
	const [dbReady, setDbReady] = useState(false);

	useEffect( () => {
		( async () => {
			try {
				await initDatabase();
				setDbReady(true);
			} catch (e) {
				console.error('Error initializing database', e);
			}
		})();
	}, []);

	if(!dbReady) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>

				<Stack.Screen name="Tabs" component={MainTabs} />

				<Stack.Screen
				name="ExerciseSelection"
				component={ExerciseSelectionScreen}
				options={{ headerShown: true }}
				/>

			</Stack.Navigator>
		</NavigationContainer>
	);
}