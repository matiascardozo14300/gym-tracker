export interface Workout {
	id: number;
	startDate: string;
	finishDate: string;
	workoutType: string;
}

export interface NewWorkout {
	startDate: string;
	finishDate: string;
	workoutTypeId: number;
}

export interface LastWorkout {
	startDate: string;
	workoutType: string;
	duration: string; // '1h 10m'
}

export interface WorkoutDetail {
	workoutType: string;
	exercises: {
		name: string;
		sets: { weight: number; reps: number }[];
	}[];
}

export interface WorkoutType {
	id: number;
	name: string;
	isCustom: number;
	color?: string | null;
	isArchived?: number;
	archivedAt?: string | null;
}

export type CreateWorkoutTypeResult =
	{ ok: true; id: number } |
	{ ok: false; code: 'DUPLICATE_NAME' };

export type UpdateResult =
	{ ok: true } |
	{ ok: false; code: 'NOT_FOUND' | 'DUPLICATE_NAME' };

export type ArchiveResult =
  | { ok: true }
  | { ok: false; code: 'NOT_FOUND' | 'ALREADY_ARCHIVED' };