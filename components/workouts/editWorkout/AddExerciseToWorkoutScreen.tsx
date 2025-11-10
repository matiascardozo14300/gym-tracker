import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList  } from '../../../App';
import {addStyles} from './styles';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AddableExercise, addExerciseToWorkout, EditableSet, fetchAddableExercisesForWorkout } from '../../../services/database';
import { exerciseImageUrls } from '../../common/allExercisesImages';

type AdExWkRouteProp = RouteProp<RootStackParamList, 'AddExerciseToWorkout'>;
type AdExWkNavProp = CompositeNavigationProp<NativeStackNavigationProp<RootStackParamList, 'AddExerciseToWorkout'>,BottomTabNavigationProp<RootTabParamList>>;

const INITIAL_SETS = [
	{ weight: '', reps: '' },
	{ weight: '', reps: '' },
	{ weight: '', reps: '' },
];

export default function AddExerciseToWorkoutScreen() {
	const navigation = useNavigation<AdExWkNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootStackParamList>>();
	const route = useRoute<AdExWkRouteProp>();

	const { workoutId, workoutTypeId, usedExerciseIds = [] } = route.params as {
		workoutId: number;
		workoutTypeId: number;
		usedExerciseIds: number[];
	};

	const [all, setAll] = useState<AddableExercise[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [target, setTarget] = useState<AddableExercise | null>(null);
	const [sets, setSets] = useState<{ weight: string; reps: string }[]>(INITIAL_SETS);
	const [replicateWeight, setReplicateWeight] = useState(false);

	useEffect(() => {
		fetchAddableExercisesForWorkout({ workoutTypeId, excludeIds: usedExerciseIds })
			.then(setAll)
			.catch(() => Alert.alert('Error', 'No se pudo cargar ejercicios'));
	}, [workoutTypeId, usedExerciseIds]);

	const openModal = (ex: AddableExercise) => {
		setTarget(ex);
		setSets(INITIAL_SETS);
		setReplicateWeight(false);
		setModalVisible(true);
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
		setSets(prev => prev.length < 5 ? [...prev, { weight: prev[0].weight, reps: '' }] : prev);
	};

	const isSubmitDisabled = (() => {
		const hasComplete = sets.some(s => s.weight.trim() !== '' && s.reps.trim() !== '');
		const hasPartial = sets.some(s => (s.weight.trim() === '') !== (s.reps.trim() === ''));
		return !hasComplete || hasPartial;
	})();

	const handleSave = async () => {
		if( !target ) return;
		try {
			const cleanSets: EditableSet[] = sets
				.filter(s => s.weight.trim() !== '' && s.reps.trim() !== '')
				.map(s => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps, 10) }));

			await addExerciseToWorkout({ workoutId, exerciseId: target.id, sets: cleanSets });

			setModalVisible(false);
			setTarget(null);

			navigation.goBack();
		} catch {
			Alert.alert('Error', 'No se pudo agregar el ejercicio.');
		}
	};

	return (
		<SafeAreaView style={addStyles.screen}>
			<Text style={addStyles.headerTitle}>Agregar ejercicio</Text>
			<FlatList
				data={all}
				keyExtractor={(i) => String(i.id)}
				contentContainerStyle={addStyles.list}
				renderItem={({ item }) => (
					<TouchableOpacity style={addStyles.card} onPress={() => openModal(item)}>
						<Image source={{ uri: exerciseImageUrls[item.code] }} style={addStyles.image} />
						<Text style={addStyles.cardText} numberOfLines={1}>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>

			<Modal visible={modalVisible} transparent animationType="slide">
				<View style={addStyles.modalOverlay}>
					<View style={addStyles.modalContainer}>
						<Text style={addStyles.modalTitle}>{target?.name ?? 'Nuevo ejercicio'}</Text>

						{sets.map((s, i) => (
							<View key={i} style={addStyles.fieldRow}>
								<TextInput
									style={addStyles.fieldInput}
									placeholder={`Peso ${i + 1}`}
									keyboardType="numeric"
									value={s.weight}
									onChangeText={v => handleWeightChange(i, v)}
									placeholderTextColor="#000"
								/>
								<TextInput
									style={addStyles.fieldInput}
									placeholder={`Reps ${i + 1}`}
									keyboardType="numeric"
									value={s.reps}
									onChangeText={v => handleRepsChange(i, v)}
									placeholderTextColor="#000"
								/>
							</View>
						))}

						<TouchableOpacity style={addStyles.checkboxRow} onPress={() => setReplicateWeight(f => !f)}>
							<View style={addStyles.checkboxBox}>
								{replicateWeight && <View style={addStyles.checkboxChecked} />}
							</View>
							<Text style={addStyles.checkboxLabel}>Mismo peso</Text>
						</TouchableOpacity>

						<View style={addStyles.buttonsRow}>
							<TouchableOpacity
								style={[addStyles.addSetButton, sets.length >= 5 && addStyles.addSetButtonDisabled]}
								onPress={addSet}
								disabled={sets.length >= 5}
							>
								<Text style={addStyles.addSetText}>+ Agregar set</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={addStyles.cancelButton} onPress={() => { setModalVisible(false); setTarget(null); }}>
							<Text style={addStyles.cancelButtonText}>Cancelar</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleSave}
							disabled={isSubmitDisabled}
							style={[addStyles.modalButton, isSubmitDisabled && addStyles.modalButtonDisabled]}
						>
							<Text style={[addStyles.modalButtonText, isSubmitDisabled && addStyles.modalButtonTextDisabled]}>Guardar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};