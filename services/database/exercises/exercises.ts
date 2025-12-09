import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { Exercise, ExerciseInsert, ExerciseNotes } from './types';
import { lista } from '../../../components/common/allExercises';

/**
 * Recupera todos los ejercicios asociados a un workoutTypeId.
 * Además reconstruye su array de workoutTypes consultando la tabla intermedia.
 */
export async function getExerciseByWorkoutType( workoutTypeId: number ): Promise<Exercise[]> {

	const rows = await getDB().getAllAsync<{
		id: number;
		name: string;
		code: string;
		muscleGroup: string;
		favorite: number;
		workoutTypesCsv: string;
	}>(
		`
		SELECT e.id, e.name, e.code, e.muscleGroup,	e.favorite,	GROUP_CONCAT(wt.name) AS workoutTypesCsv
		FROM exercises e
		JOIN workout_type_exercises wte ON e.id = wte.exerciseId
		JOIN workout_types wt ON wte.workoutTypeId = wt.id
		WHERE wte.workoutTypeId = ?
		GROUP BY e.id
		`,
		workoutTypeId
	);

	return rows.map(r => ({
		id: r.id,
		name: r.name,
		code: r.code,
		muscleGroup: r.muscleGroup as any,
		// reconstruimos el array partiendo del CSV
		workoutTypes: r.workoutTypesCsv.split(','),
		favorite: r.favorite,
	}));
}

// Obtiene todos los ejercicios de la base de datos
export async function getAllExercises(): Promise<Exercise[]> {
	return await getDB().getAllAsync<Exercise>(`SELECT * FROM exercises;`);
}

/**
 * Elimina **todos** los registros de la tabla `exercises`.
 * @returns Resultado de la operación (SQLiteRunResult.changes = número de filas eliminadas).
 */
export async function deleteAllExercises(): Promise<SQLiteRunResult> {
	return getDB().runAsync(
		`DELETE FROM exercises;`
	);
}

// Marca o desmarca un ejercicio como favorito
export async function toggleExerciseFavorite( exerciseId: number, newFlag: 0 | 1 ): Promise<SQLiteRunResult> {
	const db = getDB();
	return db.runAsync(
		`UPDATE exercises
		SET favorite = ?
		WHERE id = ?;`,
		newFlag,
		exerciseId
	);
}

export async function runCustomQuery(): Promise<void> {
	const db = getDB();
	await db.execAsync(`
		ALTER TABLE workouts
		ADD COLUMN workoutTypeId INTEGER NULL
		REFERENCES workout_types(id);

		ALTER TABLE exercises
		ADD COLUMN code TEXT;

		ALTER TABLE exercises
		ADD COLUMN favorite INTEGER NOT NULL DEFAULT 0;

		UPDATE exercises
		SET code = 'ex_' || id;

		CREATE UNIQUE INDEX idx_exercises_code ON exercises(code);
	`);
}

export async function getExerciseNotes( exerciseId: number ): Promise<string> {
	const db = getDB();

	const row = await db.getFirstAsync<ExerciseNotes>(
		`
		SELECT id, exerciseId, note, lastUpdated
		FROM exercise_notes
		WHERE exerciseId = ?
		ORDER BY datetime(lastUpdated) DESC
		LIMIT 1;
		`,
		exerciseId
	);

	if (!row || row.note == null) {
		return "";
	}

	return row.note;
}

export async function saveExerciseNotes( exerciseId: number, note: string ): Promise<void> {
	const db = getDB();

	const timestamp = new Date().toISOString();

	const existing = await db.getFirstAsync<{ id: number }>(
		`
		SELECT id
		FROM exercise_notes
		WHERE exerciseId = ?
		LIMIT 1;
		`,
		exerciseId
	);

	if( existing ) {
		await db.runAsync(
			`
			UPDATE exercise_notes
			SET note = ?, lastUpdated = ?
			WHERE id = ?;
			`,
			note,
			timestamp,
			existing.id
		);
	} else {
		await db.runAsync(
			`
			INSERT INTO exercise_notes (exerciseId, note, lastUpdated)
			VALUES (?, ?, ?);
			`,
			exerciseId,
			note,
			timestamp
		);
	}
}