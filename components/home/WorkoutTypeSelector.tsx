import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, RootTabParamList } from '../../App';
import { getWorkoutIdForDate, getWorkoutTypes, WorkoutType } from '../../services/database';
import {styles} from './styles';
import { toLocalYYYYMMDD } from '../common/helper';

import { modalStyles } from '../common/modalStyles';

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Inicio'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

type GridItem = { kind: 'type'; data: WorkoutType } | { kind: 'add' };

const MAX_CELLS = 6;
const NUM_COLS = 3;

export default function WorkoutTypeSelector() {
	const [types, setTypes] = useState<WorkoutType[]>([]);
	const [warnModalVisible, setWarnModalVisible] = useState(false);
	const [todayWorkoutId, setTodayWorkoutId] = useState<number | null>(null);
	const [pendingType, setPendingType] = useState<WorkoutType | null>(null);

	const tabNav = useNavigation<TabNav>();
  	const stackNav = tabNav.getParent<StackNav>();

	const isFocused = useIsFocused();

	useEffect(() => {
		let alive = true;

		const load = async () => {
			const rows = await getWorkoutTypes();
			if (alive) setTypes(rows);
		};

		if (isFocused) load();

		return () => { alive = false; };
	}, [isFocused]);

	const gridItems: GridItem[] = useMemo( () => {
		const includeAdd = types.length < MAX_CELLS; // Hay lugar para el botón Añadir +
		const visibleTypes = includeAdd ? types.slice( 0, MAX_CELLS - 1 ) : types.slice(0, MAX_CELLS);

		const items: GridItem[] = visibleTypes.map( t => ({ kind: 'type', data: t }) );
		if( includeAdd ) items.push({ kind: 'add' });
		return items;
	}, [types] );

	const handlePressType = async ( t: WorkoutType ) => {
		const today = toLocalYYYYMMDD( new Date() );

		const existingId = await getWorkoutIdForDate( today );
		if( !existingId ) {
			// No hay workout hoy -> empezar uno nuevo
			stackNav?.navigate( 'ExerciseSelection', { workoutTypeId: t.id } );
			return;
		}

		// Ya hay uno -> muestra modal de aviso con opciones
		setPendingType(t);
		setTodayWorkoutId(existingId);
		setWarnModalVisible(true);

	};

	const handlePressAdd = () => {
		stackNav?.navigate( 'WorkoutExerciseSelection', {} );
	};

	const goEditToday = () => {
		if( !todayWorkoutId ) return;

		setWarnModalVisible(false);
		stackNav?.navigate('EditWorkout', { workoutId: todayWorkoutId });
	}

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

			{/* Modal de aviso si ya hay workout hoy */}
			<Modal
				transparent
				animationType="fade"
				visible={warnModalVisible}
				onRequestClose={() => setWarnModalVisible(false)}
			>
				<View style={modalStyles.overlay}>
					<View style={modalStyles.sheet}>
						{/* Icono/Badge */}
						<View style={modalStyles.iconWrap}>
							<Text style={modalStyles.iconText}>⚠️</Text>
						</View>

						{/* Título y texto */}
						<Text style={modalStyles.title}>Ya registraste un entrenamiento hoy</Text>
						<Text style={[modalStyles.subtitle, { fontWeight: 'normal' }]}>
							Podés editar el que hiciste o cancelar para evitar duplicados.
						</Text>

						<View style={modalStyles.divider} />

						{/* Acciones */}
						<View style={modalStyles.actions}>
							<TouchableOpacity
								style={[modalStyles.btn, modalStyles.btnGhost]}
								onPress={() => setWarnModalVisible(false)}
							>
								<Text style={[modalStyles.btnText, modalStyles.btnGhostText]}>Cancelar</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[modalStyles.btn, modalStyles.btnPrimary]}
								onPress={goEditToday}
								activeOpacity={0.9}
								hitSlop={10}
							>
								<Text style={[modalStyles.btnText, modalStyles.btnPrimaryText]}>Editar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
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