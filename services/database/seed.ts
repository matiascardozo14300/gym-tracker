import type * as SQLite from 'expo-sqlite';
import { lista } from '../../components/common/allExercises';

/**
 * Seed inicial: inserta TODOS los ejercicios y sus vínculos con workout_types.
 * Idempotente: usa OR IGNORE y sólo linkea si falta. Corre en transacción.
 */
export async function seedInitialExercisesIfNeeded( db: SQLite.SQLiteDatabase ): Promise<void> {
	console.log("Creando los ejercicios...");

	// Si ya hay ejercicios -> no hace nada
	const row = await db.getFirstAsync<{ cnt: number }>( 'SELECT COUNT(*) AS cnt FROM exercises;' );
	if( ( row?.cnt ?? 0 ) > 0 ){
		console.log("Ejercicios ya creados previamente");
		return;
	}

	await db.runAsync( 'BEGIN' );
	try {
		// Mapeo de nombres de workout_type -> id
		const typeRows = await db.getAllAsync<{ id: number; name: string }>(
			`SELECT id, name FROM workout_types;`
		);
		const typeMap: Record<string, number> = {};
		for( const r of typeRows ) typeMap[r.name] = r.id;

		// Inserto ejercicios (OR IFNORE para idempotencia), luego obtengo su id por code
		for( const ex of lista ) {
			await db.runAsync(
				`INSERT OR IGNORE INTO exercises (name, code, muscleGroup, favorite)
				VALUES (?, ?, ?, 0);`,
				ex.name, ex.code, ex.muscleGroup
			);

			const exRow = await db.getFirstAsync<{ id: number }>(
				`SELECT id FROM exercises WHERE code = ?;`,
				ex.code
			);
			if( !exRow ) continue; // Debería existir siempre, pero por las dudas

			// Vínculo con workout_types (OR IGNORE para evitar duplicados)
			for( const wtName of ex.workoutTypes ) {
				const wtId = typeMap[wtName];
				if( wtId != null ) {
					await db.runAsync(
						`INSERT OR IGNORE INTO workout_type_exercises (workoutTypeId, exerciseId)
						VALUES (?, ?);`,
						wtId, exRow.id
					);
				}
			}
		}

		await db.runAsync( 'COMMIT' );
		console.log("Ejercicios creados con éxito");
	} catch( e ) {
		await db.runAsync( 'ROLLBACK' );
		throw e;
	}
}