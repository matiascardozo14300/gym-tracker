import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { initDatabase, getAllWorkouts } from './services/database';
import type { Workout } from './models/types';
import CalendarSection from './components/screens/CalendarSelection';
import styles from './components/styles/HomeScreen.styles';

type TabItemProps = {
	icon: string;
	label: string;
};

const Header: React.FC = () => (
	<View style={ styles.header }>
		<Text style={ styles.headerTitle }>Home</Text>
	</View>
);

const WorkoutTypeSelector: React.FC = () => {
	const types = ['Pull', 'Push', 'Legs', 'FullBody'];

	return (
		<View style={ styles.section }>
			<Text style={ styles.sectionTitle }>Choose Workout Type</Text>
			<View style={ styles.row }>
				{ types.map( ( t ) => (
					<TouchableOpacity key={ t } style={ styles.typeButton }>
						<Text style={ styles.typeButtonText }>{ t }</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const WorkoutCard: React.FC = () => (
	<TouchableOpacity style={styles.card}>
	  <Text style={styles.cardTitle}>Monday, April 22</Text>
	  <Text style={styles.cardSubtitle}>FullBody · 1h 10m</Text>
	</TouchableOpacity>
  );

const LatestWorkouts: React.FC = () => (
<View style={styles.section}>
	<Text style={styles.sectionTitle}>Latest Workouts</Text>
	<WorkoutCard />
	<WorkoutCard />
</View>
);

const TabItem: React.FC<TabItemProps> = ({ icon, label }) => (
	<TouchableOpacity style={styles.tabItem}>
	  <Text style={styles.tabIcon}>{icon}</Text>
	  <Text style={styles.tabLabel}>{label}</Text>
	</TouchableOpacity>
);

export default function HomeScreen() {
	const [ workouts, setWorkouts ] = useState<Workout[]>([]);

	// ejemplo de días marcados (puedes generarlo dinámicamente)
	const [ markedDates, setMarkedDates ] = useState({
		'2025-05-01': { marked: true, dotColor: '#50cebb' },
		'2025-05-02': { marked: true, dotColor: '#50cebb' },
	});

	useEffect(() => {
		initDatabase().catch( err => console.error('Error inicializando DB', err ) );
	}, []);

	const loadWorkouts = async () => {
		try {
		  const all = await getAllWorkouts();
		  setWorkouts(all);
		} catch (err) {
		  console.error('Error cargando workouts', err);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
		<ScrollView contentContainerStyle={styles.scrollContent}>
		<Header />
		<WorkoutTypeSelector />
		<CalendarSection markedDates={markedDates} onDayPress={ day => {
			console.log('Día seleccionado:', day);
		}} />
		<LatestWorkouts />
		</ScrollView>
		<View style={styles.tabBar}>
		<TabItem icon="🏠" label="Home" />
		<TabItem icon="🕒" label="History" />
		<TabItem icon="📊" label="Statistics" />
		<TabItem icon="⚙️" label="Settings" />
		</View>
		</SafeAreaView>
	);
}