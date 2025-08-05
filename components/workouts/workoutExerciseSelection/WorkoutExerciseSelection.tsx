import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, Image, Modal, TextInput, SectionList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, RootTabParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import styles from './styles';
import { exerciseImageUrls } from '../../common/allExercisesImages';
import AddIcon from '../../../assets/icons/add.svg';
import RemoveIcon from '../../../assets/icons/remove.svg';
import { createWorkoutType, Exercise, getAllExercises } from '../../../services/database';

type WkExSelRouteProp = RouteProp<RootStackParamList, 'WorkoutExerciseSelection'>;
type WkExSelNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'WorkoutExerciseSelection'>,
  BottomTabNavigationProp<RootTabParamList>
>;

export default function WorkoutExerciseSelectionScreen() {
	const navigation = useNavigation<WkExSelNavProp>();
	const tabNav = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
	const route = useRoute<WkExSelRouteProp>();

	const [ workoutTypeName, setWorkoutTypeName ] = useState<string>('');
	const [ addedExercises, setAddedExercises ] = useState<Exercise[]>([]);
	const [ notAddedExercises, setNotAddedExercises ] = useState<Exercise[]>([]);

	const [ finishModalVisible, setFinishModalVisible ] = useState(false);

	useEffect( () => {
		getAllExercises().then( setNotAddedExercises ).catch( console.error );
	}, []);

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
			const newTypeId = await createWorkoutType( workoutTypeName.trim(), addedExercises.map( (ex) => ex.id ) );

			setWorkoutTypeName('');
			setAddedExercises([]);
			setNotAddedExercises([]);
			setFinishModalVisible(false);

			tabNav?.navigate('Rutinas');
			navigation.navigate('Tabs', { screen: 'Rutinas' });
		} catch( error ) {
			console.error( 'Error al crear workout type:', error );
    		Alert.alert( 'Error', 'No se pudo crear el tipo de entrenamiento' );
		}
	}

	const onAddPress = ( item: Exercise ) => {
		if( isExerciseAdded( item ) ) {
			setAddedExercises( prev => prev.filter( e => e.id !== item.id ) );
			setNotAddedExercises( prev => [item, ...prev] );
		} else {
			setNotAddedExercises( prev => prev.filter( e => e.id !== item.id ) );
			setAddedExercises( prev => [...prev, item] );
		}
	}

	const handleFinishPress = () => {
		setFinishModalVisible( true );
	}

	const isExerciseAdded = ( item: Exercise ): boolean => {
		if( item === null ) return false;

		const exFound = addedExercises.find( e => e.id === item.id );

		return exFound ? true : false;
	}

	const renderItem = ({ item }: { item: Exercise }) => (
		<TouchableOpacity style={ styles.card } onPress={ () => onAddPress( item ) }>
			<TouchableOpacity style={ styles.addIconContainer } onPress={ () => onAddPress( item ) }>
				{ isExerciseAdded( item ) ? (
					<RemoveIcon width={20} height={20} fill={'red'} />
				) : (
					<AddIcon width={20} height={20} fill={'#007AFF'} />
				)}
			</TouchableOpacity>
			<Image
				source={{ uri: exerciseImageUrls[item.code] }}
				style={styles.image}
			/>
			<Text style={styles.cardText}>{item.name}</Text>
		</TouchableOpacity>
	);

	const isFinishDisabled = addedExercises.length === 0;
	const isSaveDisabled = workoutTypeName.trim() === '';

	const categoryOrder = [
		'Chest','Back','Shoulders','Biceps','Triceps',
		'Cuadriceps','Hamstrings','Gluts','Abductors','Adductors','Calves','Abs'
	];
	const groupSections = categoryOrder.map( group => ({
		title: group,
		data: notAddedExercises.filter( e => e.muscleGroup === group )
	}));

	const sections = [
		{ key: 'Added',    title: 'Added',    data: addedExercises },
		...groupSections.map(s => ({ key: s.title, ...s }))
	];

	return (
		<View style={styles.container}>
			<SectionList
				sections={sections}
				/* keyExtractor={(item) => item.id.toString()} */
				keyExtractor={(item, index) => `${item.id}-${index}`}
				renderSectionHeader={({ section }) => (
					<Text style={ styles.sectionHeader }>{section.title}</Text>
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
				<TouchableOpacity onPress={handleFinishPress} disabled={isFinishDisabled} style={[ styles.finishButton, isFinishDisabled && styles.finishButtonDisabled ]}>
					<Text style={[styles.finishButtonText, isFinishDisabled && styles.finishButtonTextDisabled]}>Save Workout</Text>
				</TouchableOpacity>
			</View>

			<Modal visible={finishModalVisible} transparent animationType='slide'>
				<View style={ styles.modalOverlay }>
					<View style={ styles.modalContainer }>
						<Text style={styles.workoutNameText}>Workout Name</Text>
						<TextInput
							style={styles.nameInput}
							placeholder='Workout Name'
							value={workoutTypeName}
							onChangeText={setWorkoutTypeName}
						/>

						<View style={styles.buttonRow}>
							<TouchableOpacity style={styles.cancelButton} onPress={() => setFinishModalVisible(false)}>
								<Text style={styles.cancelButtonText}>
									Back
								</Text>
							</TouchableOpacity>

							<TouchableOpacity style={[styles.modalButton,isSaveDisabled && styles.modalButtonDisabled]}	onPress={handleSubmit} disabled={isSaveDisabled}>
								<Text style={[ styles.modalButtonText, isSaveDisabled && styles.modalButtonTextDisabled ]}>
									Save
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

		</View>
	);

}