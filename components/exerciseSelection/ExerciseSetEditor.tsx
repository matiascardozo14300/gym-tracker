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
} from 'react-native';
import { setEditorStyles } from './styles';
import { exerciseImageUrls } from '../common/allExercisesImages';
import type { Exercise, ExerciseLastHistory } from '../../services/database';
import RestCountdown from './RestCountdown';
import { StickyNote } from 'lucide-react-native';
import { formatSeconds } from '../common/helper';

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

	const [sets, setSets] = useState<SetRow[]>(INITIAL_ROWS);
	const [replicateWeight, setReplicateWeight] = useState(false);

	// descanso en segundos (1min por defecto, 15s..5min)
	const REST_OPTIONS_SECONDS = useMemo(
		() => Array.from({ length: 20 }, (_, i) => (i + 1) * 15),
		[]
	);
	const [restSeconds, setRestSeconds] = useState<number>(60);
	const [showRestSelector, setShowRestSelector] = useState(false);

	const [restRemaining, setRestRemaining] = useState<number | null>(null);
	const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
		setSets(prev => {
			const next = [...prev];
			next[idx].weight = value;

			if (replicateWeight && idx === 0) {
				return next.map(s => ({ ...s, weight: value }));
			}
			return next;
		});
	};

	const handleRepsChange = (idx: number, value: string) => {
		setSets(prev => {
			const next = [...prev];
			next[idx].reps = value;
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
		setSets(prev =>
			prev.length < 5
				? [...prev, { weight: prev[0]?.weight ?? '', reps: '', completed: false }]
				: prev
		);
	};

	const hasComplete = sets.some(
		s => s.weight.trim() !== '' && s.reps.trim() !== ''
	);
	const hasPartial = sets.some(
		s => (s.weight.trim() === '') !== (s.reps.trim() === '')
	);
	const isSubmitDisabled = !hasComplete || hasPartial;

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
						{exercise.name}
					</Text>
				</View>

				{/* Imagen */}
				<Image
					source={{ uri: exerciseImageUrls[exercise.code] }}
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
													onPress={() => {
														setRestSeconds(sec);
														setShowRestSelector(false);
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
						/>
						<TextInput
							style={setEditorStyles.setInput}
							placeholder="Reps"
							keyboardType="numeric"
							value={s.reps}
							onChangeText={v => handleRepsChange(i, v)}
							placeholderTextColor="#6B7280"
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
						style={[
							setEditorStyles.addSetButton,
							sets.length >= 5 &&
								setEditorStyles.addSetButtonDisabled,
						]}
						onPress={addSet}
						disabled={sets.length >= 5}
					>
						<Text style={setEditorStyles.addSetText}>
							+ Agregar set
						</Text>
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
		</KeyboardAvoidingView>
	);
};

export default ExerciseSetEditor;