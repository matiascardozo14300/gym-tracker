import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing   from 'expo-sharing';

const DB_NAME = 'gymtracker.db';
let db: SQLite.SQLiteDatabase;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
	// 1. Abro (o creo) la base de datos de manera asíncrona
	db = await SQLite.openDatabaseAsync(DB_NAME);

	// 2. Creo todas las tablas en un solo batch si no existen
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
		for( const w of workouts ) {
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