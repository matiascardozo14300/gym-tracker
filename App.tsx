import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { initDatabase, getAllWorkouts, insertWorkout } from './services/database';
import type { Workout } from './models/types';

export default function App() {
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
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  title: { fontWeight: 'bold', marginBottom: 4 }
});