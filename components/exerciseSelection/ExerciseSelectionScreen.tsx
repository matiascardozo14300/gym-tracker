import React, { useEffect, useMemo, useRef, useState } from 'react';
import {View, Text, TouchableOpacity, Image, Modal, TextInput, SectionList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { Exercise, ExerciseLastHistory, getExerciseByWorkoutType, getExerciseLastHistory, getExerciseNotes, insertExerciseRecord, insertNewWorkout, insertSetRecord, NewExerciseRecord, NewSetRecord, NewWorkout, saveExerciseNotes, toggleExerciseFavorite, updateWorkoutFinishDate } from '../../services/database/';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {styles} from './styles';
import {fakePickerStyles} from './styles';
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

// Helper: arma un ISO local yyyy-MM-ddTHH:mm:ss de una fecha yyyy-MM-dd y hora/min
function dateAtLocalTimeISO(dateYYYYMMDD: string, hours = 12, minutes = 0): string {
	// Asumimos dateYYYYMMDD está en formato "YYYY-MM-DD"
	const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
	const dt = new Date(y, (m - 1), d, hours, minutes, 0, 0);
	// toISOString da UTC; queremos ISO "local" como el resto de tu app -> formateamos manual:
	const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
	const isoLocal = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
	return isoLocal;
}

export default function ExerciseSelectionScreen() {
	const navigation = useNavigation<ExSelNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
	const route = useRoute<ExSelRouteProp>();
  	const { workoutTypeId, selectedDate } = route.params as ( ExSelRouteProp['params'] & { selectedDate?: string }) | any;

	const isPastMode = useMemo( () => !!selectedDate, [ selectedDate ] );

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
	const [ notesModalVisible, setNotesModalVisible ] = useState(false);
	const [ finishModalVisible, setFinishModalVisible] = useState(false);
	const [ selectedExercise, setSelectedExercise ] = useState<Exercise | null>(null);

	const [ sets, setSets ] = useState<{ weight: string; reps: string }[]>( INITIAL_SETS );
	const [ replicateWeight, setReplicateWeight ] = useState( false );
	const [ lastHistory, setLastHistory ] = useState<ExerciseLastHistory | null>(null);
	const [ originalNotes, setOriginalNotes ] = useState<string>("");
	const [ notes, setNotes ] = useState<string>("");

	// PastMode -> Duración por defecto 00:45
	const [ durHours, setDurHours ] = useState<number>(0);
	const [ durMinutes, setDurMinutes ] = useState<number>(45);
	const [durationModalVisible, setDurationModalVisible] = useState(false);
	const [openSelector, setOpenSelector] = useState<null | 'hours' | 'minutes'>(null);

	const HOUR_OPTIONS = [0,1,2,3,4,5,6];
	const MINUTE_OPTIONS = [0,5,10,15,20,25,30,35,40,45,50,55];

	// Start timmer -> SOLO si no es PastMode
	useEffect( () => {
		if( isPastMode ) return;

		startTimeRef.current = Date.now();
		intervalRef.current = setInterval(() => {
			const diff = Date.now() - startTimeRef.current;
			setSeconds( Math.floor( diff / 1000 ) );
		}, 1000 );

		return () => {
			if( intervalRef.current ) clearInterval( intervalRef.current );
		};
	}, [isPastMode] );

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

	// Se abre el modal de notas
	useEffect( () => {
		if( notesModalVisible && selectedExercise ) {
			( async () => {
				try {
					const exerciseNotes = await getExerciseNotes( selectedExercise.id );
					setNotes( exerciseNotes );
					setOriginalNotes( exerciseNotes );
				} catch( error ) {
					console.error( 'Error al obtener las notas del ejercicio' );
					setNotes( "" );
					setOriginalNotes("");
				}
			})();
		} else {
			setNotes( "" );
			setOriginalNotes("");
		}
	}, [ notesModalVisible, selectedExercise ]);

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

	// Guarda los sets de un ejercicio
	const handleSubmit = async () => {
		if( !selectedExercise ) return;

		let currentWorkoutId = workoutId;
		if( currentWorkoutId == null ) {
			// En PastMode -> creo un workout con startDate en la fecha del parámetro
			// En Hoy -> uso "ahora"
			const startISO = isPastMode
				? dateAtLocalTimeISO( selectedDate!, 12, 0 )
				: getLocalISOString();

			const newId = await insertNewWorkout({
				startDate: startISO,
				finishDate: startISO,
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

	// Guarda un entrenamiento pasado
	const savePastWorkout = async ( params: { workoutId: number; startDateISO: string; finishDateISO: string  } ) => {
		if( workoutId != null ) {
			await updateWorkoutFinishDate( params.workoutId, params.finishDateISO );
		}
	}

	const handleCancel = () => {
		setExerciseModalVisible( false );
		setSelectedExercise( null );
		setSets( INITIAL_SETS );
		setReplicateWeight( false );
		setLastHistory( null );
	}

	const handleFinishPress = () => setFinishModalVisible( true );

	const isDirty = notes !== originalNotes;

	const saveNotes = async () => {
		if (!isDirty) return;

		if( selectedExercise ) {
			await saveExerciseNotes( selectedExercise.id, notes );
		} else {
			console.error( "No se pudieron guardar las notas" );
		}

		setNotesModalVisible(false);
	}

	// Finalizar workout y volver al Inicio (modo HOY)
	const handleFinish = async () => {
		if( intervalRef.current ) clearInterval( intervalRef.current );

		if( workoutId != null ) {
			const now = getLocalISOString();
			await updateWorkoutFinishDate( workoutId, now );
		}
		setFinishModalVisible( false );
		tabNav?.navigate('Inicio');
		navigation.navigate('Tabs', { screen: 'Inicio' });
	};

	const handleOpenDuration = () => setDurationModalVisible( true );

	const handleConfirmDuration = async () => {
		if( !workoutId ) {
			Alert.alert( 'Atención', 'Primero agregá al menos un ejercicio para guardar el entrenamiento.' );
			return;
		}

		// start ya fue creado a las 12:00 de selectedDate
		const startISO = dateAtLocalTimeISO( selectedDate!, 12, 0 );
		const totalMin = durHours * 60 + durMinutes;
		const startDateObj = new Date(
			parseInt(startISO.substring(0, 4)),
			parseInt(startISO.substring(5, 7)) - 1,
			parseInt(startISO.substring(8, 10)),
			parseInt(startISO.substring(11, 13)),
			parseInt(startISO.substring(14, 16)),
			parseInt(startISO.substring(17, 19)),
			0
		);
		const finishDateObj = new Date(startDateObj.getTime() + totalMin * 60000);
		const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
		const finishISO = `${finishDateObj.getFullYear()}-${pad(finishDateObj.getMonth() + 1)}-${pad(finishDateObj.getDate())}T${pad(finishDateObj.getHours())}:${pad(finishDateObj.getMinutes())}:${pad(finishDateObj.getSeconds())}`;

		await updateWorkoutFinishDate( workoutId, finishISO );
		await savePastWorkout({ workoutId, startDateISO: startISO, finishDateISO: finishISO });

		setDurationModalVisible( false );
		tabNav?.navigate('Inicio');
    	navigation.navigate('Tabs', { screen: 'Inicio' });
	}

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
			title: 'Favoritos',
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

				{!isPastMode && <TimerDisplay seconds={ seconds } />}

				{isPastMode ? (
					<TouchableOpacity style={[styles.finishButton]} onPress={handleOpenDuration}>
						<Text style={styles.finishButtonText}>Guardar Entrenamiento</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={ styles.finishButton } onPress={ workoutId != null ?  handleFinishPress : handleFinish }>
						<Text style={ styles.finishButtonText }>Finalizar Entrenamiento</Text>
					</TouchableOpacity>
				)}
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
							<Text style={styles.checkboxLabel}>Mismo peso</Text>
						</TouchableOpacity>

						{/* Fila de botones: Add set --- Notes */}
						<View style={ styles.buttonsRow }>
							<TouchableOpacity
								style={[ styles.addSetButton, sets.length >= 5 && styles.addSetButtonDisabled ]}
								onPress={addSet}
								disabled={ sets.length >= 5 }
							>
								<Text style={styles.addSetText}>+ Agregar set</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.addNotesButton}
								onPress={() => setNotesModalVisible( true )}
							>
								<Text style={styles.addNotesText}>Notas</Text>
							</TouchableOpacity>
						</View>

						<Text style={ styles.recordText }>{ getRecordText() }</Text>

						<TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
							<Text style={styles.cancelButtonText}>Cancelar</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleSubmit} disabled={isSubmitDisabled} style={[styles.modalButton, isSubmitDisabled && styles.modalButtonDisabled]}>
							<Text style={[styles.modalButtonText, isSubmitDisabled && styles.modalButtonTextDisabled]}>Guardar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<Modal visible={ finishModalVisible } transparent animationType="slide">
				<View style={ styles.modalOverlay }>
					<View style={ styles.modalContainer }>
						<Text style={ styles.modalTitle }>¿Estás seguro de finalizar el entrenamiento?</Text>
						<TouchableOpacity style={styles.cancelButton} onPress={() => setFinishModalVisible( false )}>
							<Text style={styles.cancelButtonText}>Atrás</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleFinish} style={styles.modalButton}>
							<Text style={styles.modalButtonText}>Guardar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Modal de duración (solo PASADO) */}
			<Modal visible={durationModalVisible} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContainer, fakePickerStyles.sheet]}>
						<Text style={[styles.modalTitle, { marginBottom: 12 }]}>Duración del entrenamiento</Text>

						{/* “Inputs” fake que abren los selectores */}
						<View style={fakePickerStyles.row}>
							<TouchableOpacity
								activeOpacity={0.8}
								style={fakePickerStyles.fakeInput}
								onPress={() => setOpenSelector(openSelector === 'hours' ? null : 'hours')}
							>
								<Text style={fakePickerStyles.fakeInputLabel}>{durHours === 1 ? 'Hora' : 'Horas'}</Text>
								<Text style={fakePickerStyles.fakeInputValue}>{durHours}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.8}
								style={fakePickerStyles.fakeInput}
								onPress={() => setOpenSelector(openSelector === 'minutes' ? null : 'minutes')}
							>
								<Text style={fakePickerStyles.fakeInputLabel}>Minutos</Text>
								<Text style={fakePickerStyles.fakeInputValue}>{durMinutes}</Text>
							</TouchableOpacity>
						</View>

						{/* Selector de HORAS */}
						{openSelector === 'hours' && (
							<View style={fakePickerStyles.selectorPanel}>
								<Text style={fakePickerStyles.selectorTitle}>Elegí la cantidad de horas</Text>
								<View style={fakePickerStyles.chipsWrap}>
									{HOUR_OPTIONS.map(h => {
										const selected = h === durHours;
										return (
											<TouchableOpacity
												key={`h-${h}`}
												onPress={() => { setDurHours(h); setOpenSelector(null); }}
												activeOpacity={0.8}
												style={[fakePickerStyles.chip, selected && fakePickerStyles.chipSelected]}
											>
												<Text style={[fakePickerStyles.chipText, selected && fakePickerStyles.chipTextSelected]}>
													{h}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>
						)}

						{/* Selector de MINUTOS */}
						{openSelector === 'minutes' && (
							<View style={fakePickerStyles.selectorPanel}>
								<Text style={fakePickerStyles.selectorTitle}>Elegí la cantidad de minutos</Text>
								<View style={fakePickerStyles.chipsWrap}>
									{MINUTE_OPTIONS.map(m => {
										const selected = m === durMinutes;
										return (
											<TouchableOpacity
												key={`m-${m}`}
												onPress={() => { setDurMinutes(m); setOpenSelector(null); }}
												activeOpacity={0.8}
												style={[fakePickerStyles.chip, selected && fakePickerStyles.chipSelected]}
											>
												<Text style={[fakePickerStyles.chipText, selected && fakePickerStyles.chipTextSelected]}>
													{m}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>
						)}

						{/* Acciones */}
						<View style={fakePickerStyles.actions}>
							<TouchableOpacity style={[styles.cancelButton, { flex: 1 }]} onPress={() => { setDurationModalVisible(false); setOpenSelector(null); }}>
								<Text style={styles.cancelButtonText}>Atrás</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.modalButton, { flex: 1 }]} onPress={handleConfirmDuration}>
								<Text style={styles.modalButtonText}>Guardar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Modal de notas */}
			<Modal visible={notesModalVisible} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Notas del ejercicio</Text>

						<TextInput
							style={styles.textArea}
							multiline
							maxLength={500}
							placeholder="Escribe notas para el ejercicio. Por ejemplo: ajustes del asiento o máquina, indicaciones de calentamiento, etc."
							placeholderTextColor="#666"
							value={notes}
							onChangeText={setNotes}
						/>

						<TouchableOpacity
							style={styles.cancelButton}
							onPress={() => setNotesModalVisible(false)}
						>
							<Text style={styles.cancelButtonText}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
                  				styles.modalButton,
                  				!isDirty && styles.modalButtonDisabled
							]}
							onPress={saveNotes}
							disabled={!isDirty}
						>
							<Text style={[ styles.modalButtonText, !isDirty && styles.modalButtonTextDisabled ]}>Guardar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}