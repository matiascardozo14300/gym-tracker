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
  | "Adductors"
  | "Abs";

export interface Exercise {
	id: number;
	name: string;
	code: string;
	muscleGroup: MuscleGroup;
	workoutTypes: string[];
	favorite: number; // 0 = no favorito, 1 = favorito
}

export interface ExerciseInsert {
	name: string;
	code: string;
	muscleGroup: MuscleGroup;
	workoutTypes: string[];
}

export interface ExerciseNotes {
	id: number;
	exerciseId: number;
	note: string;
	lastUpdated: string;
}