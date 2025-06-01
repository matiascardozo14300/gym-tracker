export type WorkoutType = "Pull" | "Push" | "Legs" | "FullBody";

export interface Workout {
	id: number;
	startDate: string;
	finishDate: string;
	workoutType: string;
}

export interface NewWorkout {
	startDate: string;
	finishDate: string;
	workoutType: string;
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