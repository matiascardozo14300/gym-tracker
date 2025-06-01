import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Header from '../header/Header';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import styles from './styles';
import { Exercise, getExerciseByWorkoutType, getExerciseRecords, WeightPoint } from '../../services/database';

const screenWidth = Dimensions.get('window').width - 32;
const workoutTypes: WorkoutType[] = ['Pull', 'Push', 'Legs', 'FullBody'];
type WorkoutType = 'Pull' | 'Push' | 'Legs' | 'FullBody';

export default function StatisticsScreen() {
	const [selectedType, setSelectedType] = useState<WorkoutType>('Pull');;
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [selectedExercise, setSelectedExercise] = useState<Exercise>();

	const [labels, setLabels] = useState<string[]>([]);
	const [data, setData] = useState<number[]>([]);
	const [maxWeight, setMaxWeight] = useState<number>(0);
	const [avgTrend, setAvgTrend] = useState<number>(0);

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
				const labels: string[] = [];
				const data: number[] = [];

				for( const record of records ) {
					const date = new Date( record.date );
					labels.push( `${date.getDate()}/${date.getMonth() + 1}` );
					data.push( record.weight );
				}
				setLabels( labels );
				setData( data );

				if( data.length === 0 ) {
					setMaxWeight( 0 );
					setAvgTrend( 0 );
					return;
				}
				const mx = Math.max( ...data );
				setMaxWeight( mx );

				const trend = ( data[ data.length - 1 ] - data[0] ) / ( data.length - 1 );
				setAvgTrend( parseFloat( trend.toFixed(1) ) );
		});
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

				<Text style={styles.chartTitle}>Weight (kg)</Text>
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
						r: '5',
						strokeWidth: '2',
						stroke: '#FFA500'
						},
						propsForBackgroundLines: {
						stroke: '#e3e3e3'
						}
						}}
						bezier
						style={styles.chartStyle}
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
			</ScrollView>
		</SafeAreaView>
	);
}