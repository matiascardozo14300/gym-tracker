import { getDB } from '../db';
import { ActiveStreakResult, UserProfileRow, WorkoutRow } from './types';

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