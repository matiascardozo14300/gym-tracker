import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { getLast3Workouts, getWorkoutDatesForMonth } from '../../services/database';
import type { LastWorkout } from '../../models/types';
import CalendarSection, { CustomMarkedDates } from './CalendarSelection';
import styles from '../styles/HomeScreen.styles';
import { workoutTypeColors } from '../styles/colorMap';

// Define la navegación de tipo "Home"
type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type TabItemProps = {
	icon: string;
	label: string;
	onPress?: () => void;
};

const TabItem: React.FC<TabItemProps> = ({ icon, label, onPress }) => (
	<TouchableOpacity style={ styles.tabItem } onPress={onPress}>
		<Text style={ styles.tabIcon }>{ icon }</Text>
		<Text style={ styles.tabLabel }>{ label }</Text>
	</TouchableOpacity>
);

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
						onPress={ () => navigation.navigate( 'ExerciseSelection', { workoutType: type } ) }
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
	const navigation = useNavigation<HomeNavProp>();

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
				<Header />
				<WorkoutTypeSelector />
				<CalendarSection markedDates={ markedDates } onDayPress={ day => {
					console.log( 'Día seleccionado:', day );
				}} />
				<LatestWorkouts workouts={ lastWorkouts } />
			</ScrollView>
			<View style={ styles.tabBar }>
				<TabItem
					icon="🏠"
					label="Home"
					onPress={ () => navigation.navigate( 'Home' ) }
				/>
				<TabItem
					icon="🕒"
					label="History"
					onPress={() => {/* Implementar navegación a History */} }
				/>
				<TabItem
					icon="📊"
					label="Statistics"
					onPress={() => {/* Implementar navegación a Statistics */} }
				/>
				<TabItem
					icon="⚙️"
					label="Settings"
					onPress={ () => navigation.navigate( 'Settings' ) }
				/>
			</View>
		</SafeAreaView>
	);
}