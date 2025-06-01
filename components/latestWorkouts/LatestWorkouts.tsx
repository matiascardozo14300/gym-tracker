import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LastWorkout } from '../../services/database';
import styles from './styles';
import { formateDateToLongText } from '../common/helper';

export type LatestWorkoutsProps = {
	workouts: LastWorkout[];
	onWorkoutPress: (workout: LastWorkout) => void;
}

export type WorkoutCardProps = {
	workout: LastWorkout;
	onWorkoutPress: (workout: LastWorkout) => void;
}

// Tarjeta de un workout
const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onWorkoutPress }) => {
	const formatedDate = formateDateToLongText(workout.startDate);

	return (
		<TouchableOpacity style={styles.card} onPress={() => onWorkoutPress(workout)}>
			<Text style={styles.cardTitle}>{formatedDate}</Text>
			<Text style={styles.cardSubtitle}>
				{workout.workoutType} · {workout.duration}
			</Text>
		</TouchableOpacity>
	);
};

const LatestWorkouts: React.FC<LatestWorkoutsProps> = ({ workouts, onWorkoutPress }) => {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Latest Workouts</Text>
			{workouts.map((w) => (
				<WorkoutCard key={w.startDate} workout={w} onWorkoutPress={ onWorkoutPress } />
			))}
		</View>
	);
};

export default LatestWorkouts;