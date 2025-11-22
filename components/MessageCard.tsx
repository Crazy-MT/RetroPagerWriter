import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, GripHorizontal } from 'lucide-react';
import { MessageCardData } from '../types';

interface MessageCardProps {
  data: MessageCardData;
  onDelete: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const MessageCard: React.FC<MessageCardProps> = ({ data, onDelete, containerRef }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < data.text.length) {
          index++;
          return data.text.slice(0, index);
        }
        clearInterval(timer);
        return prev;
      });
    }, 50); // Typing speed

    return () => clearInterval(timer);
  }, [data.text]);

  // Theme styles
  const themeStyles = {
    classic: 'bg-[#f4f1ea] text-gray-800 border-l-4 border-gray-800',
    urgent: 'bg-red-100 text-red-900 border-l-4 border-red-600',
    love: 'bg-pink-100 text-pink-900 border-l-4 border-pink-500',
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.1}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileDrag={{ scale: 1.05, rotate: 0, cursor: 'grabbing', zIndex: 50 }}
      className={`absolute w-64 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] rounded-sm font-mono text-sm select-none ${themeStyles[data.theme]}`}
      style={{ 
        left: data.x, 
        top: data.y, 
        rotate: data.rotation 
      }}
    >
      {/* Header / Handle */}
      <div className="flex justify-between items-center mb-2 border-b border-black/10 pb-1 opacity-50">
        <div className="flex items-center gap-1 cursor-grab active:cursor-grabbing">
          <GripHorizontal size={14} />
          <span className="text-xs tracking-widest">{data.timestamp}</span>
        </div>
        <button 
          onClick={(e) => {
             e.stopPropagation(); // Prevent drag start
             onDelete(data.id);
          }}
          className="hover:text-red-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[3rem] font-bold font-['VT323'] text-xl leading-6 tracking-wide break-words">
        {displayedText}
        <span className="animate-pulse inline-block w-2 h-4 bg-current ml-1 align-middle"></span>
      </div>

      {/* Footer Decor */}
      <div className="mt-3 flex justify-between items-end opacity-30">
         <div className="h-1 w-8 bg-current"></div>
         <div className="text-[10px]">MOTOROLA</div>
      </div>
    </motion.div>
  );
};