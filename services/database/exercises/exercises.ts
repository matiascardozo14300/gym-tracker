import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { Exercise, ExerciseInsert } from './types';

/**
 * Recupera todos los ejercicios cuyo CSV workoutTypes contenga workoutType.
 * Reconstruye el array con split(',').
 */
export async function getExerciseByWorkoutType( workoutType: string ): Promise<Exercise[]> {
	const rows = await getDB().getAllAsync<{ id: number; name: string; code: string; muscleGroup: string; workoutTypes: string; favorite: number; }>(
		`SELECT id, name, code, muscleGroup, workoutTypes, favorite
		FROM exercises
		WHERE workoutTypes LIKE ?;`,
		[`%${workoutType}%`]
	);

	return rows.map( r => ({
		id: r.id,
		name: r.name,
		code: r.code,
		muscleGroup: r.muscleGroup as any,
		workoutTypes: r.workoutTypes.split( ',' ),
		favorite: r.favorite
	}));
}

/**
 * Inserta o reemplaza un lote de ejercicios.
 * Convierte el array workoutTypes a CSV antes de guardarlo.
 */
export async function insertExerciseBatch( exercises: ExerciseInsert[] ): Promise<SQLiteRunResult[]> {
	const db = getDB();
	const favoriteDefault = 0;
	const stm = `
		INSERT INTO exercises
		(name, code, muscleGroup, workoutTypes, favorite)
		VALUES (?, ?, ?, ?, ?);
	`;

	const results: SQLiteRunResult[] = [];

	// Hacemos cada runAsync uno por uno, usando `for ... of` y `await`,
	// para que SQLite asigne los IDs en el orden exacto de nuestro array.
	for (const ex of exercises) {
		const r = await db.runAsync(
			stm,
			ex.name,
			ex.code,
			ex.muscleGroup,
			ex.workoutTypes.join(','),
			favoriteDefault
		);
		results.push(r);
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
		ALTER TABLE exercises
		ADD COLUMN code TEXT NOT NULL;
		ALTER TABLE exercises
		ADD COLUMN favorite INTEGER NOT NULL;
	`);
}