import React, { useEffect, useRef, useState } from 'react';
import {View, Text, TouchableOpacity, Image, Modal, TextInput, SectionList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { Exercise, ExerciseLastHistory, getExerciseByWorkoutType, getExerciseLastHistory, insertExerciseRecord, insertNewWorkout, insertSetRecord, NewExerciseRecord, NewSetRecord, NewWorkout, toggleExerciseFavorite, updateWorkoutFinishDate } from '../../services/database/';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import styles from './styles';
import { exerciseImageUrls } from '../common/allExercisesImages';
import StarFilledIcon from '../../assets/icons/favoriteFill.svg';
import StarOutlineIcon from '../../assets/icons/favorite.svg';
import { getLocalISOString } from '../common/helper';

type ExSelRouteProp = RouteProp<RootStackParamList, 'ExerciseSelection'>;
type ExSelNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'ExerciseSelection'>,
  BottomTabNavigationProp<RootTabParamList>
>;

// TimerDisplay component reused inside and outside modal
const TimerDisplay: React.FC<{ seconds: number }> = ({ seconds }) => {
	const minutes = Math.floor( seconds / 60 );
	const secs = seconds % 60;
	const mm = minutes < 10 ? `0${minutes}` : minutes;
	const ss = secs < 10 ? `0${secs}` : secs;
	return (
		<View style={ styles.timerContainer }>
			<Text style={ styles.timerText }>{`${mm}:${ss}`}</Text>
		</View>
	);
};

export default function ExerciseSelectionScreen() {
	const navigation = useNavigation<ExSelNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
	const route = useRoute<ExSelRouteProp>();
  	const { workoutTypeId } = route.params;

	const INITIAL_SETS = [
		{ weight: '', reps: '' },
		{ weight: '', reps: '' },
		{ weight: '', reps: '' }
	];

	const [ exercises, setExercises ] = useState<Exercise[]>([]);
	const [ workoutId, setWorkoutId ] = useState<number | null>(null);
	const [ refreshFlag, setRefreshFlag ] = useState(false);

	// Timer state
	const [seconds, setSeconds] = useState(0);
	const startTimeRef = useRef<number>(Date.now());
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Estados para modal e inputs
	const [ exerciseModalVisible, setExerciseModalVisible] = useState(false);
	const [ finishModalVisible, setFinishModalVisible] = useState(false);
	const [ selectedExercise, setSelectedExercise ] = useState<Exercise | null>(null);

	const [ sets, setSets ] = useState<{ weight: string; reps: string }[]>( INITIAL_SETS );
	const [ replicateWeight, setReplicateWeight ] = useState( false );
	const [ lastHistory, setLastHistory ] = useState<ExerciseLastHistory | null>(null);

	// Start timmer
	useEffect( () => {
		startTimeRef.current = Date.now();
		intervalRef.current = setInterval(() => {
			const diff = Date.now() - startTimeRef.current;
			setSeconds( Math.floor( diff / 1000 ) );
		}, 1000 );

		return () => {
			if( intervalRef.current ) clearInterval( intervalRef.current );
		};
	}, [] );

	// Busca ejercicios
	useEffect(() => {
		getExerciseByWorkoutType( workoutTypeId )
			.then( setExercises )
			.catch( console.error );
	}, [ workoutTypeId, refreshFlag ]);

	// Se abre el modal
	useEffect( () => {
		if( exerciseModalVisible && selectedExercise ) {
			( async () => {
				try {
					const hist = await getExerciseLastHistory( selectedExercise.id );
					setLastHistory( hist );
				} catch( error ) {
					console.error( 'Error al obtener el último registro para el ejercicio: ', error );
					setLastHistory( null );
				}
			})();
		} else {
			setLastHistory( null );
		}
	}, [ exerciseModalVisible, selectedExercise ]);

	// Botón de replicar peso
	useEffect(() => {
		if( replicateWeight ) {
			setSets( ( prev ) => {
				const firstWeight = prev[0]?.weight ?? '';
				return prev.map( (s) => ({ ...s, weight: firstWeight }));
			});
		}
	}, [ replicateWeight, sets[0]?.weight ]);

	// Maneja selección de ejercicio: abre modal
	const handleCardPress = ( item: Exercise ) => {
		setSelectedExercise( item );
		setExerciseModalVisible( true );
	};

	// Texto del record
	const getRecordText = (): string => {
		if( !lastHistory ) return "Última sesión: sin datos";

		const grupos: Map<number, number[]> = new Map();

		for( const set of lastHistory.sets ) {
			if( !grupos.has( set.weight ) ) {
				grupos.set( set.weight, [] );
			}
			grupos.get( set.weight )!.push( set.reps );
		}

		const partes: string[] = [];
		for( const [ peso, repsList ] of grupos.entries() ) {
			partes.push( `${peso}kg x ${repsList.join(", ")}` );
		}

		const d = new Date( lastHistory.date );
		const dd = String( d.getDate() ).padStart( 2, '0' );
		const mm = String( d.getMonth() + 1 ).padStart( 2, '0' );

		return `Última sesión: ${partes.join(", ")} · ${dd}/${mm}`;
	}

	// Al cambiar el peso de un set
	const handleWeightChange = ( idx: number, value: string ) => {
		setSets( prev => {
			const next = [ ...prev ];
			next[idx].weight = value;

			// si replicar está activo y es el primero, copio a todos
			if( replicateWeight && idx === 0 ) {
				return next.map( s => ({ ...s, weight: value }));
			}
			return next;
		});
	}

	// Al cambiar las repeticiones de un set
	const handleRepsChange = ( idx: number, value: string ) => {
		setSets( prev => {
			const next = [...prev];
			next[idx].reps = value;
			return next;
		});
	}

	// Botón "+ Add set"
	const addSet = () => {
		setSets( prev => prev.length < 5
			? [...prev, { weight: prev[0].weight, reps: '' }]
			: prev
		);
	}

	// Maneja envío y cierre del modal
	const handleSubmit = async () => {
		if( selectedExercise == null ) return;

		let currentWorkoutId = workoutId;
		if( currentWorkoutId == null ) {
			const now = getLocalISOString();
			const newId = await insertNewWorkout({
				startDate: now,
				finishDate: now,
				workoutTypeId
			} as NewWorkout );
			setWorkoutId( newId );
			currentWorkoutId = newId;
		}

		// 1) Insertar ExerciseRecord
		const exerciseRecordId = await insertExerciseRecord({
			workoutId: currentWorkoutId,
			exerciseId: selectedExercise.id
		} as NewExerciseRecord );

		for( const s of sets ) {
			await insertSetRecord({
				exerciseRecordId,
				weight: parseFloat( s.weight ),
				reps: parseInt( s.reps, 10 )
			} as NewSetRecord );
		}

		// Reset modal inputs
		setExerciseModalVisible( false );
		setSelectedExercise( null );
		setSets( INITIAL_SETS );
		setReplicateWeight( false );
		setLastHistory( null );
	}

	const handleCancel = () => {
		setExerciseModalVisible( false );
		setSelectedExercise( null );
		setSets( INITIAL_SETS );
		setReplicateWeight( false );
		setLastHistory( null );
	}

	const handleFinishPress = () => {
		setFinishModalVisible( true );
	}

	// Finalizar workout y volver al Home
	const handleFinish = async () => {
		if( intervalRef.current ) clearInterval( intervalRef.current );

		if( workoutId != null ) {
			const now = getLocalISOString();
			await updateWorkoutFinishDate( workoutId, now );
		}
		setFinishModalVisible( false );
		tabNav?.navigate('Home');
		navigation.navigate('Tabs', { screen: 'Home' });
	};

	const renderItem = ({ item }: { item: Exercise }) => (
		<TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
			<TouchableOpacity style={ styles.favoriteIconContainer } onPress={ () => onFavoritePress( item ) }>
				{ item.favorite === 1 ? (
					<StarFilledIcon width={20} height={20} fill={'#007AFF'} />
				) : (
					<StarOutlineIcon width={20} height={20} />
				)}
			</TouchableOpacity>
			<Image
				source={{ uri: exerciseImageUrls[item.code] }}
				style={styles.image}
			/>
			<Text style={styles.cardText}>{item.name}</Text>
		</TouchableOpacity>
	);

	// ¿Hay al menos un set completamente lleno?
	const hasComplete = sets.some( s => s.weight.trim() !== '' && s.reps.trim() !== '' );

	// ¿Hay algún set parcialmente lleno (peso **o** reps, pero no ambos)?
	const hasPartial = sets.some( s => ( s.weight.trim() === '' ) !== ( s.reps.trim() === '' ) );

	const isSubmitDisabled = !hasComplete || hasPartial;

	const onFavoritePress = async ( exercise: Exercise ) => {
		try {
			await toggleExerciseFavorite( exercise.id, exercise.favorite === 1 ? 0 : 1 );
			setRefreshFlag( f => !f );
		} catch( error ) {
			console.error( 'No se pudo cambiar favorito:', error );
			console.log( 'No se pudo cambiar favorito:', error );
		}
	}

	const favoriteExercises = exercises.filter( e => e.favorite === 1 );

	const categoryOrder = [
		'Chest','Back','Shoulders','Biceps','Triceps',
		'Cuadriceps','Hamstrings','Gluts','Abductors','Adductors','Calves','Abs'
	];
	const groupSections = categoryOrder
		.map( group => ({
			title: group,
			data: exercises.filter( e => e.muscleGroup === group && e.favorite === 0 )
		}))
		.filter( section => section.data.length > 0 );

	const sections = [
		{
			title: 'Favorites',
			data: favoriteExercises
		},
		...groupSections
	];

	return (
		<View style={styles.container}>
			<SectionList
				sections={sections}
				keyExtractor={(item) => item.id.toString()}
				renderSectionHeader={({ section: { title } }) => (
					<Text style={ styles.sectionHeader }>{ title }</Text>
				)}
				renderItem={({ item, index, section }) => {
					if( index % 2 !== 0 ) return null;
					const first = item;
					const second = section.data[ index + 1 ];
					return (
						<View style={styles.row}>
							{renderItem({ item: first })}
							{second ? renderItem({ item: second }) : <View style={[styles.card, { opacity: 0 }]} />}
						</View>
					);
				}}
				contentContainerStyle={styles.list}
				stickySectionHeadersEnabled={false}
			/>

			{/* Cronómetro y botón Finish */}
			<View style={ styles.footer} >
				<TimerDisplay seconds={ seconds } />
				<TouchableOpacity style={ styles.finishButton } onPress={ workoutId != null ?  handleFinishPress : handleFinish }>
					<Text style={ styles.finishButtonText }>Finish Workout</Text>
				</TouchableOpacity>
			</View>

			<Modal visible={exerciseModalVisible} transparent animationType="slide">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>
							{selectedExercise?.name || 'Agregar series'}
						</Text>

						{/* Inputs dinámicos de Peso i y Reps i */}
						{sets.map( (s, i) => (
							<View key={i} style={ styles.fieldRow }>
								<TextInput
									style={styles.fieldInput}
									placeholder={`Peso ${i + 1}`}
									keyboardType="numeric"
									value={s.weight}
									onChangeText={v => handleWeightChange(i, v)}
									placeholderTextColor="#000"
								/>
								<TextInput
									style={styles.fieldInput}
									placeholder={`Reps ${i + 1}`}
									keyboardType="numeric"
									value={s.reps}
									onChangeText={v => handleRepsChange(i, v)}
									placeholderTextColor="#000"
								/>
							</View>
						))}

						{/* Casilla “usar mismo peso para todas” */}
						<TouchableOpacity style={styles.checkboxRow} onPress={() => setReplicateWeight(f => !f)}>
							<View style={styles.checkboxBox}>
								{replicateWeight && <View style={styles.checkboxChecked} />}
							</View>
							<Text style={styles.checkboxLabel}>All same weight</Text>
						</TouchableOpacity>

						{/* Botón +Add set (hasta 5) */}
						<TouchableOpacity
							style={[styles.addSetButton, sets.length >= 5 && styles.addSetButtonDisabled]}
							onPress={addSet}
							disabled={sets.length >= 5}
						>
							<Text style={styles.addSetText}>+ Add set</Text>
						</TouchableOpacity>

						<Text style={ styles.recordText }>{ getRecordText() }</Text>

						<TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleSubmit} disabled={isSubmitDisabled} style={[styles.modalButton, isSubmitDisabled && styles.modalButtonDisabled]}>
							<Text style={[styles.modalButtonText, isSubmitDisabled && styles.modalButtonTextDisabled]}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<Modal visible={ finishModalVisible } transparent animationType="slide">
				<View style={ styles.modalOverlay }>
					<View style={ styles.modalContainer }>
						<Text style={ styles.modalTitle }>Are you sure you want to finish the workout?</Text>
						<TouchableOpacity style={styles.cancelButton} onPress={() => setFinishModalVisible( false )}>
							<Text style={styles.cancelButtonText}>Back</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleFinish} style={styles.modalButton}>
							<Text style={styles.modalButtonText}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}