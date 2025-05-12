import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import type { Workout, LastWorkout, NewWorkout } from './types';

// Crea un nuevo entrenamiento
export async function insertNewWorkout( workout: NewWorkout ): Promise<number> {
	const result = await getDB().runAsync(
		`INSERT INTO workouts (startDate, finishDate, workoutType) VALUES (?, ?, ?);`,
		workout.startDate,
		workout.finishDate,
		workout.workoutType
	);
	return result.lastInsertRowId!;
}

// Obtiene un listado de todos los entrenamientos
export async function getAllWorkouts(): Promise<Workout[]> {
	return getDB().getAllAsync<Workout>(`SELECT * FROM workouts;`);
}

// Actualiza la fecha de finalización de un entrenamiento al terminarlo
export async function updateWorkoutFinishDate( workoutId: number, finishDate: string ): Promise<SQLiteRunResult> {
	return getDB().runAsync(
		`UPDATE workouts SET finishDate = ? WHERE id = ?;`,
		finishDate,
		workoutId
	);
}

// Obtiene los últimos 3 entrenamientos
export async function getLast3Workouts(): Promise<LastWorkout[]> {
	const rows = await getDB().getAllAsync<{
		startDate: string;
		finishDate: string;
		workoutType: string;
	}>(
		`SELECT startDate, finishDate, workoutType
		FROM workouts
		ORDER BY startDate DESC
		LIMIT 3;`
	);

	// Mappear a formato con duración
	return rows.map(({ startDate, finishDate, workoutType }) => {
		const start = new Date( startDate );
		const end = new Date( finishDate );
		const diffMs = end.getTime() - start.getTime();
		const diffMin = Math.round(diffMs / 60000);
		const hours = Math.floor(diffMin / 60);
		const minutes = diffMin % 60;
		const duration = `${hours}h ${minutes}m`;

		return { startDate, workoutType, duration };
	});
}

// Obtiene un listado de fechas y tipos de entrenamientos para un mes específico
export async function getWorkoutDatesForMonth(
	year: number,
	month: number
  ): Promise<{ date: string; workoutType: string }[]> {
	const monthStr = String( month ).padStart(2, '0');
	const from = `${year}-${monthStr}-01`;
	const nextMonth = month === 12 ? 1 : month + 1;
	const nextYear = month === 12 ? year + 1 : year;
	const nextMonthStr = String( nextMonth ).padStart(2, '0');
	const to = `${nextYear}-${nextMonthStr}-01`;

	// 1) Subconsulta ordenada DESC para que al agrupar por fecha nos quedemos con el más reciente
	const rows = await getDB().getAllAsync<{
		startDate: string;
		workoutType: string;
		date: string;
	}>(
	`
		SELECT substr(startDate,1,10) as date, workoutType
		FROM (
			SELECT startDate, workoutType
			FROM workouts
			WHERE startDate >= ? AND startDate < ?
			ORDER BY startDate DESC  -- más recientes primero
		)
		GROUP BY date; -- toma el primero (el más reciente) de cada grupo
	`,
		from,
		to
	);

	// 2) Retornamos directamente date + workoutType
	return rows.map( r => ({
		date: r.date,
		workoutType: r.workoutType
	}));
}