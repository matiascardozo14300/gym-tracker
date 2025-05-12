import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { insertExerciseBatch, getAllExercises, deleteAllExercises, exportDatabaseAsJson, importDatabaseFromJson } from '../../services/database';
import type { Exercise } from '../../models/types';
import Header from '../header/Header';

// Lista completa de ejercicios a insertar
const lista: Exercise[] = [
	{ id: 1,  name: 'Close-Grip Lat PullDown',       muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 2,  name: 'Bayesian Cable Curl',           muscleGroup: 'Biceps',     workoutTypes: ['Pull', 'FullBody'] },
	{ id: 3,  name: 'EZ Bar Curl',                   muscleGroup: 'Biceps',     workoutTypes: ['Pull', 'FullBody'] },
	{ id: 4,  name: 'Chest-Supported Row',           muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 5,  name: 'Cable Row',                     muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 6,  name: 'Preacher Hammer Curl',          muscleGroup: 'Biceps',     workoutTypes: ['Pull', 'FullBody'] },
	{ id: 7,  name: 'Cross-Body Lat PullAround',     muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 8,  name: 'Wide-Grip Lat PullDown',        muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 9,  name: '1-Arm Dumbbell Row',            muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 10, name: 'Standing Hammer Curl',          muscleGroup: 'Biceps',     workoutTypes: ['Pull', 'FullBody'] },
	{ id: 11, name: 'Pull-Ups',                      muscleGroup: 'Back',       workoutTypes: ['Pull', 'FullBody'] },
	{ id: 12, name: 'Bench Press',                   muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 13, name: 'Cable Lateral Raise',           muscleGroup: 'Shoulders',  workoutTypes: ['Push', 'FullBody'] },
	{ id: 14, name: 'Standing Dumbbell Lateral Raise', muscleGroup: 'Shoulders', workoutTypes: ['Push', 'FullBody'] },
	{ id: 15, name: 'Incline Bench Press',           muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 16, name: 'Triceps Pressdown (Bar)',       muscleGroup: 'Triceps',    workoutTypes: ['Push', 'FullBody'] },
	{ id: 17, name: 'Overhead Cable Triceps Extension', muscleGroup: 'Triceps',  workoutTypes: ['Push', 'FullBody'] },
	{ id: 18, name: 'Pec Deck',                      muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 19, name: 'Cable Triceps Kickback',        muscleGroup: 'Triceps',    workoutTypes: ['Push', 'FullBody'] },
	{ id: 20, name: 'Machine Chest Press',           muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 21, name: 'Smith Flat Bench Press',        muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 22, name: 'Smith Incline Bench Press',     muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 23, name: 'Flat Dumbbell Press',           muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 24, name: 'Incline Dumbbell Press',        muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 25, name: 'Smith Machine JM Press',        muscleGroup: 'Triceps',    workoutTypes: ['Push', 'FullBody'] },
	{ id: 26, name: 'Push-Ups',                      muscleGroup: 'Chest',      workoutTypes: ['Push', 'FullBody'] },
	{ id: 27, name: 'Seated Leg Curl',               muscleGroup: 'Hamstrings', workoutTypes: ['Legs', 'FullBody'] },
	{ id: 28, name: 'Lying Leg Curl',                muscleGroup: 'Hamstrings', workoutTypes: ['Legs', 'FullBody'] },
	{ id: 29, name: 'Leg Press',                     muscleGroup: 'Cuadriceps', workoutTypes: ['Legs', 'FullBody'] },
	{ id: 30, name: 'Leg Extension',                 muscleGroup: 'Cuadriceps', workoutTypes: ['Legs', 'FullBody'] },
	{ id: 31, name: 'Machine Leg Press',             muscleGroup: 'Cuadriceps', workoutTypes: ['Legs', 'FullBody'] },
	{ id: 32, name: 'Hip Adduction',                 muscleGroup: 'Abductors',  workoutTypes: ['Legs', 'FullBody'] },
	{ id: 34, name: 'Standing Calf Raise',           muscleGroup: 'Calves',     workoutTypes: ['Legs', 'FullBody'] },
	{ id: 35, name: 'Seated Calf Raise',             muscleGroup: 'Calves',     workoutTypes: ['Legs', 'FullBody'] },
];

export default function SettingsScreen() {

	const handleChooseAvatar = () => {}

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

	const handleDeleteAllExercises = async () => {
		try {
			const allExercises: Exercise[] = await getAllExercises();
			if( allExercises.length === 0 ) {
				Alert.alert( 'No hay ejercicios para eliminar' );
				return;
			}

			Alert.alert(
				'Confirmar eliminación',
				'¿Estás seguro de que querés eliminar TODOS los ejercicios? Esta acción no se puede deshacer.',
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Eliminar',
						style: 'destructive',
						onPress: async () => {
							try {
								const result = await deleteAllExercises();
								Alert.alert( 'Operación completada', `Registros eliminados: ${result.changes}` );
							} catch( err ) {
								console.error( 'Error al eliminar ejercicios:', err );
								Alert.alert( 'Error', 'No se pudo eliminar los ejercicios.' );
							}
						}
					}
				],
				{ cancelable: true }
			);

		} catch( error ) {
			console.error( 'Error al eliminar ejercicios:', error );
			Alert.alert( 'Error', 'Ocurrió un error al comprobar los ejercicios.' )
		}
	}

	const handleExportDatabase = async () => {
		try {
			await exportDatabaseAsJson();
		} catch( error ) {
			console.error(error);
			Alert.alert( 'Error', 'No se pudo exportar la base de datos' );
		}
	}

	const handleImportDatabase = async () => {
		try {
			await importDatabaseFromJson();
			Alert.alert('Restauración', 'La base de datos se importó correctamente.');
		} catch( error ) {
			console.error(error);
			Alert.alert('Error', 'No se pudo importar la base de datos.');
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Header title='Settings' />

				<Text style={styles.sectionTitle}>Datos personales</Text>
				<View style={styles.personalSection}>
					<TouchableOpacity
						style={styles.avatarPlaceholder}
						onPress={handleChooseAvatar}
					/>
					<View style={styles.inputsContainer}>
						<View style={styles.inputRow}>
							<TextInput placeholder="Nombre" style={styles.textInput} />
							<TouchableOpacity style={styles.chooseButton} onPress={handleChooseAvatar}>
								<Text style={styles.chooseText}>Elegir</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.inputRow}>
							<TextInput placeholder="Apellido" style={styles.textInputFull}/>
						</View>
					</View>
				</View>

				<TextInput placeholder="Fecha de nacimiento" style={styles.textInputFull}/>
				<TextInput placeholder="Peso (kg)" style={styles.textInputFull} keyboardType="numeric"/>

				<Text style={styles.sectionTitle}>Opciones de desarrollador</Text>
				<TouchableOpacity style={styles.devButton} onPress={handleCreateAllExercises}>
					<Text style={styles.devButtonText}>Crear todos los ejercicios</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.devButton} onPress={handleDeleteAllExercises}>
					<Text style={styles.devButtonText}>Eliminar todos los ejercicios</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.devButton} onPress={handleExportDatabase}>
					<Text style={styles.devButtonText}>Exportar Backup</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.devButton} onPress={handleImportDatabase}>
					<Text style={styles.devButtonText}>Importar Backup</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 24 },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

  personalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginRight: 16
  },
  inputsContainer: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  textInputFull: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16
  },
  chooseButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  },
  chooseText: {
    fontSize: 14,
    fontWeight: '500'
  },

  devButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12
  },
  devButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  	tabBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 64,
		flexDirection: 'row',
		borderTopWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff',
	},
	tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	tabIcon: { fontSize: 20 },
	tabLabel: { fontSize: 12, marginTop: 2 },
});