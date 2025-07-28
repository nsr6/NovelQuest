'use client';

import { useState, useRef, useEffect } from 'react';
import { BookOpen, Heart, X, Star, User, ChevronDown, Check } from 'lucide-react';

interface BookRecommendationFormProps {
  onSubmit: (preferences: {
    favoriteBooks: string;
    leastFavoriteBooks: string;
    preferredGenres: string;
    favoriteAuthors: string;
  }) => void;
  isLoading: boolean;
}

export default function BookRecommendationForm({ onSubmit, isLoading }: BookRecommendationFormProps) {
  const [formData, setFormData] = useState({
    favoriteBooks: '',
    leastFavoriteBooks: '',
    preferredGenres: [] as string[],
    favoriteAuthors: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      preferredGenres: formData.preferredGenres.join(', '),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenreChange = (genre: string) => {
    setFormData(prev => {
      const { preferredGenres } = prev;
      const newGenres = preferredGenres.includes(genre)
        ? preferredGenres.filter(g => g !== genre)
        : [...preferredGenres, genre];
      return { ...prev, preferredGenres: newGenres };
    });
  };

  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [genreDropdownRef]);

  const genres = [
    'Fiction', 'Non-Fiction', 'Autobiography', 
    'Fantasy', 'Sci-Fi', 'Mystery', 
    'Crime', 'History', 'Romance', 'Horror', 'Thriller', 'Biography', 'Memoir', 'Self-Help', 'Cooking', 'Travel', 'Children'
  ];

  return (
    <div className="bg-aged-paper rounded-lg p-8 mb-8 border border-leather-brown shadow-inner">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-leather-brown rounded-full mb-4 ring-2 ring-gold-leaf">
          <BookOpen className="w-8 h-8 text-parchment" />
        </div>
        <h2 className="text-3xl font-serif text-dark-wood mb-2">Share your Literary Secrets</h2>
        <p className="text-dark-wood">Help us curate your personalized bookshelf.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Favorite Books */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-serif text-dark-wood">
            <Heart className="w-5 h-5 text-red-700" />
            Favorite Books
          </label>
          <input
            type="text"
            value={formData.favoriteBooks}
            onChange={(e) => handleInputChange('favoriteBooks', e.target.value)}
            placeholder="e.g., The Hobbit, Dune, Pride and Prejudice"
            className="w-full px-4 py-3 bg-parchment border border-leather-brown rounded-md focus:ring-2 focus:ring-gold-leaf focus:border-transparent transition-all duration-200 text-dark-wood placeholder-gray-500"
            required
          />
          <p className="text-sm text-dark-wood opacity-80">Separate multiple books with commas</p>
        </div>

        {/* Least Favorite Books */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-serif text-dark-wood">
            <X className="w-5 h-5 text-gray-600" />
            Least Favorite Books
          </label>
          <input
            type="text"
            value={formData.leastFavoriteBooks}
            onChange={(e) => handleInputChange('leastFavoriteBooks', e.target.value)}
            placeholder="e.g., Twilight, Fifty Shades of Grey"
            className="w-full px-4 py-3 bg-parchment border border-leather-brown rounded-md focus:ring-2 focus:ring-gold-leaf focus:border-transparent transition-all duration-200 text-dark-wood placeholder-gray-500"
          />
          <p className="text-sm text-dark-wood opacity-80">Books you didn't enjoy (optional)</p>
        </div>

        {/* Preferred Genres */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-serif text-dark-wood">
            <Star className="w-5 h-5 text-gold-leaf" />
            Preferred Genres
          </label>
          <div className="relative" ref={genreDropdownRef}>
            <button
              type="button"
              onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              className="w-full bg-parchment border border-leather-brown rounded-md focus:ring-2 focus:ring-gold-leaf focus:border-transparent transition-all duration-200 text-dark-wood flex justify-between items-center min-h-[50px] px-2"
            >
              <div className="flex flex-wrap gap-1.5">
                {formData.preferredGenres.length > 0 
                  ? formData.preferredGenres.map(genre => (
                      <div key={genre} className="flex items-center gap-1.5 bg-leather-brown text-parchment rounded-full px-2.5 py-0.5 text-sm font-serif">
                        <span>{genre}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenreChange(genre);
                          }}
                          className="text-parchment hover:text-gold-leaf"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                  ))
                  : <span className="text-gray-500 px-2">Select genres...</span>
                }
              </div>
              <ChevronDown className={`w-5 h-5 text-dark-wood transition-transform ml-auto ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isGenreDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-parchment border border-leather-brown rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 flex flex-col gap-1">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreChange(genre)}
                      className={`w-full text-left px-3 py-2 rounded-md font-serif text-dark-wood transition-colors flex items-center justify-between ${
                        formData.preferredGenres.includes(genre)
                          ? 'bg-aged-paper font-bold'
                          : 'hover:bg-aged-paper'
                      }`}
                    >
                       <span>{genre}</span>
                       {formData.preferredGenres.includes(genre) && <Check className="w-5 h-5 text-leather-brown" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-dark-wood opacity-80">Select all that apply</p>
        </div>

        {/* Favorite Authors */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-serif text-dark-wood">
            <User className="w-5 h-5 text-blue-700" />
            Favorite Authors
          </label>
          <input
            type="text"
            value={formData.favoriteAuthors}
            onChange={(e) => handleInputChange('favoriteAuthors', e.target.value)}
            placeholder="e.g., J.R.R. Tolkien, Frank Herbert, Jane Austen"
            className="w-full px-4 py-3 bg-parchment border border-leather-brown rounded-md focus:ring-2 focus:ring-gold-leaf focus:border-transparent transition-all duration-200 text-dark-wood placeholder-gray-500"
            required
          />
          <p className="text-sm text-dark-wood opacity-80">Authors whose work you enjoy</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.favoriteBooks || formData.preferredGenres.length === 0 || !formData.favoriteAuthors}
          className="w-full bg-leather-brown text-parchment font-serif font-semibold py-4 px-6 rounded-md hover:bg-dark-wood disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg border-b-4 border-dark-wood active:border-b-0"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-parchment border-t-transparent rounded-full animate-spin"></div>
              Finding Your Next Chapter...
            </div>
          ) : (
            'Get Personalized Recommendations'
          )}
        </button>
      </form>
    </div>
  );
} 