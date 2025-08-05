// Exercise done in a workout. Related to Exercise
export interface ExerciseRecord {
	id: number;
	workoutId: number;
	exerciseId: number;
}

// Sets done in an exercise. Related to ExerciseRecord
export interface SetRecord {
	id: number;
	exerciseRecordId: number;
	weight: number;
	reps: number;
}

export interface NewExerciseRecord {
	workoutId: number;
	exerciseId: number;
}

export interface NewSetRecord {
	exerciseRecordId: number;
	weight: number;
	reps: number;
}

export interface WeightPoint {
	date: string;
	weight: number;
	reps: number[];
}

export interface ExerciseLastHistory  {
	exerciseRecordId: number;
	date: string;
	sets: { weight: number; reps: number }[];
}