import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	Modal
} from 'react-native';
import { setEditorStyles } from './styles';
import { getExerciseImage } from '../common/allExercisesImages';
import type { Exercise, ExerciseLastHistory } from '../../services/database';
import RestCountdown from './RestCountdown';
import { StickyNote, HelpCircle } from 'lucide-react-native';
import { formatSeconds } from '../common/helper';
import { DEFAULT_REST_SECONDS, getSetting, REST_SETTING_KEY, saveSetting } from '../../services/database/settings/settings';
import { getExerciseNameEs } from '../common/diccionario';

export type SimpleSet = { weight: string; reps: string };

type SetRow = { weight: string; reps: string; completed: boolean };

type Props = {
	exercise: Exercise;
	lastHistory: ExerciseLastHistory | null;
	onCancel: () => void;
	onSubmit: (setsToSave: SimpleSet[], exercise: Exercise) => Promise<void>;
	onOpenNotes: () => void;
};

const ExerciseSetEditor: React.FC<Props> = ({
	exercise,
	lastHistory,
	onCancel,
	onSubmit,
	onOpenNotes,
}) => {
	const INITIAL_ROWS: SetRow[] = useMemo(
		() => [
			{ weight: '', reps: '', completed: false },
			{ weight: '', reps: '', completed: false },
			{ weight: '', reps: '', completed: false },
		],
		[]
	);

	const [helpVisible, setHelpVisible] = useState(false);

	const [sets, setSets] = useState<SetRow[]>(INITIAL_ROWS);
	const [replicateWeight, setReplicateWeight] = useState(false);

	// descanso en segundos (1min por defecto, 15s..5min)
	const REST_OPTIONS_SECONDS = useMemo(
		() => Array.from({ length: 20 }, (_, i) => (i + 1) * 15),
		[]
	);
	const [restSeconds, setRestSeconds] = useState<number>(DEFAULT_REST_SECONDS);
	const [showRestSelector, setShowRestSelector] = useState(false);

	const [restRemaining, setRestRemaining] = useState<number | null>(null);
	const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

	const repsRefs = useRef<Array<TextInput | null>>([]);

	// Carga el tiempo de descanso de la base de datos
	useEffect(() => {
		(async () => {
			try {
				const stored = await getSetting(REST_SETTING_KEY);
				if (stored != null) {
					const num = parseInt(stored, 10);
					if (!Number.isNaN(num) && num > 0) {
						setRestSeconds(num);
					} else {
						setRestSeconds(DEFAULT_REST_SECONDS);
					}
				} else {
					// No hay setting guardado -> usamos el default
					setRestSeconds(DEFAULT_REST_SECONDS);
				}
			} catch (error) {
				console.error('Error leyendo configuración de descanso', error);
				setRestSeconds(DEFAULT_REST_SECONDS);
			}
		})();
	}, []);

	// limpiar intervalo al desmontar
	useEffect(() => {
		return () => {
			if (restIntervalRef.current) clearInterval(restIntervalRef.current);
		};
	}, []);

	useEffect(() => {
		const showSub = Keyboard.addListener('keyboardDidShow', () =>
			setIsKeyboardVisible(true)
		);
		const hideSub = Keyboard.addListener('keyboardDidHide', () =>
			setIsKeyboardVisible(false)
		);

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	// replicar peso
	useEffect(() => {
		if (!replicateWeight) return;

		setSets(prev => {
			const firstWeight = prev[0]?.weight ?? '';
			return prev.map(s => ({ ...s, weight: firstWeight }));
		});
	}, [replicateWeight, sets[0]?.weight]);

	const startRest = () => {
		if (restSeconds <= 0) return;

		if (restIntervalRef.current) clearInterval(restIntervalRef.current);
		setRestRemaining(restSeconds);

		const id = setInterval(() => {
			setRestRemaining(prev => {
				if (prev == null) return prev;
				if (prev <= 1) {
					clearInterval(id);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		restIntervalRef.current = id;
	};

	const handleWeightChange = (idx: number, value: string) => {
		// Reemplazar coma por punto
		let cleaned = value.replace(',', '.');

		// Permitir vacío
		if (cleaned === '') {
			setSets(prev => {
				const next = [...prev];
				next[idx].weight = '';
				if (replicateWeight && idx === 0) {
					return next.map(s => ({ ...s, weight: '' }));
				}
				return next;
			});
			return;
		}

		// Aceptar sólo números con como máximo 1 punto y 2 decimales
		const validPattern = /^\d*\.?\d{0,2}$/;

		if (!validPattern.test(cleaned)) {
			// Si no matchea, ignoramos el cambio (no se actualiza el estado)
			return;
		}

		setSets(prev => {
			const next = [...prev];
			next[idx].weight = cleaned;

			if (replicateWeight && idx === 0) {
				return next.map(s => ({ ...s, weight: cleaned }));
			}
			return next;
		});
	};

	const handleRepsChange = (idx: number, value: string) => {
		// Mantener sólo dígitos, quitar puntos, comas y cualquier otro carácter
		const numeric = value.replace(/[^0-9]/g, '');

		setSets(prev => {
			const next = [...prev];
			next[idx].reps = numeric;
			return next;
		});
	};

	const handleToggleCompleted = (idx: number) => {
		const wasCompleted = sets[idx]?.completed ?? false;

		setSets(prev => {
			const next = [...prev];
			next[idx] = { ...next[idx], completed: !next[idx].completed };
			return next;
		});

		if (!wasCompleted) {
			const hasWeight = sets[idx]?.weight.trim() !== '';
			const hasReps = sets[idx]?.reps.trim() !== '';
			if (hasWeight && hasReps) {
				startRest();
			}
		}
	};

	const addSet = () => {
		setSets(prev => [
			...prev,
			{ weight: prev[0]?.weight ?? '', reps: '', completed: false },
		]);
	};

	const hasComplete = sets.some(
		s => s.weight.trim() !== '' && s.reps.trim() !== ''
	);

	// El botón solo se deshabilita si NO hay ni un set completo
	const isSubmitDisabled = !hasComplete;

	const handleSave = async () => {
		if (isSubmitDisabled) return;

		const cleaned: SimpleSet[] = sets
			.filter(s => s.weight.trim() !== '' && s.reps.trim() !== '')
			.map(s => ({ weight: s.weight, reps: s.reps }));

		await onSubmit(cleaned, exercise);
	};

	const getPrevForIndex = (index: number): string => {
		const prevSet = lastHistory?.sets?.[index];
		if (!prevSet) return '-';
		return `${prevSet.weight}kg x ${prevSet.reps}`;
	};

	return (
		<KeyboardAvoidingView
			style={setEditorStyles.editorContainer}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
		>
			{/* Contenido scrolleable */}
			<ScrollView
				style={setEditorStyles.editorScroll}
				contentContainerStyle={setEditorStyles.editorScrollContent}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{/* Header solo con el nombre del ejercicio */}
				<View style={setEditorStyles.editorHeader}>
					<Text style={setEditorStyles.editorTitle} numberOfLines={2}>
						{getExerciseNameEs(exercise.code, exercise.name)}
					</Text>
					<TouchableOpacity
						style={setEditorStyles.helpButton}
						onPress={() => setHelpVisible(true)}
					>
						<HelpCircle size={25} color="#007AFF" />
					</TouchableOpacity>
				</View>

				{/* Imagen */}
				<Image
					source={getExerciseImage(exercise.code)}
					style={setEditorStyles.editorImage}
				/>

				{/* Botones superiores */}
				<View style={setEditorStyles.editorTopButtonsRow}>
					<TouchableOpacity
						style={setEditorStyles.editorNotesButton}
						onPress={onOpenNotes}
					>
						<View style={setEditorStyles.editorNotesButtonContent}>
							<StickyNote
								size={18}
								color="#111827"
								style={setEditorStyles.editorNotesIcon}
							/>
							<Text style={setEditorStyles.editorNotesButtonText}>
								Ver / editar notas
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							setEditorStyles.editorReplicateButton,
							replicateWeight && setEditorStyles.editorReplicateButtonActive,
						]}
						onPress={() => setReplicateWeight(f => !f)}
					>
						<Text
							style={[
								setEditorStyles.editorReplicateButtonText,
								replicateWeight &&
									setEditorStyles.editorReplicateButtonTextActive,
							]}
						>
							Mismo peso
						</Text>
					</TouchableOpacity>
				</View>

				{/* Selector de descanso / Countdown */}
				<View style={setEditorStyles.restSelectorWrapper}>
					{restRemaining != null && restRemaining > 0 ? (
						// Mientras está corriendo el descanso, sólo se ve el contador
						<RestCountdown
							totalSeconds={restSeconds}
							remainingSeconds={restRemaining}
						/>
					) : (
						<>
							<TouchableOpacity
								style={setEditorStyles.restSelectorButton}
								onPress={() => setShowRestSelector(v => !v)}
								activeOpacity={0.85}
							>
								<Text style={setEditorStyles.restSelectorLabel}>Descanso</Text>
								<Text style={setEditorStyles.restSelectorValue}>
									{formatSeconds(restSeconds)}
								</Text>
							</TouchableOpacity>

							{showRestSelector && (
								<View style={setEditorStyles.restSelectorPanel}>
									<Text style={setEditorStyles.restSelectorTitle}>
										Seleccioná el tiempo de descanso
									</Text>
									<View style={setEditorStyles.restChipsWrap}>
										{REST_OPTIONS_SECONDS.map(sec => {
											const selected = sec === restSeconds;
											return (
												<TouchableOpacity
													key={sec}
													style={[
														setEditorStyles.restChip,
														selected && setEditorStyles.restChipSelected,
													]}
													onPress={async () => {
														setRestSeconds(sec);
														setShowRestSelector(false);

														try {
															// Persistimos la elección del usuario
															await saveSetting(REST_SETTING_KEY, String(sec));
														} catch (error) {
															console.error('Error guardando configuración de descanso', error);
														}
													}}
												>
													<Text
														style={[
															setEditorStyles.restChipText,
															selected &&
																setEditorStyles.restChipTextSelected,
														]}
													>
														{formatSeconds(sec)}
													</Text>
												</TouchableOpacity>
											);
										})}
									</View>
								</View>
							)}
						</>
					)}
				</View>

				{/* Tabla encabezado */}
				<View style={setEditorStyles.setsTableHeader}>
					<Text
						style={[
							setEditorStyles.setsHeaderCell,
							setEditorStyles.setsHeaderCellIndex,
						]}
					>
						Serie
					</Text>
					<Text
						style={[
							setEditorStyles.setsHeaderCell,
							setEditorStyles.setsHeaderCellPrev,
						]}
					>
						Anterior
					</Text>
					<Text
						style={[
							setEditorStyles.setsHeaderCell,
							setEditorStyles.setsHeaderCellKg,
						]}
					>
						Kg
					</Text>
					<Text
						style={[
							setEditorStyles.setsHeaderCell,
							setEditorStyles.setsHeaderCellReps,
						]}
					>
						Reps
					</Text>
					<Text
						style={[
							setEditorStyles.setsHeaderCell,
							setEditorStyles.setsHeaderCellDone,
						]}
					/>
				</View>

				{/* Filas de sets */}
				{sets.map((s, i) => (
					<View key={i} style={setEditorStyles.setRow}>
						<Text style={setEditorStyles.setIndex}>{i + 1}</Text>

						<Text style={setEditorStyles.setPrevText}>
							{getPrevForIndex(i)}
						</Text>

						<TextInput
							style={setEditorStyles.setInput}
							placeholder="Kg"
							keyboardType="numeric"
							value={s.weight}
							onChangeText={v => handleWeightChange(i, v)}
							placeholderTextColor="#6B7280"
							returnKeyType="next"
							blurOnSubmit={false}
							onSubmitEditing={() => {
								const ref = repsRefs.current[i];
								ref?.focus();
							}}
						/>
						<TextInput
							ref={ref => {
								repsRefs.current[i] = ref;
							}}
							style={setEditorStyles.setInput}
							placeholder="Reps"
							keyboardType="numeric"
							value={s.reps}
							onChangeText={v => handleRepsChange(i, v)}
							placeholderTextColor="#6B7280"
							returnKeyType="done"
							onSubmitEditing={() => {
								const hasWeight = sets[i]?.weight.trim() !== '';
								const hasReps = sets[i]?.reps.trim() !== '';
								const alreadyCompleted = sets[i]?.completed;

								// Si tiene peso + reps y aún no estaba marcado, lo marcamos como completado,
								// lo que a su vez dispara el RestCountdown (vía handleToggleCompleted)
								if (hasWeight && hasReps && !alreadyCompleted) {
									handleToggleCompleted(i);
								}
							}}
						/>

						<TouchableOpacity
							style={[
								setEditorStyles.setDoneButton,
								s.completed && setEditorStyles.setDoneButtonActive,
							]}
							onPress={() => handleToggleCompleted(i)}
						>
							<Text
								style={[
									setEditorStyles.setDoneButtonText,
									s.completed &&
										setEditorStyles.setDoneButtonTextActive,
								]}
							>
								✓
							</Text>
						</TouchableOpacity>
					</View>
				))}

				{/* Agregar set */}
				<View style={setEditorStyles.editorAddSetRow}>
					<TouchableOpacity
						style={setEditorStyles.addSetButton}
						onPress={addSet}
					>
						<Text style={setEditorStyles.addSetText}>+ Agregar set</Text>
					</TouchableOpacity>
				</View>

			</ScrollView>

			{/* Footer fijo con Cancelar / Guardar */}
			{!isKeyboardVisible && (
				<View style={setEditorStyles.editorFooter}>
					<TouchableOpacity
						style={setEditorStyles.cancelButton}
						onPress={onCancel}
					>
						<Text style={setEditorStyles.cancelButtonText}>Cancelar</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSave}
						disabled={isSubmitDisabled}
						style={[
							setEditorStyles.modalButton,
							isSubmitDisabled &&
								setEditorStyles.modalButtonDisabled,
						]}
					>
						<Text
							style={[
								setEditorStyles.modalButtonText,
								isSubmitDisabled &&
									setEditorStyles.modalButtonTextDisabled,
							]}
						>
							Guardar
						</Text>
					</TouchableOpacity>
				</View>
			)}

			<Modal
				visible={helpVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setHelpVisible(false)}
			>
				<View style={setEditorStyles.helpModalOverlay}>
					<View style={setEditorStyles.helpModalContainer}>
						<Text style={setEditorStyles.helpModalTitle}>
							¿Cómo registrar tu serie?
						</Text>

						<ScrollView
							style={setEditorStyles.helpModalScroll}
							contentContainerStyle={setEditorStyles.helpModalContent}
							showsVerticalScrollIndicator={false}
						>
							<Text style={setEditorStyles.helpModalSectionTitle}>
								1. Nombre e imagen del ejercicio
							</Text>
							<Text style={setEditorStyles.helpModalText}>
								Verificá que estás cargando el ejercicio correcto mirando
								el nombre y la ilustración de referencia.
							</Text>

							<Text style={setEditorStyles.helpModalSectionTitle}>
								2. Notas del ejercicio
							</Text>
							<Text style={setEditorStyles.helpModalText}>
								Usá "Ver / editar notas" para guardar configuraciones de
								máquina, postura, molestias o cualquier detalle que quieras
								recordar la próxima vez.
							</Text>

							<Text style={setEditorStyles.helpModalSectionTitle}>
								3. Mismo peso
							</Text>
							<Text style={setEditorStyles.helpModalText}>
								Activá "Mismo peso" si todas tus series usan el mismo peso.
								Escribís una sola vez y se copia al resto de las filas.
							</Text>

							<Text style={setEditorStyles.helpModalSectionTitle}>
								4. Descanso
							</Text>
							<Text style={setEditorStyles.helpModalText}>
								Configurá cuántos segundos querés descansar entre series.
								Cuando marcás una serie como completada, se inicia un
								contador regresivo con ese tiempo.
							</Text>

							<Text style={setEditorStyles.helpModalSectionTitle}>
								5. Tabla de series
							</Text>
							<Text style={setEditorStyles.helpModalText}>
								En cada fila cargás el peso (kg) y las repeticiones. El botón
								con el tilde marca la serie como hecha y dispara el descanso.
								Podés agregar todas las series que necesites.
							</Text>

							<Text style={setEditorStyles.helpModalSectionTitle}>
								6. Guardar tus datos
							</Text>
							<Text style={setEditorStyles.helpModalText}>
								Sólo se guardan las filas que tengan peso y repeticiones
								completas. Las filas incompletas se descartan automáticamente,
								así que no pasa nada si dejás alguna a medias.
							</Text>
						</ScrollView>

						<TouchableOpacity
							style={setEditorStyles.helpModalCloseButton}
							onPress={() => setHelpVisible(false)}
						>
							<Text style={setEditorStyles.helpModalCloseButtonText}>
								Entendido
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</KeyboardAvoidingView>
	);
};

export default ExerciseSetEditor;