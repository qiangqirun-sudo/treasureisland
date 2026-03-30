import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

const OceanWave = ({ color, opacity, duration, reverse, className }: { color: string, opacity: number, duration: number, reverse?: boolean, className: string }) => (
  <div className={`absolute left-0 w-[200%] ${className}`} style={{ opacity, animation: `wave-x ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}>
    <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
      <path d="M 0 50 Q 125 0 250 50 T 500 50 T 750 50 T 1000 50 L 1000 100 L 0 100 Z" fill={color} />
    </svg>
  </div>
);

const Seagull = ({ className, delay }: { className?: string, delay: number }) => (
  <svg className={`absolute opacity-0 pointer-events-none ${className}`} viewBox="0 0 100 100" width="50" height="50" style={{ animation: `fly 18s linear infinite ${delay}s` }}>
    <path d="M 20 50 Q 40 30 50 50 Q 60 30 80 50 Q 60 45 50 55 Q 40 45 20 50 Z" fill="#ffffff" stroke="#90a4ae" strokeWidth="1.5" opacity="0.95" />
    <path d="M 20 50 Q 25 45 30 50 Z" fill="#455a64" />
    <path d="M 80 50 Q 75 45 70 50 Z" fill="#455a64" />
  </svg>
);

interface GameLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
}

export default function GameLayout({ children, onBack, title }: GameLayoutProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#4fc3f7] font-serif flex items-center justify-center">
      
      {/* Global Animations */}
      <style>{`
        @keyframes wave-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fly {
          0% { transform: translate(-10vw, 100vh) scale(0.5) rotate(-20deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(110vw, -20vh) scale(1.5) rotate(20deg); opacity: 0; }
        }
        @keyframes tide-bottom {
          0%, 100% { transform: translateY(100%); opacity: 0; }
          50% { transform: translateY(20%); opacity: 0.8; }
        }
      `}</style>

      {/* 1. Realistic Ocean Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-100 rounded-full blur-[100px] opacity-70"></div>
        <OceanWave color="#29b6f6" opacity={0.6} duration={35} className="top-[10%] h-[90%]" />
        <OceanWave color="#03a9f4" opacity={0.7} duration={25} reverse className="top-[30%] h-[70%]" />
        <OceanWave color="#0288d1" opacity={0.8} duration={20} className="top-[50%] h-[50%]" />
        <OceanWave color="#0277bd" opacity={0.9} duration={15} reverse className="top-[70%] h-[30%]" />
        <OceanWave color="#01579b" opacity={1} duration={12} className="top-[85%] h-[15%]" />
      </div>

      {/* 2. Seagulls */}
      <Seagull className="top-[10%] left-[5%]" delay={0} />
      <Seagull className="top-[25%] left-[60%]" delay={5} />

      {/* 3. The Parchment Scroll */}
      <div className="relative z-10 w-[96%] max-w-5xl aspect-[3/4] md:aspect-[16/9] flex items-center justify-center mt-8 md:mt-0">
        
        {/* Organic SVG Scroll Background */}
        <svg className="absolute inset-0 w-full h-full drop-shadow-2xl pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <defs>
            <filter id="rough-paper" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3e2723" />
              <stop offset="20%" stopColor="#5d4037" />
              <stop offset="50%" stopColor="#8d6e63" />
              <stop offset="80%" stopColor="#5d4037" />
              <stop offset="100%" stopColor="#3e2723" />
            </linearGradient>
            <linearGradient id="paper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5deb3" />
              <stop offset="50%" stopColor="#fdf5e6" />
              <stop offset="100%" stopColor="#e8dcc4" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="40" height="560" fill="url(#wood)" rx="20" filter="drop-shadow(5px 5px 5px rgba(0,0,0,0.5))" />
          <rect x="940" y="20" width="40" height="560" fill="url(#wood)" rx="20" filter="drop-shadow(-5px 5px 5px rgba(0,0,0,0.5))" />
          <path d="M 50 40 L 950 40 L 950 560 L 50 560 Z" fill="url(#paper-grad)" filter="url(#rough-paper)" />
          <path d="M 50 40 L 950 40 L 950 560 L 50 560 Z" fill="none" stroke="#dcb888" strokeWidth="12" filter="url(#rough-paper)" opacity="0.6" />
        </svg>

        {/* Content Area */}
        <div className="relative z-30 w-full h-full flex flex-col p-8 md:p-12 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-[#8b5a2b] text-[#fdf5e6] rounded-sm shadow-md hover:bg-[#5c3a21] transition-colors font-serif text-sm md:text-base"
            >
              <ArrowLeft size={20} /> 返回地图
            </button>
            <h1 className="text-xl md:text-3xl font-serif font-bold text-[#5c3a21] tracking-widest">
              {title}
            </h1>
            <div className="w-24 md:w-32"></div> {/* Spacer for balance */}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 90, 43, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 90, 43, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 90, 43, 0.5);
        }
      `}</style>
    </div>
  );
}
