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
import StatisticsScreen from './components/statistics/StatisticsScreen'
import WorkoutScreen from './components/workouts/WorkoutScreen';
import WorkoutExerciseSelectionScreen from './components/workouts/workoutExerciseSelection/WorkoutExerciseSelection';
import EditWorkoutScreen from './components/workouts/editWorkout/EditWorkoutScreen';
import AddExerciseToWorkoutScreen from './components/workouts/editWorkout/AddExerciseToWorkoutScreen';
import AppLoadingScreen from './components/app/AppLoadingScreen';
import { OnboardingScreen } from './components/onBoarding/OnboardingScreen';
import { initDatabase } from './services/database';

import HomeIcon from './assets/icons/home.svg';
import WorkoutsIcon from './assets/icons/dumbbell.svg';
import ChartIcon from './assets/icons/chart.svg';
import SettingsIcon from './assets/icons/settings.svg';
import { LocaleConfig } from 'react-native-calendars';

export type RootStackParamList = {
	Tabs: { screen: keyof RootTabParamList };
	Onboarding: undefined;
	ExerciseSelection: { workoutTypeId: number };
	WorkoutExerciseSelection: { workoutTypeId?: number };
	EditWorkout: { workoutId?: number; date?: string };
	AddExerciseToWorkout: { workoutId: number; workoutTypeId: number; usedExerciseIds: number[] };
	AppLoading: undefined;
};

export type RootTabParamList = {
	Inicio: undefined;
	Ajustes: undefined;
	Rutinas: undefined;
	Progreso: undefined;
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
            case 'Inicio':
              return <HomeIcon width={size} height={size} fill={color} />;
            case 'Rutinas':
              return <WorkoutsIcon width={size} height={size} fill={color} />;
            case 'Progreso':
              return <ChartIcon width={size} height={size} fill={color} />;
            case 'Ajustes':
              return <SettingsIcon width={size} height={size} fill={color} />;
            default:
              return null;
          }
        }
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Rutinas" component={WorkoutScreen} />
      <Tab.Screen name="Progreso" component={StatisticsScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
	);
}

export default function App() {
	const [dbReady, setDbReady] = useState(false);

	LocaleConfig.locales['es'] = {
		monthNames: [
			'Enero','Febrero','Marzo','Abril','Mayo','Junio',
			'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
		],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
		today: 'Hoy',
	};
	LocaleConfig.defaultLocale = 'es';

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
			<Stack.Navigator
				screenOptions={{ headerShown: false }}
				initialRouteName='AppLoading'
			>

				<Stack.Screen
                    name='AppLoading'
                    component={AppLoadingScreen}
                    options={{ headerShown: false }}
                />
				<Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                />

				<Stack.Screen name="Tabs" component={MainTabs} />

				<Stack.Screen
					name="ExerciseSelection"
					component={ExerciseSelectionScreen}
					options={{ headerShown: true, title: 'Seleccioná ejercicios', headerBackVisible: false }}
				/>

				<Stack.Screen
					name="WorkoutExerciseSelection"
					component={WorkoutExerciseSelectionScreen}
					options={{ headerShown: true, title: 'Seleccioná ejercicios', headerBackVisible: false }}
				/>

				<Stack.Screen
					name='EditWorkout'
					component={EditWorkoutScreen}
					options={{ headerShown: true, title: 'Editá tu entrenamiento', headerBackVisible: true }}
				/>

				<Stack.Screen
					name='AddExerciseToWorkout'
					component={AddExerciseToWorkoutScreen}
					options={{ headerShown: true, title: 'Elegí el ejercicio', headerBackVisible: false }}
				/>

			</Stack.Navigator>
		</NavigationContainer>
	);
}