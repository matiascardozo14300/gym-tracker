import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import { getLast3Workouts, getWorkoutDatesForMonth, getWorkoutDetailByDate, LastWorkout, WorkoutDetail } from '../../services/database/';
import CalendarSection, { CustomMarkedDates } from '../calendar/CalendarSelection';
import LatestWorkouts from '../latestWorkouts/LatestWorkouts';
import WorkoutTypeSelector from './WorkoutTypeSelector';
import styles from './styles';
import Header from '../header/Header';
import { formateDateToLongText } from '../common/helper';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen() {
	const [ lastWorkouts, setLastWorkouts ] = useState<LastWorkout[]>([]);

	const [ markedDates, setMarkedDates ] = useState<CustomMarkedDates>({});

	const [modalVisible, setModalVisible] = useState( false );
	const [selectedDate, setSelectedDate] = useState<string | null>( null );
	const [workoutDetail, setWorkoutDetail] = useState<WorkoutDetail | null>( null );

	const today = new Date();
	const [ currentYear, setCurrentYear ] = useState( today.getFullYear() );
	const [ currentMonth, setCurrentMonth ] = useState( today.getMonth() + 1 );

	const isFocused = useIsFocused();

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
					setWorkoutDetail( detail );
				} catch( err ) {
					console.error( 'No se pudo cargar detalle:', err );
					setWorkoutDetail( null );
				}
			})();
		} else {
			setWorkoutDetail( null );
		}
	}, [modalVisible, selectedDate]);

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

				{/* MODAL VISUALIZACION ENTRENAMIENTO */}
				<Modal
					visible={modalVisible}
					transparent
					animationType="slide"
					onRequestClose={ () => {
						setModalVisible( false );
						setWorkoutDetail( null );
					}}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>
								{ selectedDate ? formateDateToLongText( selectedDate ): '' }
							</Text>

							{workoutDetail ? (
								<>
								{/* Tipo de entrenamiento */}
								<Text style={styles.modalSubtitle}>
									{workoutDetail.workoutType}
								</Text>

								{/* Lista de ejercicios con sus 3 sets */}
								<FlatList
									data={workoutDetail.exercises}
									keyExtractor={(item) => item.name}
									renderItem={({ item }) => (
										<View style={styles.detailRow}>
											<Text style={styles.detailExerciseName}>
												{item.name}
											</Text>
											<View style={styles.detailSetsContainer}>
												{item.sets.map((s, idx) => (
													<Text key={idx} style={styles.detailSetText}>
														{s.weight}kg × {s.reps}
													</Text>
												))}
											</View>
										</View>
									)}
								/>
								</>
							) : (
								<Text style={styles.modalEmptyText}>
									No hay registros para este día
								</Text>
							)}

							<TouchableOpacity
								style={styles.modalCloseButton}
								onPress={ () => {
									setModalVisible( false );
									setWorkoutDetail( null );
								}}
							>
								<Text style={styles.modalCloseButtonText}>
									Cerrar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

			</ScrollView>
		</SafeAreaView>
	);
}