'use client';

import { useState } from 'react';
import { BookOpen, X, Info, Github } from 'lucide-react';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="bg-dark-wood shadow-lg border-b-4 border-gold-leaf">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <BookOpen className="w-9 h-9 text-gold-leaf" />
            <span className="text-4xl font-serif text-parchment tracking-wider">
              NovelQuest
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-parchment hover:text-gold-leaf transition-colors flex items-center gap-2"
              title="About NovelQuest"
            >
              <Info className="w-6 h-6" />
              <span className="hidden md:block font-serif">About</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-parchment rounded-lg p-4 sm:p-8 max-w-sm w-full shadow-2xl border-2 border-gold-leaf">
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
              As a lifelong book lover, I often found myself overwhelmed by endless book lists and unsure of what to read next. Despite loving literature, it was hard to discover books that truly resonated with me. 
              <br/> That’s why I created NovelQuest — a place for readers like me, who crave thoughtful, personalized recommendations. 
              <br/>Powered by advanced AI, NovelQuest analyzes your reading preferences to help you uncover books and authors you'll genuinely connect with. It's my way of blending my love for storytelling with technology.
            </p>
          </div>
        </div>
      )}
    </header>
  );
} 