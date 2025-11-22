import React, { useState, useRef } from 'react';
import { PagerDevice } from './components/PagerDevice';
import { MessageCard } from './components/MessageCard';
import { MessageCardData } from './types';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [cards, setCards] = useState<MessageCardData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (text: string, theme: 'classic' | 'urgent' | 'love') => {
    const newCard: MessageCardData = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // Random initial position near the center but slightly varied
      x: (window.innerWidth / 2) + (Math.random() * 100 - 50) + 200, // Offset to the right of pager
      y: (window.innerHeight / 2) + (Math.random() * 100 - 50),
      rotation: Math.random() * 10 - 5, // Slight tilt
      theme
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter(c => c.id !== id));
  };

  return (
    <div className="relative w-screen h-screen bg-[#f8f9fa] text-slate-800 overflow-hidden selection:bg-teal-200 selection:text-teal-900">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}
      ></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#e2e8f0] opacity-60 pointer-events-none"></div>

      {/* Header Info */}
      <div className="absolute top-6 left-8 z-50 flex flex-col gap-1 pointer-events-none opacity-90">
        <h1 className="font-['VT323'] text-4xl text-teal-600 tracking-widest drop-shadow-[0_2px_0px_rgba(0,0,0,0.1)]">
          BEEPER.FIX
        </h1>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
           <Info size={12} />
           <span>DRAG CARDS TO ORGANIZE • USE AI BUTTON FOR 90s SLANG</span>
        </div>
      </div>

      {/* Main Interactive Area (Restricted by drag constraints) */}
      <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
        
        {/* The Pager Input Device (Fixed in Center-Leftish) */}
        <div className="z-40 mr-20 md:mr-96 filter drop-shadow-xl">
          <PagerDevice onSendMessage={handleSendMessage} />
        </div>

        {/* Render Cards */}
        {cards.map((card) => (
          <MessageCard 
            key={card.id} 
            data={card} 
            onDelete={handleDeleteCard}
            containerRef={containerRef}
          />
        ))}

      </div>
      
      {/* Footer Attribution */}
      <div className="absolute bottom-4 right-6 text-[10px] text-slate-400 font-mono">
        POWERED BY GOOGLE GEMINI • RETRO TECH V1.0
      </div>
    </div>
  );
};

export default App;