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

export type EditableWorkout = {
	id: number;
	date: string;           // 'YYYY-MM-DD'
	workoutTypeId: number;
	workoutType: string;
	exercises: EditableExercise[];
};

export type EditableSet = { weight: number; reps: number };

export type EditableExercise = {
	exerciseRecordId: number;
	exerciseId: number;
	name: string;
	code: string;
	sets: EditableSet[];
};

export type AddableExercise = {
	id: number;
	name: string;
	code: string;
};