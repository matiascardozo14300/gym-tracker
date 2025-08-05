import React from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { insertExerciseBatch, getAllExercises, deleteAllExercises, exportDatabaseAsJson, importDatabaseFromJson, Exercise, runCustomQuery } from '../../services/database';
import Header from '../header/Header';
import styles from './styles';
import { lista } from '../common/allExercises';

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
		} catch( err ) {
			console.error(err);
			const message = err instanceof Error
				? err.message
				: String(err);
			Alert.alert('Error al importar BD', message);
		}
	}

	const handleRunCustomQuery = async () => {
		try {
			await runCustomQuery();
			Alert.alert('Consulta ejecutada', 'La consulta personalizada se ejecutó correctamente.');
		} catch( error ) {
			console.error(error);
			Alert.alert('Error', 'No se pudo ejecutar la consulta personalizada.');
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Header title='Ajustes' />

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
				<TouchableOpacity style={styles.devButton} onPress={handleRunCustomQuery}>
					<Text style={styles.devButtonText}>Ejecutar Query</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
  );
}