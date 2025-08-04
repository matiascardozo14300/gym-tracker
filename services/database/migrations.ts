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

			INSERT OR IGNORE INTO workout_types (name, isCustom)
			VALUES
				('Pull', 0),
				('Push', 0),
				('Legs', 0),
				('FullBody', 0);
		`
	},
	{
		id: 2,
		up: `
			CREATE TABLE IF NOT EXISTS exercise_notes (
				id           INTEGER PRIMARY KEY AUTOINCREMENT,
				exerciseId   INTEGER NOT NULL,
				note         TEXT,
				lastUpdated  TEXT,
				FOREIGN KEY (exerciseId) REFERENCES exercises(id)
			);

			INSERT INTO exercise_notes (exerciseId, note, lastUpdated)
				SELECT id, NULL, NULL
				FROM exercises;
    	`
	},
];