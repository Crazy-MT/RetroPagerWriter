import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, Power } from 'lucide-react';
import { PagerStatus } from '../types';
import { rephraseToPagerSpeak } from '../services/geminiService';

interface PagerDeviceProps {
  onSendMessage: (text: string, theme: 'classic' | 'urgent' | 'love') => void;
}

export const PagerDevice: React.FC<PagerDeviceProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<PagerStatus>(PagerStatus.IDLE);
  const [isOn, setIsOn] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Simple beep sound generator
  const beep = (freq = 800, duration = 100) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if(ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration / 1000);

    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  };

  const handleSend = async () => {
    if (!input.trim() || !isOn) return;
    
    beep(1200, 150);
    setStatus(PagerStatus.SENDING);
    
    // Determine theme based on keywords (naive logic, can be enhanced)
    let theme: 'classic' | 'urgent' | 'love' = 'classic';
    const lower = input.toLowerCase();
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('911')) theme = 'urgent';
    else if (lower.includes('love') || lower.includes('heart') || lower.includes('143')) theme = 'love';

    setTimeout(() => {
      onSendMessage(input.toUpperCase(), theme);
      setInput('');
      setStatus(PagerStatus.IDLE);
      beep(1200, 100);
      setTimeout(() => beep(1200, 100), 150); // Double beep for sent
    }, 800);
  };

  const handleAIRephrase = async () => {
    if (!input.trim() || !isOn || status !== PagerStatus.IDLE) return;

    setStatus(PagerStatus.PROCESSING);
    beep(600, 50);
    
    try {
      const enhanced = await rephraseToPagerSpeak(input);
      setInput(enhanced);
      setStatus(PagerStatus.IDLE);
      beep(1500, 200); // High pitch success
    } catch (e) {
      setStatus(PagerStatus.ERROR);
      setTimeout(() => setStatus(PagerStatus.IDLE), 2000);
    }
  };

  const togglePower = () => {
    beep(400, 300);
    setIsOn(!isOn);
    setStatus(PagerStatus.IDLE);
  };

  return (
    <div className="relative group perspective-1000">
      {/* Pager Body - Bright/Beige Retro Style */}
      <div className="w-80 bg-[#f3f4f6] rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-b-4 border-r-4 border-[#cbd5e1] relative transform transition-transform duration-300">
        
        {/* Texture overlay */}
        <div className="absolute inset-0 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-multiply"></div>

        {/* Top Brand Label */}
        <div className="flex justify-between items-center mb-3 px-1">
            <div className="text-[#6b7280] font-bold italic text-xs tracking-wider">MOTOROLA</div>
            <div className="text-[#374151] font-mono text-[10px]">ADVISOR PLATINUM</div>
        </div>

        {/* LCD Screen */}
        <div className={`
          relative h-24 bg-[#5c7a66] rounded mb-4 shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]
          flex flex-col p-2 font-['VT323'] text-2xl overflow-hidden transition-all duration-500 border-2 border-[#4b5563]
          ${isOn ? 'brightness-100' : 'brightness-50 saturate-0'}
        `}>
            {/* Screen Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]"></div>
            
            {isOn ? (
              <>
                {/* Status Bar */}
                <div className="flex justify-between text-sm text-black/70 opacity-60 mb-1 border-b border-black/10 pb-1">
                  <span>{status}</span>
                  <span className="animate-pulse">Please Call</span>
                </div>

                {/* Input Area */}
                <textarea
                  value={input}
                  onChange={(e) => {
                      if (e.target.value.length <= 60) setInput(e.target.value);
                      beep(800 + (e.target.value.length * 10), 10); // Typo sound
                  }}
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-black font-bold uppercase leading-6 placeholder-black/30"
                  placeholder="TYPE MESSAGE..."
                  autoFocus
                  maxLength={60}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-40 text-black">OFF</div>
            )}
        </div>

        {/* Controls Area */}
        <div className="grid grid-cols-4 gap-2">
          
          {/* AI Enhance Button */}
          <button 
            onClick={handleAIRephrase}
            disabled={!isOn || status !== PagerStatus.IDLE}
            className={`
              col-span-1 h-10 rounded bg-white border-b-4 border-[#d1d5db] active:border-b-0 active:translate-y-1
              flex items-center justify-center text-slate-600 hover:text-teal-600 transition-colors
              shadow-sm group/btn
            `}
            title="Enhance with AI (Gemini)"
          >
            <RefreshCw size={16} className={status === PagerStatus.PROCESSING ? 'animate-spin' : ''} />
          </button>

          {/* Power Button */}
          <button 
            onClick={togglePower}
            className={`
              col-span-1 h-10 rounded bg-red-500 border-b-4 border-red-700 active:border-b-0 active:translate-y-1
              flex items-center justify-center text-white hover:text-red-100 transition-colors
              shadow-sm
            `}
          >
            <Power size={16} />
          </button>

          {/* Space / Spacer */}
          <div className="col-span-1"></div>

          {/* Send Button */}
          <button 
            onClick={handleSend}
            disabled={!isOn || status !== PagerStatus.IDLE}
            className={`
              col-span-1 h-10 rounded bg-teal-500 border-b-4 border-teal-700 active:border-b-0 active:translate-y-1
              flex items-center justify-center text-white hover:text-teal-100 transition-colors
              shadow-sm
            `}
          >
            <Send size={16} />
          </button>
        </div>

        {/* Bottom Decor */}
        <div className="mt-4 flex justify-center gap-1">
          {[1,2,3,4,5].map(i => (
             <div key={i} className="w-1 h-1 rounded-full bg-gray-400"></div>
          ))}
        </div>

      </div>

      {/* Clip (Belt Clip Visual) - Adjusted for light device */}
      <div className="absolute -right-3 top-10 w-4 h-24 bg-[#d1d5db] rounded-r-lg -z-10 border-r border-[#9ca3af]"></div>
    </div>
  );
};