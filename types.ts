
export interface User {
  name: string;
  age: number;
  weight: number;
  height: number;
  avatarUrl: string;
  workoutStreak?: number;
  muscleMass?: number;
  weightHistory?: { date: string; weight: number }[];
  muscleMassHistory?: { date:string; mass: number }[];
  recentWorkouts?: {
    today: SimpleWorkout[];
    yesterday: SimpleWorkout[];
  };
}

export interface SimpleWorkout {
  exercise: string;
  duration: number;
}

export interface SetDetail {
  id: string;
  weight: number;
  reps: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: SetDetail[];
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface RecommendedExercise {
    exerciseKey: string;
    exerciseName: string;
    description: string;
    sets: string;
    reps: string;
    rest: string;
    youtubeSearchQuery: string;
}

export interface RecommendedRoutine {
    routineName: string;
    description: string;
    exercises: RecommendedExercise[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface FoodCalorieInfo {
  food: string;
  calories: number;
}

export interface CalorieCalculationResult {
  totalCalories: number;
  foods: FoodCalorieInfo[];
}

export interface LowCalorieRecipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageSearchQuery: string;
}
