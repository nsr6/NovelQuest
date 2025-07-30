'use client';

import { BookRecommendation } from '@/types/book';
import { Book, User, Feather } from 'lucide-react';

interface BookRecommendationsProps {
  recommendations: BookRecommendation[];
  isLoading: boolean;
  hasSearched: boolean;
}

export default function BookRecommendations({ recommendations, isLoading, hasSearched }: BookRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-leather-brown border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xl font-serif text-dark-wood">Searching the archives...</p>
      </div>
    );
  }

  if (hasSearched && recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-aged-paper rounded-full mb-6 ring-4 ring-leather-brown ring-opacity-50">
          <Book className="w-12 h-12 text-dark-wood opacity-80" />
        </div>
        <h3 className="text-3xl font-serif text-dark-wood mb-2">No Tomes Found</h3>
        <p className="text-dark-wood max-w-md mx-auto">
          Our literary compass couldn&apos;t find a match this time. Try adjusting your preferences or exploring different genres for a new set of recommendations.
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-4xl font-serif text-center text-dark-wood mb-8 border-b-2 border-gold-leaf pb-4">
        Your Personalized Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((book, index) => (
          <div 
            key={index} 
            className="group bg-parchment p-4 rounded-lg shadow-lg border border-leather-brown flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative flex-grow mb-4">
              <div className="absolute top-0 right-[-1rem] bg-gold-leaf py-0.5 px-3 rounded-l-md shadow">
                <span className="font-serif text-xs text-dark-wood font-semibold tracking-wide">{book.genre}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-aged-paper p-2 rounded-full ring-1 ring-leather-brown">
                  <Book className="w-5 h-5 text-leather-brown" />
                </div>
                <h3 className="text-xl font-serif text-dark-wood flex-1 pr-24">{book.title}</h3>
              </div>

              <div className="border-t border-b border-leather-brown border-dashed my-3 py-2">
                <div className="flex items-center gap-2 text-dark-wood">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <p className="font-serif italic text-sm">{book.author}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-dark-wood mt-3">
                <Feather className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm leading-relaxed text-dark-wood text-opacity-80">{book.description || 'No description available.'}</p>
              </div>
            </div>
            
            <div className="text-center">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(book.title + " by " + book.author)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-leather-brown text-parchment font-serif px-6 py-2 text-sm rounded-md hover:bg-dark-wood transition-all duration-300 shadow-md border-b-2 border-dark-wood group-hover:bg-gold-leaf group-hover:text-dark-wood group-hover:border-leather-brown active:border-b-0"
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