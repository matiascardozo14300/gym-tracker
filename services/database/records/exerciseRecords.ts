import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { NewExerciseRecord, NewSetRecord } from './types';


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