'use client';

import { BookRecommendation } from '@/types/book';
import { Book, User, Feather } from 'lucide-react';

interface BookRecommendationsProps {
  recommendations: BookRecommendation[];
  isLoading: boolean;
}

export default function BookRecommendations({ recommendations, isLoading }: BookRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-leather-brown border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xl font-serif text-dark-wood">Searching the archives...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-4xl font-serif text-center text-dark-wood mb-8 border-b-2 border-gold-leaf pb-4">
        Your Personalized Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((book, index) => (
          <div key={index} className="bg-parchment p-6 rounded-lg shadow-lg border border-leather-brown transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <Book className="w-6 h-6 text-leather-brown" />
                <h3 className="text-2xl font-serif text-dark-wood">{book.title}</h3>
              </div>
              <div className="flex items-center gap-3 mb-4 text-dark-wood">
                <User className="w-5 h-5" />
                <p className="font-serif">{book.author}</p>
              </div>
              <div className="flex items-start gap-3 text-dark-wood">
                <Feather className="w-5 h-5 mt-1" />
                <p className="text-base leading-relaxed">{book.genre}</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(book.title + " by " + book.author)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold-leaf text-dark-wood font-serif px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300 shadow-md"
              >
                Find This Book
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 