import type * as SQLite from 'expo-sqlite';
import { lista } from '../../components/common/allExercises';

/**
 * Seed inicial: inserta TODOS los ejercicios y sus vínculos con workout_types.
 * Idempotente: usa OR IGNORE y sólo linkea si falta. Corre en transacción.
 */
export async function seedInitialExercisesIfNeeded( db: SQLite.SQLiteDatabase ): Promise<void> {
	console.log("Creando ejercicios...");

	await db.runAsync( 'BEGIN' );
	try {
		// Recorro la lista completa de ejercicios
		for( const ex of lista ) {
			// a) Inserto si no existe (no rompe nada si ya estaba)
			await db.runAsync(
				`INSERT OR IGNORE INTO exercises (name, code, muscleGroup, favorite, equipment)
				VALUES (?, ?, ?, 0, ?);`,
				ex.name, ex.code, ex.muscleGroup, ex.equipment
			);
		}

		await db.runAsync( 'COMMIT' );
		console.log("Ejercicios creados correctamente");
	} catch( e ) {
		await db.runAsync( 'ROLLBACK' );
		throw e;
	}
}