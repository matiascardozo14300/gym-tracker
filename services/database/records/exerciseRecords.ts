import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { ExerciseMaxHistory, NewExerciseRecord, NewSetRecord, WeightPoint } from './types';


// Inserta un nuevo ExcerciseRecord
export async function insertExerciseRecord( record: NewExerciseRecord ): Promise<number> {
	const result: SQLiteRunResult = await getDB().runAsync(
		`INSERT INTO exercise_records (workoutId, exerciseId) VALUES (?, ?);`,
		record.workoutId,
		record.exerciseId
	);
	return result.lastInsertRowId!;
}

// Inserta un nuevo SetRecord
export async function insertSetRecord( record: NewSetRecord ): Promise<number> {
	const result: SQLiteRunResult = await getDB().runAsync(
		`INSERT INTO sets (exerciseRecordId, weight, reps) VALUES (?, ?, ?);`,
		record.exerciseRecordId,
		record.weight,
		record.reps
	);
	return result.lastInsertRowId!;
}

// Obtiene el histórico de pesos por fecha de un ejercicio determinado
export async function getExerciseRecords( exerciseId: number ): Promise<WeightPoint[]> {
	const rows = await getDB().getAllAsync<WeightPoint>(
	`
		SELECT w.startDate AS date, MIN(s.weight) AS weight
		FROM exercise_records er
			JOIN workouts w ON er.workoutId = w.id
			JOIN sets s ON s.exerciseRecordId = er.id
		WHERE er.exerciseId = ?
		GROUP BY w.id, w.startDate
		ORDER BY w.startDate;
	`,
    	exerciseId
	);
	return rows;
}

// Obtiene el máximo de peso registrado para un ejercicio (junto con los sets)
export async function getExerciseMaxHistory( exerciseId: number ): Promise<ExerciseMaxHistory | null> {
	const db = getDB();

	const row = await db.getFirstAsync<{
		exerciseRecordId: number;
		date: string;
		maxWeight: number;
	}>(
		 `
		WITH maxW AS (
			SELECT MAX(s.weight) AS maxWeight
			FROM exercise_records er
			JOIN sets s ON s.exerciseRecordId = er.id
			WHERE er.exerciseId = ?
		)
		SELECT
			er.id AS exerciseRecordId,
			w.startDate AS date,
			maxW.maxWeight
		FROM exercise_records er
		JOIN workouts w ON er.workoutId = w.id
		JOIN sets s ON s.exerciseRecordId = er.id
		JOIN maxW ON s.weight = maxW.maxWeight
		WHERE er.exerciseId = ?
		ORDER BY w.startDate DESC
		LIMIT 1;
		`,
		exerciseId,
		exerciseId
	);

	if( !row ) return null;

	// Obtener los sets de esa sesión
	const sets = await db.getAllAsync<{ weight: number; reps: number }>(
		`
		SELECT weight, reps
		FROM sets
		WHERE exerciseRecordId = ?;
		`,
		row.exerciseRecordId
	);

	return {
		exerciseRecordId: row.exerciseRecordId,
		date: row.date,
		maxWeight: row.maxWeight,
		sets
	};
}