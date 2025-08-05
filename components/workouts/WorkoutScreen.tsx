import { useEffect, useState } from "react";
import { getWorkoutTypes, WorkoutType } from '../../services/database';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, ScrollView } from "react-native";
import styles from './styles';
import Header from '../header/Header';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Rutinas'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

export default function WorkoutScreen() {
	const [ types, setTypes ] = useState<WorkoutType[]>( [] );
	const tabNav = useNavigation<TabNav>();
	const stackNav = tabNav.getParent<StackNav>();

	useEffect( () => {
		getWorkoutTypes().then( all => {
			const custom = all.filter( (t) => t.isCustom );
			const defaults = all.filter((t) => !t.isCustom);
			setTypes([ ...custom, ...defaults ]);
		});
	}, []);

	const handleCreateWorkout = () => {
		stackNav?.navigate('WorkoutExerciseSelection');
	}

	const handleDeleteWorkout = () => {
		console.log("Delete workout pressed");
	}

	const renderItem = ({ item }: { item: WorkoutType }) => (
		<TouchableOpacity style={styles.card} onPress={ () => stackNav?.navigate('ExerciseSelection', { workoutTypeId: item.id }) }>
			<Text style={styles.cardTitle}>{item.name}</Text>
			<Text style={styles.cardSubtitle}>
				{item.isCustom ? 'Custom' : 'Default'}
			</Text>
		</TouchableOpacity>
	);

	const ListHeader = () => (
		<>
			<Header title="Rutinas" />

			<View style={styles.buttonRow}>
				<TouchableOpacity style={styles.createButton} onPress={handleCreateWorkout}>
					<Text style={styles.createButtonText}>Crear rutina</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteWorkout}>
					<Text style={styles.deleteButtonText}>Delete workout</Text>
				</TouchableOpacity> */}
			</View>
		</>
	);

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				ListHeaderComponent={ListHeader}
				data={types}
				keyExtractor={item => item.id.toString()}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
			/>
		</SafeAreaView>
	);
}