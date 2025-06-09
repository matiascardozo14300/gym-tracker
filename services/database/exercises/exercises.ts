import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { Exercise, ExerciseInsert } from './types';

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

/**
 * Inserta o reemplaza un lote de ejercicios.
 * Convierte el array workoutTypes a CSV antes de guardarlo.
 */
export async function insertExerciseBatch( exercises: ExerciseInsert[] ): Promise<SQLiteRunResult[]> {
	const db = getDB();
	const results: SQLiteRunResult[] = [];

	const typeRows = await db.getAllAsync<{ id: number; name: string }>(
		`SELECT id, name FROM workout_types;`
	);
	const typeMap: Record<string, number> = {};
		typeRows.forEach( r => {
		typeMap[r.name] = r.id;
	});

	for( const ex of exercises ) {
		const insertRes = await db.runAsync(
			`
			INSERT INTO exercises (name, code, muscleGroup, favorite)
			VALUES (?, ?, ?, 0);
			`,
			ex.name,
			ex.code,
			ex.muscleGroup
		);
		results.push( insertRes );

		const exerciseId = insertRes.lastInsertRowId;

		for( const wtName of ex.workoutTypes ) {
			const wtId = typeMap[wtName];
			if( wtId != null ) {
				await db.runAsync(
					`
					INSERT INTO workout_type_exercises (workoutTypeId, exerciseId)
					VALUES (?, ?);
					`,
					wtId,
					exerciseId
				);
			}
		}
	}

	return results;
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