import React, { useState, useMemo } from 'react';
import { quotes } from '../data/quotes';
import { Sparkles, X } from 'lucide-react';

export default function QuoteTicker() {
  const [isVisible, setIsVisible] = useState(false);

  // Shuffle quotes once on mount for variety
  const shuffledQuotes = useMemo(() => {
    return [...quotes].sort(() => 0.5 - Math.random());
  }, []);

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-28 right-6 p-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg shadow-yellow-400/20 transition-all duration-300 z-[40] group"
        title={isVisible ? "Hide Motivation" : "Get Motivated!"}
      >
        {isVisible ? (
          <X size={22} className="transition-transform group-hover:rotate-90" />
        ) : (
          <Sparkles size={22} className="group-hover:animate-spin" />
        )}
      </button>

      {/* Marquee Container */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-yellow-400 h-10 flex items-center z-50 shadow-[0_-4px_15px_rgba(250,204,21,0.15)] transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block hover:[animation-play-state:paused]">
            {shuffledQuotes.map((q, i) => (
              <span key={i} className="mx-12 text-base font-bold text-black tracking-wide">
                {q.text}
                <span className="text-yellow-600 font-black mx-12">★</span>
              </span>
            ))}
            {/* Duplicate list to create a seamless infinite scroll loop */}
            {shuffledQuotes.map((q, i) => (
              <span key={`dup-${i}`} className="mx-12 text-base font-bold text-black tracking-wide">
                {q.text}
                <span className="text-yellow-600 font-black mx-12">★</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
