export interface Meal {
  name: string;
  description: string;
  cookTime: string;
  effort: string;
  cuisine: string;
  why: string;
  ingredients: string;
  bestMatch: boolean;
}

export interface FormState {
  moods: string[];
  cuisines: string[];
  time: string;
  effort: string;
  fridge: string;
}
