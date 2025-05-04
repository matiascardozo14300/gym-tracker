export type WorkoutType = "Pull" | "Push" | "Legs" | "FullBody";
export type GymLocation = "Elcano" | "Castelli" | "Olazabal" | "Otro";

export interface SetRecord {
	id: string;
	weight: number;
	reps: number;
}

export interface ExerciseRecord {
	id: string;
	exerciseName: string;
	sets: SetRecord[];
}

export interface Workout {
	id: string;
	startDate: string;
	finishDate: string;
	workoutType: WorkoutType;
	gymLocation: GymLocation;
	exercises: ExerciseRecord[];
}

export interface Exercise {
	id: string;
	name: string;
	muscleGroup: string;
}

export interface UserSettings {
	restTimerEnabled: boolean;
	weight: number;
	height: number;
	age: number;
}