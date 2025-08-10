import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { getWorkoutTypes, WorkoutType } from '../../services/database';
import styles from './styles';

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Inicio'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

type GridItem = { kind: 'type'; data: WorkoutType } | { kind: 'add' };

const MAX_CELLS = 6;
const NUM_COLS = 3;

export default function WorkoutTypeSelector() {
	const [types, setTypes] = useState<WorkoutType[]>([]);
	const tabNav = useNavigation<TabNav>();
  	const stackNav = tabNav.getParent<StackNav>();

	useEffect( () => {
		( async () => {
			const allActiveTypes = await getWorkoutTypes();
			setTypes( allActiveTypes );
		})();
	}, []);

	const gridItems: GridItem[] = useMemo( () => {
		const includeAdd = types.length < MAX_CELLS; // Hay lugar para el botón Añadir +
		const visibleTypes = includeAdd ? types.slice( 0, MAX_CELLS - 1 ) : types.slice(0, MAX_CELLS);

		const items: GridItem[] = visibleTypes.map( t => ({ kind: 'type', data: t }) );
		if( includeAdd ) items.push({ kind: 'add' });
		return items;
	}, [types] );

	const handlePressType = ( t: WorkoutType ) => {
		stackNav?.navigate( 'ExerciseSelection', { workoutTypeId: t.id } );
	};

	const handlePressAdd = () => {
		stackNav?.navigate( 'WorkoutExerciseSelection' );
	};

	const renderItem = ({ item }: { item: GridItem }) => {
		if( item.kind === 'add' ) {
			return (
				<TouchableOpacity style={[ gridStyles.tile, gridStyles.addTile ]} onPress={handlePressAdd}>
					<Text style={gridStyles.addText}>Añadir +</Text>
				</TouchableOpacity>
			);
		}

		const color = item.data.color ?? '#ccc';
		return (
			<TouchableOpacity style={[ gridStyles.tile, { borderColor: color } ]} onPress={() => handlePressType( item.data )}>
				<Text style={gridStyles.tileText} numberOfLines={2} ellipsizeMode="tail">{item.data.name}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Empezá tu entrenamiento</Text>

			<FlatList
				data={gridItems}
				keyExtractor={(it, idx) => (it.kind === 'type' ? `type-${it.data.id}` : 'add')}
				numColumns={NUM_COLS}
				columnWrapperStyle={gridStyles.row}
				renderItem={renderItem}
				scrollEnabled={false}
				contentContainerStyle={gridStyles.gridContainer}
			/>
		</View>
	);
}

const gridStyles = StyleSheet.create({
  gridContainer: {
    paddingTop: 4,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
	gap: 5
  },
  tile: {
    flex: 1,
    height: 54,
    marginHorizontal: 0,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
	paddingHorizontal: 8,
  },
  tileText: {
    fontSize: 16,
    fontWeight: '600',
	textAlign: 'center',
	lineHeight: 20,
  },
  addTile: {
    borderColor: '#aaa',
    borderStyle: 'dashed',
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
});