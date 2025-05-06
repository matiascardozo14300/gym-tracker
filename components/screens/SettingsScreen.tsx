import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { insertExerciseBatch, getAllExercises } from '../../services/database';
import type { Exercise } from '../../models/types';

// Lista completa de ejercicios a insertar
const lista: Exercise[] = [
	{ id: 1,  name: 'Close-Grip Lat PullDown',       muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 2,  name: 'Bayesian Cable Curl',           muscleGroup: 'Biceps',     workoutTypes: 'Pull,FullBody' },
	{ id: 3,  name: 'EZ Bar Curl',                   muscleGroup: 'Biceps',     workoutTypes: 'Pull,FullBody' },
	{ id: 4,  name: 'Chest-Supported Row',           muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 5,  name: 'Cable Row',                     muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 6,  name: 'Preacher Hammer Curl',          muscleGroup: 'Biceps',     workoutTypes: 'Pull,FullBody' },
	{ id: 7,  name: 'Cross-Body Lat PullAround',     muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 8,  name: 'Wide-Grip Lat PullDown',        muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 9,  name: '1-Arm Dumbbell Row',            muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 10, name: 'Standing Hammer Curl',          muscleGroup: 'Biceps',     workoutTypes: 'Pull,FullBody' },
	{ id: 11, name: 'Pull-Ups',                      muscleGroup: 'Back',       workoutTypes: 'Pull,FullBody' },
	{ id: 12, name: 'Bench Press',                   muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 13, name: 'Cable Lateral Raise',           muscleGroup: 'Shoulders',  workoutTypes: 'Push,FullBody' },
	{ id: 14, name: 'Standing Dumbbell Lateral Raise', muscleGroup: 'Shoulders', workoutTypes: 'Push,FullBody' },
	{ id: 15, name: 'Incline Bench Press',           muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 16, name: 'Triceps Pressdown (Bar)',       muscleGroup: 'Triceps',    workoutTypes: 'Push,FullBody' },
	{ id: 17, name: 'Overhead Cable Triceps Extension', muscleGroup: 'Triceps',  workoutTypes: 'Push,FullBody' },
	{ id: 18, name: 'Pec Deck',                      muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 19, name: 'Cable Triceps Kickback',        muscleGroup: 'Triceps',    workoutTypes: 'Push,FullBody' },
	{ id: 20, name: 'Machine Chest Press',           muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 21, name: 'Smith Flat Bench Press',        muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 22, name: 'Smith Incline Bench Press',     muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 23, name: 'Flat Dumbbell Press',           muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 24, name: 'Incline Dumbbell Press',        muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 25, name: 'Smith Machine JM Press',        muscleGroup: 'Triceps',    workoutTypes: 'Push,FullBody' },
	{ id: 26, name: 'Push-Ups',                      muscleGroup: 'Chest',      workoutTypes: 'Push,FullBody' },
	{ id: 27, name: 'Seated Leg Curl',               muscleGroup: 'Hamstrings', workoutTypes: 'Legs,FullBody' },
	{ id: 28, name: 'Lying Leg Curl',                muscleGroup: 'Hamstrings', workoutTypes: 'Legs,FullBody' },
	{ id: 29, name: 'Leg Press',                     muscleGroup: 'Cuadriceps', workoutTypes: 'Legs,FullBody' },
	{ id: 30, name: 'Leg Extension',                 muscleGroup: 'Cuadriceps', workoutTypes: 'Legs,FullBody' },
	{ id: 31, name: 'Leg Press',                     muscleGroup: 'Cuadriceps', workoutTypes: 'Legs,FullBody' },
	{ id: 32, name: 'Hip Adduction',                 muscleGroup: 'Abductors',  workoutTypes: 'Legs,FullBody' },
	{ id: 33, name: 'Leg Press',                     muscleGroup: 'Cuadriceps', workoutTypes: 'Legs,FullBody' },
	{ id: 34, name: 'Standing Calf Raise',           muscleGroup: 'Calves',     workoutTypes: 'Legs,FullBody' },
	{ id: 35, name: 'Seated Calf Raise',             muscleGroup: 'Calves',     workoutTypes: 'Legs,FullBody' }
];

export default function SettingsScreen() {

	const handleCreateAllExercises = async () => {
		try {
			const allExercises: Exercise[] = await getAllExercises();
			if( allExercises.length > 0 ) {
				Alert.alert( 'Los ejercicios ya están creados' );
				return;
			}
			await insertExerciseBatch( lista ).then( () => {
				Alert.alert( 'Ejercicios creados correctamente' );
			});
		} catch( error ) {
			console.error( 'Error al insertar ejercicios:', error );
		}
	}

	return (
		<View style={ styles.container }>
			<TouchableOpacity style={ styles.button } onPress={ handleCreateAllExercises }>
				<Text style={ styles.buttonText }>Crear todos los ejercicios</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	button: {
		backgroundColor: '#ff4d4d',
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 8
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	}
});