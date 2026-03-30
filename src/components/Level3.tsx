import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, Compass, RefreshCw } from 'lucide-react';

interface Level3Props {
  onWin: () => void;
  onBack: () => void;
}

type Coordinate = { col: number; row: number };

const PREDEFINED_LAYOUTS = [
  [
    { col: 3, row: 1, type: 'tree' },
    { col: 4, row: 3, type: 'tree' },
    { col: 5, row: 1, type: 'tree' },
    { col: 1, row: 2, type: 'rock' },
    { col: 2, row: 5, type: 'rock' }
  ],
  [
    { col: 0, row: 3, type: 'tree' },
    { col: 3, row: 0, type: 'rock' },
    { col: 2, row: 4, type: 'tree' },
    { col: 4, row: 1, type: 'rock' },
    { col: 1, row: 5, type: 'tree' }
  ],
  [
    { col: 0, row: 2, type: 'rock' },
    { col: 5, row: 0, type: 'tree' },
    { col: 2, row: 2, type: 'tree' },
    { col: 1, row: 3, type: 'rock' },
    { col: 3, row: 1, type: 'tree' }
  ],
  [
    { col: 0, row: 1, type: 'tree' },
    { col: 3, row: 0, type: 'rock' },
    { col: 4, row: 2, type: 'tree' },
    { col: 1, row: 4, type: 'rock' },
    { col: 5, row: 1, type: 'tree' }
  ],
  [
    { col: 0, row: 2, type: 'rock' },
    { col: 1, row: 0, type: 'tree' },
    { col: 3, row: 3, type: 'tree' },
    { col: 2, row: 4, type: 'rock' },
    { col: 4, row: 0, type: 'tree' }
  ],
  [
    { col: 0, row: 1, type: 'tree' },
    { col: 4, row: 0, type: 'rock' },
    { col: 1, row: 2, type: 'tree' },
    { col: 5, row: 2, type: 'rock' },
    { col: 2, row: 4, type: 'tree' }
  ]
];

export default function Level3({ onWin, onBack }: Level3Props) {
  const [showIntro, setShowIntro] = useState(true);
  const [steps, setSteps] = useState<Coordinate[]>([
    { col: 0, row: 0 },
    { col: 0, row: 0 },
    { col: 0, row: 0 }
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [characterPos, setCharacterPos] = useState<Coordinate>({ col: 0, row: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'error' | 'success'} | null>(null);
  const [visited, setVisited] = useState<Coordinate[]>([{ col: 0, row: 0 }]);
  const [obstacles, setObstacles] = useState(PREDEFINED_LAYOUTS[0]);

  const [animationState, setAnimationState] = useState<'idle' | 'bounce' | 'wave' | 'whirlpool' | 'win'>('idle');
  const [parrotMessage, setParrotMessage] = useState<string | null>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [showMedal, setShowMedal] = useState(false);

  // Auto-dismiss error messages after 2.5 seconds
  useEffect(() => {
    if (message && message.type === 'error') {
      const timer = setTimeout(() => setMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto-dismiss parrot messages after 3 seconds as a fallback
  useEffect(() => {
    if (parrotMessage) {
      const timer = setTimeout(() => setParrotMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [parrotMessage]);

  const handleStepChange = (index: number, field: 'col' | 'row', delta: number) => {
    if (isPlaying || index !== currentStepIndex) return;
    const newSteps = [...steps];
    let val = newSteps[index][field] + delta;
    if (val > 5) val = 0;
    if (val < 0) val = 5;
    newSteps[index][field] = val;
    setSteps(newSteps);
  };

  const resetMaze = () => {
    setCharacterPos({ col: 0, row: 0 });
    setVisited([{ col: 0, row: 0 }]);
    setMessage(null);
    setIsPlaying(false);
    setAnimationState('idle');
    setParrotMessage(null);
    setChestOpen(false);
    setShowMedal(false);
    setCurrentStepIndex(0);
    setSteps([
      { col: 0, row: 0 },
      { col: 0, row: 0 },
      { col: 0, row: 0 }
    ]);
    
    let newLayout;
    do {
      newLayout = PREDEFINED_LAYOUTS[Math.floor(Math.random() * PREDEFINED_LAYOUTS.length)];
    } while (newLayout === obstacles);
    setObstacles(newLayout);
  };

  const resetToStart = () => {
    setCharacterPos({ col: 0, row: 0 });
    setVisited([{ col: 0, row: 0 }]);
    setAnimationState('idle');
    setParrotMessage(null);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const checkWinCondition = (finalPos: Coordinate) => {
    if (finalPos.col === 5 && finalPos.row === 5) {
      setChestOpen(true);
      setAnimationState('win');
      setShowMedal(true);
      setMessage({ text: "获得第3枚罗盘勋章碎片！", type: 'success' });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#4ade80', '#fbbf24']
      });

      setTimeout(() => {
        onWin();
      }, 3000);
    } else {
      setMessage({ text: "还没有到达宝箱位置(5,5)哦！", type: 'error' });
      setTimeout(() => {
        resetToStart();
      }, 2000);
    }
  };

  const confirmStep = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setMessage(null);

    const target = steps[currentStepIndex];
    let currentPos = { ...characterPos };
    let currentVisited = [...visited];

    // Check if straight line
    if (target.col !== currentPos.col && target.row !== currentPos.row) {
      setMessage({ text: "只能上下左右直线移动哦！", type: 'error' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      resetToStart();
      return;
    }

    // Check if moving at all
    if (target.col === currentPos.col && target.row === currentPos.row) {
      if (currentStepIndex < 2) {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsPlaying(false);
      } else {
        checkWinCondition(currentPos);
      }
      return;
    }

    // Move step by step
    const dCol = Math.sign(target.col - currentPos.col);
    const dRow = Math.sign(target.row - currentPos.row);
    
    let tempPos = { ...currentPos };
    while (tempPos.col !== target.col || tempPos.row !== target.row) {
      tempPos.col += dCol;
      tempPos.row += dRow;

      // Check bounds
      if (tempPos.col < 0 || tempPos.col > 5 || tempPos.row < 0 || tempPos.row > 5) {
        setAnimationState('wave');
        setParrotMessage("不能走出网格哦");
        await new Promise(resolve => setTimeout(resolve, 2000));
        resetToStart();
        return;
      }

      // Check obstacles
      if (obstacles.some(o => o.col === tempPos.col && o.row === tempPos.row)) {
        setAnimationState('bounce');
        setParrotMessage("这条路不通，换条路试试");
        await new Promise(resolve => setTimeout(resolve, 2000));
        resetToStart();
        return;
      }

      // Check visited
      if (currentVisited.some(v => v.col === tempPos.col && v.row === tempPos.row)) {
        setCharacterPos({ ...tempPos });
        setAnimationState('whirlpool');
        await new Promise(resolve => setTimeout(resolve, 2000));
        resetToStart();
        return;
      }

      currentVisited.push({ ...tempPos });
      setVisited([...currentVisited]);
      setCharacterPos({ ...tempPos });
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    currentPos = { ...target };

    if (currentStepIndex < 2) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsPlaying(false);
    } else {
      checkWinCondition(currentPos);
    }
  };

  return (
    <div className="w-full h-full bg-[#0d0404] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Mist Red Forest Background - Enhanced */}
      <div className="absolute inset-0 z-0">
        {/* Sky glow with red tint */}
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-red-900/20 via-emerald-950/10 to-transparent"></div>
        
        {/* God Rays / Light Beams */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute top-[-20%] w-32 h-[150%] bg-gradient-to-b from-white/20 to-transparent"
              style={{ 
                left: `${15 + i * 20}%`, 
                transform: 'rotate(-25deg)',
                filter: 'blur(40px)'
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        
        {/* Layered Forest - Background (Far) */}
        <div className="absolute inset-0 flex items-end justify-around px-4 opacity-30 blur-[4px]">
          {[...Array(10)].map((_, i) => {
            const isRed = Math.random() > 0.5;
            return (
              <div key={`tree-far-${i}`} className="relative flex flex-col items-center" style={{ height: `${70 + Math.random() * 20}%`, width: '100px', transform: `translateX(${(Math.random() - 0.5) * 60}px)` }}>
                <div className={`w-3 h-full ${isRed ? 'bg-red-950' : 'bg-emerald-950'} rounded-t-full`}></div>
                <div className={`absolute top-0 w-32 h-64 ${isRed ? 'bg-red-900' : 'bg-emerald-900'} rounded-full opacity-40 -translate-y-1/3`}></div>
              </div>
            );
          })}
        </div>

        {/* Layered Forest - Midground (Detailed Mangroves) */}
        <div className="absolute inset-0 flex items-end justify-around px-2 opacity-70">
          {[...Array(6)].map((_, i) => {
            const isRed = i % 2 === 0;
            const trunkColor = isRed ? '#3b0707' : '#1a3326';
            const leafColor = isRed ? 'bg-red-800' : 'bg-emerald-800';
            return (
              <div 
                key={`tree-mid-${i}`} 
                className="relative flex flex-col items-center"
                style={{ 
                  height: `${55 + Math.random() * 25}%`, 
                  width: '150px',
                  transform: `translateX(${(Math.random() - 0.5) * 30}px) scale(${0.9 + Math.random() * 0.2})`
                }}
              >
                {/* Trunk */}
                <div className="w-6 h-full rounded-t-lg relative" style={{ backgroundColor: trunkColor }}>
                  {/* Branches */}
                  <div className="absolute top-1/4 -left-8 w-12 h-2 rotate-[-30deg] rounded-full" style={{ backgroundColor: trunkColor }}></div>
                  <div className="absolute top-1/3 -right-10 w-16 h-2 rotate-[20deg] rounded-full" style={{ backgroundColor: trunkColor }}></div>
                  <div className="absolute top-1/2 -left-12 w-20 h-2 rotate-[-15deg] rounded-full" style={{ backgroundColor: trunkColor }}></div>
                </div>
                
                {/* Canopy - Clustered Leaves */}
                <div className="absolute top-0 -translate-y-1/2 flex flex-wrap justify-center w-64 h-64">
                  {[...Array(8)].map((_, j) => (
                    <div 
                      key={j} 
                      className={`${leafColor} rounded-full opacity-60 blur-[2px]`} 
                      style={{ 
                        width: `${40 + Math.random() * 40}px`, 
                        height: `${30 + Math.random() * 30}px`,
                        margin: '-10px',
                        transform: `rotate(${Math.random() * 360}deg)`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Mangrove Roots */}
                <div className="absolute bottom-0 w-full flex justify-center">
                  {[...Array(4)].map((_, j) => (
                    <div 
                      key={j} 
                      className="w-2 h-24 rounded-full"
                      style={{ 
                        backgroundColor: trunkColor,
                        transform: `rotate(${(j - 1.5) * 25}deg) translateY(10px)`,
                        transformOrigin: 'top center'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Foreground Vines/Leaves */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(4)].map((_, i) => {
            const isRed = i % 2 !== 0;
            const vineColor = isRed ? 'bg-red-900/40' : 'bg-emerald-900/40';
            const leafColor = isRed ? 'bg-red-800/60' : 'bg-emerald-800/60';
            return (
              <motion.div
                key={`vine-${i}`}
                className={`absolute top-0 w-1 ${vineColor}`}
                style={{ height: '60%', left: `${10 + i * 25}%` }}
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`absolute bottom-0 -left-2 w-5 h-8 ${leafColor} rounded-full rotate-45`}></div>
                <div className={`absolute top-1/2 -right-2 w-4 h-6 ${leafColor} rounded-full -rotate-45`}></div>
              </motion.div>
            );
          })}
        </div>

        {/* Ground / Water Reflection */}
        <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      </div>

      {/* Mist Layers - Flowing between trees */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-white/5 backdrop-blur-[3px]"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`mist-cloud-${i}`}
            className="absolute bg-white/10 rounded-full blur-[100px]"
            style={{
              width: `${400 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 100}px`,
              top: `${20 + Math.random() * 70}%`,
              left: `${-30 + Math.random() * 130}%`,
            }}
            animate={{ x: [-50, 50, -50], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i }}
          />
        ))}
      </div>

      {showIntro ? (
        <div className="z-30 flex flex-col items-center justify-center text-center px-4 w-full max-w-2xl">
          {/* Rustic Wooden Sign - Enhanced */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative mb-16"
          >
            {/* Sign Post */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-8 h-48 bg-[#5d4037] shadow-2xl rounded-b-lg border-x-2 border-black/30 z-0"></div>
            
            {/* Main Sign Board */}
            <div className="relative z-10">
              <div className="bg-[#8d6e63] p-10 md:p-14 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-4 border-[#4e342e] relative overflow-hidden transform -rotate-1">
                {/* Wood texture lines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="h-px bg-black/40 w-full my-3 transform rotate-1"></div>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-[#fffde7] drop-shadow-[0_4px_0_rgba(0,0,0,0.6)]" style={{ fontFamily: 'serif' }}>
                  冒险者请进
                </h1>
                
                {/* Rusty Nails */}
                <div className="absolute top-4 left-4 w-5 h-5 bg-stone-400 rounded-full border-2 border-stone-600 shadow-inner"></div>
                <div className="absolute top-4 right-4 w-5 h-5 bg-stone-400 rounded-full border-2 border-stone-600 shadow-inner"></div>
                <div className="absolute bottom-4 left-4 w-5 h-5 bg-stone-400 rounded-full border-2 border-stone-600 shadow-inner"></div>
                <div className="absolute bottom-4 right-4 w-5 h-5 bg-stone-400 rounded-full border-2 border-stone-600 shadow-inner"></div>
              </div>
              
              {/* Small arrow sign hanging below */}
              <motion.div 
                className="absolute -bottom-10 right-6 bg-[#795548] px-6 py-3 rounded shadow-2xl border-2 border-[#4e342e] transform rotate-3"
                animate={{ rotate: [3, 6, 3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-[#fffde7] font-bold text-base tracking-wider">前方危险 ➔</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowIntro(false)}
            className="relative z-20 px-20 py-5 bg-[#fef3c7] text-[#5d4037] rounded-2xl font-bold text-2xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all border-b-4 border-[#d97706]/30 flex items-center gap-3 group"
          >
            <span className="tracking-[0.2em]">开始探险</span>
            <motion.span 
              animate={{ x: [0, 5, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl"
            >
              ➔
            </motion.span>
          </motion.button>
          
          <button 
            onClick={onBack}
            className="mt-12 text-red-100/40 hover:text-red-100 transition-colors flex items-center gap-2 font-bold bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/5"
          >
            <ArrowLeft size={20} /> 返回地图
          </button>
        </div>
      ) : (
        <>
          {/* Top Navigation */}
          <div className="w-full flex items-center justify-between px-2 md:px-8 py-1 md:py-2 z-30 shrink-0">
            <button onClick={onBack} className="p-1.5 md:p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 shadow-lg transition-colors border border-white/10">
              <ArrowLeft className="text-white w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="flex-1 flex justify-center px-2">
              <div className="bg-black/70 backdrop-blur-md px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-2xl font-medium text-white flex items-center gap-4 md:gap-6 max-w-full md:max-w-[800px] border-2 border-yellow-500/30">
                <span className="text-5xl md:text-6xl shrink-0">🦜</span>
                <div className="flex flex-col">
                  <p className="text-xs md:text-base leading-tight md:leading-relaxed font-bold">
                    "宝藏就在<span className="text-yellow-400 text-lg md:text-xl font-black underline underline-offset-2 decoration-yellow-500/50 mx-0.5">(5,5)</span>，但路上有棕榈树和巨石挡路。你必须按顺序在石板上放对贝壳，小皮才能安全到达！记住，只能上下左右移动，不能穿过树和石头。"
                  </p>
                </div>
              </div>
            </div>
            <div className="w-8 md:w-10"></div>
          </div>

          {/* Parrot Message Overlay */}
          <AnimatePresence>
            {parrotMessage && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-1/4 right-4 md:right-10 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-yellow-400 max-w-[80vw]"
              >
                <span className="text-4xl animate-bounce">🦜</span>
                <p className="text-[#4e342e] font-bold text-sm md:text-lg">{parrotMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Game Area */}
          <div className="z-20 flex flex-col gap-2 sm:gap-4 items-center justify-center w-full flex-1 min-h-0 px-2 py-1 md:py-2 overflow-hidden">
            
            {/* Top Row: Maze Grid */}
            <div className="relative flex items-center justify-center shrink-0 w-full py-1">
              <div className="relative p-1.5 md:p-4 bg-[#3e2723] rounded-xl md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-2 md:border-8 border-[#2d1b18] flex items-center justify-center">
                
                <div className="relative aspect-square" style={{ width: 'min(52vh, 90vw)' }}>
                  {/* Y-Axis Labels (Left) */}
                  <div className="absolute -left-4 md:-left-7 top-0 bottom-0 flex flex-col justify-around py-1 z-10">
                    {[5, 4, 3, 2, 1, 0].map(n => (
                      <span key={n} className="text-xs md:text-sm font-black text-[#fffde7] opacity-60 flex items-center justify-center w-4 md:w-6">{n}</span>
                    ))}
                  </div>

                  {/* X-Axis Labels (Bottom) */}
                  <div className="absolute left-0 right-0 -bottom-4 md:-bottom-7 flex justify-around px-1 z-10">
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="text-xs md:text-sm font-black text-[#fffde7] opacity-60 flex items-center justify-center h-4 md:h-6">{n}</span>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-6 gap-0.5 md:gap-1 bg-[#1a0f0d] p-0.5 md:p-1 rounded-lg relative overflow-hidden w-full h-full">
                    {/* Wave Effect */}
                    <AnimatePresence>
                      {animationState === 'wave' && (
                        <motion.div
                          initial={{ x: '100%' }}
                          animate={{ x: '-100%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "linear" }}
                          className="absolute inset-0 z-40 bg-gradient-to-r from-transparent via-blue-400/80 to-transparent skew-x-12 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {[5, 4, 3, 2, 1, 0].map(row => (
                      [0, 1, 2, 3, 4, 5].map(col => {
                      const isStart = col === 0 && row === 0;
                      const isEnd = col === 5 && row === 5;
                      const isChar = characterPos.col === col && characterPos.row === row;
                      const isVisited = visited.some(v => v.col === col && v.row === row);
                      const obstacle = obstacles.find(o => o.col === col && o.row === row);
                      
                      return (
                        <div
                          key={`${col}-${row}`}
                          className="aspect-square rounded-sm relative flex items-center justify-center text-xl sm:text-4xl transition-all duration-300 overflow-hidden"
                          style={{ 
                            backgroundColor: '#e8d5a5',
                            backgroundImage: 'radial-gradient(#d4b872 2px, transparent 2px)',
                            backgroundSize: '12px 12px'
                          }}
                        >
                          {/* Coordinates Label - Always visible above fog */}
                          <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] text-[#4e342e] font-black z-30 opacity-70">({col},{row})</span>

                          {/* End Chest */}
                          {isEnd && (
                            <div className="relative z-30 flex items-center justify-center">
                              <motion.div
                                animate={chestOpen ? { scale: [1, 1.2, 1] } : { y: [0, -2, 0] }}
                                transition={{ duration: chestOpen ? 0.5 : 2, repeat: chestOpen ? 0 : Infinity, ease: "easeInOut" }}
                                className="relative z-10 flex items-center justify-center"
                              >
                                {chestOpen ? (
                                  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md">
                                    <path d="M12 28 C12 14 52 14 52 28 Z" fill="#6D350D" />
                                    <ellipse cx="32" cy="30" rx="18" ry="6" fill="#FFEA00" filter="blur(2px)" />
                                    <rect x="12" y="32" width="40" height="22" rx="3" fill="#A0522D" />
                                    <rect x="20" y="32" width="6" height="22" fill="#FFD700" />
                                    <rect x="38" y="32" width="6" height="22" fill="#FFD700" />
                                    <rect x="10" y="30" width="44" height="4" rx="2" fill="#DAA520" />
                                    <rect x="28" y="32" width="8" height="6" rx="2" fill="#FFD700" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md">
                                    <rect x="12" y="32" width="40" height="22" rx="3" fill="#A0522D" />
                                    <path d="M12 32 C12 18 52 18 52 32 Z" fill="#8B4513" />
                                    <rect x="20" y="20" width="6" height="34" fill="#FFD700" />
                                    <rect x="38" y="20" width="6" height="34" fill="#FFD700" />
                                    <rect x="10" y="30" width="44" height="4" rx="2" fill="#DAA520" />
                                    <rect x="28" y="26" width="8" height="10" rx="2" fill="#FFD700" />
                                    <circle cx="32" cy="30" r="1.5" fill="#8B4513" />
                                    <rect x="31" y="30" width="2" height="3" fill="#8B4513" />
                                  </svg>
                                )}
                                
                                {/* Subtle Sparkle */}
                                {!chestOpen && (
                                  <motion.div
                                    animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute -top-1 -right-1 text-xs"
                                  >
                                    ✨
                                  </motion.div>
                                )}
                              </motion.div>

                              {/* Golden Light & Medal Fragment */}
                              <AnimatePresence>
                                {showMedal && (
                                  <motion.div
                                    initial={{ y: 0, scale: 0, opacity: 0 }}
                                    animate={{ y: -40, scale: 1.5, opacity: 1 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="absolute z-50 flex flex-col items-center pointer-events-none"
                                  >
                                    <div className="absolute inset-0 bg-yellow-400 blur-xl rounded-full opacity-60 animate-pulse"></div>
                                    <Compass className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300 drop-shadow-[0_0_15px_rgba(255,215,0,1)]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {/* Fog Effect - Thin Mist */}
                          {!isVisited && (
                            <motion.div 
                              className={`absolute inset-0 z-10 flex items-center justify-center overflow-hidden ${isEnd ? 'opacity-0' : 'opacity-100'}`}
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
                            </motion.div>
                          )}

                          {/* Obstacles */}
                          {obstacle && (
                            <div className="relative z-20 drop-shadow-md scale-100 sm:scale-150">
                              {obstacle.type === 'tree' ? '🌴' : '🪨'}
                            </div>
                          )}

                          {/* Footprints */}
                          {isVisited && !isChar && !isStart && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 0.8, scale: 1 }}
                              className="relative z-10 text-xs sm:text-2xl rotate-12 opacity-60"
                            >
                              🐾
                            </motion.div>
                          )}

                          {/* Whirlpool */}
                          {animationState === 'whirlpool' && isChar && (
                            <motion.div
                              animate={{ rotate: 720, scale: [0, 2, 0], opacity: [0, 1, 0] }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                              className="absolute inset-[-50%] z-20 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.8),transparent)] pointer-events-none"
                            />
                          )}

                          {/* Character */}
                          {isChar && (
                            <motion.div 
                              layoutId="character" 
                              className="absolute inset-0 flex items-center justify-center z-30 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" 
                              initial={false} 
                              animate={
                                animationState === 'whirlpool' ? { rotate: 720, scale: 0, opacity: 0 } :
                                animationState === 'wave' ? { x: -50, opacity: 0, transition: { duration: 1 } } :
                                animationState === 'bounce' ? { x: [-15, 15, -15, 15, 0], transition: { duration: 0.5 } } :
                                { x: 0, rotate: 0, scale: 1, opacity: 1 }
                              }
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-xl overflow-visible">
                                {/* Shadow */}
                                <ellipse cx="50" cy="92" rx="20" ry="4" fill="rgba(0,0,0,0.2)" />

                                {/* Back Hair */}
                                <path d="M 30 30 Q 50 20 70 30 L 75 45 Q 50 55 25 45 Z" fill="#2c1e16" />

                                {/* Legs & Pants */}
                                <path d="M 40 65 L 60 65 L 62 78 L 52 75 L 50 70 L 48 75 L 38 78 Z" fill="#263238" />

                                {/* Boots */}
                                {/* Left Boot */}
                                <path d="M 37 75 L 47 75 L 47 92 L 32 92 Z" fill="#5d4037" />
                                <rect x="35" y="73" width="14" height="7" rx="2" fill="#8d6e63" />
                                {/* Right Boot */}
                                <path d="M 53 75 L 63 75 L 68 92 L 53 92 Z" fill="#5d4037" />
                                <rect x="51" y="73" width="14" height="7" rx="2" fill="#8d6e63" />

                                {/* Arms (Back/Sleeves) */}
                                {/* Left Arm */}
                                <circle cx="28" cy="55" r="9" fill="#f8f9fa" />
                                <path d="M 20 55 Q 20 70 28 70 L 32 70 L 32 55 Z" fill="#f8f9fa" />
                                {/* Right Arm */}
                                <circle cx="72" cy="55" r="9" fill="#f8f9fa" />
                                <path d="M 80 55 Q 80 70 72 70 L 68 70 L 68 55 Z" fill="#f8f9fa" />

                                {/* Hands */}
                                <circle cx="26" cy="72" r="4.5" fill="#ffe4c4" />
                                <circle cx="74" cy="72" r="4.5" fill="#ffe4c4" />

                                {/* Body / Shirt */}
                                <rect x="35" y="45" width="30" height="24" rx="4" fill="#f8f9fa" />
                                {/* Shirt Collar/Laces */}
                                <path d="M 45 45 L 50 52 L 55 45" fill="#ffe4c4" />
                                <path d="M 46 52 L 54 56 M 54 52 L 46 56 M 46 58 L 54 62 M 54 58 L 46 62" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" />

                                {/* Red Vest */}
                                <path d="M 35 45 L 43 68 L 35 68 Z" fill="#d32f2f" />
                                <path d="M 65 45 L 57 68 L 65 68 Z" fill="#d32f2f" />
                                <rect x="35" y="45" width="8" height="23" fill="#d32f2f" />
                                <rect x="57" y="45" width="8" height="23" fill="#d32f2f" />
                                {/* Gold Trim */}
                                <line x1="43" y1="45" x2="43" y2="68" stroke="#fbc02d" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="57" y1="45" x2="57" y2="68" stroke="#fbc02d" strokeWidth="2.5" strokeLinecap="round" />

                                {/* Belt */}
                                <rect x="36" y="66" width="28" height="6" fill="#3e2723" />
                                <rect x="46" y="65" width="8" height="8" fill="none" stroke="#fbc02d" strokeWidth="2.5" rx="1" />

                                {/* Head */}
                                <rect x="28" y="22" width="44" height="36" rx="18" fill="#ffe4c4" />
                                
                                {/* Ears */}
                                <circle cx="26" cy="38" r="5" fill="#ffe4c4" />
                                <circle cx="74" cy="38" r="5" fill="#ffe4c4" />
                                <circle cx="25" cy="38" r="2" fill="#e6b39a" />
                                <circle cx="75" cy="38" r="2" fill="#e6b39a" />

                                {/* Blush */}
                                <ellipse cx="34" cy="44" rx="5" ry="3" fill="#ffb6c1" opacity="0.7" />
                                <ellipse cx="66" cy="44" rx="5" ry="3" fill="#ffb6c1" opacity="0.7" />

                                {/* Eyes */}
                                <circle cx="38" cy="38" r="6" fill="#4e342e" />
                                <circle cx="62" cy="38" r="6" fill="#4e342e" />
                                {/* Eye Highlights */}
                                <circle cx="39.5" cy="36" r="2.5" fill="#ffffff" />
                                <circle cx="63.5" cy="36" r="2.5" fill="#ffffff" />
                                <circle cx="36" cy="40" r="1" fill="#ffffff" />
                                <circle cx="60" cy="40" r="1" fill="#ffffff" />

                                {/* Eyebrows */}
                                <path d="M 33 31 Q 38 29 43 32" fill="none" stroke="#2c1e16" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 57 32 Q 62 29 67 31" fill="none" stroke="#2c1e16" strokeWidth="2.5" strokeLinecap="round" />

                                {/* Mouth */}
                                <path d="M 46 47 Q 50 53 54 47 Z" fill="#c62828" />
                                <path d="M 47 47.5 Q 50 51 53 47.5 Z" fill="#ff8a80" />

                                {/* Hair (Front Bangs) */}
                                <path d="M 26 30 Q 35 18 45 26 Q 52 18 60 26 Q 68 18 74 30 Q 68 36 60 28 Q 52 36 45 28 Q 35 36 26 30 Z" fill="#2c1e16" />
                                <path d="M 26 25 Q 30 35 35 25 Z" fill="#2c1e16" />
                                <path d="M 74 25 Q 70 35 65 25 Z" fill="#2c1e16" />

                                {/* Pirate Hat */}
                                {/* Back Brim */}
                                <path d="M 8 32 Q 50 15 92 32 Q 75 38 50 36 Q 25 38 8 32 Z" fill="#b71c1c" />
                                {/* Front Flap */}
                                <path d="M 10 34 Q 50 -8 90 34 Q 50 24 10 34 Z" fill="#d32f2f" />
                                {/* Gold Trim */}
                                <path d="M 10 34 Q 50 -8 90 34" fill="none" stroke="#fbc02d" strokeWidth="4" strokeLinecap="round" />
                                
                                {/* Skull Emblem */}
                                <g transform="translate(50, 16) scale(1.1)">
                                  {/* Crossbones */}
                                  <line x1="-10" y1="-6" x2="10" y2="8" stroke="#fbc02d" strokeWidth="3" strokeLinecap="round" />
                                  <line x1="-10" y1="8" x2="10" y2="-6" stroke="#fbc02d" strokeWidth="3" strokeLinecap="round" />
                                  {/* Skull */}
                                  <circle cx="0" cy="0" r="5.5" fill="#fbc02d" />
                                  <rect x="-3.5" y="3" width="7" height="5" fill="#fbc02d" rx="1" />
                                  {/* Skull Eyes */}
                                  <circle cx="-2" cy="0" r="1.5" fill="#d32f2f" />
                                  <circle cx="2" cy="0" r="1.5" fill="#d32f2f" />
                                  {/* Skull Teeth */}
                                  <line x1="-1.5" y1="5" x2="-1.5" y2="8" stroke="#d32f2f" strokeWidth="1" />
                                  <line x1="0" y1="5" x2="0" y2="8" stroke="#d32f2f" strokeWidth="1" />
                                  <line x1="1.5" y1="5" x2="1.5" y2="8" stroke="#d32f2f" strokeWidth="1" />
                                </g>
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

                {/* Message Overlay */}
                <AnimatePresence>
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-5 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] font-bold text-xl z-50 whitespace-nowrap border-4 backdrop-blur-md
                        ${message.type === 'success' ? 'bg-green-500/95 text-white border-green-300' : 'bg-red-500/95 text-white border-red-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        {message.type === 'success' ? '✨' : '⚠️'}
                        {message.text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Row: Instruction Console & Guide */}
            <div className="relative w-full max-w-3xl flex flex-col items-center gap-2 sm:gap-3 shrink-0">
              {/* Compact Guide Box - Only on larger mobile or desktop */}
              <div className="hidden sm:flex w-full bg-[#4e342e]/80 backdrop-blur-sm p-1 rounded-lg border border-[#8d6e63] items-center gap-2">
                <span className="text-lg animate-bounce">🦜</span>
                <p className="text-[#fffde7] text-sm font-medium opacity-90">
                  设定3步坐标，避开🌴和🪨。到达🎁即获胜！
                </p>
              </div>

              <div className="w-full bg-[#7d6b5d] p-1 md:p-3 rounded-xl md:rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 md:border-4 border-[#4e342e] relative overflow-hidden">
                {/* Stone Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')]"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2 md:gap-6">
                  {/* Title - Hidden on mobile to save space */}
                  <div className="hidden md:flex flex-col items-center justify-center gap-1 px-4 border-r border-[#4e342e]/30">
                    <div className="w-1.5 h-1.5 bg-[#4e342e] rounded-full"></div>
                    <span className="font-black text-[#2d1b18] text-sm tracking-widest uppercase vertical-text">指令台</span>
                    <div className="w-1.5 h-1.5 bg-[#4e342e] rounded-full"></div>
                  </div>

                  {/* Steps Container */}
                  <div className="flex flex-row gap-1.5 md:gap-4 flex-1 justify-center">
                    {[0, 1, 2].map(i => {
                      const isActive = i === currentStepIndex;
                      return (
                      <div key={i} className={`relative flex-1 max-w-[100px] transition-opacity ${isActive ? 'opacity-100 scale-105 z-10' : 'opacity-50'}`}>
                        <div className={`bg-[#2d1b18] p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-inner border ${isActive ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'border-[#4e342e]'} flex items-center justify-between mt-1`}>
                          <div className="text-base md:text-xl font-mono text-[#8d6e63]">(</div>
                          <div className="flex items-center gap-1 md:gap-3">
                            {[ 'col', 'row' ].map(type => (
                              <div key={type} className="flex flex-col items-center">
                                <button 
                                  onClick={() => handleStepChange(i, type as any, 1)} 
                                  disabled={!isActive}
                                  className={`w-8 h-6 md:w-10 md:h-8 flex items-center justify-center bg-[#4e342e] rounded-t ${isActive ? 'hover:bg-[#5d4037] active:scale-95 cursor-pointer' : 'cursor-not-allowed'} text-[#fffde7] text-xs md:text-sm transition-transform`}
                                >
                                  ▲
                                </button>
                                <div className={`bg-[#1a0f0d] w-8 h-8 md:w-12 md:h-12 flex items-center justify-center border-x ${isActive ? 'border-yellow-500/50' : 'border-[#4e342e]'}`}>
                                  <span className={`text-lg md:text-2xl font-black ${type === 'col' ? 'text-blue-400' : 'text-pink-400'}`}>{steps[i][type as any]}</span>
                                </div>
                                <button 
                                  onClick={() => handleStepChange(i, type as any, -1)} 
                                  disabled={!isActive}
                                  className={`w-8 h-6 md:w-10 md:h-8 flex items-center justify-center bg-[#4e342e] rounded-b ${isActive ? 'hover:bg-[#5d4037] active:scale-95 cursor-pointer' : 'cursor-not-allowed'} text-[#fffde7] text-xs md:text-sm transition-transform`}
                                >
                                  ▼
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="text-base md:text-xl font-mono text-[#8d6e63]">)</div>
                        </div>
                      </div>
                    )})}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={confirmStep}
                      disabled={isPlaying}
                      className={`relative group ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="absolute inset-0 bg-red-600 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative bg-gradient-to-b from-red-500 to-red-700 px-4 md:px-8 py-2 md:py-3 rounded-lg border-b-2 md:border-b-4 border-red-900 flex items-center justify-center gap-1 md:gap-2 shadow-lg">
                        <span className="text-lg md:text-xl">🐚</span>
                        <span className="text-white font-black text-sm md:text-base tracking-wider">确认</span>
                      </div>
                    </motion.button>

                    <button 
                      onClick={resetMaze} 
                      disabled={isPlaying} 
                      className="px-3 py-1.5 text-[#4e342e] font-black hover:text-[#2d1b18] transition-colors flex items-center justify-center gap-1 text-sm md:text-xs uppercase tracking-widest bg-black/5 rounded-lg"
                    >
                      <RefreshCw size={14} className={isPlaying ? 'animate-spin' : ''} /> 重置迷宫
                    </button>
                  </div>
                </div>
              </div>
              {/* Base of the console */}
              <div className="w-[95%] h-1.5 md:h-4 bg-[#4e342e] rounded-full -mt-1 md:-mt-2 shadow-2xl border-b-2 md:border-b-4 border-black/40"></div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
