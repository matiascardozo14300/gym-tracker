import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing   from 'expo-sharing';
import { migrations } from './migrations';
import { getLocalISOString } from '../../components/common/helper';
import { seedInitialExercisesIfNeeded } from '../database/seed';

const DB_NAME = 'rackit.db';
let db: SQLite.SQLiteDatabase;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
	db = await SQLite.openDatabaseAsync( DB_NAME );

	// 1. Creo la tabla que lleva el registro de migraciones
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			id INTEGER PRIMARY KEY,
			applied_at TEXT NOT NULL
		);
	`);

	// 2. Leo las migraciones ya aplicadas
	const appliedRows: { id: number }[] = await db.getAllAsync( 'SELECT id FROM schema_migrations;' );
	const appliedIds = appliedRows.map( r => r.id );

	// 3. Ejecuto sólo las que faltan
	for( const migration of migrations ) {
		if( !appliedIds.includes( migration.id ) ) {
			console.log( "Aplicando migración id: ", migration.id );
			await db.execAsync( migration.up );

			// Luego de la migración 1 -> seed ejercicios
			if( migration.id === 1 ) {
				// Si en el futuro quiero agregar nuevos ejercicios, deben estar en otro seed, ya que este
				// no se vuelve a ejecutar
				await seedInitialExercisesIfNeeded( db );
			}

			const appliedAt = getLocalISOString();
			await db.runAsync(
				'INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?);',
				migration.id,
				appliedAt
			);
		}
	}

	console.log('Database ready with all migrations applied.');
	return db;
}

export function getDB(): SQLite.SQLiteDatabase {
	if( !db ) {
		throw new Error('La base no está inicializada. Llama primero a initDatabase()');
	}
	return db;
}

// Exporta la base de datos a un JSON
export async function exportDatabaseAsJson() {
	const db = getDB();

	// 1) Leer todas las tablas
	const workouts = await db.getAllAsync( 'SELECT * FROM workouts;' );
	const exercises = await db.getAllAsync( 'SELECT * FROM exercises;' );
	const exerciseRecords = await db.getAllAsync( 'SELECT * FROM exercise_records;' );
	const sets = await db.getAllAsync( 'SELECT * FROM sets;' );
	const workout_types = await db.getAllAsync( 'SELECT * FROM workout_types;' );
	const workout_type_exercises = await db.getAllAsync( 'SELECT * FROM workout_type_exercises;' );

	// 2) Serializar a JSON
	const payload = { workouts, exercises, exerciseRecords, sets, workout_types, workout_type_exercises };
	const json = JSON.stringify( payload, null, 2 );

	// 3) Escribir en un fichero temporal
	const fileName = `gym-tracker-backup-${Date.now()}.json`;
	const fileUri  = FileSystem.cacheDirectory + fileName;
	await FileSystem.writeAsStringAsync( fileUri, json, {
		encoding: FileSystem.EncodingType.UTF8
	});

	// 4) Compartir usando el diálogo nativo
	if( await Sharing.isAvailableAsync() ) {
		await Sharing.shareAsync( fileUri, {
			mimeType: 'application/json',
			dialogTitle: 'Compartir backup de Gym Tracker'
		});
	} else {
		throw new Error('El módulo de sharing no está disponible en este dispositivo');
	}
}

// Importar base de datos desde un JSON
export async function importDatabaseFromJson() {
	const res = await DocumentPicker.getDocumentAsync({
		type: 'application/json',
		multiple: false
	});

	if( res.canceled || res.assets.length === 0 ) {
		throw new Error('No se seleccionó ningún archivo');
	}

	const { uri } = res.assets[0];

	let payload: any;
	try {
		const content = await FileSystem.readAsStringAsync( uri, { encoding: FileSystem.EncodingType.UTF8 } );
		payload = JSON.parse(content);
	} catch( err ) {
		throw new Error('El archivo seleccionado no es un JSON válido.');
	}

	const { workouts, exercises, exerciseRecords, sets, workout_types, workout_type_exercises } = payload;
	if( !Array.isArray(workouts) || !Array.isArray(exercises) || !Array.isArray(exerciseRecords) || !Array.isArray(sets) || !Array.isArray(workout_types) || !Array.isArray(workout_type_exercises)) {
		throw new Error('Formato de backup incorrecto: faltan tablas o no son arrays.');
	}

  	const db = getDB();

	try {
		await db.execAsync(`
			DROP TABLE IF EXISTS workout_type_exercises;
			DROP TABLE IF EXISTS sets;
			DROP TABLE IF EXISTS exercise_records;
			DROP TABLE IF EXISTS exercises;
			DROP TABLE IF EXISTS workouts;
			DROP TABLE IF EXISTS workout_types;
		`);

		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS workout_types (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			isCustom INTEGER NOT NULL DEFAULT 0
			);

			CREATE TABLE IF NOT EXISTS exercises (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				code TEXT NOT NULL UNIQUE,
				muscleGroup TEXT NOT NULL,
				favorite INTEGER NOT NULL DEFAULT 0
			);

			CREATE TABLE IF NOT EXISTS workout_type_exercises (
				workoutTypeId INTEGER NOT NULL,
				exerciseId INTEGER NOT NULL,
				PRIMARY KEY (workoutTypeId, exerciseId),
				FOREIGN KEY (workoutTypeId) REFERENCES workout_types(id),
				FOREIGN KEY (exerciseId) REFERENCES exercises(id)
			);

			CREATE TABLE IF NOT EXISTS workouts (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				startDate TEXT NOT NULL,
				finishDate TEXT NOT NULL,
				workoutTypeId INTEGER NOT NULL,
				FOREIGN KEY (workoutTypeId) REFERENCES workout_types(id)
			);

			CREATE TABLE IF NOT EXISTS exercise_records (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				workoutId INTEGER NOT NULL,
				exerciseId INTEGER NOT NULL,
				FOREIGN KEY (workoutId) REFERENCES workouts(id),
				FOREIGN KEY (exerciseId) REFERENCES exercises(id)
			);

			CREATE TABLE IF NOT EXISTS sets (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				exerciseRecordId INTEGER NOT NULL,
				weight REAL NOT NULL,
				reps INTEGER NOT NULL,
				FOREIGN KEY (exerciseRecordId) REFERENCES exercise_records(id)
			);
		`);

		// 5) Insertar filas validadas
		for( const wt of workout_types ) {
			if (
				typeof wt.id !== 'number' ||
				typeof wt.name !== 'string' ||
				typeof wt.isCustom !== 'number'
			) {
				throw new Error('Registro inválido en workout_types.');
			}
			await db.runAsync(
				`INSERT INTO workout_types (id, name, isCustom)
				VALUES (?, ?, ?);`,
				wt.id,
				wt.name,
				wt.isCustom
			);
		}

		for (const ex of exercises) {
			if (
				typeof ex.id !== 'number' ||
				typeof ex.name !== 'string' ||
				typeof ex.code !== 'string' ||
				typeof ex.muscleGroup !== 'string' ||
				typeof ex.favorite !== 'number'
			) {
				throw new Error('Registro inválido en exercises.');
			}
			await db.runAsync(
				`INSERT INTO exercises (id, name, code, muscleGroup, favorite)
				VALUES (?, ?, ?, ?, ?);`,
				ex.id,
				ex.name,
				ex.code,
				ex.muscleGroup,
				ex.favorite
			);
		}

		for( const wte of workout_type_exercises ) {
			if (
				typeof wte.workoutTypeId !== 'number' ||
				typeof wte.exerciseId !== 'number'
			) {
				throw new Error('Registro inválido en workout_types.');
			}
			await db.runAsync(
				`INSERT INTO workout_type_exercises (workoutTypeId, exerciseId)
				VALUES (?, ?);`,
				wte.workoutTypeId,
				wte.exerciseId
			);
		}

		for( const w of workouts ) {
			if (
				typeof w.id !== 'number' ||
				typeof w.startDate !== 'string' ||
				typeof w.finishDate !== 'string' ||
				typeof w.workoutTypeId !== 'number'
			) {
				throw new Error('Registro inválido en workouts.');
			}
			await db.runAsync(
				`INSERT INTO workouts (id, startDate, finishDate, workoutTypeId)
				VALUES (?, ?, ?, ?);`,
				w.id,
				w.startDate,
				w.finishDate,
				w.workoutTypeId
			);
		}

		for (const er of exerciseRecords) {
			if (
				typeof er.id !== 'number' ||
				typeof er.workoutId !== 'number' ||
				typeof er.exerciseId !== 'number'
			) {
				throw new Error('Registro inválido en exercise_records.');
			}
			await db.runAsync(
				`INSERT INTO exercise_records (id, workoutId, exerciseId)
				VALUES (?, ?, ?);`,
				er.id,
				er.workoutId,
				er.exerciseId
			);
		}

		for (const s of sets) {
			if (
				typeof s.id !== 'number' ||
				typeof s.exerciseRecordId !== 'number' ||
				typeof s.weight !== 'number' ||
				typeof s.reps !== 'number'
			) {
				throw new Error('Registro inválido en sets.');
			}
			await db.runAsync(
				`INSERT INTO sets (id, exerciseRecordId, weight, reps)
				VALUES (?, ?, ?, ?);`,
				s.id,
				s.exerciseRecordId,
				s.weight,
				s.reps
			);
		}
	} catch (err) {
		// Re-lanzar para informar error sin dejar BD en estado parcial
		const errMsg = err instanceof Error ? err.message : String( err );
		console.error( '[importDatabaseFromJson] Error completo:', err );
		throw new Error(`Importación fallida: ${errMsg}`);
	}
}