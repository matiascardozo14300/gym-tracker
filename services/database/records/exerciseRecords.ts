import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { NewExerciseRecord, NewSetRecord, WeightPoint } from './types';


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