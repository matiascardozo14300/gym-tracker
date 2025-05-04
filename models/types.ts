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
	id: string;
	name: string;
	muscleGroup: MuscleGroup;
	workoutTypes: WorkoutType[];
}

export interface Workout {
	id: string;
	startDate: string;
	finishDate: string;
	workoutType: WorkoutType;
}

// Exercise done in a workout. Related to Exercise
export interface ExerciseRecord {
	id: string;
	workoutId: string;
	exerciseId: string;
}

// Sets done in an exercise. Related to ExerciseRecord
export interface SetRecord {
	id: string;
	exerciseRecordId: string;
	weight: number;
	reps: number;
}

export interface UserSettings {
	restTimerEnabled: boolean;
	weight: number;
	height: number;
	age: number;
}