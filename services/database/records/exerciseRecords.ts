import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { ExerciseLastHistory, NewExerciseRecord, NewSetRecord, WeightPoint } from './types';


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

// Obtiene el histórico de pesos por fecha de un ejercicio determinado,
// de forma que:
//   • Si hay varios registros el mismo día, toma SOLO el último.
//   • Devuelve como máximo los últimos 10 días distintos.
export async function getExerciseRecords( exerciseId: number ): Promise<WeightPoint[]> {
	const db = getDB();
	const recs = await db.getAllAsync<{ recordId: number; date: string }>(
		`
		SELECT
			er.id AS recordId,
			w.startDate AS date
		FROM exercise_records er
		JOIN workouts w ON er.workoutId = w.id
		WHERE er.exerciseId = ?
		ORDER BY w.startDate ASC;
		`,
		exerciseId
  	);

	type DayRec = { recordId: number; dateKey: string };
	const distinct: DayRec[] = [];

	for( const { recordId, date } of recs ) {
		const dateKey = date.includes("T") ? date.split("T")[0] : date;
		const last = distinct[distinct.length - 1];

		if( last && last.dateKey === dateKey ) {
			// mismo día: sobrescribo el recordId con el más reciente
			last.recordId = recordId;
		} else {
			// día nuevo: lo añado
			distinct.push({ recordId, dateKey });
		}
	}

	const lastTen = distinct.slice( -10 );

	const result: WeightPoint[] = [];
	for( const { recordId, dateKey  } of lastTen ) {
		const setRows = await db.getAllAsync<{ weight: number; reps: number }>(
			`
			SELECT weight, reps
			FROM sets
			WHERE exerciseRecordId = ?
			ORDER BY id ASC;
			`,
			recordId
		);

		// Si no hay sets, lo ignoramos
		if( setRows.length === 0 ) continue;

		const weight = setRows[0].weight;
		const reps = setRows.map( (r) => r.reps );

		result.push({
			date: dateKey,
			weight,
			reps,
		});
	}

	return result;
}

// Obtiene el máximo de peso registrado para un ejercicio (junto con los sets)
export async function getExerciseLastHistory( exerciseId: number ): Promise<ExerciseLastHistory | null> {

	const db = getDB();

	const row = await db.getFirstAsync<{
		exerciseRecordId: number;
    	date: string;
	}>(
		`
			SELECT
				er.id AS exerciseRecordId,
				w.startDate AS date
			FROM exercise_records er
			JOIN workouts w
				ON er.workoutId = w.id
			WHERE er.exerciseId = ?
			ORDER BY w.startDate DESC
			LIMIT 1;
		`,
		exerciseId
	);

	if( !row ) return null;

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
		sets
	};
}