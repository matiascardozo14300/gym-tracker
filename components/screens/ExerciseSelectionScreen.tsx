import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	StyleSheet,
	Modal,
	TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import type { Exercise, ExerciseRecord, NewExerciseRecord, NewSetRecord, NewWorkout, Workout } from '../../models/types';
import { getExerciseByWorkoutType, insertExerciseRecord, insertNewWorkout, insertSetRecord, updateWorkoutFinishDate } from '../../services/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const exerciseImageUrls: Record<string, string> = {
	'1': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'2': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'3': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'4': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'5': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'6': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'7': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'8': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'9': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'10': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'11': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'12': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'13': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'14': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'15': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'16': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'17': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'18': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'19': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'20': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'21': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'22': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'23': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'24': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'25': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'26': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'27': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'28': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'29': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'30': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'31': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'32': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'34': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
	'35': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F02131101.png&w=640&q=80',
  };

type ExerciseSelectionRouteProp = RouteProp<RootStackParamList, 'ExerciseSelection'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseSelection'>

export default function ExerciseSelectionScreen() {
	const navigation = useNavigation<NavigationProp>();
	const { workoutType } = useRoute<ExerciseSelectionRouteProp>().params;
	const [ exercises, setExercises ] = useState<Exercise[]>([]);

	// Nuevo workout en DB
	const [ workoutId, setWorkoutId ] = useState<number | null>(null);

	// Estados para modal e inputs
	const [ modalVisible, setModalVisible] = useState(false);
	const [ selectedExercise, setSelectedExercise ] = useState<Exercise | null>(null);
	const [ weight, setWeight ] = useState('');
	const [ reps1, setReps1 ] = useState('');
	const [ reps2, setReps2 ] = useState('');
	const [ reps3, setReps3 ] = useState('');

	// Crear workout al entrar
	useEffect( () => {
		( async () => {
			const now = new Date().toISOString();
			const id = await insertNewWorkout({
				startDate: now,
				finishDate: now,
				workoutType
			} as NewWorkout );
			setWorkoutId( id );
		})();

		// Cargar ejercicios disponibles
		getExerciseByWorkoutType( workoutType )
			.then(setExercises)
			.catch(console.error);
	}, [ workoutType ] );

	// Maneja selección de ejercicio: abre modal
	const handleCardPress = ( item: Exercise ) => {
		setSelectedExercise( item );
		setModalVisible( true );
	};

	// Maneja envío y cierre del modal
	const handleSubmit = async () => {
		if( workoutId == null || selectedExercise == null ) return;

		// 1) Insertar ExerciseRecord
		const exerciseRecordId = await insertExerciseRecord({
			workoutId,
			exerciseId: selectedExercise.id
		} as NewExerciseRecord );

		// 2) Insertar los 3 SetRecords
		const sets: NewSetRecord[] = [ reps1, reps2, reps3 ].map( (r, idx) => ({
			exerciseRecordId,
			weight: parseFloat( weight ),
			reps: parseInt( r, 10 )
		} as NewSetRecord ));

		for( const set of sets ) {
			await insertSetRecord( set );
		}

		// Reset modal inputs
		setModalVisible( false );
		setSelectedExercise( null );
		setWeight( '' );
		setReps1( '' );
		setReps2( '' );
		setReps3( '' );
	}

	// Finalizar workout y volver al Home
	const handleFinish = async () => {
		if (workoutId != null) {
			const now = new Date().toISOString();
			await updateWorkoutFinishDate( workoutId, now );
		}
		navigation.navigate('Home');
	};

	const renderItem = ({ item }: { item: Exercise }) => (
		<TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
		  <Image
			source={{ uri: exerciseImageUrls[item.id.toString()] }}
			style={styles.image}
		  />
		  <Text style={styles.cardText}>{item.name}</Text>
		</TouchableOpacity>
	  );

	return (
		<View style={styles.container}>
		  <Text style={styles.title}>Select Exercise</Text>
		  <FlatList
			data={exercises}
			keyExtractor={(item) => item.id.toString()}
			numColumns={2}
			renderItem={renderItem}
			columnWrapperStyle={styles.row}
			contentContainerStyle={styles.list}
		  />

		{/* Botón finalizar al final */}
		<TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
			<Text style={styles.finishButtonText}>Finish Workout</Text>
		</TouchableOpacity>

		  {/* Modal para ingresar peso y repeticiones */}
		  <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedExercise ? selectedExercise.name : 'Agregar series'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Peso (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps set 1"
              keyboardType="numeric"
              value={reps1}
              onChangeText={setReps1}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps set 2"
              keyboardType="numeric"
              value={reps2}
              onChangeText={setReps2}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps set 3"
              keyboardType="numeric"
              value={reps3}
              onChangeText={setReps3}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
              <Text style={styles.modalButtonText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: '#fff' },
	title: {
	  marginTop: 16,
	  fontSize: 24,
	  fontWeight: 'bold',
	  marginBottom: 16,
	  textAlign: 'center'
	},
	list: { paddingBottom: 16 },
	row: { justifyContent: 'space-between', marginBottom: 16 },
	card: {
	  width: '48%',
	  backgroundColor: '#fff',
	  borderRadius: 12,
	  borderColor: '#ccc',
	  borderWidth: 1,
	  padding: 12,
	  alignItems: 'center',
	  shadowColor: '#000',
	  shadowOpacity: 0.1,
	  shadowRadius: 4,
	  elevation: 2
	},
	image: { width: 100, height: 100, marginBottom: 8, resizeMode: 'contain' },
	cardText: { fontSize: 16, textAlign: 'center', fontWeight: '600' },

	finishButton: {
	  backgroundColor: '#28a745',
	  paddingVertical: 12,
	  borderRadius: 8,
	  alignItems: 'center',
	  marginTop: 16
	},
	finishButtonText: { color: '#fff', fontWeight: '600' },

	// Estilos del modal
	modalOverlay: {
	  flex: 1,
	  backgroundColor: 'rgba(0,0,0,0.4)',
	  justifyContent: 'center',
	  alignItems: 'center'
	},
	modalContainer: {
	  width: '80%',
	  backgroundColor: '#fff',
	  borderRadius: 12,
	  padding: 20
	},
	modalTitle: {
	  fontSize: 18,
	  fontWeight: '600',
	  marginBottom: 12,
	  textAlign: 'center'
	},
	input: {
	  borderWidth: 1,
	  borderColor: '#ccc',
	  borderRadius: 8,
	  paddingHorizontal: 12,
	  paddingVertical: 8,
	  marginBottom: 12
	},
	modalButton: {
	  backgroundColor: '#007AFF',
	  paddingVertical: 12,
	  borderRadius: 8,
	  alignItems: 'center'
	},
	modalButtonText: {
	  color: '#fff',
	  fontWeight: '600'
	}
  });
