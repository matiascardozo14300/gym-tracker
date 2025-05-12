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