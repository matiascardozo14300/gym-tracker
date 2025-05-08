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
	'1': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F26161101-Cable-Lateral-Pulldown-with-V-bar_Back_small.png&w=640&q=100',
	'2': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F26561101-Cable-One-Arm-Biceps-Curl-(VERSION-2)_Upper-Arms_small.png&w=640&q=100',
	'3': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F04471101-EZ-Barbell-Curl_Upper-Arms_small.png&w=640&q=100',
	'4': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F13501101-Lever-Seated-Row_Back_small.png&w=640&q=100',
	'5': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02391101-Cable-Straight-Back-Seated-Row_Back_small.png&w=640&q=100',
	'6': 'https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F16461101.png&w=3840&q=75',
	'7': 'https://lyfta.app/images/exercises/00071101.png',
	'8': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01971101-Cable-Pulldown-(pro-lat-bar)_Back_small.png&w=640&q=100',
	'9': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02921101-Dumbbell-Bent-over-Row_back_Back-AFIX_small.png&w=640&q=100',
	'10': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03131101-Dumbbell-Hammer-Curl_Forearm_small.png&w=640&q=100',
	'11': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F06521101-Pull-up_Back_small.png&w=640&q=100',
	'12': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00251101-Barbell-Bench-Press_Chest-FIX_small.png&w=640&q=100',
	'13': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F01921101-Cable-One-Arm-Lateral-Raise_Shoulders_small.png&w=640&q=100',
	'14': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03341101-Dumbbell-Lateral-Raise_shoulder-AFIX_small.png&w=640&q=100',
	'15': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F00471101-Barbell-Incline-Bench-Press_Chest_small.png&w=640&q=100',
	'16': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F16051101-Cable-Triceps-Pushdown-(SZ-bar)_Upper-arms_small.png&w=640&q=100',
	'17': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F41151101-Cable-Overhead-Tricep-Extension-Straight-Bar-(male)_Upper-Arms_small.png&w=640&q=100',
	'18': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F10301101-Lever-Pec-Deck-Fly_Chest_small.png&w=640&q=100',
	'19': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F50331101-Cable-Single-Arm-Triceps-Pushdown-(Rope-Attachment)_Upper-Arms_small.png&w=640&q=100',
	'20': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05771101-Lever-Chest-Press_Chest_small.png&w=640&q=100',
	'21': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F07481101-Smith-Bench-Press_Chest-FIX_small.png&w=640&q=100',
	'22': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F07571101-Smith-Incline-Bench-Press_Chest-FIX_small.png&w=640&q=100',
	'23': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F02891101-Dumbbell-Bench-Press_Chest_small.png&w=640&q=100',
	'24': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F03141101-Dumbbell-Incline-Bench-Press_Chest-FIX_small.png&w=640&q=100',
	'25': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F07511101-Smith-Close-Grip-Bench-Press_Upper-Arms_small.png&w=640&q=100',
	'26': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F06621101-Push-up-m_Chest-FIX_small.png&w=640&q=100',
	'27': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05991101-Lever-Seated-Leg-Curl_Thighs-FIX_small.png&w=640&q=100',
	'28': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05861101-Lever-Lying-Leg-Curl_Thighs_small.png&w=640&q=100',
	'29': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F07401101-Sled-45-Leg-Wide-Press_Thighs_small.png&w=640&q=100',
	'30': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05851101-Lever-Leg-Extension_Thighs_small.png&w=640&q=100',
	'31': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F33851101-Lever-Seated-Leg-Press-(VERSION-2)_Thighs_small.png&w=640&q=100',
	'32': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05981101-Lever-Seated-Hip-Adduction_Thighs_small.png&w=640&q=100',
	'34': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F23151101-Lever-Rotary-Calf_Calves_small.png&w=640&q=100',
	'35': 'https://my.lyfta.app/_next/image?url=https%3A%2F%2Fapilyfta.com%2Fstatic%2FGymvisualPNG%2F05941101-Lever-Seated-Calf-Raise-(plate-loaded)_Calf_small.png&w=640&q=100',
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
		  <Text style={styles.title}>Select Next Exercise</Text>
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
