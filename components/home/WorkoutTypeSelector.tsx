import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { getWorkoutTypes, WorkoutType } from '../../services/database';
import styles from './styles';
import { workoutTypeColors } from '../common/colorMap';

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Home'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

export default function WorkoutTypeSelector() {
	const [types, setTypes] = useState<WorkoutType[]>([]);
	const tabNav = useNavigation<TabNav>();
  	const stackNav = tabNav.getParent<StackNav>();

	useEffect( () => {
		( async () => {
			const allTypes = await getWorkoutTypes();
			setTypes( allTypes );
		})();
	}, []);

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Choose Workout Type</Text>

			<ScrollView	horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
				{types.map( (t) => (
					<TouchableOpacity
						key={t.id}
						onPress={() =>
							stackNav?.navigate('ExerciseSelection', { workoutTypeId: t.id })
						}
						style={[ styles.typeButton, { borderColor: workoutTypeColors[t.name] || '#ccc' }, ]}
					>
						<Text style={styles.typeButtonText}>{t.name}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}