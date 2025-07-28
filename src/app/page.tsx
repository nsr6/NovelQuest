'use client';

import { useState } from 'react';
import BookRecommendationForm from '@/components/BookRecommendationForm';
import BookRecommendations from '@/components/BookRecommendations';
import { BookRecommendation } from '@/types/book';
import Header from '@/components/Header';

export default function Home() {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async (preferences: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-parchment bg-opacity-90 p-8 rounded-lg shadow-lg">
          <BookRecommendationForm
            onSubmit={handleGetRecommendations}
            isLoading={isLoading}
          />
          {error && (
            <div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          <BookRecommendations
            recommendations={recommendations}
            isLoading={isLoading}
          />
        </div>
      </main>
      <footer className="bg-dark-wood bg-opacity-80 border-t border-gold-leaf mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-parchment">
          <p>© 2025 NovelQuest. Powered by AI for better reading experiences.</p>
        </div>
      </footer>
    </div>
  );
}
