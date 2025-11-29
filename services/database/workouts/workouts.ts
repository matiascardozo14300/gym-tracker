import { SQLiteRunResult } from 'expo-sqlite';
import { getDB } from '../db';
import { type Workout, type LastWorkout, type NewWorkout, type WorkoutDetail, type WorkoutType, type CreateWorkoutTypeResult, type UpdateResult, type ArchiveResult, EditableWorkout, EditableSet, AddableExercise, EditableExercise } from './types';
import { ARCHIVE_TAG, formatDeletedWorkoutName } from '../../../utils/deleteName';

// Crea un nuevo entrenamiento
export async function insertNewWorkout( workout: NewWorkout ): Promise<number> {
	const result = await getDB().runAsync(
		`INSERT INTO workouts (startDate, finishDate, workoutTypeId) VALUES (?, ?, ?);`,
		workout.startDate,
		workout.finishDate,
		workout.workoutTypeId
	);
	return result.lastInsertRowId!;
}

// Obtiene un listado de todos los entrenamientos
export async function getAllWorkouts(): Promise<Workout[]> {
	const rows = await getDB().getAllAsync<{
		id: number;
		startDate: string;
		finishDate: string;
		workoutTypeName: string;
	}>(`
		SELECT
			w.id,
			w.startDate,
			w.finishDate,
			wt.name AS workoutTypeName
		FROM workouts w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		ORDER BY w.startDate DESC;
    `);

	return rows.map(r => ({
		id: r.id,
		startDate: r.startDate,
		finishDate: r.finishDate,
		workoutType: r.workoutTypeName
	}));
}

// Actualiza la fecha de finalización de un entrenamiento al terminarlo
export async function updateWorkoutFinishDate( workoutId: number, finishDate: string ): Promise<SQLiteRunResult> {
	return getDB().runAsync(
		`UPDATE workouts SET finishDate = ? WHERE id = ?;`,
		finishDate,
		workoutId
	);
}

// Obtiene los últimos 3 entrenamientos
export async function getLast3Workouts(): Promise<LastWorkout[]> {
	const rows = await getDB().getAllAsync<{
		startDate: string;
		finishDate: string;
		workoutType: string | null;
    	isArchived: number | null;
	}>(
		`SELECT
			w.startDate,
			w.finishDate,
			wt.name AS workoutType,
			wt.isArchived AS isArchived
		FROM workouts w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		ORDER BY w.startDate DESC
		LIMIT 3;`
	);

	// Mappear a formato con duración
	return rows.map(({ startDate, finishDate, workoutType, isArchived }) => {
		const start = new Date( startDate );
		const end = new Date( finishDate );
		const diffMs = end.getTime() - start.getTime();
		const diffMin = Math.round(diffMs / 60000);
		const hours = Math.floor(diffMin / 60);
		const minutes = diffMin % 60;
		const duration = `${hours}h ${minutes}m`;

		return {
			startDate,
			workoutType: formatDeletedWorkoutName( workoutType, isArchived ),
			duration
		};
	});
}

// Obtiene un listado de fechas y tipos de entrenamientos para un mes específico
export async function getWorkoutDatesForMonth(
	year: number,
	month: number
  ): Promise<{ date: string; workoutType: string; color: string | null; }[]> {
	const monthStr = String( month ).padStart(2, '0');
	const from = `${year}-${monthStr}-01`;
	const nextMonth = month === 12 ? 1 : month + 1;
	const nextYear = month === 12 ? year + 1 : year;
	const nextMonthStr = String( nextMonth ).padStart(2, '0');
	const to = `${nextYear}-${nextMonthStr}-01`;

	const rows = await getDB().getAllAsync<{
		date: string;
		workoutType: string | null;
		color: string | null;
		isArchived: number | null;
	}>(
	`
		SELECT
			substr(w.startDate,1,10) AS date,
			wt.name AS workoutType,
			wt.color AS color,
			wt.isArchived AS isArchived
		FROM (
			SELECT startDate, workoutTypeId
			FROM workouts
			WHERE startDate >= ? AND startDate < ?
			ORDER BY startDate DESC
		) AS w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		GROUP BY date;
	`,
		from,
		to
	);

	return rows.map( r => ({
		date: r.date,
		workoutType: formatDeletedWorkoutName( r.workoutType, r.isArchived ),
		color: r.color
	}));
}

// Devuelve los datos completos de un workout por fecha
export async function getWorkoutDetailByDate( dateString: string ): Promise<WorkoutDetail | null> {
	const db = getDB();
	const workoutRow = await db.getFirstAsync<{ id: number; workoutType: string | null; isArchived: number | null; }>(
		`
		SELECT
			w.id,
			wt.name AS workoutType,
			wt.isArchived AS isArchived
		FROM workouts w
		LEFT JOIN workout_types wt
			ON w.workoutTypeId = wt.id
		WHERE date(w.startDate) = ?
		ORDER BY w.id DESC
		LIMIT 1;
		`,
		dateString
	);

	if( !workoutRow ) return null;
	const { id: workoutId, workoutType, isArchived } = workoutRow;

	// Recuperar todos los registros de sets junto con el nombre del ejercicio
	const rows = await db.getAllAsync<{ exerciseName: string; code: string; weight: number; reps: number; }>(
		`
		SELECT
			e.name AS exerciseName,
			e.code,
			s.weight,
			s.reps
		FROM exercise_records er
		JOIN exercises      e ON er.exerciseId = e.id
		JOIN sets           s ON s.exerciseRecordId = er.id
		WHERE er.workoutId = ?
		ORDER BY e.name, s.id;
		`,
		workoutId
	);

	const map: Record<
	string,
		{
			name: string;
			code: string;
			sets: { weight: number; reps: number }[];
		}
	> = {};

	for( const row of rows ) {
		if( !map[row.exerciseName] ) {
			map[row.exerciseName] = {
				name: row.exerciseName,
				code: row.code,
				sets: [],
			};
		}

		map[row.exerciseName].sets.push({
			weight: row.weight,
			reps: row.reps,
		});
	}

	const exercises = Object.values( map );

	return {
		workoutType: formatDeletedWorkoutName( workoutType, isArchived ),
		exercises,
	};
}

// Obtiene todos los tipos de entrenamiento existentes (activos por defecto)
export async function getWorkoutTypes( opts: { includeArchived?: boolean } = {} ): Promise<WorkoutType[]> {
	const { includeArchived = false } = opts;

	const where = includeArchived ? '' : 'WHERE isArchived = 0';

	const rows = await getDB().getAllAsync<WorkoutType>(
		`
		SELECT id, name, isCustom, color, isArchived, archivedAt, sortOrder
		FROM workout_types
		${where}
		ORDER BY sortOrder ASC, name COLLATE NOCASE;
		`
	);

	return rows;
}

export async function createWorkoutType( name: string, exerciseIds: number[] ): Promise<CreateWorkoutTypeResult> {
	const db = getDB();

	const cleaned = name.trim().replace(/\s+/g, ' ');
	if( !cleaned ) return { ok: false, code: 'DUPLICATE_NAME' };

	const existing = await db.getFirstAsync<{ id: number }>(
		`SELECT id FROM workout_types WHERE name = ? COLLATE NOCASE LIMIT 1;`,
    	cleaned
	);

	if( existing ) return { ok: false, code: 'DUPLICATE_NAME' };

	try {
		const result = await db.runAsync(
			`INSERT INTO workout_types (name, isCustom, sortOrder) VALUES (?, 1, (SELECT COALESCE(MAX(sortOrder), 0) + 1 FROM workout_types WHERE isArchived = 0));`,
			cleaned
		);
		const workoutTypeId = result.lastInsertRowId!;

		const stm = `
			INSERT INTO workout_type_exercises (workoutTypeId, exerciseId)
			VALUES (?, ?);
		`;
		for( const exId of exerciseIds ) {
			await db.runAsync( stm, workoutTypeId, exId );
		}

		return { ok: true, id: workoutTypeId };
	} catch( err ) {
		const msg = String(err);
    	if (msg.includes('UNIQUE') || msg.includes('constraint')) {
      		return { ok: false, code: 'DUPLICATE_NAME' };
    	}

		throw err;
	}
}

export async function updateWorkoutTypeColor( workoutTypeId: number, color: string ): Promise<void> {
	await getDB().runAsync(
		`UPDATE workout_types SET color = ? WHERE id = ?;`,
		color,
		workoutTypeId
	);
}

export async function updateWorkoutTypeAndExercises( workoutTypeId: number, newName: string, exerciseIds: number[] ): Promise<UpdateResult> {
	const db = getDB();

	const cleaned = newName.trim().replace(/\s+/g, ' ');
  	if (!cleaned) return { ok: false, code: 'DUPLICATE_NAME' };

	const current = await db.getFirstAsync<{ name: string }>(
		`SELECT name FROM workout_types WHERE id = ?;`,
		workoutTypeId
	);
	if (!current) return { ok: false, code: 'NOT_FOUND' };

	const sameName = current.name === cleaned;

	if( !sameName ) {
		const dup = await db.getFirstAsync<{ id: number }>(
			`SELECT id
			FROM workout_types
			WHERE name = ? COLLATE NOCASE AND id <> ?
			LIMIT 1;`,
			cleaned,
			workoutTypeId
		);

		if( dup ) return { ok: false, code: 'DUPLICATE_NAME' };
	}

	await db.runAsync('BEGIN');
	try {
		if( !sameName ) {
			await db.runAsync(
				`UPDATE workout_types
				SET name = ?
				WHERE id = ?;`,
				cleaned,
				workoutTypeId
			);
		}

		await db.runAsync( `DELETE FROM workout_type_exercises WHERE workoutTypeId = ?;`, workoutTypeId );

		const uniqueExerciseIds = [...new Set(exerciseIds)];

		for( const exId of uniqueExerciseIds ) {
			await db.runAsync(
				`INSERT OR IGNORE INTO workout_type_exercises (workoutTypeId, exerciseId)
				VALUES (?, ?);`,
				workoutTypeId, exId
			);
		}

		await db.runAsync( 'COMMIT' );
		return { ok: true }
	} catch( err: any ) {
		await db.runAsync( 'ROLLBACK' );
		const msg = String(err?.message ?? err);
		if( msg.includes('UNIQUE') || msg.includes('constraint') ) {
			return { ok: false, code: 'DUPLICATE_NAME' };
		}

		throw err;
	}
}

export async function getWorkoutTypeNameById(
  workoutTypeId: number
): Promise<string> {
  const db = getDB();

  const row = await db.getFirstAsync<{ name: string }>(
    `
    SELECT name
    FROM workout_types
    WHERE id = ?
    LIMIT 1;
    `,
    workoutTypeId
  );

  return row?.name ?? "";
}

export async function deleteWorkoutType( workoutTypeId: number ): Promise<ArchiveResult> {
	const db = getDB();

	const row = await db.getFirstAsync<{ name: string; isArchived: number }>(
		`SELECT name, isArchived FROM workout_types WHERE id = ? LIMIT 1;`,
		workoutTypeId
	);

	if( !row ) return { ok: false, code: 'NOT_FOUND' };
	if( ( row.isArchived ?? 0 ) === 1 ) return { ok: false, code: 'ALREADY_ARCHIVED' };

	const archivedAtIso = new Date().toISOString();
	const ts = archivedAtIso.slice(0, 19).replace('T', ' ');

	// Nombre nuevo: "<old> §ARCHIVED§ 2025-08-13 17:22:10 #<id>"
	const archivedName = `${row.name} ${ARCHIVE_TAG} ${ts} #${workoutTypeId}`;
	console.log("Rutina a eliminar: ", archivedName);
	const deleteColor = "#ccc";

	try {
		await db.runAsync(
			`
			UPDATE workout_types
			SET isArchived = 1, archivedAt = ?, name = ?, color = ?
			WHERE id = ?;`,
			archivedAtIso,
			archivedName,
			deleteColor,
			workoutTypeId
		);

		return { ok: true };
	} catch( error: any ) {
		console.error("Error al borrar la rutina: ", error);
		throw error;
	}

}

export async function reorderWorkoutTypes( orderedIds: number[] ): Promise<void> {
	const db = getDB();
	await db.runAsync('BEGIN');

	try {
		// i = 0..n-1 → sortOrder = i+1
		for( let i = 0; i < orderedIds.length; i++ ) {
			await db.runAsync(
				`UPDATE workout_types SET sortOrder = ? WHERE id = ?;`,
				i + 1,
				orderedIds[i]
			);
		}
		await db.runAsync('COMMIT');
	} catch( e ) {
		await db.runAsync('ROLLBACK');
		throw e;
	}
}

// Trae la información de un entrenamiento para ser editado
export async function fetchWorkoutForEdit(params: { workoutId?: number; date?: string | null }): Promise<EditableWorkout> {

	const db = getDB();

	let workoutId = params.workoutId ?? null;

	if( !workoutId && params.date ) {
		// Busco el workout cuyo startDate sea ese día
		const row = await db.getFirstAsync<{ id: number; workoutTypeId: number; workoutType: string; startDate: string }>(
			`
			SELECT w.id, w.workoutTypeId, wt.name AS workoutType, w.startDate
			FROM workouts w
			JOIN workout_types wt ON wt.id = w.workoutTypeId
			WHERE substr(w.startDate,1,10) = ?
			ORDER BY w.startDate DESC
			LIMIT 1;
			`,
			params.date
		);

		if( !row ) {
			return {
				id: -1,
				date: params.date!,
				workoutTypeId: -1,
				workoutType: '',
				exercises: [],
      		};
		}

		workoutId = row.id;
	}

	if( !workoutId ) {
		throw new Error('fetchWorkoutForEdit: se requiere workout id o date');
	}

	const header = await db.getFirstAsync<{ startDate: string; workoutTypeId: number; workoutType: string }>(
		`
		SELECT w.startDate, w.workoutTypeId, wt.name AS workoutType
		FROM workouts w
		JOIN workout_types wt ON wt.id = w.workoutTypeId
		WHERE w.id = ?;
		`,
		workoutId
	);
	if( !header ) {
		throw new Error('Workout no encontrado');
	}

	const date = header.startDate.slice(0, 10);

	const recs = await db.getAllAsync<{
		exerciseRecordId: number;
		exerciseId: number;
		name: string;
		code: string;
	}>(
		`
		SELECT er.id AS exerciseRecordId, e.id AS exerciseId, e.name, e.code
		FROM exercise_records er
		JOIN exercises e ON e.id = er.exerciseId
		WHERE er.workoutId = ?
		ORDER BY er.id;
		`,
		workoutId
	);

	const exercises: EditableExercise[] = [];
	if( recs.length ) {
		const ids = recs.map(r => r.exerciseRecordId);
		const placeholders = ids.map(() => '?').join(',');
		const setsRows = await db.getAllAsync<{
			exerciseRecordId: number;
			weight: number;
			reps: number;
		}>(
			`
			SELECT s.exerciseRecordId, s.weight, s.reps
			FROM sets s
			WHERE s.exerciseRecordId IN (${placeholders})
			ORDER BY s.id;
			`,
			...ids
		);

		for( const r of recs ) {
			const mySets = setsRows
				.filter(s => s.exerciseRecordId === r.exerciseRecordId)
				.map(s => ({ weight: s.weight, reps: s.reps }));

			exercises.push({
				exerciseRecordId: r.exerciseRecordId,
				exerciseId: r.exerciseId,
				name: r.name,
				code: r.code,
				sets: mySets,
			});
		}
	}
	return {
		id: workoutId,
		date,
		workoutTypeId: header.workoutTypeId,
		workoutType: header.workoutType,
		exercises,
	};
}

export async function updateExerciseSets(params: { workoutId: number; exerciseId: number; sets: EditableSet[] }): Promise<void> {
	const db = getDB();
	await db.runAsync('BEGIN');

	try {
		// Encontrar exercise_record
		const rec = await db.getFirstAsync<{ id: number }>(
			`SELECT id FROM exercise_records WHERE workoutId = ? AND exerciseId = ?;`,
			params.workoutId, params.exerciseId
		);
		if( !rec ) throw new Error('exercise_record no encontrado');

		await db.runAsync(`DELETE FROM sets WHERE exerciseRecordId = ?;`, rec.id);

		if( params.sets?.length ) {
			const stmt = `INSERT INTO sets (exerciseRecordId, weight, reps) VALUES (?, ?, ?);`;
			for( const s of params.sets ) {
				await db.runAsync(stmt, rec.id, s.weight, s.reps);
			}
		}

		await db.runAsync('COMMIT');
	} catch (e) {
		await db.runAsync('ROLLBACK');
		throw e;
	}
}

export async function deleteExerciseFromWorkout(params: { workoutId: number; exerciseId: number }): Promise<void> {
	const db = getDB();
	await db.runAsync('BEGIN');
	try {
		const rec = await db.getFirstAsync<{ id: number }>(
			`SELECT id FROM exercise_records WHERE workoutId = ? AND exerciseId = ?;`,
			params.workoutId, params.exerciseId
		);
		if( !rec ) {
			await db.runAsync('COMMIT'); // nada para borrar
			return;
		}
		await db.runAsync(`DELETE FROM sets WHERE exerciseRecordId = ?;`, rec.id);
		await db.runAsync(`DELETE FROM exercise_records WHERE id = ?;`, rec.id);
		await db.runAsync('COMMIT');
	} catch (e) {
		await db.runAsync('ROLLBACK');
		throw e;
	}
}

export async function fetchAddableExercisesForWorkout(params: { workoutTypeId: number; excludeIds: number[] }): Promise<AddableExercise[]> {
	const db = getDB();

	if( !params.excludeIds?.length ) {
		return db.getAllAsync<AddableExercise>(
			`
			SELECT e.id, e.name, e.code
			FROM exercises e
			JOIN workout_type_exercises wte ON wte.exerciseId = e.id
			WHERE wte.workoutTypeId = ?
			ORDER BY e.muscleGroup, e.name;
			`,
			params.workoutTypeId
		);
	}

	const placeholders = params.excludeIds.map(() => '?').join(',');
	return db.getAllAsync<AddableExercise>(
		`
		SELECT e.id, e.name, e.code
		FROM exercises e
		JOIN workout_type_exercises wte ON wte.exerciseId = e.id
		WHERE wte.workoutTypeId = ?
		AND e.id NOT IN (${placeholders})
		ORDER BY e.muscleGroup, e.name;
		`,
		params.workoutTypeId,
		...params.excludeIds
	);
}

export async function addExerciseToWorkout(params: { workoutId: number; exerciseId: number; sets: EditableSet[] }): Promise<void> {
	const db = getDB();
	await db.runAsync('BEGIN');
	try {
		// Evitar duplicado accidental del mismo exerciseId dentro del workout
		const exists = await db.getFirstAsync<{ id: number }>(
			`SELECT id FROM exercise_records WHERE workoutId = ? AND exerciseId = ?;`,
			params.workoutId, params.exerciseId
		);
		if(exists) throw new Error('El ejercicio ya existe en este entrenamiento');

		const ins = await db.runAsync(
			`INSERT INTO exercise_records (workoutId, exerciseId) VALUES (?, ?);`,
			params.workoutId, params.exerciseId
		);
		const exerciseRecordId = ins.lastInsertRowId!;

		if (params.sets?.length) {
			const stmt = `INSERT INTO sets (exerciseRecordId, weight, reps) VALUES (?, ?, ?);`;
			for (const s of params.sets) {
				await db.runAsync(stmt, exerciseRecordId, s.weight, s.reps);
			}
		}

		await db.runAsync('COMMIT');
	} catch (e) {
		await db.runAsync('ROLLBACK');
		throw e;
	}
}

// Devuelve el ID del workout si existe uno comenzado hoy (por fecha local YYYY-MM-DD)
export async function getWorkoutIdForDate( dateYYYYMMDD: string ): Promise<number | null> {
	const db = getDB();
	const row = await db.getFirstAsync<{id:number}>(
		`SELECT id
		FROM workouts
		WHERE substr(startDate,1,10) = ?
		ORDER BY startDate DESC
		LIMIT 1`,
		dateYYYYMMDD
	);
	return row?.id ?? null;
}