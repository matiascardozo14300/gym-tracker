import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import { getLast3Workouts, getWorkoutDatesForMonth, getWorkoutDetailByDate, getWorkoutTypes, LastWorkout, WorkoutDetail, WorkoutType } from '../../services/database/';
import CalendarSection, { CustomMarkedDates } from '../calendar/CalendarSelection';
import LatestWorkouts from '../latestWorkouts/LatestWorkouts';
import WorkoutTypeSelector from './WorkoutTypeSelector';
import {styles, modalUX, pickerUX} from './styles';
import Header from '../header/Header';
import { formateDateToLongText, isFutureDate, isToday } from '../common/helper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Inicio'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
	const [ lastWorkouts, setLastWorkouts ] = useState<LastWorkout[]>([]);

	const [ markedDates, setMarkedDates ] = useState<CustomMarkedDates>({});

	const [modalVisible, setModalVisible] = useState( false );
	const [selectedDate, setSelectedDate] = useState<string | null>( null );
	const [workoutDetail, setWorkoutDetail] = useState<WorkoutDetail | null>( null );

	const [typePickerVisible, setTypePickerVisible] = useState( false );
	const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);

	const today = new Date();
	const [ currentYear, setCurrentYear ] = useState( today.getFullYear() );
	const [ currentMonth, setCurrentMonth ] = useState( today.getMonth() + 1 );

	const isFocused = useIsFocused();

	const navigation = useNavigation<StackNav>();
	const tabNav = useNavigation<TabNav>();
	const stackNav = tabNav.getParent<StackNav>();

	const load = useCallback( async ( year: number, month: number ) => {
		const [ last3, items ] = await Promise.all([
			getLast3Workouts(),
			getWorkoutDatesForMonth( year, month ),
		]);

		setLastWorkouts( last3 );

		const marks: CustomMarkedDates = {};
		for( const { date, workoutType, color } of items ) {
			marks[date] = {
				customStyles: {
					container: {
						backgroundColor: color || 'grey',
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
	}, []);

	useEffect(() => {
		if( isFocused ) {
			load( currentYear, currentMonth );
		}
	}, [ isFocused, currentYear, currentMonth, load ]);

	const handleMonthChange = ( year: number, month: number ) => {
		setCurrentMonth( month );
		setCurrentYear( year );
	}

	// Cuando se selecciona un día en el calendario
	useEffect( () => {
		if( modalVisible && selectedDate ) {
			( async () => {
				try {
					const detail = await getWorkoutDetailByDate( selectedDate );
					setWorkoutDetail( detail || null );
				} catch( err ) {
					console.error( 'No se pudo cargar detalle:', err );
					setWorkoutDetail( null );
				}
			})();
		} else {
			setWorkoutDetail( null );
		}
	}, [modalVisible, selectedDate]);

	const openTypePicker = async () => {
		try {
			const types = await getWorkoutTypes();
			setWorkoutTypes(types);
      		setTypePickerVisible(true);
		} catch( e ) {
			console.error( 'Error cargando tipos de rutina', e );
			setWorkoutTypes( [] );
			setTypePickerVisible( true );
		}
	}

	const closeAllModals = () => {
		setTypePickerVisible( false );
		setModalVisible( false );
		setWorkoutDetail( null );
	};

	const startPastWorkout = ( type: WorkoutType ) => {
		if( !selectedDate ) return;

		closeAllModals();
		navigation.navigate( 'ExerciseSelection', {
			workoutTypeId: type.id,
			forDate: selectedDate, // 👈 param para modo "carga pasada"
		} as any );
	}

	const hasRecord = !!workoutDetail;
	const isTodaySelected = !!selectedDate && isToday( selectedDate );
	const addDisabled = !hasRecord && !!selectedDate && isFutureDate(selectedDate);

	return (
		<SafeAreaView style={ styles.container }>
			<ScrollView contentContainerStyle={ styles.scrollContent }>
				<Header title='Inicio' />
				<WorkoutTypeSelector />
				<CalendarSection
					markedDates={ markedDates }
					onDayPress={ async ( day ) => {
						const dateString = day.dateString;
						setSelectedDate( dateString );
						setModalVisible( true );
					}}
					onMonthChanged={ (date) => handleMonthChange( date?.year, date?.month )}
				/>
				<LatestWorkouts workouts={ lastWorkouts } onWorkoutPress={ async ( workout ) => {
					const dateString = workout.startDate.includes( 'T' ) ? workout.startDate.split( 'T' )[0] : workout.startDate;
					setSelectedDate( dateString );
					setModalVisible( true );
				} } />

				{/* MODAL VISUALIZACIÓN / ACCIONES DEL DÍA */}
				<Modal
					visible={modalVisible}
					transparent
					animationType="fade"
					onRequestClose={ () => {
						setModalVisible( false );
						setWorkoutDetail( null );
					}}
				>
					<View style={styles.modalOverlay}>
						<View style={[styles.modalContainer, modalUX.container]}>
							{/* Header */}
							<View style={modalUX.header}>
								<Text style={modalUX.title}>
									{ selectedDate ? formateDateToLongText(selectedDate) : '' }
								</Text>
								{workoutDetail ? (
									<Text style={modalUX.subtitle}>{workoutDetail.workoutType}</Text>
								) : (
									<Text style={modalUX.subtitleMuted}>Sin registro</Text>
								)}
							</View>

							{/* Body */}
							{workoutDetail ? (
								<View style={modalUX.listBlock}>
									<FlatList
										contentContainerStyle={{ paddingBottom: 0 }}
										data={workoutDetail.exercises}
										keyExtractor={(item) => item.name}
										renderItem={({ item }) => (
											<View style={modalUX.detailRow}>
												<Text style={modalUX.exerciseName}>{item.name}</Text>
												<View style={modalUX.setsRow}>
													{item.sets.map((s, idx) => (
														<View key={idx} style={modalUX.pill}>
															<Text style={modalUX.pillText}>{s.weight}kg × {s.reps}</Text>
														</View>
													))}
												</View>
											</View>
										)}
									/>
								</View>
							) : (
								<View style={modalUX.emptyWrap}>
									<Text style={modalUX.emptyText}>No hay registros para este día</Text>
								</View>
							)}

							{/* Footer con acciones */}
							<View style={modalUX.actions}>
								<TouchableOpacity
									style={[modalUX.btn, modalUX.btnGhost]}
									onPress={() => {
										setModalVisible(false);
										setWorkoutDetail(null);
									}}
								>
									<Text style={[modalUX.btnText, modalUX.btnGhostText]}>Cerrar</Text>
								</TouchableOpacity>

								{hasRecord ? (
									// Caso 1: hay registro -> Editar
									<TouchableOpacity
										style={[modalUX.btn, modalUX.btnPrimary]}
										onPress={() => {
											// TODO -> Lógica de edición del entrenamiento pasado (lo implementamos luego)
											// Podrías navegar a una pantalla de detalle/edición con la fecha:
											// navigation.navigate('EditPastWorkout', { date: selectedDate })
										}}
									>
										<Text style={modalUX.btnTextPrimary}>Editar</Text>
									</TouchableOpacity>
								) : isTodaySelected ? (
									// Caso 2: NO hay registro y la fecha es HOY -> Iniciar
									<TouchableOpacity
										style={[modalUX.btn, modalUX.btnPrimary]}
										onPress={() => {
											stackNav?.navigate( 'Tabs', { screen: 'Rutinas' } );
											setModalVisible(false);
											setWorkoutDetail(null);
										}}
									>
										<Text style={modalUX.btnTextPrimary}>Iniciar</Text>
									</TouchableOpacity>
								) : (
									// Caso 3: NO hay registro y la fecha NO es hoy -> Añadir (con bloqueo si es futura)
									<TouchableOpacity
										style={[modalUX.btn, modalUX.btnPrimary, addDisabled && modalUX.btnDisabled]}
										onPress={openTypePicker}
										disabled={addDisabled}
									>
										<Text style={[modalUX.btnTextPrimary, addDisabled && modalUX.btnTextDisabled]}>Añadir</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</View>
				</Modal>

				{/* MODAL #2: SELECTOR DE RUTINA (grid de tiles con color) */}
				<Modal
					visible={typePickerVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setTypePickerVisible(false)}
				>
					<View style={styles.modalOverlay}>
						<View style={[styles.modalContainer, pickerUX.container]}>
							<Text style={pickerUX.title}>Seleccioná la rutina</Text>
							<Text style={pickerUX.subtitle}>
								Vas a cargar un entrenamiento para {selectedDate ? formateDateToLongText(selectedDate) : 'la fecha elegida'}.
							</Text>

							<FlatList
								contentContainerStyle={pickerUX.grid}
								data={workoutTypes}
								keyExtractor={(item) => String(item.id)}
								numColumns={2}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={[pickerUX.tile, { borderColor: item.color ?? '#ccc' }]}
										onPress={() => startPastWorkout(item)}
										activeOpacity={0.9}
									>
										<View style={[pickerUX.swatch, { backgroundColor: item.color ?? '#ccc' }]} />
										<Text style={pickerUX.tileText} numberOfLines={2} ellipsizeMode="tail">
											{item.name}
										</Text>
									</TouchableOpacity>
								)}
							/>

							<View style={modalUX.actions}>
								<TouchableOpacity
									style={[modalUX.btn, modalUX.btnGhost]}
									onPress={() => setTypePickerVisible(false)}
									activeOpacity={0.9}
								>
									<Text style={[modalUX.btnText, modalUX.btnGhostText]}>Atrás</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

			</ScrollView>
		</SafeAreaView>
	);
}