'use client';

import { useState, useRef, useEffect } from 'react';
import { BookOpen, Heart, X, Star, User, ChevronDown, Check, HelpCircle } from 'lucide-react';

interface BookSuggestion {
  key: string;
  name: string;
}

interface AuthorSuggestion {
  key: string;
  name: string;
}

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
    favoriteBooks: [] as string[],
    leastFavoriteBooks: [] as string[],
    preferredGenres: [] as string[],
    favoriteAuthors: [] as string[]
  });

  const [inputs, setInputs] = useState({
    favoriteBooks: '',
    leastFavoriteBooks: '',
    favoriteAuthors: '',
  });

  const [suggestions, setSuggestions] = useState<(BookSuggestion | AuthorSuggestion)[]>([]);
  const [activeField, setActiveField] = useState<'favoriteBooks' | 'leastFavoriteBooks' | 'favoriteAuthors' | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      favoriteBooks: formData.favoriteBooks.join(', '),
      leastFavoriteBooks: formData.leastFavoriteBooks.join(', '),
      preferredGenres: formData.preferredGenres.join(', '),
      favoriteAuthors: formData.favoriteAuthors.join(', '),
    });
  };

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
    setActiveField(field);
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
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [genreDropdownRef, autocompleteRef]);

  const handleAddChip = (field: keyof typeof formData) => {
    const value = inputs[field as keyof typeof inputs].trim();
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
    setInputs(prev => ({ ...prev, [field as keyof typeof inputs]: '' }));
    setSuggestions([]);
  };

  const handleRemoveChip = (field: keyof typeof formData, chipToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((chip: string) => chip !== chipToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof typeof formData) => {
    if ((e.key === 'Enter' || e.key === ',') && inputs[field as keyof typeof inputs]) {
      e.preventDefault();
      handleAddChip(field);
    }
  };

  const handleSuggestionClick = (suggestion: BookSuggestion | AuthorSuggestion) => {
    if (!activeField) return;
    const field = activeField as keyof typeof formData;
    
    if (suggestion.name && !formData[field].includes(suggestion.name)) {
       setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], suggestion.name]
      }));
    }

    setInputs(prev => ({ ...prev, [activeField as keyof typeof inputs]: '' }));
    setActiveField(null);
    setSuggestions([]);
  };

  useEffect(() => {
    if (!activeField) {
      setSuggestions([]);
      return;
    }

    const searchTerm = inputs[activeField];

    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const isBookField = activeField.toLowerCase().includes('book');
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        let filteredSuggestions: (BookSuggestion | AuthorSuggestion)[];

        if (isBookField) {
          filteredSuggestions = data.docs
            .filter((doc: any) => doc.title)
            .map((doc: any) => ({ key: doc.key, name: doc.title }));
        } else {
          const allAuthors = data.docs.flatMap((doc: any) => doc.author_name || []);
          const uniqueAuthors = [...new Set(allAuthors)] as string[];
          filteredSuggestions = uniqueAuthors.map((authorName: string) => ({
            key: authorName,
            name: authorName,
          }));
        }
        
        const uniqueSuggestions = Array.from(new Map(filteredSuggestions.map(item => [item.name, item])).values());
        setSuggestions(uniqueSuggestions.slice(0, 7));
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputs, activeField]);

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
            <div className="relative group flex items-center ml-1">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-sm text-parchment bg-dark-wood rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-normal">
                Add at least 2 favourite books to get better results
              </div>
            </div>
          </label>
          <div className="relative" ref={activeField === 'favoriteBooks' ? autocompleteRef : null}>
            <div className="w-full px-2 py-2 bg-parchment border border-leather-brown rounded-md focus-within:ring-2 focus-within:ring-gold-leaf focus-within:border-transparent transition-all duration-200 text-dark-wood placeholder-gray-500 flex flex-wrap items-center gap-2">
              {formData.favoriteBooks.map(book => (
                <div key={book} className="flex items-center gap-2 bg-leather-brown text-parchment rounded-full px-3 py-1 text-sm font-serif">
                  <span>{book}</span>
                  <button type="button" onClick={() => handleRemoveChip('favoriteBooks', book)} className="text-parchment hover:text-gold-leaf">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={inputs.favoriteBooks}
                onFocus={() => setActiveField('favoriteBooks')}
                onChange={(e) => handleInputChange('favoriteBooks', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'favoriteBooks')}
                placeholder="Books you love..."
                className="flex-grow bg-transparent focus:outline-none text-dark-wood placeholder-gray-500 min-w-[150px]"
                autoComplete="off"
              />
            </div>
            {activeField === 'favoriteBooks' && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-parchment border border-leather-brown rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion.key}
                    type="button"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-aged-paper font-serif text-dark-wood"
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Least Favorite Books */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-serif text-dark-wood">
            <X className="w-5 h-5 text-gray-600" />
            Not-so-Favorite Books
            <div className="relative group flex items-center ml-1">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-sm text-parchment bg-dark-wood rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-normal">
                Add 2 or more not-so-favorite books to get better results
              </div>
            </div>
          </label>
           <div className="relative" ref={activeField === 'leastFavoriteBooks' ? autocompleteRef : null}>
            <div className="w-full px-2 py-2 bg-parchment border border-leather-brown rounded-md focus-within:ring-2 focus-within:ring-gold-leaf focus-within:border-transparent transition-all duration-200 text-dark-wood placeholder-gray-500 flex flex-wrap items-center gap-2">
              {formData.leastFavoriteBooks.map(book => (
                <div key={book} className="flex items-center gap-2 bg-leather-brown text-parchment rounded-full px-3 py-1 text-sm font-serif">
                  <span>{book}</span>
                  <button type="button" onClick={() => handleRemoveChip('leastFavoriteBooks', book)} className="text-parchment hover:text-gold-leaf">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={inputs.leastFavoriteBooks}
                onFocus={() => setActiveField('leastFavoriteBooks')}
                onChange={(e) => handleInputChange('leastFavoriteBooks', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'leastFavoriteBooks')}
                placeholder="Books you didn't enjoy"
                className="flex-grow bg-transparent focus:outline-none text-dark-wood placeholder-gray-500 min-w-[150px]"
                autoComplete="off"
              />
            </div>
            {activeField === 'leastFavoriteBooks' && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-parchment border border-leather-brown rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion.key}
                    type="button"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-aged-paper font-serif text-dark-wood"
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-dark-wood opacity-80">(optional)</p>
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
        </div>

        {/* Favorite Authors */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-serif text-dark-wood">
            <User className="w-5 h-5 text-blue-700" />
            Favorite Authors
            <div className="relative group flex items-center ml-1">
              <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
              <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 text-sm text-parchment bg-dark-wood rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-normal">
                Add your favorite authors to get better results
              </div>
            </div>
          </label>
           <div className="relative" ref={activeField === 'favoriteAuthors' ? autocompleteRef : null}>
            <div className="w-full px-2 py-2 bg-parchment border border-leather-brown rounded-md focus-within:ring-2 focus-within:ring-gold-leaf focus-within:border-transparent transition-all duration-200 text-dark-wood placeholder-gray-500 flex flex-wrap items-center gap-2">
              {formData.favoriteAuthors.map(author => (
                <div key={author} className="flex items-center gap-2 bg-leather-brown text-parchment rounded-full px-3 py-1 text-sm font-serif">
                  <span>{author}</span>
                  <button type="button" onClick={() => handleRemoveChip('favoriteAuthors', author)} className="text-parchment hover:text-gold-leaf">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={inputs.favoriteAuthors}
                onFocus={() => setActiveField('favoriteAuthors')}
                onChange={(e) => handleInputChange('favoriteAuthors', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'favoriteAuthors')}
                placeholder="Authors whose work you enjoy"
                className="flex-grow bg-transparent focus:outline-none text-dark-wood placeholder-gray-500 min-w-[150px]"
                autoComplete="off"
              />
            </div>
            {activeField === 'favoriteAuthors' && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-parchment border border-leather-brown rounded-md shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion.key}
                    type="button"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-aged-paper font-serif text-dark-wood"
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-dark-wood opacity-80">(optional)</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || formData.favoriteBooks.length === 0 || formData.preferredGenres.length === 0}
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