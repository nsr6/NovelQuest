export interface BookRecommendation {
  title: string;
  author: string;
  genre: string;
  description: string;
}

export interface BookPreferences {
  favoriteBooks: string;
  leastFavoriteBooks: string;
  preferredGenres: string;
  favoriteAuthors: string;
}

export interface MoodPreferences {
  mood: string;
  requestType: 'mood' | 'personalized';
}

export type RecommendationRequest = BookPreferences | MoodPreferences; 