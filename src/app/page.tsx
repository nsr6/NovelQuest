'use client';

import { useState, useRef, useEffect } from 'react';
import BookRecommendationForm from '@/components/BookRecommendationForm';
import BookRecommendations from '@/components/BookRecommendations';
import { BookRecommendation } from '@/types/book';
import Header from '@/components/Header';

export default function Home() {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastPreferences, setLastPreferences] = useState<any>(null);
  const [previouslyRecommended, setPreviouslyRecommended] = useState<string[]>([]);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && hasSearched) {
      recommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, hasSearched, recommendations]);

  const fetchApiRecommendations = async (preferences: any, excludedTitles: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, excludedTitles }),
      });
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data: BookRecommendation[] = await response.json();
      setRecommendations(data);
      setPreviouslyRecommended(prev => [...new Set([...prev, ...data.map(b => b.title)])]);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = async (preferences: any) => {
    setHasSearched(true);
    setLastPreferences(preferences);
    setPreviouslyRecommended([]);
    await fetchApiRecommendations(preferences, []);
  };

  const handleRefresh = () => {
    if (lastPreferences) {
      fetchApiRecommendations(lastPreferences, previouslyRecommended);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-parchment bg-opacity-90 p-4 sm:p-8 rounded-lg shadow-lg">
          <BookRecommendationForm
            onSubmit={handleNewSearch}
            isLoading={isLoading}
          />
          {error && (
            <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          <div ref={recommendationsRef}>
            <BookRecommendations
              recommendations={recommendations}
              isLoading={isLoading}
              hasSearched={hasSearched}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </main>
      <footer className="bg-dark-wood mt-16 border-t-4 border-gold-leaf">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-parchment">
          <p className="font-serif text-lg mb-2">&copy; 2025 NovelQuest</p>
          <p className="text-sm text-parchment opacity-80">
            Crafted with ❤️ by{" "}
              Catabyss
            . Powered by AI for better reading experiences.
          </p>
        </div>
      </footer>
    </div>
  );
}
