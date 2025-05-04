import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { initDatabase, getAllWorkouts, insertWorkout } from './services/database';
import type { Workout } from './models/types';

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

const CalendarSection: React.FC = () => {
	const weeks = [
	  ['', '', '', '1', '2', '3', '4'],
	  ['5', '6', '7', '8', '9', '10', '11'],
	  ['12', '13', '14', '15', '16', '17', '18'],
	  ['19', '20', '21', '22', '23', '24', '25'],
	  ['26', '27', '28', '29', '30', '', ''],
	];
	return (
	  <View style={styles.section}>
		<Text style={styles.sectionTitle}>April 2024</Text>
		<View style={styles.weekDaysRow}>
		  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
			<Text key={d} style={styles.weekDay}>
			  {d}
			</Text>
		  ))}
		</View>
		{weeks.map((week, i) => (
		  <View key={i} style={styles.weekRow}>
			{week.map((day, j) => {
			  const isSelected = day === '21';
			  return (
				<View
				  key={j}
				  style={[
					styles.dayCell,
					isSelected && styles.selectedDayCell,
				  ]}
				>
				  <Text
					style={[
					  styles.dayText,
					  isSelected && styles.selectedDayText,
					]}
				  >
					{day}
				  </Text>
				</View>
			  );
			})}
		  </View>
		))}
	  </View>
	);
};

const WorkoutCard: React.FC = () => (
	<TouchableOpacity style={styles.card}>
	  <Text style={styles.cardTitle}>Monday, April 22</Text>
	  <Text style={styles.cardSubtitle}>FullBody · Castelli · 1h 10m</Text>
	</TouchableOpacity>
  );

const LatestWorkouts: React.FC = () => (
<View style={styles.section}>
	<Text style={styles.sectionTitle}>Latest Workouts</Text>
	<WorkoutCard />
</View>
);

const TabItem: React.FC<TabItemProps> = ({ icon, label }) => (
	<TouchableOpacity style={styles.tabItem}>
	  <Text style={styles.tabIcon}>{icon}</Text>
	  <Text style={styles.tabLabel}>{label}</Text>
	</TouchableOpacity>
);

const HomeScreen: React.FC = () => (
	<SafeAreaView style={styles.container}>
	  <ScrollView contentContainerStyle={styles.scrollContent}>
		<Header />
		<WorkoutTypeSelector />
		<CalendarSection />
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

export default HomeScreen;
/* export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    initDatabase().catch(err => console.error('Error inicializando DB', err));
  }, []);

  const loadWorkouts = async () => {
    try {
      const all = await getAllWorkouts();
      setWorkouts(all);
    } catch (err) {
      console.error('Error cargando workouts', err);
    }
  };

  const addWorkout = async () => {
    const now = new Date().toISOString();
    const newWorkout: Workout = {
      id: "1",
      startDate: now,
      finishDate: now,
      workoutType: 'FullBody',
      gymLocation: 'Otro',
	  exercises: []
    };
    try {
      await insertWorkout(newWorkout);
      // recargo la lista
      await loadWorkouts();
    } catch (err) {
      console.error('Error agregando workout', err);
    }
  };

  return (
    <View style={styles.container}>
            <Button title="Agregar entrenamiento" onPress={addWorkout} />

			<View style={{ height: 12 }} />

			<Button title="Mostrar entrenamientos" onPress={loadWorkouts} />


      <FlatList
        data={workouts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.workoutType} — {item.gymLocation}
            </Text>
            <Text>Inicio: {new Date(item.startDate).toLocaleString()}</Text>
            <Text>Fin: {new Date(item.finishDate).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>No hay entrenamientos aún</Text>
        }
      />
    </View>
  );
} */

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	scrollContent: { padding: 16, paddingBottom: 80 },
	header: { marginBottom: 24, marginTop: 24 },
	headerTitle: { fontSize: 32, fontWeight: 'bold' },

	section: { marginBottom: 24 },
	sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

	row: { flexDirection: 'row', justifyContent: 'space-between' },
	typeButton: {
		flex: 1,
		marginHorizontal: 4,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		alignItems: 'center',
	},
	typeButtonText: { fontSize: 16 },

	weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
	weekDay: { flex: 1, textAlign: 'center', fontWeight: '500' },
	weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
	dayCell: {
		flex: 1,
		aspectRatio: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dayText: { color: '#333' },
	selectedDayCell: {
		backgroundColor: '#007AFF20',
		borderRadius: 20,
	},
	selectedDayText: { color: '#007AFF', fontWeight: '700' },

	card: {
		backgroundColor: '#f9f9f9',
		padding: 16,
		borderRadius: 12,
	},
	cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
	cardSubtitle: { fontSize: 14, color: '#666' },

	tabBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 64,
		flexDirection: 'row',
		borderTopWidth: 1,
		borderColor: '#ddd',
		backgroundColor: '#fff',
	},
	tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	tabIcon: { fontSize: 20 },
	tabLabel: { fontSize: 12, marginTop: 2 },
});