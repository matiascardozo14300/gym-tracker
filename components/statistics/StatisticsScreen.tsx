import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import Header from '../header/Header';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import styles from './styles';
import { Exercise, getExerciseByWorkoutType, getExerciseRecords, WeightPoint } from '../../services/database';
import HelpIcon from '../../assets/icons/help.svg';

const screenWidth = Dimensions.get('window').width - 32;
const workoutTypes: WorkoutType[] = ['Pull', 'Push', 'Legs', 'FullBody'];
type WorkoutType = 'Pull' | 'Push' | 'Legs' | 'FullBody';

export default function StatisticsScreen() {
	const [selectedType, setSelectedType] = useState<WorkoutType>('Pull');;
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [selectedExercise, setSelectedExercise] = useState<Exercise>();

	const [labels, setLabels] = useState<string[]>([]);
	const [data, setData] = useState<number[]>([]);
	const [repIncreased, setRepIncreased] = useState<boolean[]>([]);
	const [maxWeight, setMaxWeight] = useState<number>(0);
	const [avgTrend, setAvgTrend] = useState<number>(0);

	const [helpModalVisible, setHelpModalVisible] = useState(false);

  	useEffect( () => {
		getExerciseByWorkoutType( selectedType )
			.then( ( exercises: Exercise[] ) => {
				setExercises( exercises );
				setSelectedExercise( exercises[0] || null );
			})
			.catch( console.error );
	}, [selectedType] );

	useEffect( () => {
		if( !selectedExercise ) return;

		getExerciseRecords( selectedExercise.id )
			.then( ( records: WeightPoint[] ) => {
				const limited = records.map( (r) => ({
					...r,
					reps: r.reps.slice( 0, 3 ),
				}));

				const newLabels: string[] = [];
				const newData: number[] = [];
				const newRepInc: boolean[] = [];

				for( let i = 0; i < limited.length; i++ ) {
					const record = limited[i];
					const date = new Date( record.date );
					newLabels.push( `${date.getDate()}/${date.getMonth() + 1}` );
					newData.push( record.weight );

					if( i === 0 ) {
						newRepInc.push( false );
					} else {
						const prev = limited[i - 1];

						if( record.weight !== prev.weight ) {
							newRepInc.push( false );
						} else {
							const sum = ( arr: number[] ) => arr.reduce( (a, b) => a + b, 0 );
							const sumCur = sum( record.reps );
							const sumPrev = sum( prev.reps );
							newRepInc.push( sumCur > sumPrev );
						}
					}
				}

				setLabels( newLabels );
				setData( newData );
				setRepIncreased( newRepInc );

				if( newData.length === 0 ) {
					setMaxWeight( 0 );
					setAvgTrend( 0 );
					return;
				}
				const mx = Math.max( ...newData );
				setMaxWeight( mx );

				const trend = ( newData[ newData.length - 1 ] - newData[0] ) / ( newData.length - 1 );
				setAvgTrend( parseFloat( trend.toFixed(1) ) );
			})
			.catch( console.error );
	}, [selectedExercise] );

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Header title="Statistics" />

				<Text style={styles.sectionTitle}>Choose Workout Type</Text>
				<View style={styles.row}>
					{workoutTypes.map( (t) => (
						<TouchableOpacity key={t} onPress={() => setSelectedType(t)} style={[ styles.typeButton, selectedType === t && styles.typeButtonActive]}>
							<Text style={[ styles.typeButtonText, selectedType === t && styles.typeButtonTextActive ]}>
								{t}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.dropdownContainer}>
					<Picker
						selectedValue={selectedExercise}
						onValueChange={ (v) => setSelectedExercise( v )}
						mode="dropdown"
						style={styles.picker}
						itemStyle={styles.pickerItem}
					>
						{exercises.map( (ex) => (
							<Picker.Item key={ex.id} label={ex.name} value={ex} color="#000" />
						))}
					</Picker>
				</View>

				<View style={styles.chartTitleContainer}>
					<Text style={styles.chartTitle}>Weight (kg)</Text>
					<TouchableOpacity onPress={() => setHelpModalVisible(true)} style={styles.helpButton}>
						<HelpIcon width={25} height={25} color={"grey"} />
					</TouchableOpacity>
				</View>

				{labels.length >= 2 && data.length >= 2 ? (
					<LineChart
						data={{ labels, datasets: [{ data }] }}
						width={screenWidth}
						height={220}
						yAxisSuffix="kg"
						chartConfig={{
							backgroundGradientFrom: '#fff',
							backgroundGradientTo: '#fff',
							decimalPlaces: 0,
							color: (opacity = 1) => `rgba(255,165,0,${opacity})`,
							labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
							propsForDots: {
							r: '0',
							},
							propsForBackgroundLines: {
							stroke: '#e3e3e3',
							},
						}}
						bezier
						style={styles.chartStyle}
						renderDotContent={({ x, y, index }) => {
							const isBigger = repIncreased[index];
							const radius = isBigger ? 10 : 5;
							return (
							<View
								key={`dot-${index}`}
								style={{
								position: 'absolute',
								left: x - radius,
								top: y - radius,
								width: radius * 2,
								height: radius * 2,
								borderRadius: radius,
								borderWidth: 2,
								borderColor: '#FFA500',
								backgroundColor: '#FFA500',
								}}
							/>
							);
						}}
					/>
  				) : (
    				<Text>No hay suficientes registros para este ejercicio</Text>
  				)}
				<View style={styles.statsCard}>
					<View style={styles.statsRow}>
						<Text style={styles.statsLabel}>Max Weight</Text>
						<Text style={styles.statsValue}>{maxWeight} kg</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.statsRow}>
						<Text style={styles.statsLabel}>Average Trend</Text>
						<Text style={styles.statsValue}>+{avgTrend} kg/day</Text>
					</View>
				</View>

				<Modal
					visible={helpModalVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setHelpModalVisible(false)}
					>
					<View style={styles.helpModalOverlay}>
						<View style={styles.helpModalContainer}>
							<Text style={styles.helpModalTitle}>¿Cómo funciona el gráfico?</Text>
							<ScrollView contentContainerStyle={styles.helpModalContent}>
								<Text style={styles.helpModalText}>
									• Cada punto representa el peso levantado en una sesión (eje Y) en la fecha correspondiente (eje X).
									{'\n\n'}
									• Si el peso se incrementa respecto a la sesión anterior, el punto aparece más arriba: el gráfico traza una línea ascendente.
									{'\n\n'}
									• Si el peso se mantiene pero las repeticiones totales suben (por ejemplo: de 7–5–4 a 8–5–4 con el mismo peso), ese punto aparece con un radio el doble de grande (para indicar progreso en repeticiones sin haber subido peso).
									{'\n\n'}
									• Si peso y repeticiones se mantienen iguales, el punto conserva su tamaño normal.
								</Text>
							</ScrollView>
							<TouchableOpacity
								style={styles.helpModalCloseButton}
								onPress={() => setHelpModalVisible(false)}
							>
								<Text style={styles.helpModalCloseText}>Cerrar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</ScrollView>
		</SafeAreaView>
	);
}