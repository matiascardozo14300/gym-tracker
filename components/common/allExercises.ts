import { ExerciseInsert } from '../../services/database';

// Lista completa de ejercicios a insertar
export const lista: Omit<ExerciseInsert, 'id'>[] = [
	{
		code: 'close-grip-lat-pulldown',
		name: 'Close-Grip Lat PullDown',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'bayesian-cable-curl',
		name: 'Bayesian Cable Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'ez-bar-curl',
		name: 'EZ Bar Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'chest-supported-row',
		name: 'Chest-Supported Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'cable-row',
		name: 'Cable Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'preacher-hammer-curl',
		name: 'Preacher Hammer Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'cross-body-lat-pullaround',
		name: 'Cross-Body Lat PullAround',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'wide-grip-lat-pulldown',
		name: 'Wide-Grip Lat PullDown',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: '1-arm-dumbbell-row',
		name: '1-Arm Dumbbell Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'standing-hammer-curl',
		name: 'Standing Hammer Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'pull-ups',
		name: 'Pull-Ups',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'bench-press',
		name: 'Bench Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cable-lateral-raise',
		name: 'Cable Lateral Raise',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'standing-dumbbell-lateral-raise',
		name: 'Standing Dumbbell Lateral Raise',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'incline-bench-press',
		name: 'Incline Bench Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'triceps-pressdown-bar',
		name: 'Triceps Pressdown (Bar)',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'overhead-cable-triceps-extension',
		name: 'Overhead Cable Triceps Extension',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'pec-deck',
		name: 'Pec Deck',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cable-triceps-kickback',
		name: 'Cable Triceps Kickback',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'machine-chest-press',
		name: 'Machine Chest Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'smith-flat-bench-press',
		name: 'Smith Flat Bench Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'smith-incline-bench-press',
		name: 'Smith Incline Bench Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'flat-dumbbell-press',
		name: 'Flat Dumbbell Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'incline-dumbbell-press',
		name: 'Incline Dumbbell Press',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'smith-machine-jm-press',
		name: 'Smith Machine JM Press',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'push-ups',
		name: 'Push-Ups',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'seated-leg-curl',
		name: 'Seated Leg Curl',
		muscleGroup: 'Hamstrings',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'lying-leg-curl',
		name: 'Lying Leg Curl',
		muscleGroup: 'Hamstrings',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'leg-press',
		name: 'Leg Press',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'leg-extension',
		name: 'Leg Extension',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'machine-leg-press',
		name: 'Machine Leg Press',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'hip-adduction',
		name: 'Hip Adduction',
		muscleGroup: 'Adductors',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'standing-calf-raise',
		name: 'Standing Calf Raise',
		muscleGroup: 'Calves',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'seated-calf-raise',
		name: 'Seated Calf Raise',
		muscleGroup: 'Calves',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'lever-standing-calf-raise',
		name: 'Lever Standing Calf Raise',
		muscleGroup: 'Calves',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'lever-seated-crunch',
		name: 'Lever Seated Crunch',
		muscleGroup: 'Abs',
		workoutTypes: ['Pull', 'Push', 'Legs', 'FullBody']
	},
	{
		code: 'straight-leg-raise',
		name: 'Straight Leg Raise',
		muscleGroup: 'Abs',
		workoutTypes: ['Pull', 'Push', 'Legs', 'FullBody']
	},
	{
		code: 'cable-crunch',
		name: 'Cable Crunch',
		muscleGroup: 'Abs',
		workoutTypes: ['Pull', 'Push', 'Legs', 'FullBody']
	},
	{
		code: 'bent-over-row',
		name: 'Bent Over Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'cable-standing-lat-pushdown',
		name: 'Cable Standing Lat PushDown',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'shrug',
		name: 'Shrug',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'lever-lying-t-bar-row',
		name: 'Lever Lying T-Bar Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'assisted-pull-ups',
		name: 'Assisted Pull-Ups',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: '45-degree-hyperextension',
		name: '45 Degree Hyperextension',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'seated-wide-grip-row',
		name: 'Seated Wide-Grip Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'lever-front-pulldown',
		name: 'Lever Front PullDown',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'cable-wide-neutral-grip-pulldown',
		name: 'Cable Wide Neutral Grip PullDown',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'lever-bent-over-row',
		name: 'Lever Bent-Over Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'incline-dumbbell-row',
		name: 'Incline Dumbbell Row',
		muscleGroup: 'Back',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'biceps-curl',
		name: 'Biceps Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'dumbbell-incline-curl',
		name: 'Dumbbell Incline Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'lever-preacher-curl',
		name: 'Lever Preacher Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'cable-biceps-curl',
		name: 'Cable Biceps Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'barbell-preacher-curl',
		name: 'Barbell Preacher Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'dumbbell-preacher-curl',
		name: 'Dumbbell Preacher Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'concentration-curl',
		name: 'Concentration Curl',
		muscleGroup: 'Biceps',
		workoutTypes: ['Pull', 'FullBody']
	},
	{
		code: 'lever-seated-fly',
		name: 'Lever Seated Fly',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'dumbbell-shoulder-press',
		name: 'Dumbbell Shoulder Press',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'machine-shoulder-press',
		name: 'Machine Shoulder Press',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'lever-seated-reverse-fly',
		name: 'Lever Seated Reverse Fly',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'front-raise',
		name: 'Front Raise',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'barbell-shoulder-press',
		name: 'Barbell Shoulder Press',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'lever-lateral-raise',
		name: 'Lever Lateral Raise',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cable-face-pull',
		name: 'Cable Face Pull',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'smith-shoulder-press',
		name: 'Smith Shoulder Press',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cross-over-reverse-fly',
		name: 'Cross-Over Reverse Fly',
		muscleGroup: 'Shoulders',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cable-standing-fly',
		name: 'Cable Standing Fly',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'chest-dip',
		name: 'Chest Dip',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'fly',
		name: 'Fly',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'incline-fly',
		name: 'Incline Fly',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cable-middle-fly',
		name: 'Cable Middle Fly',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'cable-seated-chest-fly',
		name: 'Cable Seated Chest Fly',
		muscleGroup: 'Chest',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'pulley-overhead-tricep-extension',
		name: 'Pulley Overhead Tricep Extension',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'lever-seated-dip',
		name: 'Lever Seated Dip',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'seated-bench-extension',
		name: 'Seated Bench Extension',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'triceps-dip',
		name: 'Triceps Dip',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'assisted-triceps-dip',
		name: 'Assisted Triceps Dip',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'deadlift',
		name: 'Deadlift',
		muscleGroup: 'Hamstrings',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'romanian-deadlift',
		name: 'Romanian Deadlift',
		muscleGroup: 'Hamstrings',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'good-morning',
		name: 'Good Morning',
		muscleGroup: 'Hamstrings',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'barbell-squat',
		name: 'Barbell Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'hack-squat',
		name: 'Hack Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'smith-squat',
		name: 'Smith Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'dumbbell-bulgarian-split-squat',
		name: 'Dumbbell Bulgarian Split Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'dumbbell-squat',
		name: 'Dumbbell Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'dumbbell-lunges',
		name: 'Dumbbell Lunges',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'kettlebell-goblet-squat',
		name: 'Kettlebell Goblet Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'smith-bulgarian-split-squat',
		name: 'Smith Bulgarian Split Squat',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'smith-lunges',
		name: 'Smith Lunges',
		muscleGroup: 'Cuadriceps',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'hip-abduction',
		name: 'Hip Abduction',
		muscleGroup: 'Abductors',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'hip-thrust',
		name: 'Hip Thrust',
		muscleGroup: 'Gluts',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'smith-hip-thrust',
		name: 'Smith Hip Thrust',
		muscleGroup: 'Gluts',
		workoutTypes: ['Legs', 'FullBody']
	},
	{
		code: 'cable-pushdown-rope',
		name: 'Cable Pushdown (Rope)',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'barbell-skullcrusher',
		name: 'Barbell Skullcrusher',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	},
	{
		code: 'dumbbell-skullcrusher',
		name: 'Dumbbell Skullcrusher',
		muscleGroup: 'Triceps',
		workoutTypes: ['Push', 'FullBody']
	}
];