import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/screens/HomeScreen';
import ExerciseSelectionScreen from './components/screens/ExerciseSelectionScreen';
import { initDatabase } from './services/database';
import { ActivityIndicator, View } from 'react-native';
import SettingsScreen from './components/screens/SettingsScreen';

export type RootStackParamList = {
	Home: undefined;
	ExerciseSelection: { workoutType: string };
	Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const [dbReady, setDbReady] = useState(false);

	useEffect(() => {
		// Inicializa SQLite antes de montar la navegación
		(async () => {
			try {
				await initDatabase();
				setDbReady(true);
			} catch (e) {
				console.error('Error initializing database', e);
			}
		})();
	}, []);

	if (!dbReady) {
		// Pantalla de carga mientras la DB se inicializa
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Home" component={ HomeScreen } />
				<Stack.Screen name="ExerciseSelection" component={ ExerciseSelectionScreen }/>
				<Stack.Screen name="Settings" component={ SettingsScreen } />
			</Stack.Navigator>
		</NavigationContainer>
	);
}