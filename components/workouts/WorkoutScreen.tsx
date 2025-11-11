import { useEffect, useState } from "react";
import { deleteWorkoutType, getWorkoutTypes, updateWorkoutTypeColor, WorkoutType,
  reorderWorkoutTypes } from '../../services/database';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from "react-native";
import styles from './styles';
import Header from '../header/Header';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import PaletteIcon from '../../assets/icons/palette.svg';
import EditIcon from '../../assets/icons/edit.svg';
import DeleteIcon from '../../assets/icons/delete.svg';
import PlayArrow from '../../assets/icons/play_arrow_green.svg';
/* import { LinearGradient } from 'expo-linear-gradient'; */

type TabNav = BottomTabNavigationProp<RootTabParamList, 'Rutinas'>;
type StackNav = NativeStackNavigationProp<RootStackParamList>;

const PRESET_COLORS = [
  '#F8BBD0', // Pink (Pull)
  '#BBDEFB', // Blue (Push)
  '#C8E6C9', // Green (Legs)
  '#E1BEE7', // Purple (FullBody)
  '#B3E5FC', // Light Blue
  '#B2EBF2', // Cyan
  '#B2DFDB', // Teal
  '#DCEDC8', // Light Green
  '#FFE0B2', // Orange
  '#FFECB3', // Amber
  '#FFCCBC', // Deep Orange
  '#CFD8DC', // Blue Grey
]

export default function WorkoutScreen() {
	const [ types, setTypes ] = useState<WorkoutType[]>( [] );
	const [ savingOrder, setSavingOrder ] = useState(false);

	const [ colorModalVisible, setColorModalVisible ] = useState(false);
	const [ target, setTarget ] = useState<WorkoutType | null>(null);
	const [ tempColor, setTempColor ] = useState<string | null>(null);

	const [ deleteModalVisible, setDeleteModalVisible ] = useState(false);
	const [ targetToDelete, setTargetToDelete ] = useState<WorkoutType | null>(null);

	const tabNav = useNavigation<TabNav>();
	const stackNav = tabNav.getParent<StackNav>();

	useEffect(() => {
		getWorkoutTypes().then( ( activeTypes ) => setTypes( activeTypes ));
	}, []);

	const handleCreateWorkout = () => {
		stackNav?.navigate( 'WorkoutExerciseSelection', {} );
	}

	const handleStartWorkout = ( item: WorkoutType ) => {
		stackNav?.navigate( 'ExerciseSelection', { workoutTypeId: item.id } );
	}

	const handleChangeColor = ( item: WorkoutType ) => {
		setTarget( item );
		setTempColor( item.color ?? PRESET_COLORS[0] );
		setColorModalVisible( true );
	}

	const handleEditWorkout = ( item: WorkoutType ) => {
		stackNav?.navigate( 'WorkoutExerciseSelection', { workoutTypeId: item.id } );
	}

	const handleDeleteWorkout = ( item: WorkoutType ) => {
		setTargetToDelete( item );
		setDeleteModalVisible( true );
	}

	const closeConfirm = () => {
		setDeleteModalVisible( false );
		setTargetToDelete( null );
	}

	const confirmDelete = async () => {
		if( !targetToDelete ) return;
		try {
			const res = await deleteWorkoutType( targetToDelete.id );

			if( !res.ok ) {
				if (res.code === 'NOT_FOUND') {
					Alert.alert('Error', 'La rutina no existe.');
				} else if (res.code === 'ALREADY_ARCHIVED') {
					Alert.alert('Aviso', 'La rutina ya estaba eliminada.');
				} else {
					Alert.alert('Error', 'No se pudo eliminar la rutina.');
				}
				return;
			}

			setTypes( prev => prev.filter( t => t.id !== targetToDelete.id ) );

			setDeleteModalVisible( false );
			setTargetToDelete( null );
		} catch( e ) {
			Alert.alert('Error', 'Ocurrió un problema al eliminar la rutina.');
		}
	}

	const saveColor = async () => {
		if( !target || !tempColor ) return;

		await updateWorkoutTypeColor( target.id, tempColor );
		setTypes( (prev) =>
      		prev.map( (t) => ( t.id === target.id ? { ...t, color: tempColor } : t ))
		);
		setColorModalVisible( false );
		setTarget( null );
	}

	const closeColorModal = () => {
		setColorModalVisible( false );
		setTarget( null );
	}

	const persistOrder = async ( next: WorkoutType[], prev: WorkoutType[] ) => {
		try {
			setSavingOrder(true);
			await reorderWorkoutTypes(next.map((t) => t.id));
		} catch {
			setTypes( prev ); // rollback
			Alert.alert( "Error", "No se pudo actualizar el orden de las rutinas." );
		} finally {
			setSavingOrder( false );
		}
	};

	const moveUp = ( index: number ) => {
		if( index <= 0 || savingOrder ) return;
		const prev = types;
		const next = [...types];
		const tmp = next[index - 1];
		next[index - 1] = next[index];
		next[index] = tmp;
		setTypes( next );
		void persistOrder( next, prev );
	};

	const moveDown = ( index: number ) => {
		if( index >= types.length - 1 || savingOrder ) return;
		const prev = types;
		const next = [...types];
		const tmp = next[index + 1];
		next[index + 1] = next[index];
		next[index] = tmp;
		setTypes( next );
		void persistOrder( next, prev );
	};

	const ListHeader = () => (
		<>
			<Header title="Rutinas" />
			<View style={styles.headerActions}>
				<TouchableOpacity style={styles.createButton} onPress={handleCreateWorkout} activeOpacity={0.8}>
					<Text style={styles.createButtonText}>Crear rutina</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity
					activeOpacity={0.85}
					onPress={handleCreateWorkout}
					style={styles.createButtonWrapper}
				>
					<LinearGradient
					colors={['#00C851', '#00bcd4']} // verde -> celeste
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.createButtonGradient}
					>
					<Text style={styles.createButtonText}>+ Crear rutina</Text>
					</LinearGradient>
				</TouchableOpacity> */}
			</View>
		</>
	);

	const renderItem = ({ item, index }: { item: WorkoutType; index: number }) => {
		const color = item.color ?? "#ccc";
		const isFirst = index === 0;
		const isLast = index === types.length - 1;

		return (
			<View style={styles.card}>
				<View style={arrowStyles.col}>
					<TouchableOpacity
						disabled={isFirst || savingOrder}
						onPress={() => moveUp(index)}
						style={[arrowStyles.btn, (isFirst || savingOrder) && arrowStyles.btnDisabled]}
						hitSlop={8}
					>
						<View style={[arrowStyles.triUp, { borderBottomColor: color }]} />
					</TouchableOpacity>

					<TouchableOpacity
						disabled={isLast || savingOrder}
						onPress={() => moveDown(index)}
						style={[arrowStyles.btn, (isLast || savingOrder) && arrowStyles.btnDisabled]}
						hitSlop={8}
					>
						<View style={[arrowStyles.triDown, { borderTopColor: color }]} />
					</TouchableOpacity>
				</View>

				<View style={styles.cardContent}>
					<Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
						{item.name}
					</Text>

					<View style={styles.iconRow}>
						<TouchableOpacity onPress={() => handleChangeColor(item)} hitSlop={10} style={styles.iconBtn}>
							<PaletteIcon width={20} height={20} fill={'#696767ff'} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleEditWorkout(item)} hitSlop={10} style={styles.iconBtn}>
							<EditIcon width={20} height={20} fill={'#696767ff'} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => handleDeleteWorkout(item)} hitSlop={10} style={styles.iconBtn}>
							<DeleteIcon width={20} height={20} fill={'#696767ff'} />
						</TouchableOpacity>
					</View>
				</View>

				<TouchableOpacity style={styles.startBtn} onPress={() => handleStartWorkout(item)} activeOpacity={0.9}>
					<Text style={styles.startBtnText}>Iniciar</Text>
					<PlayArrow width={20} height={20} fill={'#fff'} style={styles.startIcon} />
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				ListHeaderComponent={ListHeader}
				data={types}
				keyExtractor={item => String(item.id)}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				extraData={savingOrder}
			/>

			{/* Modal selector de color */}
			<Modal transparent animationType="fade" visible={colorModalVisible}>
				<View style={pickStyles.overlay}>
					<View style={pickStyles.sheet}>
						<Text style={pickStyles.title}>Elegí un color</Text>

						<View style={pickStyles.grid}>
							{PRESET_COLORS.map((c) => {
								const selected = tempColor === c;
								return (
									<TouchableOpacity
										key={c}
										onPress={() => setTempColor(c)}
										style={[
											pickStyles.swatch,
											{ backgroundColor: c },
											selected && pickStyles.swatchSelected,
										]}
										activeOpacity={0.8}
									/>
								);
							})}
						</View>

						<View style={pickStyles.actions}>
							<TouchableOpacity style={pickStyles.cancelBtn} onPress={closeColorModal}>
								<Text style={pickStyles.cancelText}>Cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[pickStyles.saveBtn, !tempColor && pickStyles.saveBtnDisabled]}
								onPress={saveColor}
								disabled={!tempColor}
							>
								<Text style={pickStyles.saveText}>Guardar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<Modal transparent animationType="slide" visible={deleteModalVisible}>
				<View style={styles.modalOverlay}>
					<View style={ styles.modalContainer }>
						<Text style={ styles.modalTitle }>Eliminar rutina</Text>
						<Text style={ styles.modalText }>
							{`¿Seguro que querés eliminar "${targetToDelete?.name}"?\n\n` +
         					'Los entrenamientos pasados que usan esta rutina se seguirán viendo.'}
						</Text>
						<TouchableOpacity style={styles.cancelButton} onPress={closeConfirm}>
							<Text style={styles.cancelButtonText}>Cancelar</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={confirmDelete} style={styles.modalButton}>
							<Text style={styles.modalButtonText}>Eliminar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

/** Flechas triangulitos */
const arrowStyles = StyleSheet.create({
  col: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 6,
	marginRight: 10
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  btnDisabled: { opacity: 0.35 },
  triUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ccc", // se sobreescribe con color real
  },
  triDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ccc", // se sobreescribe con color real
  },
});

const pickStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center", alignItems: "center",
    paddingHorizontal: 18,
  },
  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 12,
  },
  grid: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12, columnGap: 12,
  },
  swatch: {
    width: 42, height: 42, borderRadius: 10,
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  swatchSelected: {
    borderWidth: 3, borderColor: "#333",
  },
  actions: {
    flexDirection: "row", justifyContent: "space-between", marginTop: 16,
  },
  cancelBtn: {
    flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: "#cfcfcf",
    alignItems: "center", justifyContent: "center", marginRight: 8,
  },
  saveBtn: {
    flex: 1, height: 44, borderRadius: 10, backgroundColor: "#007AFF",
    alignItems: "center", justifyContent: "center", marginLeft: 8,
  },
  saveBtnDisabled: { opacity: 0.5 },
  cancelText: { color: "#444", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "700" },
});