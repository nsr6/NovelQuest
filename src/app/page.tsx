'use client';

import { useState, useRef, useEffect } from 'react';
import BookRecommendationForm from '@/components/BookRecommendationForm';
import BookRecommendations from '@/components/BookRecommendations';
import { BookRecommendation } from '@/types/book';
import Header from '@/components/Header';

export default function Home() {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastPreferences, setLastPreferences] = useState<any>(null);
  const [previouslyRecommended, setPreviouslyRecommended] = useState<string[]>([]);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(isSubmitting || isRefreshing) && hasSearched) {
      recommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isSubmitting, isRefreshing, hasSearched, recommendations]);

  const fetchRecommendationsLogic = async (preferences: any, excludedTitles: string[]) => {
    try {
      // Include excludedTitles for both mood-based and personalized requests
      const requestBody = preferences.requestType === 'mood' 
        ? { ...preferences, excludedTitles }
        : { ...preferences, excludedTitles, requestType: 'personalized' };

      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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
    }
  };

  const handleNewSearch = async (preferences: any) => {
    setHasSearched(true);
    setLastPreferences(preferences);
    setPreviouslyRecommended([]);
    setError(null);
    setIsSubmitting(true);
    await fetchRecommendationsLogic(preferences, []);
    setIsSubmitting(false);
  };

  const handleRefresh = async () => {
    if (lastPreferences) {
      setError(null);
      setIsRefreshing(true);
      await fetchRecommendationsLogic(lastPreferences, previouslyRecommended);
      setIsRefreshing(false);
    }
  };

  const handleReset = () => {
    setRecommendations([]);
    setHasSearched(false);
    setLastPreferences(null);
    setPreviouslyRecommended([]);
    setError(null);
  };

  const isLoading = isSubmitting || isRefreshing;

  return (
    <div className="relative min-h-screen bg-bookshelf bg-cover bg-center bg-fixed">
      <div className="bg-overlay flex-grow flex flex-col">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-6 sm:py-8 lg:py-12 flex-grow">
        <div className="bg-parchment bg-opacity-90 p-3 sm:p-6 rounded-lg shadow-lg">
            <BookRecommendationForm
              onSubmit={handleNewSearch}
              onReset={handleReset}
              isLoading={isSubmitting}
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
    </div>
  );
}
