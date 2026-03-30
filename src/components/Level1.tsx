import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Play } from 'lucide-react';

const OceanWave = ({ color, opacity, duration, reverse, className }: { color: string, opacity: number, duration: number, reverse?: boolean, className: string }) => (
  <div className={`absolute left-0 w-[200%] flex flex-col ${className}`} style={{ opacity, animation: `wave-x ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}>
    <svg viewBox="0 0 1000 50" preserveAspectRatio="none" className="w-full h-[8vh] md:h-[12vh] shrink-0">
      <path d="M 0 25 Q 125 0 250 25 T 500 25 T 750 25 T 1000 25 L 1000 50 L 0 50 Z" fill={color} />
    </svg>
    <div className="flex-1 w-full" style={{ backgroundColor: color }}></div>
  </div>
);

const Seagull = ({ className, delay }: { className?: string, delay: number }) => (
  <svg className={`absolute opacity-0 pointer-events-none ${className}`} viewBox="0 0 100 100" width="50" height="50" style={{ animation: `fly 18s linear infinite ${delay}s` }}>
    <path d="M 20 50 Q 40 30 50 50 Q 60 30 80 50 Q 60 45 50 55 Q 40 45 20 50 Z" fill="#ffffff" stroke="#90a4ae" strokeWidth="1.5" opacity="0.95" />
    <path d="M 20 50 Q 25 45 30 50 Z" fill="#455a64" />
    <path d="M 80 50 Q 75 45 70 50 Z" fill="#455a64" />
  </svg>
);

const ShellIcon = ({ size = 28, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-md ${className}`}>
    <defs>
      <linearGradient id="shellGradL1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
    </defs>
    <path d="M50 90 C10 90, 5 40, 20 20 C35 0, 65 0, 80 20 C95 40, 90 90, 50 90 Z" fill="url(#shellGradL1)" stroke="#0284c7" strokeWidth="2" />
    <path d="M50 90 L50 10 M40 88 L25 15 M60 88 L75 15 M30 80 L12 30 M70 80 L88 30" stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M35 90 C40 100, 60 100, 65 90 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
  </svg>
);

const ContentContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative z-10 w-full max-w-4xl flex flex-col items-center justify-start pt-8 md:pt-12 px-4 h-full overflow-y-auto ${className}`}>
    <div className="relative z-30 w-full md:w-[85%] flex flex-col pb-8">
      {children}
    </div>
  </div>
);

const TicketBoothScene = () => (
  <div className="relative w-full max-w-sm h-32 mt-2 mb-6 mx-auto overflow-hidden rounded-2xl bg-gradient-to-b from-[#e0f2fe]/40 to-[#bae6fd]/60 border-2 border-[#7dd3fc] shadow-inner">
    <style>{`
      @keyframes queue {
        0% { transform: translateX(-250px); }
        100% { transform: translateX(350px); }
      }
      @keyframes hop {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      @keyframes sway {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
      }
    `}</style>

    {/* Background Elements */}
    <div className="absolute bottom-0 w-full h-8 bg-[#fef08a]/30 rounded-t-[100%]"></div>
    <div className="absolute top-2 left-4 text-2xl opacity-50 animate-[float-slow_4s_ease-in-out_infinite]">☁️</div>
    <div className="absolute top-4 right-12 text-xl opacity-40 animate-[float-slow_5s_ease-in-out_infinite_1s]">☁️</div>

    {/* Ticket Booth - Redesigned as a cute wooden shack */}
    <div className="absolute right-4 bottom-1 flex flex-col items-center z-20">
      {/* Roof */}
      <div className="relative z-30 w-28 h-10 bg-[#fcd34d] rounded-t-xl border-b-4 border-[#fbbf24] shadow-md flex items-center justify-center overflow-hidden">
        {/* Striped awning pattern */}
        <div className="absolute inset-0 flex">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-[#f87171]' : 'bg-white'}`}></div>
          ))}
        </div>
        {/* Scalloped edge */}
        <div className="absolute -bottom-2 w-[120%] h-4 flex justify-around">
           {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-5 h-5 rounded-full ${i % 2 === 0 ? 'bg-[#f87171]' : 'bg-white'} shadow-sm`}></div>
          ))}
        </div>
        <div className="absolute bg-white/90 px-2 py-0.5 rounded-md border border-[#f87171] shadow-sm z-10 transform -rotate-2 animate-[sway_3s_ease-in-out_infinite]">
          <span className="text-[#ef4444] text-[10px] font-bold tracking-widest">售票处</span>
        </div>
      </div>
      
      {/* Booth Body */}
      <div className="w-24 h-16 bg-[#fef3c7] border-x-4 border-b-4 border-[#d97706] relative flex items-end justify-center pb-1 shadow-md">
        {/* Window opening */}
        <div className="absolute top-2 w-16 h-12 bg-[#bae6fd] border-2 border-[#92400e] rounded-t-md overflow-hidden flex items-end justify-center">
          {/* Ticket Conductor (Penguin) */}
          <div className="text-3xl origin-bottom animate-[hop_2s_infinite] mb-1">🐧</div>
        </div>
        {/* Wood planks detail */}
        <div className="w-full flex justify-around absolute bottom-0 h-4 opacity-20">
          <div className="w-px h-full bg-[#92400e]"></div>
          <div className="w-px h-full bg-[#92400e]"></div>
          <div className="w-px h-full bg-[#92400e]"></div>
        </div>
      </div>
    </div>

    {/* Queue of animals */}
    <div className="absolute left-0 bottom-2 flex gap-4 z-10 items-end" style={{ animation: 'queue 18s linear infinite' }}>
      <div className="text-3xl drop-shadow-md animate-[float-slow_2s_ease-in-out_infinite] transform -scale-x-100">🐠</div>
      <div className="text-2xl drop-shadow-md animate-[hop_1.5s_ease-in-out_infinite] transform -scale-x-100">🐡</div>
      <div className="text-3xl drop-shadow-md animate-[float-slow_2.5s_ease-in-out_infinite]">🐙</div>
      <div className="text-2xl drop-shadow-md animate-[hop_1.8s_ease-in-out_infinite] transform -scale-x-100">🐢</div>
      <div className="text-3xl drop-shadow-md animate-[float-slow_2.2s_ease-in-out_infinite]">🦑</div>
      <div className="text-2xl drop-shadow-md animate-[hop_1.6s_ease-in-out_infinite] transform -scale-x-100">🦐</div>
      <div className="text-3xl drop-shadow-md animate-[float-slow_2.1s_ease-in-out_infinite] transform -scale-x-100">🐬</div>
    </div>
  </div>
);

interface Level1Props {
  medals: boolean[];
  onWin: () => void;
  onBack: () => void;
}

export default function Level1({ medals, onWin, onBack }: Level1Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [target, setTarget] = useState({ col: 0, row: 0 });
  const [animalsGrid, setAnimalsGrid] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shakingCell, setShakingCell] = useState<{col: number, row: number} | null>(null);

  const generateTarget = () => {
    const newTarget = {
      col: Math.floor(Math.random() * 5) + 1,
      row: Math.floor(Math.random() * 5) + 1
    };
    setTarget(newTarget);
    
    const animals = ['🐠', '🐡', '🐙', '🦀', '🦐', '🦑', '🐬', '⭐', '🦭', '🐧'];
    const newGrid: Record<string, string> = {};
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        if (r !== newTarget.row || c !== newTarget.col) {
          newGrid[`${c}-${r}`] = animals[Math.floor(Math.random() * animals.length)];
        }
      }
    }
    setAnimalsGrid(newGrid);
  };

  useEffect(() => {
    generateTarget();
  }, []);

  const handleCellClick = (col: number, row: number) => {
    if (showSuccess) return;

    if (col === target.col && row === target.row) {
      setErrorMsg(null);
      setShakingCell(null);
      setShowSuccess(true);
      setProgress(p => p + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#bae6fd', '#ffffff']
      });

      setTimeout(() => {
        setShowSuccess(false);
        if (progress + 1 >= 3) {
          onWin();
        } else {
          generateTarget();
        }
      }, progress + 1 >= 3 ? 3000 : 2000);
    } else {
      setShakingCell({ col, row });
      setErrorMsg("不对不对，再数数，从左往右第几列？从下往上第几行？");
      setTimeout(() => {
        setErrorMsg(null);
        setShakingCell(null);
      }, 3000);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#4fc3f7] font-serif flex items-center justify-center">
      
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) rotate(-5deg); }
          75% { transform: translateX(4px) rotate(5deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Realistic Ocean Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[100px] opacity-50"></div>
        <OceanWave color="#29b6f6" opacity={0.6} duration={35} className="top-[10%] h-[90%]" />
        <OceanWave color="#03a9f4" opacity={0.7} duration={25} reverse className="top-[30%] h-[70%]" />
        <OceanWave color="#0288d1" opacity={0.8} duration={20} className="top-[50%] h-[50%]" />
        <OceanWave color="#0277bd" opacity={0.9} duration={15} reverse className="top-[70%] h-[30%]" />
        <OceanWave color="#01579b" opacity={1} duration={12} className="top-[85%] h-[15%]" />
      </div>

      {/* Seagulls */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Seagull delay={0} />
        <Seagull className="left-20" delay={6} />
        <Seagull className="right-40" delay={13} />
      </div>

      <ContentContainer>
        {showIntro ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full h-full py-4">
            <ShellIcon size={70} className="mb-2 md:mb-4 shrink-0" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-[0.15em] text-[#0284c7] mb-2 shrink-0" style={{ fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>
              贝壳影院
            </h1>
            <p className="text-[#0369a1] text-sm md:text-base font-serif mb-2 max-w-lg leading-relaxed shrink-0">
              欢迎来到海岛上最著名的贝壳影院！今天放映的是《海怪传说》。请根据电影票上的坐标，找到你的专属座位吧！
            </p>
            
            <div className="shrink-0 w-full">
              <TicketBoothScene />
            </div>

            <button
              onClick={() => setShowIntro(false)}
              className="shrink-0 bg-[#0284c7] hover:bg-[#0369a1] text-white font-serif text-lg md:text-xl px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 border-2 border-[#bae6fd]"
            >
              <Play size={24} fill="currentColor" /> 开始寻座
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-start pt-2 md:pt-4 px-2">
            {/* Header */}
            <div className="w-full flex justify-between items-start mb-2 md:mb-4">
              <button onClick={onBack} className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors text-[#0284c7] shadow-sm mt-1">
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex flex-col items-end gap-2">
                {/* Fragments */}
                {progress < 3 && (
                  <div className="flex items-center gap-2 text-[#ea580c] font-serif font-bold bg-white/50 px-4 py-2 rounded-full shadow-sm">
                    <span>贝壳碎片:</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={`text-lg transition-all duration-500 ${i < progress ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`}>
                          🐚
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Turtle Task Description */}
            <div className="flex items-end justify-center gap-2 mb-4 md:mb-6 w-full max-w-md relative">
              <div className="relative flex flex-col items-center animate-[float-slow_3s_ease-in-out_infinite]">
                {/* Turtle */}
                <div className="text-5xl drop-shadow-lg transform -scale-x-100">🐢</div>
                <div className="absolute top-2 right-2 text-xs">💧</div>
              </div>
              
              {/* Speech Bubble */}
              <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-none border-2 border-[#bae6fd] shadow-md relative max-w-[250px]">
                <p className="text-[#0369a1] font-serif text-sm md:text-base leading-snug">
                  "呜...我的票上写着 <span className="font-bold text-[#0284c7] text-lg">({target.col}, {target.row})</span>，可是这么多座位，到底哪个是我的呀？你能帮我找找吗？"
                </p>
              </div>
            </div>

            {/* Grid */}
            <div className="relative bg-white/40 p-3 md:p-6 rounded-2xl border border-[#e0f2fe] shadow-inner w-full max-w-lg">
              {/* Giant Canvas Screen */}
              <div className="w-full h-24 md:h-32 bg-[#f8fafc] rounded-lg mb-4 md:mb-6 border-4 border-[#d97706] shadow-inner relative overflow-hidden flex items-center justify-center">
                {/* Canvas texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                
                {/* Underwater animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8] to-[#0284c7] opacity-80"></div>
                
                {/* Animated fish on screen */}
                <div className="absolute top-4 text-2xl animate-[queue_10s_linear_infinite] transform -scale-x-100">🐋</div>
                <div className="absolute bottom-4 text-xl animate-[queue_8s_linear_infinite_2s] transform -scale-x-100">🦈</div>
                <div className="absolute top-8 text-lg animate-[queue_12s_linear_infinite_1s] transform -scale-x-100">🐠</div>
                
                {/* Bubbles */}
                <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-white rounded-full animate-[hop_3s_ease-in-out_infinite] opacity-50"></div>
                <div className="absolute bottom-0 left-2/4 w-3 h-3 bg-white rounded-full animate-[hop_4s_ease-in-out_infinite_1s] opacity-40"></div>
                <div className="absolute bottom-0 left-3/4 w-1.5 h-1.5 bg-white rounded-full animate-[hop_2.5s_ease-in-out_infinite_0.5s] opacity-60"></div>

                <div className="relative z-10 border-2 border-white/30 px-4 py-1 rounded bg-black/20 backdrop-blur-sm">
                   <span className="text-white font-serif text-sm md:text-base tracking-widest font-bold drop-shadow-md">《海怪传说》放映中</span>
                </div>
              </div>

              <div className="flex justify-center">
                {/* Row labels (Y axis) */}
                <div className="flex flex-col gap-1.5 md:gap-3 mr-2 md:mr-3">
                  {[5, 4, 3, 2, 1].map(row => (
                    <div key={row} className="h-10 w-6 md:h-12 md:w-8 flex items-center justify-center font-serif font-bold text-[#0284c7]">
                      {row}
                    </div>
                  ))}
                </div>

                <div>
                  {/* The Grid */}
                  <div className="grid grid-cols-5 gap-1.5 md:gap-3">
                    {[5, 4, 3, 2, 1].flatMap(row => (
                      [1, 2, 3, 4, 5].map(col => {
                        const isTarget = col === target.col && row === target.row;
                        const isSuccess = showSuccess && isTarget;
                        
                        return (
                          <button
                            key={`${col}-${row}`}
                            className={`relative w-10 h-10 md:w-12 md:h-12 rounded-t-full rounded-b-md flex items-center justify-center text-xl md:text-2xl transition-all overflow-hidden
                              ${isSuccess 
                                ? 'bg-[#fdf2f8] shadow-[0_0_15px_rgba(244,114,182,0.8)] scale-110 z-10 border-2 border-[#f472b6]' 
                                : 'bg-[#fdf2f8] border-2 border-[#fbcfe8] shadow-sm hover:bg-[#fce7f3] hover:scale-105'}`}
                            onClick={() => handleCellClick(col, row)}
                          >
                            {/* Shell ridges */}
                            <div className="absolute inset-0 flex justify-evenly opacity-30 pointer-events-none">
                              <div className="w-px h-full bg-[#f472b6] transform rotate-12"></div>
                              <div className="w-px h-full bg-[#f472b6]"></div>
                              <div className="w-px h-full bg-[#f472b6] transform -rotate-12"></div>
                            </div>
                            {/* Seaweed */}
                            <div className="absolute bottom-0 w-full h-1/3 bg-[#4ade80] rounded-t-xl opacity-70 pointer-events-none"></div>
                            <div className="absolute bottom-[-2px] text-[10px] opacity-80 pointer-events-none">🌿</div>
                            
                            {/* Animal or Empty */}
                            <div className={`relative z-10 text-lg md:text-xl leading-none ${shakingCell?.col === col && shakingCell?.row === row ? 'animate-[shake_0.2s_ease-in-out_3]' : ''}`}>
                              {isTarget ? (
                                isSuccess ? (
                                  <div className="relative flex items-center justify-center">
                                    <span>🐢</span>
                                    <span className="absolute -bottom-1 -right-1 text-sm animate-[pop-in_0.4s_ease-out_forwards]">🍿</span>
                                  </div>
                                ) : ''
                              ) : animalsGrid[`${col}-${row}`]}
                            </div>
                          </button>
                        );
                      })
                    ))}
                  </div>

                  {/* Col labels (X axis) */}
                  <div className="grid grid-cols-5 gap-1.5 md:gap-3 mt-2 md:mt-3">
                    {[1, 2, 3, 4, 5].map(col => (
                      <div key={col} className="w-10 md:w-12 flex items-center justify-center font-serif font-bold text-[#0284c7]">
                        {col}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 md:bottom-8 bg-white text-[#e11d48] px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg border border-[#fda4af] font-serif z-50 text-sm md:text-base text-center max-w-[90%]"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </ContentContainer>
    </div>
  );
}
