import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { getLast3Workouts, getWorkoutDatesForMonth, LastWorkout } from '../../services/database/';
import CalendarSection, { CustomMarkedDates } from '../calendar/CalendarSelection';
import styles from './styles';
import { workoutTypeColors } from '../common/colorMap';
import Header from '../header/Header';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const WorkoutTypeSelector: React.FC = () => {
	const types = ['Pull', 'Push', 'Legs', 'FullBody'];
	const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList, 'Home'>>();
	const stackNav = tabNav.getParent<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<View style={ styles.section }>
			<Text style={ styles.sectionTitle }>Choose Workout Type</Text>
			<View style={ styles.row }>
				{ types.map( ( type ) => (
					<TouchableOpacity
						key={ type }
						onPress={ () => stackNav?.navigate('ExerciseSelection', { workoutType: type }) }
						style={[
							styles.typeButton,
							{ borderColor: workoutTypeColors[ type ] || '#ccc' }
						]}
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

export default function HomeScreen() {
	const [ lastWorkouts, setLastWorkouts ] = useState<LastWorkout[]>([]);
	const [markedDates, setMarkedDates] = useState<CustomMarkedDates>({});

	useEffect(() => {
		getLast3Workouts().then( setLastWorkouts ).catch( console.error );

		(async () => {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const items = await getWorkoutDatesForMonth( year, month );

			const marks: CustomMarkedDates = {};
			for (const { date, workoutType } of items) {
				marks[date] = {
				  customStyles: {
					container: {
					  backgroundColor: workoutTypeColors[ workoutType ] || 'grey',
					  borderRadius: 20
					},
					text: {
					  color: 'black',
					  fontWeight: '600'
					}
				  }
				};
			  }
			setMarkedDates( marks );
		})();
	}, []);

	return (
		<SafeAreaView style={ styles.container }>
			<ScrollView contentContainerStyle={ styles.scrollContent }>
				<Header title='Home' />
				<WorkoutTypeSelector />
				<CalendarSection markedDates={ markedDates } onDayPress={ day => {
					console.log( 'Día seleccionado:', day );
				}} />
				<LatestWorkouts workouts={ lastWorkouts } />
			</ScrollView>
		</SafeAreaView>
	);
}