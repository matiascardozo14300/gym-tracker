import React, { useEffect, useState, useRef } from 'react';
import {View, Text, TouchableOpacity, Image, Modal, TextInput, SectionList, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import styles from './styles';
import { getExerciseImage } from '../../common/allExercisesImages';
import AddIcon from '../../../assets/icons/add.svg';
import RemoveIcon from '../../../assets/icons/remove.svg';
import { createWorkoutType, Exercise, getAllExercises, getExerciseByWorkoutType, getWorkoutTypeNameById, updateWorkoutTypeAndExercises } from '../../../services/database';
import { getExerciseNameEs, getMuscleGroupLabelEs } from '../../common/diccionario';
type MuscleGroup = Exercise['muscleGroup'];
type WkExSelRouteProp = RouteProp<RootStackParamList, 'WorkoutExerciseSelection'>;
type WkExSelNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'WorkoutExerciseSelection'>,
  BottomTabNavigationProp<RootTabParamList>
>;

export default function WorkoutExerciseSelectionScreen() {
	const navigation = useNavigation<WkExSelNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
	const route = useRoute<WkExSelRouteProp>();

	const workoutTypeId = route.params?.workoutTypeId;
	const appendMode = route.params?.appendMode;
	const isEditMode = !!workoutTypeId;

	const [ workoutTypeName, setWorkoutTypeName ] = useState<string>('');

	const [allExercises, setAllExercises] = useState<Exercise[]>([]); // Todos los ejercicios
    const [addedExercises, setAddedExercises] = useState<Exercise[]>([]); // Solo los seleccionados

	const [ finishModalVisible, setFinishModalVisible ] = useState(false);

	const [ selectedMuscleGroup, setSelectedMuscleGroup ] = useState<MuscleGroup | null>(null);

	const [muscleFilterScrollX, setMuscleFilterScrollX] = useState(0);
	const muscleFilterScrollRef = useRef<ScrollView | null>(null);

	useEffect(() => {
		if( muscleFilterScrollRef.current ) {
			muscleFilterScrollRef.current.scrollTo({
				x: muscleFilterScrollX,
				y: 0,
				animated: false
			});
		}
	}, [selectedMuscleGroup]);

	useEffect( () => {
		(async () => {
			try {
				const all = await getAllExercises();
				setAllExercises(all);

				if( isEditMode && workoutTypeId ) {
					const exercises = await getExerciseByWorkoutType( workoutTypeId );
					const wkName = await getWorkoutTypeNameById( workoutTypeId );
					setWorkoutTypeName( wkName );
					setAddedExercises( exercises );
				} else {
					setWorkoutTypeName('');
					setAddedExercises([]);
				}
			} catch( error ) {
				console.error("Error loading data", error);
				Alert.alert('Error', 'No se pudo cargar la información');
			}
		})();
	}, [isEditMode, workoutTypeId]);

	const handleAppendSave = async () => {
        if (addedExercises.length === 0) {
            Alert.alert('Error', 'Debes tener al menos un ejercicio en la rutina.');
            return;
        }

        try {
            const exerciseIds = addedExercises.map(ex => ex.id);

            // Usamos el nombre que ya se cargó en el state (workoutTypeName) al iniciar el componente
            // Actualizamos la definición de la rutina con los nuevos ejercicios
            await updateWorkoutTypeAndExercises(
                workoutTypeId!,
                workoutTypeName,
                exerciseIds
            );

            // Volvemos a la pantalla anterior (ExerciseSelectionScreen)
            navigation.goBack();

        } catch (error) {
            console.error('Error actualizando rutina:', error);
            Alert.alert('Error', 'No se pudieron añadir los ejercicios.');
        }
    };

	const handleSubmit = async () => {
		if( !workoutTypeName.trim() ) {
			Alert.alert( 'Error', 'Debes ingresar un nombre para tu entrenamiento' );
			return;
		}
		if( addedExercises.length === 0 ) {
			Alert.alert('Error', 'Debes agregar al menos un ejercicio');
			return;
		}

		try {
			const exerciseIds = addedExercises.map(ex => ex.id);

			if( isEditMode && workoutTypeId ) {
				const res = await updateWorkoutTypeAndExercises(
					workoutTypeId,
					workoutTypeName.trim(),
					exerciseIds
				);

				if( !res.ok ) {
					if( res.code === 'DUPLICATE_NAME' ) {
						Alert.alert( 'Nombre duplicado', 'Ya existe una rutina con ese nombre.' );
					} else if( res.code === 'NOT_FOUND' ) {
						Alert.alert( 'Error', 'La rutina no existe.' );
					}
					return;
				}
			} else {
				const res = await createWorkoutType(
					workoutTypeName.trim(),
					exerciseIds
				);
				if( !res.ok && res.code === 'DUPLICATE_NAME' ) {
					Alert.alert('Nombre duplicado', 'Ya existe una rutina con ese nombre.');
 					 return;
				}
			}

			setWorkoutTypeName('');
			setAddedExercises([]);
			setFinishModalVisible(false);

			tabNav?.navigate('Rutinas');
			navigation.navigate('Tabs', { screen: 'Rutinas' });
		} catch( error ) {
			console.error( 'Error al crear workout type:', error );
    		Alert.alert( 'Error', 'No se pudo crear el tipo de entrenamiento' );
		}
	}

	const handleFinishPress = () => setFinishModalVisible( true );

	const isExerciseAdded = (item: Exercise): boolean => {
		return addedExercises.some(e => e.id === item.id);
	}

	const onToggleExercise = (item: Exercise) => {
        if (isExerciseAdded(item)) {
            // Si ya está, lo sacamos del array de añadidos
            setAddedExercises(prev => prev.filter(e => e.id !== item.id));
        } else {
            // Si no está, lo agregamos
            setAddedExercises(prev => [...prev, item]);
        }
    }

	const handleMuscleGroupPress = (group: MuscleGroup) => {
		setSelectedMuscleGroup(prev => (prev === group) ? null : group);
	}

	const renderMuscleFilter = () => (
		<View style={styles.muscleFilterContainer}>
			<Text style={styles.muscleFilterTitle}>Filtrar por grupo muscular</Text>

			<ScrollView
				ref={muscleFilterScrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.muscleFilterScrollContent}
				onScroll={e => {
					setMuscleFilterScrollX(e.nativeEvent.contentOffset.x);
				}}
				scrollEventThrottle={16}
			>
				{categoryOrder.map(group => {
					const isSelected = selectedMuscleGroup === group;

					return (
						<TouchableOpacity key={group} style={styles.muscleFilterItem} onPress={() => handleMuscleGroupPress(group)}>
							<Image source={muscleGroupImages[group]} style={[styles.muscleFilterImage, isSelected && styles.muscleFilterImageSelected,]} />
							<Text style={[styles.muscleFilterLabel, isSelected && styles.muscleFilterLabelSelected,]}>
								{getMuscleGroupLabelEs(group)}
							</Text>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);

	const renderItem = ({ item }: { item: Exercise }) => {
		const isSelected = isExerciseAdded(item);
		return (
			<TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => onToggleExercise(item)}
                activeOpacity={0.7}
            >
                <View style={styles.addIconContainer}>
                    {isSelected ? (
                        <RemoveIcon width={20} height={20} fill={'#007AFF'} />
                    ) : (
                        <AddIcon width={20} height={20} fill={'#ccc'} />
                    )}
                </View>

				{isSelected && (
					<View style={styles.selectedBadge}>
						<Text style={styles.selectedBadgeText}>Añadido</Text>
					</View>
				)}

                <Image
                    source={getExerciseImage(item.code)}
                    style={styles.image}
                />

                <Text style={styles.cardText}>
                    {getExerciseNameEs(item.code, item.name)}
                </Text>
            </TouchableOpacity>
		);
	};

	const isFinishDisabled = addedExercises.length === 0;
	const isSaveDisabled = workoutTypeName.trim() === '';

	const muscleGroupImages: Record<MuscleGroup, any> = {
		Chest: require('../../../assets/muscleGroups/chest.png'),
		Back: require('../../../assets/muscleGroups/back.png'),
		Shoulders: require('../../../assets/muscleGroups/shoulders.png'),
		Biceps: require('../../../assets/muscleGroups/biceps.png'),
		Triceps: require('../../../assets/muscleGroups/triceps.png'),
		Forearms: require('../../../assets/muscleGroups/biceps.png'),
		Cuadriceps: require('../../../assets/muscleGroups/cuadriceps.png'),
		Hamstrings: require('../../../assets/muscleGroups/hamstrings.png'),
		Gluts: require('../../../assets/muscleGroups/gluts.png'),
		Calves: require('../../../assets/muscleGroups/calves.png'),
		Abductors: require('../../../assets/muscleGroups/abductors.png'),
		Adductors: require('../../../assets/muscleGroups/adductors.png'),
		Abs: require('../../../assets/muscleGroups/abs.png'),
	};

	const categoryOrder: MuscleGroup[] = [
		'Chest','Back','Shoulders','Biceps','Triceps',
		'Cuadriceps','Hamstrings','Gluts','Abductors','Adductors','Calves','Abs'
	];

	const visibleCategoryOrder = selectedMuscleGroup
        ? categoryOrder.filter(group => group === selectedMuscleGroup)
        : categoryOrder;

	const sections = visibleCategoryOrder.map(group => {
        const exercisesInGroup = allExercises.filter(e => e.muscleGroup === group);

        // Si hay un filtro activo, mostramos el grupo aunque esté vacío (o puedes ocultarlo si prefieres)
        // Si no hay filtro, generalmente solo mostramos grupos que tienen ejercicios,
        // pero asumiremos que quieres ver la estructura.
        return {
            title: group,
            data: exercisesInGroup,
            key: group
        };
    // Filtramos secciones vacías para que no se vea el título sin cards
    }).filter(section => section.data.length > 0);

	return (
		<View style={styles.container}>
			{renderMuscleFilter()}
			<SectionList
				sections={sections}
				keyExtractor={(item, index) => `${item.id}-${index}`}
				renderSectionHeader={({ section }) => (
					<Text style={styles.sectionHeader}>
                        {getMuscleGroupLabelEs(section.title as MuscleGroup)}
                    </Text>
				)}
				renderItem={({ item, index, section }) => {
					if( index % 2 !== 0 ) return null;
					const first = item;
					const second = section.data[ index + 1 ];
					return (
						<View key={`row-${section.key}-${index}`} style={styles.row}>
							{renderItem({ item: first })}
							{second ? renderItem({ item: second }) : <View style={[styles.card, { opacity: 0 }]} />}
						</View>
					);
				}}
				contentContainerStyle={styles.list}
				stickySectionHeadersEnabled={false}
			/>

			<View style={styles.footer}>
				<TouchableOpacity
                    onPress={appendMode ? handleAppendSave : handleFinishPress}
                    disabled={isFinishDisabled}
                    style={[styles.finishButton, isFinishDisabled && styles.finishButtonDisabled]}
                >
                    <Text style={[styles.finishButtonText, isFinishDisabled && styles.finishButtonTextDisabled]}>
                        {appendMode
                            ? `Añadir a esta sesión (${addedExercises.length})`
                            : `Añadir ${addedExercises.length} ${addedExercises.length === 1 ? 'ejercicio' : 'ejercicios'}`
                        }
                    </Text>
                </TouchableOpacity>
			</View>

			<Modal visible={finishModalVisible} transparent animationType='slide'>
				<View style={ styles.modalOverlay }>
					<View style={ styles.modalContainer }>
						<Text style={styles.workoutNameText}>Nombre de la rutina</Text>
						<TextInput
							style={styles.nameInput}
							placeholder='Nombre'
							value={workoutTypeName}
							onChangeText={setWorkoutTypeName}
						/>

						<View style={styles.buttonRow}>
							<TouchableOpacity style={styles.cancelButton} onPress={() => setFinishModalVisible(false)}>
								<Text style={styles.cancelButtonText}>
									Atrás
								</Text>
							</TouchableOpacity>

							<TouchableOpacity style={[styles.modalButton,isSaveDisabled && styles.modalButtonDisabled]}	onPress={handleSubmit} disabled={isSaveDisabled}>
								<Text style={[ styles.modalButtonText, isSaveDisabled && styles.modalButtonTextDisabled ]}>
									Guardar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

		</View>
	);

}