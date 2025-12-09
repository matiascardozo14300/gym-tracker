export interface Migration {
	id: number;
	up: string;
}

export const migrations: Migration[] = [
	{
		id: 1,
		up: `
			CREATE TABLE IF NOT EXISTS workout_types (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL UNIQUE,
				isCustom INTEGER NOT NULL DEFAULT 0,
				color TEXT,
				isArchived INTEGER NOT NULL DEFAULT 0,
				archivedAt TEXT,
				sortOrder INTEGER NOT NULL DEFAULT 0
			);

			CREATE INDEX IF NOT EXISTS idx_workout_types_isArchived_sortOrder ON workout_types(isArchived, sortOrder);

			CREATE TABLE IF NOT EXISTS exercises (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				code TEXT NOT NULL UNIQUE,
				muscleGroup TEXT NOT NULL,
				favorite INTEGER NOT NULL DEFAULT 0,
				equipment TEXT
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

			CREATE TABLE IF NOT EXISTS exercise_notes (
				id           INTEGER PRIMARY KEY AUTOINCREMENT,
				exerciseId   INTEGER NOT NULL,
				note         TEXT,
				lastUpdated  TEXT,
				FOREIGN KEY (exerciseId) REFERENCES exercises(id)
			);

			CREATE TABLE IF NOT EXISTS user_profile (
				id INTEGER PRIMARY KEY DEFAULT 1,
				nombre TEXT,
				objetivo_semanal INTEGER,
				recordatorios_activos INTEGER NOT NULL DEFAULT 0,
				peso_kg REAL,
				edad INTEGER,
				altura_m REAL,
				genero TEXT
			);

			CREATE TABLE IF NOT EXISTS settings (
				key TEXT PRIMARY KEY NOT NULL,
				value TEXT
			);
		`
	},
];