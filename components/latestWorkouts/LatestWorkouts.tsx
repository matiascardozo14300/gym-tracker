import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LastWorkout } from '../../services/database';
import {styles} from './styles';
import {emptyStyles} from './styles';
import { formateDateToLongText } from '../common/helper';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Inicio'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

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
		<TouchableOpacity style={styles.card} onPress={() => onWorkoutPress(workout)} activeOpacity={0.9}>
			<Text style={styles.cardTitle}>{formatedDate}</Text>
			<Text style={styles.cardSubtitle}>
				{workout.workoutType} · {workout.duration}
			</Text>
		</TouchableOpacity>
	);
};

type EmptyWorkoutsCardProps = {};

const EmptyWorkoutsCard: React.FC<EmptyWorkoutsCardProps> = () => {
	const tabNav = useNavigation<TabNav>();
	const stackNav = tabNav.getParent<StackNav>();

	const onStartFirstWorkout = () => {
		stackNav?.navigate( 'Tabs', { screen: 'Rutinas' } );
	}

	return (
	<View style={[styles.card, emptyStyles.card]}>
		<View style={emptyStyles.row}>
			<View style={emptyStyles.iconBubble}>
				<Text style={emptyStyles.iconText}>🏋️‍♂️</Text>
			</View>

			<View style={emptyStyles.textCol}>
				<Text style={emptyStyles.title} numberOfLines={1} ellipsizeMode="tail">
					No tenés entrenamientos recientes
				</Text>

				<TouchableOpacity
					style={emptyStyles.cta}
					onPress={onStartFirstWorkout}
					activeOpacity={0.9}
				>
					<Text style={emptyStyles.ctaText}>Iniciar ahora</Text>
				</TouchableOpacity>
			</View>
		</View>
	</View>
	);
}

const LatestWorkouts: React.FC<LatestWorkoutsProps> = ({ workouts, onWorkoutPress }) => {
	const isEmpty = workouts.length === 0;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Últimos entrenamientos</Text>

			{ isEmpty ? (
				<EmptyWorkoutsCard />
			) : (
				workouts.map( ( w ) => (
					<WorkoutCard key={w.startDate} workout={w} onWorkoutPress={onWorkoutPress} />
				))
			)}

		</View>
	);
};

export default LatestWorkouts;