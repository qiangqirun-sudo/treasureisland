import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { View } from '../App';
import { Play, X, Ship, Star } from 'lucide-react';

const Seagull = ({ className, delay }: { className?: string, delay: number }) => (
  <svg className={`absolute opacity-0 pointer-events-none ${className}`} viewBox="0 0 100 100" width="50" height="50" style={{ animation: `fly 18s linear infinite ${delay}s` }}>
    <path d="M 20 50 Q 40 30 50 50 Q 60 30 80 50 Q 60 45 50 55 Q 40 45 20 50 Z" fill="#ffffff" stroke="#90a4ae" strokeWidth="1.5" opacity="0.95" />
    <path d="M 20 50 Q 25 45 30 50 Z" fill="#455a64" />
    <path d="M 80 50 Q 75 45 70 50 Z" fill="#455a64" />
  </svg>
);

const Dolphin = ({ className, delay }: { className?: string, delay: number }) => (
  <svg className={`absolute opacity-0 pointer-events-none ${className}`} viewBox="0 0 100 100" width="100" height="100" style={{ animation: `jump 10s cubic-bezier(0.4, 0, 0.2, 1) infinite ${delay}s` }}>
    {/* Main body (blue-grey) */}
    <path d="M 10 70 C 30 30, 70 40, 90 80 C 75 65, 40 55, 10 70 Z" fill="#455a64" opacity="0.95" />
    {/* Dorsal fin */}
    <path d="M 40 45 L 35 30 L 50 45 Z" fill="#263238" opacity="0.95" />
    {/* Lighter underbelly */}
    <path d="M 15 68 C 35 50, 65 55, 85 78 C 70 68, 40 60, 15 68 Z" fill="#90a4ae" opacity="0.9" />
    {/* Water splash */}
    <path d="M 0 80 Q 20 60 40 80 T 80 80 T 100 80" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.6" style={{ animation: 'splash 8s infinite' }} />
  </svg>
);

const OceanWave = ({ color, opacity, duration, reverse, className }: { color: string, opacity: number, duration: number, reverse?: boolean, className: string }) => (
  <div className={`absolute left-0 w-[200%] ${className}`} style={{ opacity, animation: `wave-x ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}>
    <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
      <path d="M 0 50 Q 125 0 250 50 T 500 50 T 750 50 T 1000 50 L 1000 100 L 0 100 Z" fill={color} />
    </svg>
  </div>
);

const ShellIcon = ({ size = 28, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-md ${className}`}>
    <defs>
      <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5f0e6" />
        <stop offset="100%" stopColor="#d7ccc8" />
      </linearGradient>
    </defs>
    <path d="M50 90 C10 90, 5 40, 20 20 C35 0, 65 0, 80 20 C95 40, 90 90, 50 90 Z" fill="url(#shellGrad)" stroke="#8d6e63" strokeWidth="2" />
    <path d="M50 90 L50 10 M40 88 L25 15 M60 88 L75 15 M30 80 L12 30 M70 80 L88 30" stroke="#8d6e63" strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M35 90 C40 100, 60 100, 65 90 Z" fill="#bcaaa4" stroke="#8d6e63" strokeWidth="1" />
  </svg>
);

const CompassIcon = ({ size = 28, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-md ${className}`}>
    <defs>
      <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d7ccc8" />
        <stop offset="50%" stopColor="#8d6e63" />
        <stop offset="100%" stopColor="#4e342e" />
      </linearGradient>
      <radialGradient id="dial" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stopColor="#f5f5f5" />
        <stop offset="100%" stopColor="#e0e0e0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#brass)" stroke="#3e2723" strokeWidth="2" />
    <circle cx="50" cy="50" r="35" fill="url(#dial)" stroke="#5d4037" strokeWidth="1.5" />
    <path d="M50 20 L56 50 L50 80 L44 50 Z" fill="#37474f" />
    <path d="M50 80 L56 50 L50 20 L44 50 Z" fill="#b0bec5" />
    <circle cx="50" cy="50" r="6" fill="#5d4037" />
  </svg>
);

const MapScrollIcon = ({ size = 28, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-md ${className}`}>
    <defs>
      <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#efebe9" />
        <stop offset="50%" stopColor="#d7ccc8" />
        <stop offset="100%" stopColor="#bcaaa4" />
      </linearGradient>
    </defs>
    <rect x="25" y="15" width="50" height="70" fill="url(#paper)" stroke="#5d4037" strokeWidth="2" />
    <path d="M25 15 Q10 15 10 25 L10 75 Q10 85 25 85 Z" fill="#d7ccc8" stroke="#5d4037" strokeWidth="2" />
    <path d="M75 15 Q90 15 90 25 L90 75 Q90 85 75 85 Z" fill="#d7ccc8" stroke="#5d4037" strokeWidth="2" />
    <path d="M35 30 L65 30 M35 50 L65 50 M35 70 L55 70" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
    <rect x="15" y="40" width="70" height="12" fill="#4e342e" stroke="#3e2723" strokeWidth="1" />
  </svg>
);

const AnchorIcon = ({ size = 28, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-md ${className}`}>
    <defs>
      <linearGradient id="iron" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78909c" />
        <stop offset="50%" stopColor="#455a64" />
        <stop offset="100%" stopColor="#263238" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="20" r="10" fill="none" stroke="url(#iron)" strokeWidth="6" />
    <rect x="46" y="30" width="8" height="50" fill="url(#iron)" />
    <rect x="30" y="40" width="40" height="8" fill="url(#iron)" rx="4" />
    <path d="M20 60 C20 90, 80 90, 80 60" fill="none" stroke="url(#iron)" strokeWidth="8" strokeLinecap="round" />
    <path d="M15 55 L25 55 L20 45 Z" fill="url(#iron)" />
    <path d="M85 55 L75 55 L80 45 Z" fill="url(#iron)" />
  </svg>
);

const TreasureChest = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
    {/* Glowing light from inside when open */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <path d="M 15 50 L 85 50 L 50 -20 Z" fill="url(#glowGrad)" style={{ mixBlendMode: 'screen' }} />
      <circle cx="50" cy="50" r="40" fill="url(#glowGrad)" style={{ mixBlendMode: 'screen' }} />
    </motion.g>

    {/* Chest Base */}
    <path d="M 10 50 L 90 50 L 85 90 L 15 90 Z" fill="#5d4037" stroke="#3e2723" strokeWidth="2" />
    <path d="M 10 50 L 90 50" stroke="#ffb300" strokeWidth="4" />
    <path d="M 25 50 L 25 90 M 75 50 L 75 90" stroke="#3e2723" strokeWidth="2" />
    <circle cx="50" cy="65" r="8" fill="#ffb300" />
    
    {/* Open Lid (Behind) */}
    <motion.g 
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, scaleY: isOpen ? 1 : 0 }}
      style={{ transformOrigin: '50% 50px' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <path d="M 10 50 C 10 10, 90 10, 90 50 Z" fill="#4e342e" stroke="#3e2723" strokeWidth="2" />
      <path d="M 15 45 C 15 20, 85 20, 85 45 Z" fill="#ffb300" opacity="0.8" />
    </motion.g>

    {/* Closed Lid (Front) */}
    <motion.g 
      initial={{ opacity: 1, rotateX: 0 }}
      animate={{ opacity: isOpen ? 0 : 1, rotateX: isOpen ? 90 : 0 }}
      style={{ transformOrigin: '50% 50px' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <path d="M 10 50 C 10 20, 90 20, 90 50 Z" fill="#795548" stroke="#3e2723" strokeWidth="2" />
      <path d="M 10 50 C 10 20, 90 20, 90 50 Z" fill="none" stroke="#ffb300" strokeWidth="2" />
      <path d="M 25 50 C 25 30, 75 30, 75 50" fill="none" stroke="#3e2723" strokeWidth="2" />
      {/* Lock */}
      <rect x="42" y="40" width="16" height="20" rx="2" fill="#ffb300" stroke="#fff8e1" strokeWidth="1" />
      <circle cx="50" cy="50" r="3" fill="#3e2723" />
      <path d="M 49 53 L 51 53 L 51 57 L 49 57 Z" fill="#3e2723" />
    </motion.g>

    <defs>
      <linearGradient id="glowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#ffe57f" stopOpacity="1" />
        <stop offset="100%" stopColor="#fff8e1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

interface MapProps {
  medals: boolean[];
  onSelectLevel: (level: View) => void;
  hasSeenTreasure: boolean;
  onTreasureSeen: () => void;
}

export default function Map({ medals, onSelectLevel, hasSeenTreasure, onTreasureSeen }: MapProps) {
  const [chestOpen, setChestOpen] = useState(false);
  const allMedals = medals.every(m => m);

  useEffect(() => {
    if (allMedals && !hasSeenTreasure) {
      const timer = setTimeout(() => {
        setChestOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allMedals, hasSeenTreasure]);

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
        @keyframes jump {
          0% { transform: translateY(120px) rotate(-30deg); opacity: 0; }
          10% { transform: translateY(-60px) rotate(-10deg); opacity: 1; }
          20% { transform: translateY(30px) rotate(30deg); opacity: 0; }
          100% { transform: translateY(120px) rotate(30deg); opacity: 0; }
        }
        @keyframes splash {
          0%, 5% { opacity: 0; transform: scale(0.5); }
          10% { opacity: 0.8; transform: scale(1.2); }
          20%, 100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes tide-bottom {
          0%, 100% { transform: translateY(100%); opacity: 0; }
          50% { transform: translateY(20%); opacity: 0.8; }
        }
      `}</style>

      {/* 1. Realistic Ocean Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Sun Glare */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-100 rounded-full blur-[100px] opacity-70"></div>
        
        {/* Layered Waves */}
        <OceanWave color="#29b6f6" opacity={0.6} duration={35} className="top-[10%] h-[90%]" />
        <OceanWave color="#03a9f4" opacity={0.7} duration={25} reverse className="top-[30%] h-[70%]" />
        <OceanWave color="#0288d1" opacity={0.8} duration={20} className="top-[50%] h-[50%]" />
        <OceanWave color="#0277bd" opacity={0.9} duration={15} reverse className="top-[70%] h-[30%]" />
        <OceanWave color="#01579b" opacity={1} duration={12} className="top-[85%] h-[15%]" />
      </div>

      {/* 3. The Parchment Scroll */}
      <div className="relative z-10 w-[96%] max-w-5xl aspect-[3/4] md:aspect-[16/9] flex items-center justify-center mt-8 md:mt-0">
        
        {/* Organic SVG Scroll Background */}
        <svg className="absolute inset-0 w-full h-full drop-shadow-2xl pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <defs>
            {/* Filter for rough, torn paper edges */}
            <filter id="rough-paper" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            {/* Wood gradient for rollers */}
            <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3e2723" />
              <stop offset="20%" stopColor="#5d4037" />
              <stop offset="50%" stopColor="#8d6e63" />
              <stop offset="80%" stopColor="#5d4037" />
              <stop offset="100%" stopColor="#3e2723" />
            </linearGradient>
            {/* Paper gradient */}
            <linearGradient id="paper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5deb3" />
              <stop offset="50%" stopColor="#fdf5e6" />
              <stop offset="100%" stopColor="#e8dcc4" />
            </linearGradient>
          </defs>
          
          {/* Wooden Rollers */}
          <rect x="20" y="20" width="40" height="560" fill="url(#wood)" rx="20" filter="drop-shadow(5px 5px 5px rgba(0,0,0,0.5))" />
          <rect x="940" y="20" width="40" height="560" fill="url(#wood)" rx="20" filter="drop-shadow(-5px 5px 5px rgba(0,0,0,0.5))" />
          
          {/* Paper Body with rough edges */}
          <path d="M 50 40 L 950 40 L 950 560 L 50 560 Z" fill="url(#paper-grad)" filter="url(#rough-paper)" />
          
          {/* Paper inner shadow/aging */}
          <path d="M 50 40 L 950 40 L 950 560 L 50 560 Z" fill="none" stroke="#dcb888" strokeWidth="12" filter="url(#rough-paper)" opacity="0.6" />
        </svg>

        {/* Dynamic Tide washing over the scroll (Bottom Only) */}
        <div className="absolute inset-0 left-[6%] right-[6%] top-[8%] bottom-[8%] overflow-hidden rounded-3xl z-20 pointer-events-none mix-blend-multiply opacity-60">
          {/* Bottom tide */}
          <div className="absolute bottom-0 left-0 w-[200%] h-32 md:h-48" style={{ animation: 'wave-x 8s linear infinite, tide-bottom 6s ease-in-out infinite' }}>
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M 0 50 Q 125 20 250 50 T 500 50 T 750 50 T 1000 50 L 1000 100 L 0 100 Z" fill="#b2ebf2" />
            </svg>
          </div>
        </div>

        {/* Scroll Content Container */}
        <div className="relative z-30 w-[90%] h-[85%] flex flex-col">
          
          {/* Title */}
          <div className="absolute top-2 md:top-6 left-1/2 -translate-x-1/2 text-center w-full flex flex-col items-center z-30">
            <div className="relative inline-block transform hover:scale-105 transition-transform duration-500 cursor-default">
              {/* Background thick stroke & shadow */}
              <h1 className="text-4xl md:text-6xl font-bold tracking-[0.15em] absolute top-0 left-0 w-full text-center z-0" 
                  style={{ 
                    fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif', 
                    WebkitTextStroke: '6px #fdf5e6',
                    color: '#fdf5e6',
                    textShadow: '0px 8px 15px rgba(62, 39, 35, 0.5)'
                  }}>
                神秘藏宝岛
              </h1>
              {/* Foreground gradient text */}
              <h1 className="text-4xl md:text-6xl font-bold tracking-[0.15em] relative z-10" 
                  style={{ 
                    fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif', 
                    background: 'linear-gradient(180deg, #8d6e63 0%, #3e2723 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 2px 1px rgba(255,255,255,0.8))'
                  }}>
                神秘藏宝岛
              </h1>
            </div>
            
            <div className="mt-3 flex items-center justify-center gap-3 opacity-80">
              <svg width="40" height="10" viewBox="0 0 40 10" className="opacity-70">
                <path d="M0 5 L15 5 L20 0 L25 5 L40 5" fill="none" stroke="#5c3a21" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#5c3a21] font-serif text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">Treasure Map</p>
              <svg width="40" height="10" viewBox="0 0 40 10" className="opacity-70">
                <path d="M40 5 L25 5 L20 0 L15 5 L0 5" fill="none" stroke="#5c3a21" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Compass Rose */}
          <div className="absolute bottom-0 left-0 opacity-30 pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#5c3a21">
              <circle cx="50" cy="50" r="40" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
              <path d="M 50 0 L 60 40 L 100 50 L 60 60 L 50 100 L 40 60 L 0 50 L 40 40 Z" fill="#5c3a21" opacity="0.2" />
              <path d="M 50 0 L 50 100 M 0 50 L 100 50" strokeWidth="1.5" />
              <text x="44" y="15" fill="#5c3a21" stroke="none" fontSize="14" fontFamily="serif" fontWeight="bold">N</text>
            </svg>
          </div>

          {/* Realistic Island SVG */}
          <svg viewBox="120 100 660 450" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full pointer-events-none mt-10 md:mt-16 opacity-95 z-10">
            <defs>
              <filter id="island-rough">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
                <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#3e2723" floodOpacity="0.4"/>
              </filter>
              <filter id="forest-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="4" result="noise" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" in="noise" result="coloredNoise" />
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
                <feBlend mode="multiply" in="texture" in2="SourceGraphic" />
              </filter>
              <filter id="rock-texture">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" result="coloredNoise" />
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
                <feBlend mode="multiply" in="texture" in2="SourceGraphic" />
              </filter>
            </defs>

            <g filter="url(#island-rough)">
              {/* Shallow Water / Reef */}
              <path d="M 150 300 C 120 150, 400 100, 650 150 C 750 200, 780 400, 650 480 C 450 550, 180 450, 150 300 Z" fill="#81d4fa" opacity="0.5" />
              
              {/* Sand / Beach */}
              <path d="M 180 300 C 160 180, 400 130, 620 180 C 700 240, 720 380, 600 450 C 420 500, 210 420, 180 300 Z" fill="#c1a57b" />
              
              {/* Grass / Vegetation */}
              <path d="M 210 300 C 190 210, 400 160, 580 210 C 650 260, 670 360, 560 420 C 420 460, 240 400, 210 300 Z" fill="#558b2f" filter="url(#forest-texture)" />
              <path d="M 250 280 C 230 230, 400 190, 520 230 C 590 270, 610 340, 520 390 C 400 420, 270 360, 250 280 Z" fill="#33691e" filter="url(#forest-texture)" />
              
              {/* Rocks / Mountains */}
              <path d="M 320 350 L 380 200 L 450 260 L 520 180 L 580 300 L 500 380 L 400 340 Z" fill="#5d4037" filter="url(#rock-texture)" />
              <path d="M 380 200 L 450 260 L 400 340 L 320 350 Z" fill="#4e342e" filter="url(#rock-texture)" />
              <path d="M 520 180 L 580 300 L 500 380 L 450 260 Z" fill="#3e2723" filter="url(#rock-texture)" />
              
              {/* Mountain Peaks (Snow/Highlight) */}
              <path d="M 380 200 L 400 230 L 370 240 Z" fill="#bcaaa4" />
              <path d="M 520 180 L 540 220 L 500 230 Z" fill="#bcaaa4" />
            </g>
          </svg>

          {/* Levels */}
          <div className="absolute inset-0 mt-10 md:mt-16 z-20">
            <LevelButton 
              x="12%" y="50%" mdX="18%" mdY="50%"
              icon={<ShellIcon size={36} />} title="贝壳影院" 
              onClick={() => onSelectLevel('level1')} 
              completed={medals[0]}
            />
            <LevelButton 
              x="50%" y="22%" mdX="50%" mdY="25%"
              icon={<CompassIcon size={36} />} title="潮汐训练营" 
              onClick={() => onSelectLevel('level2')} 
              completed={medals[1]}
            />
            <LevelButton 
              x="88%" y="50%" mdX="82%" mdY="50%"
              icon={<MapScrollIcon size={36} />} title="迷雾迷宫" 
              onClick={() => onSelectLevel('level3')} 
              completed={medals[2]}
            />
            <LevelButton 
              x="50%" y="78%" mdX="50%" mdY="95%"
              icon={<AnchorIcon size={36} />} title="寄居蟹田园" 
              onClick={() => onSelectLevel('level4')} 
              completed={medals[3]}
            />

            {/* Treasure Chest */}
            <AnimatePresence>
              {allMedals && (
                <motion.div 
                  className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Intense Gold Glow */}
                    <motion.div 
                      className="absolute inset-0 bg-yellow-400 blur-2xl rounded-full"
                      animate={{ 
                        opacity: chestOpen ? [0.6, 1, 0.8] : 0.4, 
                        scale: chestOpen ? [1, 2, 1.5] : 1 
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    ></motion.div>
                    
                    {/* Chest Icon */}
                    <div className="w-24 h-24 md:w-32 md:h-32 relative z-10 drop-shadow-2xl">
                       <TreasureChest isOpen={chestOpen} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Treasure Chest Popup */}
      <AnimatePresence>
        {chestOpen && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div 
              className="bg-[#fdf5e6] p-8 md:p-12 rounded-[40px] border-8 border-[#dcb888] shadow-[0_0_100px_rgba(255,215,0,0.6)] text-center max-w-2xl w-full relative overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", delay: 1.5 }}
            >
              {/* Intense Glow Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.3)_0%,transparent_70%)] animate-pulse"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif font-black text-[#8b5a2b] mb-8 leading-relaxed">
                  ✨ 恭喜你！你已成为真正的数对探险家！ ✨
                </h2>
                
                <button 
                  onClick={() => {
                    onTreasureSeen();
                    onSelectLevel('easter_egg');
                  }}
                  className="group relative bg-gradient-to-b from-yellow-400 to-amber-600 text-white font-serif text-lg md:text-xl font-black px-8 py-5 rounded-full shadow-[0_10px_25px_rgba(217,119,6,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-4 border-yellow-200 w-full md:w-auto mx-auto"
                >
                  👉 点击进入【海岛的礼物】彩蛋涂画屋
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Dolphins jumping over everything (High Z-Index) */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <Dolphin className="left-[15%] bottom-[5%]" delay={1} />
        <Dolphin className="right-[20%] bottom-[10%]" delay={6} />
        <Dolphin className="left-[55%] bottom-[2%]" delay={11} />
      </div>

      {/* 4. Seagulls flying over everything */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <Seagull delay={0} />
        <Seagull className="left-20" delay={6} />
        <Seagull className="right-40" delay={13} />
      </div>

      {/* 5. UI Elements (Fixed to screen) */}
      
      {/* Medals */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col items-end z-50">
        <div className="flex items-center gap-2 md:gap-3 bg-white/90 p-1.5 md:p-2 rounded-full border-2 border-sky-200 shadow-lg backdrop-blur-sm">
          <div className="pl-2 md:pl-3 text-sky-800 font-bold text-xs md:text-sm flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500 drop-shadow-sm" />
            <span className="hidden sm:inline">探索进度</span>
          </div>
          <div className="flex gap-1.5 md:gap-2 pr-1 md:pr-1.5">
            {[
              { icon: <ShellIcon size={20} />, name: '贝壳勋章' },
              { icon: <CompassIcon size={20} />, name: '海螺勋章' },
              { icon: <MapScrollIcon size={20} />, name: '罗盘勋章' },
              { icon: <AnchorIcon size={20} />, name: '珊瑚勋章' }
            ].map((medal, i) => (
              <div key={i} className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 ${medals[i] ? 'border-yellow-400 text-amber-700 bg-yellow-100 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'border-slate-200 text-slate-400 bg-slate-50'} transition-all duration-300`} title={medal.name}>
                {medal.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelButton({ x, y, mdX, mdY, icon, title, onClick, completed }: { x: string, y: string, mdX?: string, mdY: string, icon: React.ReactNode, title: string, onClick: () => void, completed: boolean }) {
  const desktopX = mdX || x;
  return (
    <div 
      className="absolute flex flex-col items-center cursor-pointer z-20 group level-button"
      style={{ 
        '--mobile-x': x,
        '--mobile-y': y,
        '--desktop-x': desktopX,
        '--desktop-y': mdY,
        left: 'var(--mobile-x)', 
        top: 'var(--mobile-y)', 
        transform: 'translate(-50%, -50%)' 
      } as React.CSSProperties}
      onClick={onClick}
    >
      <style>{`
        @media (min-width: 768px) {
          .level-button { 
            left: var(--desktop-x) !important;
            top: var(--desktop-y) !important; 
          }
        }
      `}</style>
      <div className="relative">
        <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 ${completed ? 'bg-[#f5deb3] border-[#8b5a2b] text-[#5c3a21]' : 'bg-white border-[#dcb888] text-[#a07855]'} transition-all group-hover:scale-105 shadow-md`}>
          {icon}
        </div>
        {completed && (
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm text-xs md:text-sm font-sans">
            ✓
          </div>
        )}
      </div>
      <div className="mt-2 md:mt-3 bg-white/90 text-[#5c3a21] px-3 py-1 md:px-4 md:py-1.5 border border-[#dcb888] font-serif text-[10px] md:text-xs tracking-widest shadow-sm group-hover:bg-[#f5deb3] transition-colors whitespace-nowrap rounded-sm">
        {title}
      </div>
    </div>
  );
}
