import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { getLast3Workouts } from '../../services/database';
import type { LastWorkout, Workout } from '../../models/types';
import CalendarSection from './CalendarSelection';
import styles from '../styles/HomeScreen.styles';

type HomeNavProp = NativeStackNavigationProp<
	RootStackParamList,
	'Home'
>;

type TabItemProps = {
	icon: string;
	label: string;
};

const Header: React.FC = () => (
	<View style={ styles.header }>
		<Text style={ styles.headerTitle }>Home</Text>
	</View>
);

const WorkoutTypeSelector: React.FC = () => {
	const types = ['Pull', 'Push', 'Legs', 'FullBody'];
	const navigation = useNavigation<HomeNavProp>();

	return (
		<View style={ styles.section }>
			<Text style={ styles.sectionTitle }>Choose Workout Type</Text>
			<View style={ styles.row }>
				{ types.map( ( type ) => (
					<TouchableOpacity
						key={ type }
						style={ styles.typeButton }
						onPress={ () => navigation.navigate( 'ExerciseSelection', { workoutType: type } ) }
					>
						<Text style={ styles.typeButtonText }>{ type }</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

// Tarjeta de un workout
const WorkoutCard: React.FC<{ workout: LastWorkout }> = ({ workout }) => {
	// formatear fecha
	const date = new Date(workout.startDate);
	const title = date.toLocaleDateString( undefined, {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});

	return (
		<TouchableOpacity style={styles.card}>
			<Text style={styles.cardTitle}>{title}</Text>
			<Text style={styles.cardSubtitle}>
				{workout.workoutType} · {workout.duration}
			</Text>
		</TouchableOpacity>
	);
};

// Sección de últimos workouts
const LatestWorkouts: React.FC<{ workouts: LastWorkout[] }> = ({ workouts }) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>Latest Workouts</Text>
		{workouts.map((w) => (
			<WorkoutCard key={w.startDate} workout={w} />
		))}
	</View>
);

const TabItem: React.FC<TabItemProps> = ({ icon, label }) => (
	<TouchableOpacity style={styles.tabItem}>
	  <Text style={styles.tabIcon}>{icon}</Text>
	  <Text style={styles.tabLabel}>{label}</Text>
	</TouchableOpacity>
);

export default function HomeScreen() {
	const [ workouts, setWorkouts ] = useState<Workout[]>([]);
	const [ lastWorkouts, setLastWorkouts ] = useState<LastWorkout[]>([]);

	// ejemplo de días marcados (puedes generarlo dinámicamente)
	const [ markedDates, setMarkedDates ] = useState({
		'2025-05-01': { marked: true, dotColor: '#50cebb' },
		'2025-05-02': { marked: true, dotColor: '#50cebb' },
	});

	useEffect(() => {
		getLast3Workouts().then( setLastWorkouts ).catch( console.error );
	}, []);

	return (
		<SafeAreaView style={styles.container}>
		<ScrollView contentContainerStyle={styles.scrollContent}>
		<Header />
		<WorkoutTypeSelector />
		<CalendarSection markedDates={markedDates} onDayPress={ day => {
			console.log('Día seleccionado:', day);
		}} />
		<LatestWorkouts workouts={lastWorkouts} />
		</ScrollView>
		<View style={styles.tabBar}>
		<TabItem icon="🏠" label="Home" />
		<TabItem icon="🕒" label="History" />
		<TabItem icon="📊" label="Statistics" />
		<TabItem icon="⚙️" label="Settings" />
		</View>
		</SafeAreaView>
	);
}