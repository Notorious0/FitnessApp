export interface SetData {
  kg: string;
  reps: string;
  repDisplay?: string;
  weightUnit?: string;
  repType?: string;
}

export interface Exercise {
  id: string;
  name: string;
  gifUrl?: string;
  equipment?: string;
  target?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  sets?: SetData[];
}

export interface Workout {
  id: string;
  workoutName: string;
  exercises?: Exercise[];
  supersets?: { [key: string]: string };
  supersetColors?: { [key: string]: string }; // ✅ sadece string
}

export interface Folder {
  id: string;
  folderName: string;
}

export type SupersetColorMap = {
  [key: string]: string;
};

export type SupersetColors = {
  [key: string]: number;
};
