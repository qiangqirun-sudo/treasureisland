import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, Flag, Play, X } from 'lucide-react';

const ScallopShell = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    {/* Classic Scallop silhouette with bold lines */}
    <path d="M50,95 C30,95 2,80 2,45 C2,15 25,2 50,2 C75,2 98,15 98,45 C98,80 70,95 50,95 Z" opacity="0.15" />
    <path d="M50,95 C30,95 2,80 2,45 C2,15 25,2 50,2 C75,2 98,15 98,45 C98,80 70,95 50,95 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    {/* Bold radiating ribs */}
    <path d="M50,95 L50,2 M50,95 L20,10 M50,95 L80,10 M50,95 L5,30 M50,95 L95,30 M50,95 L2,50 M50,95 L98,50" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round" />
    {/* Large hinge base */}
    <path d="M30,95 L70,95 L75,100 L25,100 Z" />
  </svg>
);

const TideTrainingScene = () => (
  <div className="relative w-full max-w-md mx-auto aspect-[4/3] my-2 md:my-4 flex items-center justify-center">
    <style>{`
      @keyframes tide-surge {
        0%, 100% { transform: scale(1) translateY(0); opacity: 0.4; }
        50% { transform: scale(1.05) translateY(-3px); opacity: 0.7; }
      }
      @keyframes foam-ripple {
        0% { transform: scale(1); opacity: 0; }
        50% { transform: scale(1.02); opacity: 0.5; }
        100% { transform: scale(1.04); opacity: 0; }
      }
      .animate-tide {
        transform-origin: center;
        animation: tide-surge 4s ease-in-out infinite;
      }
      .animate-foam {
        transform-origin: center;
        animation: foam-ripple 4s ease-in-out infinite;
      }
    `}</style>
    <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-xl">
      <defs>
        <filter id="island-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#3e2723" floodOpacity="0.3"/>
        </filter>
        <filter id="sand-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
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
        {/* Shallow Water / Reef - Animated Tide */}
        <path 
          d="M 20 150 C 10 50, 150 20, 300 40 C 380 50, 390 150, 370 250 C 350 320, 100 280, 20 150 Z" 
          fill="#81d4fa" 
          className="animate-tide"
        />
        
        {/* Sand / Beach */}
        <path d="M 40 150 C 30 70, 150 40, 280 60 C 350 70, 360 150, 340 230 C 320 290, 100 260, 40 150 Z" fill="#c1a57b" filter="url(#sand-texture)" />

        {/* Foam Ripple - Surging up the beach */}
        <path 
          d="M 40 150 C 30 70, 150 40, 280 60 C 350 70, 360 150, 340 230 C 320 290, 100 260, 40 150 Z" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          className="animate-foam"
        />
      </g>

      {/* Blue Grid drawn on the sand */}
      <g stroke="#0288d1" strokeWidth="2" opacity="0.6" strokeDasharray="4 4">
        {/* Horizontal lines */}
        {[80, 120, 160, 200].map(y => (
          <line key={`h-${y}`} x1="60" y1={y} x2="320" y2={y} />
        ))}
        {/* Vertical lines */}
        {[80, 120, 160, 200, 240, 280].map(x => (
          <line key={`v-${x}`} x1={x} y1="60" x2={x} y2="240" />
        ))}
      </g>

      {/* Origin Stone at bottom-left intersection (x=80, y=200) */}
      <g transform="translate(80, 200)">
        {/* Shadow */}
        <ellipse cx="0" cy="8" rx="18" ry="8" fill="#3e2723" opacity="0.4" />
        {/* Stone Base */}
        <path d="M -18 8 L -24 -12 L -6 -32 L 12 -26 L 24 -6 L 14 8 Z" fill="#5d4037" filter="url(#rock-texture)" />
        {/* Stone Highlight */}
        <path d="M -6 -32 L 12 -26 L 0 -6 L -18 8 Z" fill="#8d6e63" opacity="0.6" />
      </g>

      {/* Red Flag at top-right intersection (x=240, y=120) */}
      <g transform="translate(240, 120)">
        {/* Shadow */}
        <ellipse cx="0" cy="4" rx="12" ry="4" fill="#3e2723" opacity="0.4" />
        {/* Pole */}
        <line x1="0" y1="4" x2="0" y2="-35" stroke="#4e342e" strokeWidth="4" strokeLinecap="round" />
        {/* Flag */}
        <path d="M 0 -32 L 28 -20 L 0 -8 Z" fill="#e53935" />
        {/* Label */}
        <rect x="-28" y="-52" width="56" height="16" rx="4" fill="#2e7d32" opacity="0.95" />
        <text x="0" y="-40" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#ffffff" textAnchor="middle">安全高地</text>
      </g>
    </svg>
  </div>
);

interface Level2Props {
  onWin: () => void;
  onBack: () => void;
}

export default function Level2({ onWin, onBack }: Level2Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [target, setTarget] = useState({ col: 0, row: 0 });
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<{ col: number, row: number, isCorrect: boolean, id: number } | null>(null);
  const [instructorAction, setInstructorAction] = useState<'idle' | 'shake' | 'thumbsup'>('idle');

  const generateTarget = (currentProgress: number) => {
    // Difficulty progression
    if (currentProgress === 0) {
      setTarget({ col: 4, row: 3 }); // Simple
    } else if (currentProgress === 1) {
      setTarget({ col: 5, row: 4 }); // Medium
    } else {
      setTarget({ col: 2, row: 5 }); // Advanced
    }
  };

  useEffect(() => {
    generateTarget(0);
  }, []);

  useEffect(() => {
    if (errorCount >= 2) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 8000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [errorCount]);

  const handlePointClick = (col: number, row: number) => {
    if (showSuccess) return;

    const isCorrect = col === target.col && row === target.row;
    setLastAttempt({ col, row, isCorrect, id: Date.now() });

    if (isCorrect) {
      setErrorMsg(null);
      setErrorCount(0);
      setShowSuccess(true);
      setInstructorAction('thumbsup');
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#fbbf24', '#f472b6']
      });

      setTimeout(() => {
        setShowSuccess(false);
        setInstructorAction('idle');
        setLastAttempt(null);
        if (progress + 1 >= 3) {
          onWin();
        } else {
          setProgress(p => p + 1);
          generateTarget(progress + 1);
        }
      }, 3000);
    } else {
      setErrorCount(c => c + 1);
      setInstructorAction('shake');
      setErrorMsg(`"从起点开始数！先数贝壳列：0,1,2,3...再数海星行：0,1,2,3..."`);
      
      setTimeout(() => {
        setErrorMsg(null);
        setInstructorAction('idle');
      }, 4000);
    }
  };

  return (
    <div className="w-full h-full bg-[#fdf6e3] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Sand Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d4a373 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>


      {/* Bottom Tide Effect (Waves) */}
      {!showIntro && (
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-40 z-0 pointer-events-none overflow-hidden">
          {/* Layer 1: Deep Water */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-full bg-blue-600/10"
            animate={{ height: ['80%', '90%', '80%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          
          {/* Layer 2: Middle Wave */}
          <motion.div 
            className="absolute bottom-0 left-[-50%] w-[200%] h-full bg-blue-400/15"
            animate={{ 
              x: ['-25%', '0%'],
              y: [5, 0, 5]
            }}
            transition={{ 
              x: { repeat: Infinity, duration: 15, ease: "linear" },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
            style={{ borderRadius: '45% 55% 0 0' }}
          />

          {/* Layer 3: Top Foam/Wave */}
          <motion.div 
            className="absolute bottom-0 left-[-50%] w-[200%] h-[80%] bg-blue-300/20 border-t-2 border-white/30"
            animate={{ 
              x: ['0%', '-25%'],
              y: [0, 8, 0]
            }}
            transition={{ 
              x: { repeat: Infinity, duration: 12, ease: "linear" },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            style={{ borderRadius: '55% 45% 0 0' }}
          />

          {/* Floating Bubbles near the shore */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-4 w-1 h-1 md:w-2 md:h-2 bg-white/40 rounded-full"
              style={{ left: `${i * 10 + 5}%` }}
              animate={{ 
                y: [-10, -40],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.8]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {showIntro ? (
        <div className="z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-amber-900 mb-4" style={{ fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>
            潮汐训练营
          </h1>
          <p className="text-amber-800 text-sm md:text-base font-serif mb-4 leading-relaxed">
            潮汐训练营是海岛冒险家的必修课。这里有一张神秘的"潮汐网格"，每当涨潮时，海水会从起点石(0,0)开始慢慢淹没网格。只有熟练掌握坐标的人，才能准确找到安全高地。
          </p>
          
          <TideTrainingScene />

          <button
            onClick={() => setShowIntro(false)}
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-serif text-lg md:text-xl px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 border-2 border-amber-300"
          >
            <Play size={24} fill="currentColor" /> 开始训练
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="absolute top-4 md:top-6 left-4 md:left-6 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 z-20">
            <button onClick={onBack} className="p-2 md:p-3 bg-white/80 rounded-full hover:bg-white shadow-md transition-colors">
              <ArrowLeft className="text-amber-900 w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="bg-white/80 px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-md font-bold text-amber-900 flex items-center gap-2 text-sm md:text-base">
              <span>进度:</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <Star key={i} className={`w-4 h-4 md:w-5 md:h-5 ${i < progress ? "fill-blue-400 text-blue-400" : "text-gray-300"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Story / Task */}
          <div className="z-30 bg-white/90 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl w-[90%] max-w-2xl text-center mt-24 md:mt-0 mb-8 md:mb-12 border-2 md:border-4 border-amber-200 relative">
            <motion.div 
              className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-4xl md:text-6xl"
              animate={
                instructorAction === 'shake' ? { rotate: [-15, 15, -15, 15, 0] } :
                instructorAction === 'thumbsup' ? { y: [-10, 0, -10, 0], scale: [1, 1.1, 1] } :
                {}
              }
              transition={{ duration: 0.5, repeat: instructorAction === 'idle' ? 0 : Infinity }}
            >
              {instructorAction === 'thumbsup' ? '👍🦭' : '🦭'}
            </motion.div>
            <h2 className="text-xl md:text-2xl font-bold text-amber-900 mt-2 md:mt-4 mb-1 md:mb-2">海狮教官</h2>
            <p className="text-amber-800 text-sm md:text-lg italic">
              {showSuccess ? (
                <span className="text-green-600 font-bold flex flex-col items-center gap-1">
                  <span className="text-2xl">叮！✨</span>
                  <span>"太棒了！旗子插得稳稳当当！"</span>
                </span>
              ) : (
                instructorAction === 'shake' ? (
                  <span className="text-red-600 font-bold">"从起点开始数！先数贝壳列：0,1,2,3...再数海星行：0,1,2,3..."</span>
                ) : (
                  `"新兵小皮注意！海水每次涨潮都从这块起点石开始淹。现在，宝藏埋在 (${target.col}, ${target.row})，快点找到他，准确插上旗帜吧！"`
                )
              )}
            </p>
            
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-14 md:-bottom-20 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg whitespace-nowrap font-bold border-2 border-red-200 z-[100] text-xs md:text-base"
                >
                  {errorMsg}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-red-100 border-t-2 border-l-2 border-red-200 rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid Area */}
          <div className="z-10 relative p-4 md:p-8 bg-white/40 rounded-3xl backdrop-blur-sm border-2 border-white/50 shadow-2xl">
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
              
              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                {/* Visual Aid: Starting lines (Row 0, Col 0) */}
                <rect x="0" y="250" width="300" height="50" fill="#fef3c7" opacity="0.5" />
                <rect x="0" y="0" width="50" height="300" fill="#fef3c7" opacity="0.5" />

                {/* Horizontal Lines (Rows 0-5) */}
                {[0, 50, 100, 150, 200, 250, 300].map((y, i) => (
                  <line 
                    key={`h-${i}`} 
                    x1="0" y1={y} x2="300" y2={y} 
                    stroke="#0288d1" 
                    strokeWidth={i === 6 ? 3 : 1} 
                    opacity={i === 6 ? 0.8 : 0.3} 
                    strokeDasharray={i === 6 ? "" : "4 4"}
                  />
                ))}
                {/* Vertical Lines (Cols 0-5) */}
                {[0, 50, 100, 150, 200, 250, 300].map((x, i) => (
                  <line 
                    key={`v-${i}`} 
                    x1={x} y1="0" x2={x} y2="300" 
                    stroke="#0288d1" 
                    strokeWidth={i === 0 ? 3 : 1} 
                    opacity={i === 0 ? 0.8 : 0.3} 
                    strokeDasharray={i === 0 ? "" : "4 4"}
                  />
                ))}
              </svg>

              {/* Origin Stone */}
              <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 z-10 pointer-events-none">
                <div className="relative">
                  {/* Stone */}
                  <div className="w-10 h-6 md:w-16 md:h-10 bg-stone-500 rounded-[100%] border-b-4 border-stone-700 shadow-lg"></div>
                </div>
              </div>

              {/* X-Axis Shells (Col 1-5, Row 0) */}
              {[1, 2, 3, 4, 5].map(col => (
                <div 
                  key={`shell-${col}`}
                  className="absolute bottom-[-24px] md:bottom-[-40px] flex flex-col items-center"
                  style={{ left: `${(col / 6) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="relative flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-stone-50 rounded-full shadow-lg border-2 border-stone-200">
                    <ScallopShell className="w-8 h-8 md:w-14 md:h-14 text-stone-400 fill-stone-100" />
                    <span className="absolute text-base md:text-3xl font-black text-stone-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">{col}</span>
                  </div>
                </div>
              ))}

              {/* Y-Axis Starfish (Row 1-5, Col 0) */}
              {[1, 2, 3, 4, 5].map(row => (
                <div 
                  key={`star-${row}`}
                  className="absolute left-[-24px] md:left-[-40px] flex items-center"
                  style={{ bottom: `${(row / 6) * 100}%`, transform: 'translateY(50%)' }}
                >
                  <div className="relative flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-rose-50 rounded-full shadow-lg border-2 border-rose-200">
                    <Star className="w-8 h-8 md:w-14 md:h-14 text-rose-400 fill-rose-400" />
                    <span className="absolute text-base md:text-3xl font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{row}</span>
                  </div>
                </div>
              ))}

              {/* Grid Points (Intersections) */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                {[5, 4, 3, 2, 1, 0].flatMap(row => (
                  [0, 1, 2, 3, 4, 5].map(col => {
                    const isTarget = col === target.col && row === target.row;
                    const isSuccess = showSuccess && isTarget;
                    const isOrigin = col === 0 && row === 0;
                    
                    return (
                      <div
                        key={`${col}-${row}`}
                        className="relative flex items-center justify-center group"
                        style={{ width: '100%', height: '100%' }}
                      >
                        {/* Interactive area around the intersection (bottom-left of the cell) */}
                        <div 
                          className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 -translate-x-1/2 translate-y-1/2 cursor-pointer z-20 flex items-center justify-center"
                          onClick={() => handlePointClick(col, row)}
                        >
                          {/* Flagpole (Unflagged) - REMOVED per user request */}

                          {/* Origin Golden Flag */}
                          {isOrigin && (
                            <motion.div 
                              className="relative flex flex-col items-center"
                              animate={{ 
                                rotate: [-1, 1, -1],
                              }}
                              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                              <div className="w-1 h-8 md:h-10 bg-amber-800 rounded-full shadow-sm"></div>
                              <motion.div 
                                className="absolute top-0 left-1 w-6 h-4 md:w-8 md:h-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 shadow-md"
                                style={{ 
                                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                                  transformOrigin: 'left center'
                                }}
                                animate={{ 
                                  rotateY: [0, 20, 0, -20, 0],
                                  skewY: [-5, 5, -5],
                                  scaleX: [1, 0.9, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                              />
                            </motion.div>
                          )}

                        {/* Success Flag */}
                        {isSuccess && (
                          <motion.div 
                            initial={{ scale: 0, y: -20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            className="relative"
                          >
                            <div className="w-1 h-6 md:h-8 bg-blue-700 rounded-full"></div>
                            <div className="absolute top-0 left-1 w-4 h-3 md:w-6 md:h-4 bg-blue-500 rounded-sm shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}>
                              {/* Streamers */}
                              <motion.div 
                                className="absolute top-0 right-0 w-full h-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                              >
                                <div className="absolute -right-2 top-0 w-4 h-0.5 bg-pink-400 rotate-12"></div>
                                <div className="absolute -right-3 top-2 w-5 h-0.5 bg-yellow-400 -rotate-12"></div>
                                <div className="absolute -right-2 top-4 w-4 h-0.5 bg-cyan-400 rotate-6"></div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}

                        {/* Error Feedback (Fallen Flag and Bubbles) */}
                        {lastAttempt && lastAttempt.col === col && lastAttempt.row === row && !lastAttempt.isCorrect && (
                          <motion.div 
                            key={`error-${lastAttempt.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative"
                          >
                            {/* Fallen Flag */}
                            <motion.div 
                              initial={{ rotate: 0 }}
                              animate={{ rotate: 75 }}
                              className="origin-bottom"
                            >
                              <div className="w-1 h-6 md:h-8 bg-gray-400 rounded-full"></div>
                              <div className="absolute top-0 left-1 w-4 h-3 md:w-6 md:h-4 bg-gray-300 rounded-sm" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
                            </motion.div>
                            {/* Bubbles */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute bottom-0 left-0 w-2 h-2 bg-blue-200/60 rounded-full border border-white/40"
                                initial={{ y: 0, x: 0, scale: 0.5, opacity: 1 }}
                                animate={{ 
                                  y: -20 - i * 10, 
                                  x: (i - 1) * 10, 
                                  scale: [0.5, 1, 0.8],
                                  opacity: [1, 0.8, 0] 
                                }}
                                transition={{ duration: 1.5, delay: i * 0.2 }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </div>

                      {/* Intersection Dot - Only show for grid internal points (not on axes) */}
                      {!(col === 0 || row === 0) && (
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-amber-400/60 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                      )}
                    </div>
                  );
                })
              ))}
              </div>

              {/* Origin Stone */}
              <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-2xl md:text-4xl z-10 pointer-events-none drop-shadow-md">
                🪨
              </div>

            </div>
          </div>

          {/* Hint Note (Treasure Hint) */}
          <AnimatePresence>
            {showHint && (
              <motion.div 
                initial={{ opacity: 0, y: 100, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-4 right-4 md:bottom-10 md:right-10 w-64 md:w-80 bg-emerald-100 p-5 rounded-lg shadow-2xl border-2 border-emerald-300 z-[100] font-serif overflow-hidden"
              >
                {/* Wave animation background */}
                <motion.div 
                  className="absolute inset-0 bg-blue-400/10"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                
                <div className="relative z-10">
                  <div className="text-lg md:text-xl font-bold mb-2 text-emerald-900 flex items-center justify-between border-b border-emerald-200 pb-1">
                    <span className="flex items-center gap-2">💎 宝藏小贴士</span>
                    <button 
                      onClick={() => setShowHint(false)}
                      className="text-emerald-700 hover:text-emerald-900 transition-colors p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-sm md:text-base text-emerald-800 leading-relaxed font-bold">
                    "(0,0)是起点，往右一列是(1,0)，往上一行是(0,1)。先列后行，就不迷路！"
                  </p>
                  <div className="mt-2 text-[10px] md:text-xs text-emerald-700/70 italic text-right">
                    —— 随浪而来的小贴士
                  </div>
                </div>
                
                {/* Seaweed texture */}
                <div className="absolute -bottom-2 -left-2 w-12 h-12 text-emerald-300/40 rotate-12">🌿</div>
                <div className="absolute -top-2 -right-2 w-12 h-12 text-emerald-300/40 -rotate-12">🌿</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
