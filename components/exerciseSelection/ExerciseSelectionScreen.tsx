import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Modal,
	TextInput,
	SectionList,
	Alert,
	FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList } from '../../App';
import {
	Exercise,
	ExerciseLastHistory,
	getExerciseByWorkoutType,
	getExerciseLastHistory,
	getExerciseNotes,
	insertExerciseRecord,
	insertNewWorkout,
	insertSetRecord,
	NewExerciseRecord,
	NewSetRecord,
	NewWorkout,
	saveExerciseNotes,
	toggleExerciseFavorite,
	updateWorkoutFinishDate,
} from '../../services/database/';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { styles, fakePickerStyles } from './styles';
import { exerciseImageUrls } from '../common/allExercisesImages';
import StarFilledIcon from '../../assets/icons/favoriteFill.svg';
import StarOutlineIcon from '../../assets/icons/favorite.svg';
import { getLocalISOString } from '../common/helper';
import ExerciseSetEditor, { SimpleSet } from './ExerciseSetEditor';
import { modalStyles } from '../common/modalStyles';
import { modalUX } from '../home/styles';

type ExSelRouteProp = RouteProp<RootStackParamList, 'ExerciseSelection'>;
type ExSelNavProp = CompositeNavigationProp<
	NativeStackNavigationProp<RootStackParamList, 'ExerciseSelection'>,
	BottomTabNavigationProp<RootTabParamList>
>;

// helper para mostrar MM:SS
const formatSeconds = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
	const ss = secs < 10 ? `0${secs}` : `${secs}`;
	return `${mm}:${ss}`;
};

// Timer general del workout (footer)
const TimerDisplay: React.FC<{ seconds: number }> = ({ seconds }) => (
	<View style={styles.timerContainer}>
		<Text style={styles.timerText}>{formatSeconds(seconds)}</Text>
	</View>
);

// Helper: ISO local yyyy-MM-ddTHH:mm:ss a partir de yyyy-MM-dd + hora/min
function dateAtLocalTimeISO(dateYYYYMMDD: string, hours = 12, minutes = 0): string {
	const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
	const dt = new Date(y, m - 1, d, hours, minutes, 0, 0);
	const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
	return (
		`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
		`T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`
	);
}

export default function ExerciseSelectionScreen() {
	const navigation = useNavigation<ExSelNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
	const route = useRoute<ExSelRouteProp>();

	const { workoutTypeId, selectedDate } =
		(route.params as ExSelRouteProp['params'] & { selectedDate?: string }) || {};

	const isPastMode = useMemo(() => !!selectedDate, [selectedDate]);

	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [workoutId, setWorkoutId] = useState<number | null>(null);
	const [refreshFlag, setRefreshFlag] = useState(false);

	// timer de sesión (modo tiempo real)
	const [seconds, setSeconds] = useState(0);
	const startTimeRef = useRef<number>(Date.now());
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// estado de pantalla de sets / modales
	const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
	const [notesModalVisible, setNotesModalVisible] = useState(false);
	const [finishModalVisible, setFinishModalVisible] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
	const [lastHistory, setLastHistory] = useState<ExerciseLastHistory | null>(null);

	const [originalNotes, setOriginalNotes] = useState<string>('');
	const [notes, setNotes] = useState<string>('');

	// ejercicios ya cargados en este workout (marca "Completado" en card)
	const [completedExercises, setCompletedExercises] = useState<
		Record<number, boolean>
	>({});

	// PastMode -> duración por defecto
	const [durHours, setDurHours] = useState<number>(0);
	const [durMinutes, setDurMinutes] = useState<number>(45);
	const [durationModalVisible, setDurationModalVisible] = useState(false);
	const [openSelector, setOpenSelector] = useState<null | 'hours' | 'minutes'>(
		null
	);

	const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5, 6];
	const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', (e) => {
			// Siempre prevenimos el pop automático
			e.preventDefault();

			// 1) Si está abierto el editor de sets, lo cerramos
			if (exerciseModalVisible) {
				setExerciseModalVisible(false);
				setSelectedExercise(null);
				setLastHistory(null);
				return;
			}

			// 2) Si NO hay workout creado todavía, ir directo al Home
			if (workoutId == null) {
				goHome();
				return;
			}

			// 3) Si hay workout, editor cerrado -> mostramos el modal de confirmación
			setFinishModalVisible(true);
		});

		return unsubscribe;
	}, [navigation, tabNav, exerciseModalVisible, workoutId]);


	// timer sólo en modo "ahora"
	useEffect(() => {
		if (isPastMode) return;

		startTimeRef.current = Date.now();
		intervalRef.current = setInterval(() => {
			const diff = Date.now() - startTimeRef.current;
			setSeconds(Math.floor(diff / 1000));
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isPastMode]);

	// cargar ejercicios
	useEffect(() => {
		getExerciseByWorkoutType(workoutTypeId)
			.then(setExercises)
			.catch(console.error);
	}, [workoutTypeId, refreshFlag]);

	// cuando se abre el editor de sets, obtenemos el último historial
	useEffect(() => {
		if (exerciseModalVisible && selectedExercise) {
			(async () => {
				try {
					const hist = await getExerciseLastHistory(selectedExercise.id);
					setLastHistory(hist);
				} catch (error) {
					console.error('Error al obtener el último registro para el ejercicio: ', error);
					setLastHistory(null);
				}
			})();
		} else {
			setLastHistory(null);
		}
	}, [exerciseModalVisible, selectedExercise]);

	// modal de notas -> carga/limpia notas
	useEffect(() => {
		if (notesModalVisible && selectedExercise) {
			(async () => {
				try {
					const exerciseNotes = await getExerciseNotes(selectedExercise.id);
					setNotes(exerciseNotes);
					setOriginalNotes(exerciseNotes);
				} catch (error) {
					console.error('Error al obtener las notas del ejercicio');
					setNotes('');
					setOriginalNotes('');
				}
			})();
		} else {
			setNotes('');
			setOriginalNotes('');
		}
	}, [notesModalVisible, selectedExercise]);

	const handleCardPress = (item: Exercise) => {
		setSelectedExercise(item);
		setExerciseModalVisible(true);
	};

	// callback que recibe sets desde ExerciseSetEditor
	const handleSubmitSets = async (setsToSave: SimpleSet[], exercise: Exercise) => {
		let currentWorkoutId = workoutId;
		if (currentWorkoutId == null) {
			const startISO = isPastMode
				? dateAtLocalTimeISO(selectedDate!, 12, 0)
				: getLocalISOString();

			const newId = await insertNewWorkout({
				startDate: startISO,
				finishDate: startISO,
				workoutTypeId,
			} as NewWorkout);

			setWorkoutId(newId);
			currentWorkoutId = newId;
		}

		const exerciseRecordId = await insertExerciseRecord({
			workoutId: currentWorkoutId,
			exerciseId: exercise.id,
		} as NewExerciseRecord);

		for (const s of setsToSave) {
			await insertSetRecord({
				exerciseRecordId,
				weight: parseFloat(s.weight),
				reps: parseInt(s.reps, 10),
			} as NewSetRecord);
		}

		// marcar la card como completada
		setCompletedExercises(prev => ({ ...prev, [exercise.id]: true }));

		setExerciseModalVisible(false);
		setSelectedExercise(null);
		setLastHistory(null);
	};

	const savePastWorkout = async (params: {
		workoutId: number;
		startDateISO: string;
		finishDateISO: string;
	}) => {
		if (workoutId != null) {
			await updateWorkoutFinishDate(params.workoutId, params.finishDateISO);
		}
	};

	const handleCancelEditor = () => {
		setExerciseModalVisible(false);
		setSelectedExercise(null);
		setLastHistory(null);
	};

	const handleFinishPress = () => setFinishModalVisible(true);

	const handleConfirmFinishFromModal = async () => {
		if (isPastMode) {
			// Cerrar el modal de confirmación y seguir el mismo flujo
			// que si hubieras tocado "Guardar Entrenamiento"
			setFinishModalVisible(false);
			handleOpenDuration();
		} else {
			// En modo "ahora" hacemos exactamente lo mismo que el footer:
			await handleFinish();
		}
	};

	const isDirty = notes !== originalNotes;

	const saveNotesHandler = async () => {
		if (!isDirty) return;

		if (selectedExercise) {
			await saveExerciseNotes(selectedExercise.id, notes);
		} else {
			console.error('No se pudieron guardar las notas');
		}

		setNotesModalVisible(false);
	};

	const handleFinish = async () => {
		if (intervalRef.current) clearInterval(intervalRef.current);

		if (workoutId != null) {
			const now = getLocalISOString();
			await updateWorkoutFinishDate(workoutId, now);
		}
		setFinishModalVisible(false);
		goHome();
	};

	const handleOpenDuration = () => setDurationModalVisible(true);

	const handleConfirmDuration = async () => {
		if (!workoutId) {
			Alert.alert(
				'Atención',
				'Primero agregá al menos un ejercicio para guardar el entrenamiento.'
			);
			return;
		}

		const startISO = dateAtLocalTimeISO(selectedDate!, 12, 0);
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
		const finishISO =
			`${finishDateObj.getFullYear()}-${pad(finishDateObj.getMonth() + 1)}-${pad(
				finishDateObj.getDate()
			)}` +
			`T${pad(finishDateObj.getHours())}:${pad(
				finishDateObj.getMinutes()
			)}:${pad(finishDateObj.getSeconds())}`;

		await updateWorkoutFinishDate(workoutId, finishISO);
		await savePastWorkout({
			workoutId,
			startDateISO: startISO,
			finishDateISO: finishISO,
		});

		setDurationModalVisible(false);
		goHome();
	};

	const goHome = () => {
		tabNav?.navigate('Inicio');
		navigation.navigate('Tabs', { screen: 'Inicio' });
	}

	const onFavoritePress = async (exercise: Exercise) => {
		try {
			await toggleExerciseFavorite(exercise.id, exercise.favorite === 1 ? 0 : 1);
			setRefreshFlag(f => !f);
		} catch (error) {
			console.error('No se pudo cambiar favorito:', error);
		}
	};

	const favoriteExercises = exercises.filter(e => e.favorite === 1);


	const pendingExercises = useMemo(
		() => exercises.filter((e) => !completedExercises[e.id]),
		[exercises, completedExercises]
	);

	const categoryOrder = [
		'Chest',
		'Back',
		'Shoulders',
		'Biceps',
		'Triceps',
		'Cuadriceps',
		'Hamstrings',
		'Gluts',
		'Abductors',
		'Adductors',
		'Calves',
		'Abs',
	];

	const groupSections = categoryOrder
		.map(group => ({
			title: group,
			data: exercises.filter(
				e => e.muscleGroup === group && e.favorite === 0
			),
		}))
		.filter(section => section.data.length > 0);

	const sections = [
		{ title: 'Favoritos', data: favoriteExercises },
		...groupSections,
	];

	const renderCard = ({ item }: { item: Exercise }) => {
		const isCompleted = completedExercises[item.id];

		return (
			<TouchableOpacity
				style={[
					styles.card,
					isCompleted && styles.cardCompleted,
				]}
				onPress={() => handleCardPress(item)}
			>
				<TouchableOpacity
					style={styles.favoriteIconContainer}
					onPress={() => onFavoritePress(item)}
				>
					{item.favorite === 1 ? (
						<StarFilledIcon width={20} height={20} fill={'#007AFF'} />
					) : (
						<StarOutlineIcon width={20} height={20} />
					)}
				</TouchableOpacity>

				{isCompleted && (
					<View style={styles.completedBadge}>
						<Text style={styles.completedBadgeText}>Completado</Text>
					</View>
				)}

				<Image
					source={{ uri: exerciseImageUrls[item.code] }}
					style={styles.image}
				/>
				<Text style={styles.cardText}>{item.name}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{/* Si está activo el editor, mostramos esa “pantalla”; sino, el listado */}
			{exerciseModalVisible && selectedExercise ? (
				<ExerciseSetEditor
					exercise={selectedExercise}
					lastHistory={lastHistory}
					onCancel={handleCancelEditor}
					onSubmit={handleSubmitSets}
					onOpenNotes={() => setNotesModalVisible(true)}
				/>
			) : (
				<>
					<SectionList
						sections={sections}
						keyExtractor={item => item.id.toString()}
						renderSectionHeader={({ section: { title } }) => (
							<Text style={styles.sectionHeader}>{title}</Text>
						)}
						renderItem={({ item, index, section }) => {
							if (index % 2 !== 0) return null;
							const first = item;
							const second = section.data[index + 1];
							return (
								<View style={styles.row}>
									{renderCard({ item: first })}
									{second ? (
										renderCard({ item: second })
									) : (
										<View style={[styles.card, { opacity: 0 }]} />
									)}
								</View>
							);
						}}
						contentContainerStyle={styles.list}
						stickySectionHeadersEnabled={false}
					/>

					{/* footer con cronómetro y botón de fin */}
					<View style={styles.footer}>
						{!isPastMode && <TimerDisplay seconds={seconds} />}

						{isPastMode ? (
							<TouchableOpacity
								style={styles.finishButton}
								onPress={() => workoutId == null ? goHome() : handleOpenDuration()}
							>
								<Text style={styles.finishButtonText}>
									Guardar Entrenamiento
								</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={styles.finishButton}
								onPress={
									workoutId != null ? handleFinishPress : handleFinish
								}
							>
								<Text style={styles.finishButtonText}>
									Finalizar Entrenamiento
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</>
			)}

			{/* Modal confirmar finalización (modo hoy) */}
			<Modal
				visible={finishModalVisible}
				transparent
				animationType="slide"
			>
				<View style={modalStyles.overlay}>
					<View style={modalStyles.sheet}>

						<View style={modalStyles.iconWrap}>
							<Text style={modalStyles.iconText}>🏋</Text>
						</View>

						<Text style={modalStyles.title}>
							¿Estás seguro de finalizar tu entrenamiento?
						</Text>
						<Text style={modalStyles.subtitle}>
							Tu progreso actual quedará guardado y podrás editarlo si así lo deseas
						</Text>

						<View style={modalStyles.divider} />

						{pendingExercises.length > 0 ? (
							<View style={modalUX.scrollArea}>
								<Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
									Te faltan estos ejercicios:
								</Text>
								<FlatList
									showsVerticalScrollIndicator
									contentContainerStyle={{ paddingBottom: 0 }}
									data={pendingExercises}
									keyExtractor={(ex) => ex.name}
									renderItem={({item}) => (
										<Text
											key={item.id}
											style={{ fontSize: 14, marginVertical: 2 }}
										>
										• {item.name}
										</Text>
									)}
								/>
							</View>
						) : (
							<Text style={{ fontSize: 14, marginTop: 12 }}>
								Ya completaste todos los ejercicios de tu rutina.
							</Text>
						)}

						<View style={modalStyles.actions}>
							<TouchableOpacity
								style={[modalStyles.btn, modalStyles.btnGhost]}
								onPress={() => setFinishModalVisible(false)}
							>
								<Text style={[modalStyles.btnText, modalStyles.btnGhostText]}>Cancelar</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[modalStyles.btn, modalStyles.btnPrimary]}
								onPress={handleConfirmFinishFromModal}
							>
								<Text style={[modalStyles.btnText, modalStyles.btnPrimaryText]}>Finalizar</Text>
							</TouchableOpacity>
						</View>

					</View>
				</View>
			</Modal>

			{/* Modal de duración (modo pasado) */}
			<Modal visible={durationModalVisible} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContainer, fakePickerStyles.sheet]}>
						<Text style={[styles.modalTitle, { marginBottom: 12 }]}>
							Duración del entrenamiento
						</Text>

						<View style={fakePickerStyles.row}>
							<TouchableOpacity
								activeOpacity={0.8}
								style={fakePickerStyles.fakeInput}
								onPress={() =>
									setOpenSelector(openSelector === 'hours' ? null : 'hours')
								}
							>
								<Text style={fakePickerStyles.fakeInputLabel}>
									{durHours === 1 ? 'Hora' : 'Horas'}
								</Text>
								<Text style={fakePickerStyles.fakeInputValue}>{durHours}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={0.8}
								style={fakePickerStyles.fakeInput}
								onPress={() =>
									setOpenSelector(
										openSelector === 'minutes' ? null : 'minutes'
									)
								}
							>
								<Text style={fakePickerStyles.fakeInputLabel}>Minutos</Text>
								<Text style={fakePickerStyles.fakeInputValue}>
									{durMinutes}
								</Text>
							</TouchableOpacity>
						</View>

						{openSelector === 'hours' && (
							<View style={fakePickerStyles.selectorPanel}>
								<Text style={fakePickerStyles.selectorTitle}>
									Elegí la cantidad de horas
								</Text>
								<View style={fakePickerStyles.chipsWrap}>
									{HOUR_OPTIONS.map(h => {
										const selected = h === durHours;
										return (
											<TouchableOpacity
												key={`h-${h}`}
												onPress={() => {
													setDurHours(h);
													setOpenSelector(null);
												}}
												activeOpacity={0.8}
												style={[
													fakePickerStyles.chip,
													selected &&
														fakePickerStyles.chipSelected,
												]}
											>
												<Text
													style={[
														fakePickerStyles.chipText,
														selected &&
															fakePickerStyles.chipTextSelected,
													]}
												>
													{h}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>
						)}

						{openSelector === 'minutes' && (
							<View style={fakePickerStyles.selectorPanel}>
								<Text style={fakePickerStyles.selectorTitle}>
									Elegí la cantidad de minutos
								</Text>
								<View style={fakePickerStyles.chipsWrap}>
									{MINUTE_OPTIONS.map(m => {
										const selected = m === durMinutes;
										return (
											<TouchableOpacity
												key={`m-${m}`}
												onPress={() => {
													setDurMinutes(m);
													setOpenSelector(null);
												}}
												activeOpacity={0.8}
												style={[
													fakePickerStyles.chip,
													selected &&
														fakePickerStyles.chipSelected,
												]}
											>
												<Text
													style={[
														fakePickerStyles.chipText,
														selected &&
															fakePickerStyles.chipTextSelected,
													]}
												>
													{m}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>
						)}

						<View style={fakePickerStyles.actions}>
							<TouchableOpacity
								style={[styles.cancelButton, { flex: 1 }]}
								onPress={() => {
									setDurationModalVisible(false);
									setOpenSelector(null);
								}}
							>
								<Text style={styles.cancelButtonText}>Atrás</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, { flex: 1 }]}
								onPress={handleConfirmDuration}
							>
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
								!isDirty && styles.modalButtonDisabled,
							]}
							onPress={saveNotesHandler}
							disabled={!isDirty}
						>
							<Text
								style={[
									styles.modalButtonText,
									!isDirty && styles.modalButtonTextDisabled,
								]}
							>
								Guardar
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}