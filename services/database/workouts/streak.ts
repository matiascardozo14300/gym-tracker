import { getDB } from '../db';
import { ActiveStreakResult, StreaksResult, UserProfileRow, WorkoutRow, CountRow, WeeklyGoalProgress } from './types';

function startOfWeekMonday( date: Date ): Date {
	// Clonamos solo fecha (sin horas)
	const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const day = d.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

	// Queremos que la semana empiece el lunes
	const diff = day === 0 ? -6 : 1 - day; // si es domingo (0), vamos 6 días atrás
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function toDateOnlyKey(d: Date): string {
	// yyyy-mm-dd
	return d.toISOString().slice(0, 10);
}

export async function getActiveStreak(): Promise<ActiveStreakResult> {
	const db = getDB();

	// 1) Leer objetivo semanal del user_profile
	const profile = await db.getFirstAsync<UserProfileRow>(
		`SELECT objetivo_semanal
		FROM user_profile
		WHERE id = 1`
	);

	const weeklyGoal = profile?.objetivo_semanal ?? 3;

	// 2) Leer todos los workouts
	const workouts = await db.getAllAsync<WorkoutRow>(
		`SELECT startDate
		FROM workouts
		ORDER BY startDate DESC`
	);

	if (!workouts.length) {
		return { streak: 0, weeklyGoal };
	}

	// 3) Agrupar por semana (lunes–domingo), usando la fecha de inicio del workout
	const weekCounts = new Map<string, number>(); // key = 'yyyy-mm-dd' del lunes, value = cantidad de workouts

	for (const w of workouts) {
		const date = new Date(w.startDate);
		if (isNaN(date.getTime())) continue; // por si hay datos corruptos

		const weekStart = startOfWeekMonday(date);
		const key = toDateOnlyKey(weekStart);

		weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1);
	}

	const today = new Date();
	const currentWeekStart = startOfWeekMonday(today);

	// 4) La "última semana completa" es la semana anterior al lunes de esta semana
	const lastCompletedWeekStart = new Date(currentWeekStart);
	lastCompletedWeekStart.setDate(lastCompletedWeekStart.getDate() - 7);
	lastCompletedWeekStart.setHours(0, 0, 0, 0);

	let streak = 0;
	const seenWeeks: string[] = [];

	// 5) Vamos retrocediendo semana por semana mientras se cumpla el objetivo
	let cursor = new Date(lastCompletedWeekStart);

	while (true) {
		const key = toDateOnlyKey(cursor);
		seenWeeks.push(key);

		const count = weekCounts.get(key) ?? 0;

		if (count >= weeklyGoal) {
			streak += 1;
			// Retrocedemos una semana
			cursor.setDate(cursor.getDate() - 7);
			cursor.setHours(0, 0, 0, 0);
		} else {
			// Semana no cumplida => se corta la racha
			break;
		}
	}

	return { streak, weeklyGoal };
}

export async function getStreaks(): Promise<StreaksResult> {
	const db = getDB();

	// 1) Leer objetivo semanal (siempre entre 1 y 7 según tu lógica actual)
	const profile = await db.getFirstAsync<UserProfileRow>(
		`SELECT objetivo_semanal
		FROM user_profile
		WHERE id = 1`
	);

	const weeklyGoal = profile?.objetivo_semanal ?? 3;

	// 2) Leer todos los workouts ordenados por fecha ascendente
	const workouts = await db.getAllAsync<WorkoutRow>(
		`SELECT startDate
		FROM workouts
		ORDER BY startDate ASC`
	);

	if (!workouts.length) {
		return {
			activeStreak: 0,
			maxHistoricStreak: 0,
			weeklyGoal,
		};
	}

	// 3) Agrupar por semana (lunes–domingo)
	const weekCounts = new Map<string, number>(); // key = lunes de esa semana (yyyy-mm-dd)
	let firstWeekStart: Date | null = null;

	for (const w of workouts) {
		const date = new Date(w.startDate);
		if (isNaN(date.getTime())) continue; // por si hay datos corruptos

		const weekStart = startOfWeekMonday(date);
		const key = toDateOnlyKey(weekStart);

		weekCounts.set(key, (weekCounts.get(key) ?? 0) + 1);

		if (!firstWeekStart || weekStart < firstWeekStart) {
			firstWeekStart = new Date(weekStart);
		}
	}

	if (!firstWeekStart) {
		return {
			activeStreak: 0,
			maxHistoricStreak: 0,
			weeklyGoal,
		};
	}

	// 4) Determinar la última semana completa
	const today = new Date();
	const currentWeekStart = startOfWeekMonday(today);

	const lastCompletedWeekStart = new Date(currentWeekStart);
	lastCompletedWeekStart.setDate(lastCompletedWeekStart.getDate() - 7);
	lastCompletedWeekStart.setHours(0, 0, 0, 0);

	// Si ni siquiera hay una semana completa pasada (ej: muy pocos datos),
	// la racha activa e histórica será 0.
	if (lastCompletedWeekStart < firstWeekStart) {
		return {
			activeStreak: 0,
			maxHistoricStreak: 0,
			weeklyGoal,
		};
	}

	// 5) Calcular racha histórica máxima recorriendo desde la primera semana a la última completa
	let maxHistoricStreak = 0;
	let currentRun = 0;

	let cursor = new Date(firstWeekStart);

	while (cursor <= lastCompletedWeekStart) {
		const key = toDateOnlyKey(cursor);
		const count = weekCounts.get(key) ?? 0;

		if (count >= weeklyGoal) {
			currentRun += 1;
			if (currentRun > maxHistoricStreak) {
				maxHistoricStreak = currentRun;
			}
		} else {
			currentRun = 0;
		}

		// avanzar a la semana siguiente
		cursor.setDate(cursor.getDate() + 7);
		cursor.setHours(0, 0, 0, 0);
	}

	// 6) Calcular racha activa (desde la última semana completa hacia atrás)
  let activeStreak = 0;
  const cursorActive = new Date(lastCompletedWeekStart);

	while (true) {
		const key = toDateOnlyKey(cursorActive);
		const count = weekCounts.get(key) ?? 0;

		if (count >= weeklyGoal) {
			activeStreak += 1;
			// Semana anterior
			cursorActive.setDate(cursorActive.getDate() - 7);
			cursorActive.setHours(0, 0, 0, 0);

			// Si nos fuimos antes de la primera semana, cortamos
			if (cursorActive < firstWeekStart) {
				break;
			}
		} else {
			break;
		}
	}

	return {
		activeStreak,
		maxHistoricStreak,
		weeklyGoal,
	};
}

export async function getMaxHistoricStreak(): Promise<number> {
	const result = await getStreaks();
	return result.maxHistoricStreak;
}

/**
 * Devuelve:
 * - goal: objetivo semanal configurado en user_profile
 * - completed: cantidad de workouts de esta semana (lunes -> lunes siguiente)
 */
export async function getWeeklyGoalProgress(): Promise<WeeklyGoalProgress> {
	const db = getDB();

	// 1) Leer objetivo semanal
	const profile = await db.getFirstAsync<UserProfileRow>(
		`SELECT objetivo_semanal
		FROM user_profile
		WHERE id = 1`
	);

	// Siempre deberías tener algo entre 1 y 7, pero por las dudas hacemos fallback
	const goal = profile?.objetivo_semanal ?? 3;

	// 2) Calcular rango de esta semana (lunes inclusive hasta el lunes siguiente exclusivo)
	const today = new Date();
	const weekStart = startOfWeekMonday(today);

	const nextWeekStart = new Date(weekStart);
	nextWeekStart.setDate(nextWeekStart.getDate() + 7);
	nextWeekStart.setHours(0, 0, 0, 0);

	const weekStartIso = weekStart.toISOString();
	const nextWeekStartIso = nextWeekStart.toISOString();

	// 3) Contar entrenamientos (workouts) en ese rango
	const row = await db.getFirstAsync<CountRow>(
		`
		SELECT COUNT(*) AS count
		FROM workouts
		WHERE startDate >= ?
			AND startDate < ?
		`,
		weekStartIso,
		nextWeekStartIso
	);

	const completed = row?.count ?? 0;

	return {
		completed,
		goal,
	};
}