export type WorkoutType = "Pull" | "Push" | "Legs" | "FullBody";
export type MuscleGroup =
  | "Chest"
  | "Shoulders"
  | "Triceps"
  | "Back"
  | "Biceps"
  | "Forearms"
  | "Cuadriceps"
  | "Hamstrings"
  | "Gluts"
  | "Calves"
  | "Abductors"
  | "Abs";

export interface Exercise {
	id: number;
	name: string;
	muscleGroup: MuscleGroup;
	workoutTypes: string[];
}

export interface Workout {
	id: number;
	startDate: string;
	finishDate: string;
	workoutType: WorkoutType;
}

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

export interface UserSettings {
	restTimerEnabled: boolean;
	weight: number;
	height: number;
	age: number;
}

export interface NewWorkout {
	startDate: string;
	finishDate: string;
	workoutType: string;
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

export interface LastWorkout {
	startDate: string;
	workoutType: string;
	duration: string;
}