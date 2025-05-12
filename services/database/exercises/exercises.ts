import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { Exercise } from './types';

/**
 * Recupera todos los ejercicios cuyo CSV workoutTypes contenga workoutType.
 * Reconstruye el array con split(',').
 */
export async function getExerciseByWorkoutType( workoutType: string ): Promise<Exercise[]> {
	const rows = await getDB().getAllAsync<{ id: number; name: string; muscleGroup: string; workoutTypes: string; }>(
		`SELECT id, name, muscleGroup, workoutTypes
		FROM exercises
		WHERE workoutTypes LIKE ?;`,
		[`%${workoutType}%`]
	);

	return rows.map( r => ({
		id: r.id,
		name: r.name,
		muscleGroup: r.muscleGroup as any,
		workoutTypes: r.workoutTypes.split( ',' )
	}));
}

/**
 * Inserta o reemplaza un lote de ejercicios.
 * Convierte el array workoutTypes a CSV antes de guardarlo.
 */
export async function insertExerciseBatch( exercises: Exercise[] ): Promise<SQLiteRunResult[]> {
	const stm = `
		INSERT OR REPLACE INTO exercises
		(id, name, muscleGroup, workoutTypes)
		VALUES (?, ?, ?, ?);
	`;
	return Promise.all(
		exercises.map( ex =>
			getDB().runAsync(
				stm,
				ex.id,
				ex.name,
				ex.muscleGroup,
				ex.workoutTypes.join(',')
			)
		)
	);
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