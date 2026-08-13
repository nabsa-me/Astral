export interface IDiaryEntry {
  id: string;
  dayId?: string;
  heading: string;
  body: string;
  photos?: string[];
  date?: string;
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
