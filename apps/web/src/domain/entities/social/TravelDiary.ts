export interface IDiaryEntry {
  id: string;
  dayId?: string;
  /** Links to a specific planner stop this entry narrates. */
  stopId?: string;
  heading: string;
  body: string;
  photos?: string[];
  date?: string;
  /** Personal, social-first fields (PolarSteps-style step). */
  placeName?: string;
  rating?: number; // 1..5
  review?: string;
  mood?: string; // short label or emoji
}

export interface ITravelDiaryStats {
  likes: number;
  comments: number;
}

export interface ITravelDiary {
  id: string;
  ownerId: string;
  sharedRouteId?: string;
  title: string;
  summary?: string;
  coverImageUrl?: string;
  entries: IDiaryEntry[];
  stats?: ITravelDiaryStats;
  createdAt: string;
}
