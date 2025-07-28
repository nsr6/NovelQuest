'use client';

import { useState } from 'react';
import { BookOpen, X, Info } from 'lucide-react';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="bg-dark-wood bg-opacity-80 shadow-md border-b-2 border-gold-leaf">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-gold-leaf" />
            <span className="text-3xl font-serif text-parchment tracking-wider">
              NovelQuest
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-parchment hover:text-gold-leaf transition-colors flex items-center gap-2"
              title="About NovelQuest"
            >
              <Info className="w-6 h-6" />
              <span className="hidden md:block">About</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-parchment rounded-lg p-8 max-w-md w-full shadow-2xl border-2 border-gold-leaf">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-serif text-dark-wood">About NovelQuest</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-dark-wood hover:text-leather-brown"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <p className="text-dark-wood leading-relaxed">
              NovelQuest uses advanced AI to analyze your reading preferences and provide personalized book recommendations. 
              Our mission is to help you discover new books and authors you'll love, all within a vintage, bookish atmosphere.
            </p>
          </div>
        </div>
      )}
    </header>
  );
} 