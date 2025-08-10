import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import type { Workout, LastWorkout, NewWorkout, WorkoutDetail, WorkoutType } from './types';

// Crea un nuevo entrenamiento
export async function insertNewWorkout( workout: NewWorkout ): Promise<number> {
	const result = await getDB().runAsync(
		`INSERT INTO workouts (startDate, finishDate, workoutTypeId) VALUES (?, ?, ?);`,
		workout.startDate,
		workout.finishDate,
		workout.workoutTypeId
	);
	return result.lastInsertRowId!;
}

// Obtiene un listado de todos los entrenamientos
export async function getAllWorkouts(): Promise<Workout[]> {
	const rows = await getDB().getAllAsync<{
		id: number;
		startDate: string;
		finishDate: string;
		workoutTypeName: string;
	}>(`
		SELECT
			w.id,
			w.startDate,
			w.finishDate,
			wt.name AS workoutTypeName
		FROM workouts w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		ORDER BY w.startDate DESC;
    `);

	return rows.map(r => ({
		id: r.id,
		startDate: r.startDate,
		finishDate: r.finishDate,
		workoutType: r.workoutTypeName
	}));
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
		`SELECT
			w.startDate,
			w.finishDate,
			wt.name AS workoutType
		FROM workouts w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		ORDER BY w.startDate DESC
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

	const rows = await getDB().getAllAsync<{
		date: string;
		workoutType: string;
	}>(
	`
		SELECT
			substr(w.startDate,1,10) AS date,
			wt.name AS workoutType
		FROM (
			SELECT startDate, workoutTypeId
			FROM workouts
			WHERE startDate >= ? AND startDate < ?
			ORDER BY startDate DESC
		) AS w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		GROUP BY date;
	`,
		from,
		to
	);

	return rows.map( r => ({
		date: r.date,
		workoutType: r.workoutType
	}));
}

// Devuelve los datos completos de un workout por fecha
export async function getWorkoutDetailByDate( dateString: string ): Promise<WorkoutDetail | null> {
	const db = getDB();
	const workoutRow = await db.getFirstAsync<{ id: number; workoutType: string }>(
		`
		SELECT
			w.id,
			wt.name AS workoutType
		FROM workouts w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		WHERE date(w.startDate) = ?
		ORDER BY w.id DESC
		LIMIT 1;
		`,
		dateString
	);

	if( !workoutRow ) return null;
	const { id: workoutId, workoutType } = workoutRow;

	// Recuperar todos los registros de sets junto con el nombre del ejercicio
	const rows = await db.getAllAsync<{ exerciseName: string; weight: number; reps: number; }>(
		`
		SELECT
			e.name AS exerciseName,
			s.weight,
			s.reps
		FROM exercise_records er
		JOIN exercises      e ON er.exerciseId = e.id
		JOIN sets           s ON s.exerciseRecordId = er.id
		WHERE er.workoutId = ?
		ORDER BY e.name, s.id;
		`,
		workoutId
	);

	const map: Record<
	string,
		{
			name: string;
			sets: { weight: number; reps: number }[];
		}
	> = {};

	for( const row of rows ) {
		if( !map[row.exerciseName] ) {
			map[row.exerciseName] = {
				name: row.exerciseName,
				sets: [],
			};
		}

		map[row.exerciseName].sets.push({
			weight: row.weight,
			reps: row.reps,
		});
	}

	const exercises = Object.values( map );

	return {
		workoutType,
		exercises,
	};
}

// Obtiene todos los tipos de entrenamiento existentes (activos por defecto)
export async function getWorkoutTypes( opts: { includeArchived?: boolean } = {} ): Promise<WorkoutType[]> {
	const { includeArchived = false } = opts;

	const where = includeArchived ? '' : 'WHERE isArchived = 0';

	const rows = await getDB().getAllAsync<WorkoutType>(
		`
		SELECT id, name, isCustom, color, isArchived, archivedAt
		FROM workout_types
		${where}
		ORDER BY isCustom, name;
		`
	);

	return rows;
}

export async function createWorkoutType( name: string, exerciseIds: number[] ): Promise<number> {
	const db = getDB();

	const result = await db.runAsync(
		`INSERT INTO workout_types (name, isCustom) VALUES (?, 1);`,
		name
	);
	const workoutTypeId = result.lastInsertRowId!;

	const stm = `
		INSERT INTO workout_type_exercises (workoutTypeId, exerciseId)
		VALUES (?, ?);
	`;
	for( const exId of exerciseIds ) {
		await db.runAsync( stm, workoutTypeId, exId );
	}

	return workoutTypeId;
}