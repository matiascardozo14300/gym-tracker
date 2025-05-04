import * as SQLite from 'expo-sqlite';
import type {
	SQLiteDatabase,
	SQLiteRunResult
  } from 'expo-sqlite';
import { Workout } from '../models/types';

const DB_NAME = 'gymtracker.db';
let db: SQLiteDatabase;

export async function initDatabase(): Promise<SQLiteDatabase> {
	// 1. Abro (o creo) la base de datos de manera asíncrona
	db = await SQLite.openDatabaseAsync(DB_NAME);

	// 2. Creo todas las tablas en un solo batch
	await db.execAsync(`
	  CREATE TABLE IF NOT EXISTS workouts (
		id TEXT PRIMARY KEY NOT NULL,
		startDate TEXT NOT NULL,
		finishDate TEXT NOT NULL,
		workoutType TEXT NOT NULL,
		gymLocation TEXT NOT NULL
	  );

	  CREATE TABLE IF NOT EXISTS exercise_records (
		id TEXT PRIMARY KEY NOT NULL,
		workoutId TEXT NOT NULL,
		exerciseName TEXT NOT NULL,
		FOREIGN KEY (workoutId) REFERENCES workouts(id)
	  );

	  CREATE TABLE IF NOT EXISTS set_records (
		id TEXT PRIMARY KEY NOT NULL,
		exerciseId TEXT NOT NULL,
		weight REAL NOT NULL,
		reps INTEGER NOT NULL,
		FOREIGN KEY (exerciseId) REFERENCES exercise_records(id)
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

export async function insertWorkout(w: Workout): Promise<SQLiteRunResult> {
	return getDB().runAsync(
	  `INSERT INTO workouts
		 (id, startDate, finishDate, workoutType, gymLocation)
	   VALUES (?, ?, ?, ?, ?);`,
	  w.id,
	  w.startDate,
	  w.finishDate,
	  w.workoutType,
	  w.gymLocation
	);
  }

  export async function getAllWorkouts(): Promise<Workout[]> {
	return getDB().getAllAsync<Workout>(`SELECT * FROM workouts;`);
  }