import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert, Modal, TextInput, Image } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList } from '../../../App';
import {editStyles} from './styles';
import { imgStyles } from './styles';
import EditIcon from '../../../assets/icons/edit.svg';
import DeleteIcon from '../../../assets/icons/delete.svg';
import AddIcon from '../../../assets/icons/add.svg';
import ImageIcon from '../../../assets/icons/image.svg';
import { formateDateToLongText } from '../../common/helper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { deleteExerciseFromWorkout, EditableExercise, EditableSet, EditableWorkout, fetchWorkoutForEdit, updateExerciseSets, fetchAddableExercisesForWorkout } from '../../../services/database';
import { getExerciseImage } from '../../common/allExercisesImages';
import { modalStyles } from '../../common/modalStyles';
import { getExerciseNameEs } from '../../common/diccionario';

const INITIAL_SETS = [
	{ weight: '', reps: '' },
	{ weight: '', reps: '' },
	{ weight: '', reps: '' },
];

type EdWkRouteProp = RouteProp<RootStackParamList, 'EditWorkout'>;
type EdWkNavProp = CompositeNavigationProp<NativeStackNavigationProp<RootStackParamList, 'EditWorkout'>,BottomTabNavigationProp<RootTabParamList>>;

export default function EditWorkoutScreen() {
	const navigation = useNavigation<EdWkNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootStackParamList>>();
	const route = useRoute<EdWkRouteProp>();

	const workoutId = route.params?.workoutId;
	const dateParam = route.params?.date || null;

	const [workout, setWorkout] = useState<EditableWorkout | null>(null);
	const [loading, setLoading] = useState(true);

	// Estado del modal de edición de un ejercicio
	const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState<EditableExercise | null>(null);
	const [sets, setSets] = useState<{ weight: string; reps: string }[]>(INITIAL_SETS);
	const [replicateWeight, setReplicateWeight] = useState(false);

	const [imageModalVisible, setImageModalVisible] = useState(false);
	const [imageExercise, setImageExercise] = useState<string | null>(null);

	const [allExercisesAddedModalVisible, setAllExercisesAddedModalVisible] = useState(false);

	// Cargar entrenamiento
	const load = useCallback( async () => {
		setLoading(true);
		try {
			const data = await fetchWorkoutForEdit( { workoutId, date: dateParam } );
			setWorkout(data);
		} catch( e ) {
			console.error('Error fetching workout for edit', e);
      		Alert.alert('Error', 'No se pudo cargar el entrenamiento.');
		} finally {
			setLoading(false);
		}
	}, [workoutId, dateParam]);

	useFocusEffect(
		useCallback(() => {
			load();
		}, [load])
	);

	// Abrir el modal de edición con valores pre-cargados
	const openEditModal = (ex: EditableExercise) => {
		setSelectedExercise(ex);

		// Pre-cargar sets existentes
		const pre = ex.sets.length > 0
			? ex.sets.map(s => ({ weight: String(s.weight), reps: String(s.reps) }))
			: INITIAL_SETS;
		setSets(pre);
		setReplicateWeight(false);
		setExerciseModalVisible(true);
	};

	const handleWeightChange = (idx: number, v: string) => {
		setSets( prev => {
			const next = [...prev];
			next[idx].weight = v;
			if( replicateWeight && idx === 0 ) {
				return next.map(s => ({ ...s, weight: v }));
			}
			return next;
		});
	};

	const handleRepsChange = (idx: number, v: string) => {
		setSets( prev => {
			const next = [...prev];
			next[idx].reps = v;
			return next;
		});
	};

	const addSet = () => {
		setSets( prev => prev.length < 5 ? [...prev, { weight: prev[0].weight, reps: '' }] : prev );
	};

	const isSubmitDisabled = ( () => {
		const hasComplete = sets.some(s => s.weight.trim() !== '' && s.reps.trim() !== '');
		const hasPartial = sets.some(s => (s.weight.trim() === '') !== (s.reps.trim() === ''));
		return !hasComplete || hasPartial;
	})();

	const handleCancelModal = () => {
		setExerciseModalVisible(false);
		setSelectedExercise(null);
		setSets(INITIAL_SETS);
		setReplicateWeight(false);
	};

	const handleSaveModal = async () => {
		if( !selectedExercise || !workout ) return;
		try {
			const cleanSets: EditableSet[] = sets
				.filter(s => s.weight.trim() !== '' && s.reps.trim() !== '')
				.map(s => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps, 10) }));

			await updateExerciseSets({
				workoutId: workout.id,
				exerciseId: selectedExercise.exerciseId,
				sets: cleanSets,
			});

			// Refrescar en memoria (optimista)
			setWorkout( prev => {
				if( !prev ) return prev;
				return {
					...prev,
					exercises: prev.exercises.map(e => e.exerciseId === selectedExercise.exerciseId ? { ...e, sets: cleanSets } : e)
				};
			});

			handleCancelModal();
		} catch( e ) {
			console.error('No se pudo actualizar sets', e);
			Alert.alert('Error', 'No se pudo guardar los cambios.');
		}
	};

	const confirmDeleteExercise = (ex: EditableExercise) => {
		Alert.alert( 'Eliminar registro', `¿Eliminar "${getExerciseNameEs(ex.code, ex.name)}" de este entrenamiento?`,
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						if (!workout) return;
						try {
							await deleteExerciseFromWorkout({ workoutId: workout.id, exerciseId: ex.exerciseId });
							setWorkout( prev => prev ? { ...prev, exercises: prev.exercises.filter( e => e.exerciseId !== ex.exerciseId ) } : prev );
						} catch( e ) {
							Alert.alert('Error', 'No se pudo eliminar el ejercicio.');
						}
					}
				}
			]
		);
	};

	const goToAddExercise = async () => {
		if( !workout ) return;

        try {
            // 1. Obtener los IDs de los ejercicios ya en uso
            const usedExerciseIds = workout.exercises.map( e => e.exerciseId );

            // 2. Llamar a la DB para ver si quedan ejercicios
            const addableExercises = await fetchAddableExercisesForWorkout({
                workoutTypeId: workout.workoutTypeId,
                excludeIds: usedExerciseIds
            });

            // 3. Lógica condicional
            if( addableExercises.length > 0 ) {
                // Si hay ejercicios, navegar como antes
                navigation.navigate('AddExerciseToWorkout', {
                    workoutId: workout.id,
                    workoutTypeId: workout.workoutTypeId,
                    usedExerciseIds: usedExerciseIds
                });
            } else {
                // Si no hay ejercicios, mostrar el nuevo modal
                setAllExercisesAddedModalVisible(true);
            }
        } catch (error) {
            console.error("Error al verificar ejercicios disponibles:", error);
            Alert.alert("Error", "No se pudo verificar los ejercicios disponibles.");
        }
	};

	const openImageModal = (ex: string) => {
		setImageExercise(ex);
		setImageModalVisible(true);
	};

	const closeImageModal = () => {
		setImageModalVisible(false);
		setImageExercise(null);
	};

	if( loading ) {
		return (
			<SafeAreaView style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
				<Text>Cargando…</Text>
			</SafeAreaView>
		);
	}

	if( !workout ) {
		return (
			<SafeAreaView style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
				<Text>No se encontró el entrenamiento.</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={editStyles.screen}>

			{/* Header simple */}
			<View style={editStyles.header}>
				<Text style={editStyles.title}>{formateDateToLongText(workout.date)}</Text>
				<Text style={editStyles.subtitle}>{workout.workoutType}</Text>
			</View>

			{/* Listado */}
			<FlatList
				data={workout.exercises}
				keyExtractor={(item) => String(item.exerciseId)}
				contentContainerStyle={editStyles.list}
				renderItem={({ item }) => (
					<View style={editStyles.card}>
						<View style={editStyles.cardHeader}>
							<Text style={editStyles.exerciseName} numberOfLines={2}>{getExerciseNameEs(item.code, item.name)}</Text>
							<View style={editStyles.actionsRow}>
								<TouchableOpacity style={editStyles.iconBtn} onPress={() => openImageModal(item.code)} hitSlop={10}>
									<ImageIcon width={20} height={20} fill={'#6B7280'} />
								</TouchableOpacity>
								<TouchableOpacity style={editStyles.iconBtn} onPress={() => openEditModal(item)} hitSlop={10}>
									<EditIcon width={20} height={20} fill={'#6B7280'} />
								</TouchableOpacity>
								<TouchableOpacity style={editStyles.iconBtn} onPress={() => confirmDeleteExercise(item)} hitSlop={10}>
									<DeleteIcon width={20} height={20} fill={'#6B7280'} />
								</TouchableOpacity>
							</View>
						</View>

						{/* Pills con sets */}
						<View style={editStyles.pillWrap}>
							{item.sets.length === 0 ? (
								<Text style={editStyles.emptyPillText}>Sin registros</Text>
							) : (
								item.sets.map((s, idx) => (
									<View key={idx} style={editStyles.pill}>
										<Text style={editStyles.pillText}>{s.weight}kg × {s.reps}</Text>
									</View>
								))
							)}
						</View>
					</View>
				)}
				ListFooterComponent={
					<TouchableOpacity style={editStyles.addBtn} onPress={goToAddExercise} activeOpacity={0.9}>
						<AddIcon width={18} height={18} fill={'#fff'} />
						<Text style={editStyles.addBtnText}>Agregar ejercicio</Text>
					</TouchableOpacity>
				}
			/>

			{/* ======= Modal de edición de sets (tu modal, precargado) ======= */}
			<Modal visible={exerciseModalVisible} transparent animationType="slide">
				<View style={editStyles.modalOverlay}>
					<View style={editStyles.modalContainer}>
						<Text style={editStyles.modalTitle}>{selectedExercise ? getExerciseNameEs(selectedExercise.code, selectedExercise.name) : 'Editar ejercicio'}</Text>

						{sets.map((s, i) => (
							<View key={i} style={editStyles.fieldRow}>
								<TextInput
									style={editStyles.fieldInput}
									placeholder={`Peso ${i + 1}`}
									keyboardType="numeric"
									value={s.weight}
									onChangeText={v => handleWeightChange(i, v)}
									placeholderTextColor="#000"
								/>
								<TextInput
									style={editStyles.fieldInput}
									placeholder={`Reps ${i + 1}`}
									keyboardType="numeric"
									value={s.reps}
									onChangeText={v => handleRepsChange(i, v)}
									placeholderTextColor="#000"
								/>
							</View>
						))}

						<TouchableOpacity style={editStyles.checkboxRow} onPress={() => setReplicateWeight(f => !f)}>
							<View style={editStyles.checkboxBox}>
								{replicateWeight && <View style={editStyles.checkboxChecked} />}
							</View>
							<Text style={editStyles.checkboxLabel}>Mismo peso</Text>
						</TouchableOpacity>

						<View style={editStyles.buttonsRow}>
							<TouchableOpacity
								style={[editStyles.addSetButton, sets.length >= 5 && editStyles.addSetButtonDisabled]}
								onPress={addSet}
								disabled={sets.length >= 5}
							>
								<Text style={editStyles.addSetText}>+ Agregar set</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={editStyles.cancelButton} onPress={handleCancelModal}>
							<Text style={editStyles.cancelButtonText}>Cancelar</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleSaveModal}
							disabled={isSubmitDisabled}
							style={[editStyles.modalButton, isSubmitDisabled && editStyles.modalButtonDisabled]}
						>
							<Text style={[editStyles.modalButtonText, isSubmitDisabled && editStyles.modalButtonTextDisabled]}>Guardar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* ======= Modal de imagen en grande ======= */}
			<Modal
				visible={imageModalVisible}
				transparent
				animationType="fade"
				onRequestClose={closeImageModal}
			>
				<View style={imgStyles.overlay}>
					<View style={imgStyles.sheet}>
						<TouchableOpacity style={imgStyles.closeBtn} onPress={closeImageModal} hitSlop={10}>
							<Text style={imgStyles.closeText}>✕</Text>
						</TouchableOpacity>

						<View style={imgStyles.imgWrap}>
							{imageExercise && getExerciseImage(imageExercise) ? (
								<Image
									source={getExerciseImage(imageExercise)}
									style={imgStyles.image}
									resizeMode="contain"
								/>
							) : (
								<View style={imgStyles.placeholder}>
									<Text style={imgStyles.placeholderText}>Sin imagen</Text>
								</View>
							)}
						</View>
					</View>
				</View>
			</Modal>
			<Modal
				visible={allExercisesAddedModalVisible}
				transparent
				animationType='fade'
				onRequestClose={ () => setAllExercisesAddedModalVisible(false) }
			>
				<View style={modalStyles.overlay}>
					<View style={modalStyles.sheet}>

						<View style={modalStyles.iconWrap}>
							<Text style={modalStyles.iconText}>🏋</Text>
						</View>

						<Text style={modalStyles.title}>Ejercicios completos</Text>

						<View style={modalStyles.divider} />

						<Text style={modalStyles.subtitle}>
							Ya agregaste todos los ejercicios de esta rutina a tu entrenamiento.
						</Text>

						<View style={modalStyles.actions}>
							<TouchableOpacity
								style={[modalStyles.btn, modalStyles.btnGhost]}
								onPress={ () => setAllExercisesAddedModalVisible(false) }
							>
								<Text style={[modalStyles.btnText, modalStyles.btnGhostText]}>Atrás</Text>
							</TouchableOpacity>
						</View>

					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};