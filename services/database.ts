import * as SQLite from 'expo-sqlite';
import type {
	SQLiteDatabase,
	SQLiteRunResult
  } from 'expo-sqlite';
import { Exercise, NewExerciseRecord, NewSetRecord, NewWorkout, Workout } from '../models/types';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing   from 'expo-sharing';

const DB_NAME = 'gymtracker.db';
let db: SQLiteDatabase;

export async function initDatabase(): Promise<SQLiteDatabase> {
	// 1. Abro (o creo) la base de datos de manera asíncrona
	db = await SQLite.openDatabaseAsync(DB_NAME);

	// 2. Creo todas las tablas en un solo batch
	await db.execAsync(`
		CREATE TABLE IF NOT EXISTS exercises (
			id INTEGER PRIMARY KEY NOT NULL,
			name TEXT NOT NULL,
			muscleGroup TEXT NOT NULL,
			workoutTypes TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS workouts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			startDate TEXT NOT NULL,
			finishDate TEXT NOT NULL,
			workoutType TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS exercise_records (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			workoutId INTEGER NOT NULL,
			exerciseId INTEGER NOT NULL,
			FOREIGN KEY(workoutId) REFERENCES workouts(id),
			FOREIGN KEY(exerciseId) REFERENCES exercises(id)
		);

		CREATE TABLE IF NOT EXISTS sets (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			exerciseRecordId INTEGER NOT NULL,
			weight REAL NOT NULL,
			reps INTEGER NOT NULL,
			FOREIGN KEY(exerciseRecordId) REFERENCES exercise_records(id)
		);
	`);

	console.log('Tablas inicializadas correctamente con execAsync');
	return db;
}

export function getDB(): SQLiteDatabase {
if (!db) {
throw new Error('La base no está inicializada. Llama primero a initDatabase()');
}
return db;
}

// Inserta un nuevo Entrenamiento
export async function insertNewWorkout( workout: NewWorkout ): Promise<number> {
	const db = getDB();
	const result = await db.runAsync(
		`INSERT INTO workouts (startDate, finishDate, workoutType)
		VALUES (?, ?, ?);`,
		workout.startDate,
		workout.finishDate,
		workout.workoutType
	);
	return result.lastInsertRowId!;
}

// Inserta un nuevo ExcerciseRecord
export async function insertExerciseRecord( record: NewExerciseRecord ): Promise<number> {
	const db = getDB();
	const result: SQLiteRunResult = await db.runAsync(
		`INSERT INTO exercise_records (workoutId, exerciseId)
		VALUES (?, ?);`,
		record.workoutId,
		record.exerciseId
	);
	return result.lastInsertRowId!;
}

// Inserta un nuevo SetRecord
export async function insertSetRecord( record: NewSetRecord ): Promise<number> {
	const db = getDB();
	const result: SQLiteRunResult = await db.runAsync(
		`INSERT INTO sets (exerciseRecordId, weight, reps)
		VALUES (?, ?, ?);`,
		record.exerciseRecordId,
		record.weight,
		record.reps
	);
	return result.lastInsertRowId!;
}

// Obtiene un listado de todos los Entrenamientos
export async function getAllWorkouts(): Promise<Workout[]> {
	return getDB().getAllAsync<Workout>(`SELECT * FROM workouts;`);
}

/**
 * Recupera todos los ejercicios cuyo CSV workoutTypes contenga workoutType.
 * Reconstruye el array con split(',').
 */
export async function getExerciseByWorkoutType( workoutType: string ): Promise<Exercise[]> {
	const db = getDB();
	const rows = await db.getAllAsync<{ id: number; name: string; muscleGroup: string; workoutTypes: string; }>(
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

// Actualiza la fecha de finalización de un Entrenamiento
export async function updateWorkoutFinishDate( workoutId: number, finishDate: string ): Promise<SQLiteRunResult> {
	const db = getDB();
	return db.runAsync(
		`UPDATE workouts
		SET finishDate = ?
		WHERE id = ?;`,
		finishDate,
		workoutId
	);
}

export async function getLast3Workouts(): Promise<{
	startDate: string;
	workoutType: string;
	duration: string;
}[]> {
	const db = getDB();
	const rows = await db.getAllAsync<{
		startDate: string;
		finishDate: string;
		workoutType: string;
	}>(
		`SELECT startDate, finishDate, workoutType
		FROM workouts
		ORDER BY startDate DESC
		LIMIT 3;`
	);

	// Mappear a formato con duración
	return rows.map(({ startDate, finishDate, workoutType }) => {
		const start = new Date(startDate);
		const end = new Date(finishDate);
		const diffMs = end.getTime() - start.getTime();
		const diffMin = Math.round(diffMs / 60000);
		const hours = Math.floor(diffMin / 60);
		const minutes = diffMin % 60;
		const duration = `${hours}h ${minutes}m`;

		return { startDate, workoutType, duration };
	  });
}

/* export async function updateExercise(): Promise<SQLiteRunResult> {
	const db = getDB();
	return db.runAsync(
		`DELETE FROM exercises
		WHERE id = ?;`,
		33
	);
} */

/**
 * Inserta o reemplaza un lote de ejercicios.
 * Convierte el array workoutTypes a CSV antes de guardarlo.
 */
export async function insertExerciseBatch( exercises: Exercise[] ): Promise<SQLiteRunResult[]> {
	const db = getDB();

	const stm = `
		INSERT OR REPLACE INTO exercises
		(id, name, muscleGroup, workoutTypes)
		VALUES (?, ?, ?, ?);
	`;
	return Promise.all(
		exercises.map( ex =>
			db.runAsync(
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
	const db = getDB();
	return await db.getAllAsync<Exercise>(`SELECT * FROM exercises;`);
}

/**
 * Elimina **todos** los registros de la tabla `exercises`.
 * @returns Resultado de la operación (SQLiteRunResult.changes = número de filas eliminadas).
 */
export async function deleteAllExercises(): Promise<SQLiteRunResult> {
	const db = getDB();
	return db.runAsync(
		`DELETE FROM exercises;`
	);
}

/**
 * Devuelve un listado de fechas y tipos de workout para un mes dado
 */
export async function getWorkoutDatesForMonth(
	year: number,
	month: number
  ): Promise<{ date: string; workoutType: string }[]> {
	const db = getDB();

	const monthStr = String(month).padStart(2, '0');
	const from = `${year}-${monthStr}-01`;
	const nextMonth = month === 12 ? 1 : month + 1;
	const nextYear = month === 12 ? year + 1 : year;
	const nextMonthStr = String(nextMonth).padStart(2, '0');
	const to = `${nextYear}-${nextMonthStr}-01`;

	// 1) Subconsulta ordenada DESC para que al agrupar por fecha nos quedemos con el más reciente
	const rows = await db.getAllAsync<{
	  startDate: string;
	  workoutType: string;
	  date: string;
	}>(
	  `
	  SELECT
		substr(startDate,1,10) as date,
		workoutType
	  FROM (
		SELECT startDate, workoutType
		FROM workouts
		WHERE startDate >= ? AND startDate < ?
		ORDER BY startDate DESC  -- más recientes primero
	  )
	  GROUP BY date;             -- toma el primero (el más reciente) de cada grupo
	  `,
	  from,
	  to
	);

	// 2) Retornamos directamente date + workoutType
	return rows.map(r => ({
	  date: r.date,
	  workoutType: r.workoutType
	}));
  }

export async function exportDatabaseAsJson() {
	const db = getDB();

	// 1) Leer todas las tablas
	const workouts = await db.getAllAsync( 'SELECT * FROM workouts;' );
	const exercises = await db.getAllAsync( 'SELECT * FROM exercises;' );
	const exerciseRecords = await db.getAllAsync( 'SELECT * FROM exercise_records;' );
	const sets = await db.getAllAsync( 'SELECT * FROM sets;' );

	// 2) Serializar a JSON
	const payload = { workouts, exercises, exerciseRecords, sets };
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

	const { workouts, exercises, exerciseRecords, sets } = payload;
	if( !Array.isArray(workouts) || !Array.isArray(exercises) || !Array.isArray(exerciseRecords) || !Array.isArray(sets)) {
		throw new Error('Formato de backup incorrecto: faltan tablas o no son arrays.');
	}

  	const db = getDB();

	try {
		await db.execAsync(`
			DELETE FROM sets;
			DELETE FROM exercise_records;
			DELETE FROM exercises;
			DELETE FROM workouts;
		`);

		// 5) Insertar filas validadas
		for(const w of workouts) {
			if (
				typeof w.id !== 'number' ||
				typeof w.startDate !== 'string' ||
				typeof w.finishDate !== 'string' ||
				typeof w.workoutType !== 'string'
			) {
				throw new Error('Registro inválido en workouts.');
			}
			await db.runAsync(
				`INSERT INTO workouts (id, startDate, finishDate, workoutType)
				VALUES (?, ?, ?, ?);`,
				w.id,
				w.startDate,
				w.finishDate,
				w.workoutType
			);
		}

		for (const ex of exercises) {
			if (
				typeof ex.id !== 'number' ||
				typeof ex.name !== 'string' ||
				typeof ex.muscleGroup !== 'string' ||
				typeof ex.workoutTypes !== 'string'
			) {
				throw new Error('Registro inválido en exercises.');
			}
			await db.runAsync(
				`INSERT INTO exercises (id, name, muscleGroup, workoutTypes)
				VALUES (?, ?, ?, ?);`,
				ex.id,
				ex.name,
				ex.muscleGroup,
				ex.workoutTypes
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
		throw new Error(`Importación fallida: ${err}`);
	}
}