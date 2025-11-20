import { getDB } from '../db';

type VolumeRow = {
  totalVolume: number | null;
};

export type WeeklyVolumeResult = {
  totalVolumeKg: number;
  weekStart: string;      // yyyy-mm-dd
  weekEndExclusive: string; // yyyy-mm-dd (lunes siguiente)
};

function startOfWeekMonday(date: Date): Date {
	// Normalizamos a fecha sin horas
	const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const day = d.getDay(); // 0 = dom, 1 = lun, ..., 6 = sáb

	// Queremos que la semana empiece el lunes
	const diff = day === 0 ? -6 : 1 - day; // si es domingo (0), ir 6 días atrás
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function toDateKey(d: Date): string {
	// yyyy-mm-dd
	return d.toISOString().slice(0, 10);
}

/**
 * Devuelve el volumen total (kg) levantado en la semana actual.
 * Semana = [lunes de esta semana, lunes de la semana siguiente).
 */
export async function getCurrentWeekVolume(): Promise<WeeklyVolumeResult> {
	const db = getDB();

	const today = new Date();
	const weekStart = startOfWeekMonday(today);

	const nextWeekStart = new Date(weekStart);
	nextWeekStart.setDate(nextWeekStart.getDate() + 7);
	nextWeekStart.setHours(0, 0, 0, 0);

	const weekStartIso = weekStart.toISOString();
	const nextWeekStartIso = nextWeekStart.toISOString();

	// Hacemos toda la suma en SQL: SUM(weight * reps)
	const row = await db.getFirstAsync<VolumeRow>(
		`
		SELECT SUM(s.weight * s.reps) AS totalVolume
		FROM workouts w
		JOIN exercise_records er ON er.workoutId = w.id
		JOIN sets s ON s.exerciseRecordId = er.id
		WHERE w.startDate >= ?
			AND w.startDate < ?
		`,
		weekStartIso,
		nextWeekStartIso
	);

	const totalVolumeKg = row?.totalVolume ?? 0;

	return {
		totalVolumeKg,
		weekStart: toDateKey(weekStart),
		weekEndExclusive: toDateKey(nextWeekStart),
	};
}