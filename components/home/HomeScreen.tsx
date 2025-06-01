import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, FlatList } from 'react-native';
import { getLast3Workouts, getWorkoutDatesForMonth, getWorkoutDetailByDate, LastWorkout, WorkoutDetail } from '../../services/database/';
import CalendarSection, { CustomMarkedDates } from '../calendar/CalendarSelection';
import LatestWorkouts from '../latestWorkouts/LatestWorkouts';
import styles from './styles';
import { workoutTypeColors } from '../common/colorMap';
import Header from '../header/Header';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { formateDateToLongText } from '../common/helper';

const WorkoutTypeSelector: React.FC = () => {
	const types = ['Pull', 'Push', 'Legs', 'FullBody'];
	const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList, 'Home'>>();
	const stackNav = tabNav.getParent<NativeStackNavigationProp<RootStackParamList>>();

	return (
		<View style={ styles.section }>
			<Text style={ styles.sectionTitle }>Choose Workout Type</Text>
			<View style={ styles.row }>
				{ types.map( ( type ) => (
					<TouchableOpacity
						key={ type }
						onPress={ () => stackNav?.navigate('ExerciseSelection', { workoutType: type }) }
						style={[
							styles.typeButton,
							{ borderColor: workoutTypeColors[ type ] || '#ccc' }
						]}
					>
						<Text style={ styles.typeButtonText }>{ type }</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

export default function HomeScreen() {
	const [ lastWorkouts, setLastWorkouts ] = useState<LastWorkout[]>([]);

	const [ markedDates, setMarkedDates ] = useState<CustomMarkedDates>({});

	const [modalVisible, setModalVisible] = useState( false );
	const [selectedDate, setSelectedDate] = useState<string | null>( null );
	const [workoutDetail, setWorkoutDetail] = useState<WorkoutDetail | null>( null );

	// Al cargar la pantalla por primera vez
	useEffect(() => {
		getLast3Workouts().then( setLastWorkouts ).catch( console.error );

		(async () => {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;
			const items = await getWorkoutDatesForMonth( year, month );

			const marks: CustomMarkedDates = {};
			for (const { date, workoutType } of items) {
				marks[date] = {
				  customStyles: {
					container: {
					  backgroundColor: workoutTypeColors[ workoutType ] || 'grey',
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
		})();
	}, []);

	const fetchWorkoutsForMonth = async ( year: number, month: number ) => {
		const items = await getWorkoutDatesForMonth( year, month );
		const marks: CustomMarkedDates = {};
		for (const { date, workoutType } of items) {
			marks[date] = {
				customStyles: {
				container: {
					backgroundColor: workoutTypeColors[ workoutType ] || 'grey',
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
				<Header title='Home' />
				<WorkoutTypeSelector />
				<CalendarSection
					markedDates={ markedDates }
					onDayPress={ async ( day ) => {
						const dateString = day.dateString;
						setSelectedDate( dateString );
						setModalVisible( true );
					}}
					onMonthChanged={ (date) => fetchWorkoutsForMonth( date?.year, date?.month )}
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