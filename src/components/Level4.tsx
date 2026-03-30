import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Play, ArrowLeft } from 'lucide-react';

interface Level4Props {
  onWin: () => void;
  onBack: () => void;
}

type Crab = {
  id: number;
  col: number;
  row: number;
  color: string;
  points: number;
  duration: number;
};

const CRAB_COLORS = ['#ef4444', '#f97316', '#eab308', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];

const HermitCrab = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
    <style>{`
      @keyframes wave-l {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-20deg); }
      }
      @keyframes wave-r {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(20deg); }
      }
      .claw-l { animation: wave-l 0.4s ease-in-out infinite; transform-origin: 30px 85px; }
      .claw-r { animation: wave-r 0.4s ease-in-out infinite; transform-origin: 70px 85px; }
    `}</style>
    {/* Back Legs */}
    <path d="M 25 65 Q 10 75 15 85" stroke="#d84315" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M 75 65 Q 90 75 85 85" stroke="#d84315" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    {/* Shell (Spiral) */}
    <path d="M 15 55 C 15 15, 85 15, 85 55 C 85 80, 15 80, 15 55 Z" fill={color} />
    <path d="M 85 55 C 85 30, 30 30, 30 55 C 30 70, 70 70, 70 55 C 70 45, 45 45, 45 55" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="4" strokeLinecap="round" />
    <path d="M 25 35 Q 40 25 60 30" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" fill="none" />
    
    {/* Body / Head emerging from shell */}
    <path d="M 35 65 C 35 50, 65 50, 65 65 C 65 85, 35 85, 35 65 Z" fill="#ffcc80" />
    
    {/* Front Claws */}
    <path className="claw-l" d="M 30 70 Q 15 70 20 90 Q 35 95 40 80 Z" fill="#ff8a65" stroke="#d84315" strokeWidth="2" strokeLinejoin="round" />
    <path className="claw-r" d="M 70 70 Q 85 70 80 90 Q 65 95 60 80 Z" fill="#ff8a65" stroke="#d84315" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Eyes on stalks */}
    <path d="M 42 60 Q 35 45 30 40" stroke="#ffcc80" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="30" cy="40" r="6" fill="white" />
    <circle cx="29" cy="39" r="3" fill="black" />
    
    <path d="M 58 60 Q 65 45 70 40" stroke="#ffcc80" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="70" cy="40" r="6" fill="white" />
    <circle cx="71" cy="39" r="3" fill="black" />
  </svg>
);

export default function Level4({ onWin, onBack }: Level4Props) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [crabs, setCrabs] = useState<Crab[]>([]);
  const [clickEffect, setClickEffect] = useState<{col: number, row: number, type: 'hit' | 'miss'} | null>(null);
  const [targetPos, setTargetPos] = useState({ col: 1, row: 1 });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Idle crab spawning for intro
  useEffect(() => {
    let isActive = true;
    let timeout: NodeJS.Timeout;
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    if (gameState === 'intro') {
      const spawnIdleCrab = () => {
        if (!isActive) return;
        const id = Date.now();
        const col = Math.floor(Math.random() * 5) + 1;
        const row = Math.floor(Math.random() * 5) + 1;
        const color = CRAB_COLORS[Math.floor(Math.random() * CRAB_COLORS.length)];
        
        setCrabs(prev => {
          if (prev.some(c => c.col === col && c.row === row)) return prev;
          return [...prev, { id, col, row, color, points: 0, duration: 2500 }];
        });

        setTimeout(() => {
          if (!isActive) return;
          setCrabs(prev => prev.filter(c => c.id !== id));
        }, 2500);

        timeout = setTimeout(spawnIdleCrab, 400 + Math.random() * 600);
      };
      
      spawnIdleCrab();
      t1 = setTimeout(spawnIdleCrab, 200);
      t2 = setTimeout(spawnIdleCrab, 500);
    }
    return () => {
      isActive = false;
      clearTimeout(timeout);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [gameState]);

  // Game crab spawning
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleNextCrab = () => {
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    const waitTime = 500 + Math.random() * 1000;
    gameLoopRef.current = setTimeout(() => {
      spawnCrab();
    }, waitTime);
  };

  const spawnCrab = () => {
    const id = Date.now();
    const col = Math.floor(Math.random() * 5) + 1;
    const row = Math.floor(Math.random() * 5) + 1;
    const color = CRAB_COLORS[Math.floor(Math.random() * CRAB_COLORS.length)];
    
    setCrabs([{ id, col, row, color, points: 1, duration: 5000 }]);

    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    gameLoopRef.current = setTimeout(() => {
      setCrabs(prev => prev.filter(c => c.id !== id));
      scheduleNextCrab();
    }, 5000);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      scheduleNextCrab();
    } else {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    setCrabs([]);
    setScore(0);
    setTimeLeft(90);
    setGameState('playing');
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setGameState('gameover');
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    setCrabs([]);
    
    if (scoreRef.current >= 10) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#8b5a2b', '#dcb888', '#fdf5e6', '#ffffff']
      });
      setTimeout(onWin, 3000);
    }
  };

  useEffect(() => {
    if (score >= 10 && gameState === 'playing') {
      endGame();
    }
  }, [score, gameState]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleHit = () => {
    if (gameState !== 'playing') return;

    const { col, row } = targetPos;
    const hitCrab = crabs.find(c => c.col === col && c.row === row);
    if (hitCrab) {
      setScore(prev => prev + hitCrab.points);
      setCrabs(prev => prev.filter(c => c.id !== hitCrab.id));
      setClickEffect({ col, row, type: 'hit' });
      
      scheduleNextCrab();
    } else {
      setClickEffect({ col, row, type: 'miss' });
    }

    setTimeout(() => setClickEffect(null), 400);
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#e6c280] font-serif flex flex-col items-center justify-center">
      {/* Full screen Sand Texture Overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}></div>
      
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-5xl opacity-60 pointer-events-none drop-shadow-md">🐚</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-60 pointer-events-none drop-shadow-md">🌿</div>
      <div className="absolute top-1/4 right-12 text-5xl opacity-60 pointer-events-none drop-shadow-md">⭐</div>
      <div className="absolute bottom-10 left-1/4 text-6xl opacity-60 pointer-events-none drop-shadow-md">🌿</div>
      <div className="absolute top-12 right-1/3 text-4xl opacity-60 pointer-events-none drop-shadow-md">🪨</div>
      <div className="absolute bottom-1/3 left-8 text-4xl opacity-60 pointer-events-none drop-shadow-md">🐚</div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-30">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-[#8b5a2b] text-[#fdf5e6] rounded-full shadow-lg hover:bg-[#5c3a21] transition-colors font-serif text-sm md:text-base border-2 border-[#dcb888]"
        >
          <ArrowLeft size={20} /> 返回地图
        </button>

        <AnimatePresence>
          {gameState !== 'intro' && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex gap-4 md:gap-8 bg-[#fdf5e6]/90 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-[#dcb888] shadow-lg"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] md:text-xs font-bold text-[#8b5a2b] uppercase tracking-widest">得分</span>
                <span className={`text-2xl md:text-3xl font-black ${score >= 10 ? 'text-green-600' : 'text-[#5c3a21]'}`}>{score}/10</span>
              </div>
              <div className="w-px bg-[#dcb888]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] md:text-xs font-bold text-[#8b5a2b] uppercase tracking-widest">时间</span>
                <span className={`text-2xl md:text-3xl font-black ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-[#5c3a21]'}`}>{timeLeft}s</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full flex-1 mt-20 md:mt-24 mb-24 md:mb-32">
        
        {/* Grandpa Dialog */}
        <AnimatePresence>
          {gameState === 'intro' && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="w-full max-w-2xl px-4 mb-4 md:mb-6"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#fdf5e6] border-4 border-[#dcb888] shadow-lg flex items-center justify-center text-3xl md:text-4xl shrink-0 z-10 relative">
                  👴
                </div>
                <div className="relative bg-[#fdf5e6]/95 backdrop-blur-sm p-3 md:p-4 rounded-2xl border-2 border-[#dcb888] shadow-lg text-[#5c3a21] font-serif text-sm md:text-base font-bold leading-relaxed flex-1 mt-1 md:mt-2">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-[#fdf5e6] border-l-2 border-b-2 border-[#dcb888] transform rotate-45"></div>
                  哎哟喂，这些小淘气又跑出来啦！快在它们缩回洞里之前，输入它们所在的坐标并点击打击！敲够<span className="text-red-600 font-black text-lg md:text-xl mx-1 drop-shadow-sm">10</span>只就算你厉害！
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <div className="relative w-full max-w-3xl aspect-square max-h-[55vh] md:max-h-[65vh]">
          <div className="absolute inset-0 grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-1 md:gap-2 p-2 md:p-4 touch-none select-none">
            {/* Y-axis */}
            <div className="grid grid-rows-5 gap-2 md:gap-4 py-2 md:py-4 pr-1 md:pr-2">
              {[5, 4, 3, 2, 1].map(y => (
                <div key={`y-${y}`} className="flex items-center justify-center font-black text-[#8b5a2b] text-lg md:text-2xl w-4 md:w-8">{y}</div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-5 grid-rows-5 gap-2 md:gap-4 bg-[#fdf5e6]/40 rounded-2xl border-4 border-[#dcb888] shadow-inner p-2 md:p-4 relative">
              {[5, 4, 3, 2, 1].flatMap(row => 
                [1, 2, 3, 4, 5].map(col => {
                  const crab = crabs.find(c => c.col === col && c.row === row);
                  const isHit = clickEffect?.col === col && clickEffect?.row === row;

                  return (
                    <div 
                      key={`${col}-${row}`}
                      className="relative flex items-center justify-center"
                    >
                      {/* Sand hole */}
                  <div className="absolute inset-2 md:inset-4 rounded-[40%] bg-[#c29b57] shadow-[inset_0_10px_20px_rgba(93,64,55,0.8)] border-b-4 border-[#e6c280]/50 mix-blend-multiply"></div>

                  <AnimatePresence>
                    {crab && (
                      <motion.div 
                        initial={{ y: 40, scale: 0.3, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 40, scale: 0.3, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                          <HermitCrab color={crab.color} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {clickEffect?.type === 'hit' && isHit && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 1, y: 0 }}
                        animate={{ scale: 1.5, opacity: 0, y: -40 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-20 text-3xl md:text-5xl font-black text-green-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pointer-events-none"
                      >
                        +1
                      </motion.div>
                    )}
                    {clickEffect?.type === 'miss' && isHit && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-20 text-4xl md:text-6xl font-black text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pointer-events-none"
                      >
                        ❌
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
            </div>

            {/* Empty bottom-left corner */}
            <div></div>

            {/* X-axis */}
            <div className="grid grid-cols-5 gap-2 md:gap-4 px-2 md:px-4 pt-1 md:pt-2">
              {[1, 2, 3, 4, 5].map(x => (
                <div key={`x-${x}`} className="flex items-center justify-center font-black text-[#8b5a2b] text-lg md:text-2xl h-4 md:h-8">{x}</div>
              ))}
            </div>
          </div>
        </div>

      {/* Coordinate Input Console */}
      <AnimatePresence>
        {gameState === 'playing' && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="relative w-full max-w-md flex flex-col items-center gap-2 sm:gap-3 shrink-0 mt-4 z-20 px-4"
          >
            <div className="w-full bg-[#7d6b5d] p-3 md:p-4 rounded-xl md:rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 md:border-4 border-[#4e342e] relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')]"></div>
              
              <div className="relative z-10 flex items-center justify-center gap-4 md:gap-8">
                {/* Coordinate Input */}
                <div className="bg-[#2d1b18] p-2 md:p-3 rounded-lg md:rounded-xl shadow-inner border border-[#4e342e] flex items-center gap-2 md:gap-4">
                  <div className="text-xl md:text-2xl font-mono text-[#8d6e63]">(</div>
                  
                  {/* Col */}
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => setTargetPos(p => ({...p, col: p.col < 5 ? p.col + 1 : 1}))}
                      className="w-10 h-8 md:w-12 md:h-10 flex items-center justify-center bg-[#4e342e] rounded-t hover:bg-[#5d4037] text-[#fffde7] active:scale-95 transition-transform"
                    >▲</button>
                    <div className="bg-[#1a0f0d] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-x border-[#4e342e]">
                      <span className="text-xl md:text-3xl font-black text-blue-400">{targetPos.col}</span>
                    </div>
                    <button 
                      onClick={() => setTargetPos(p => ({...p, col: p.col > 1 ? p.col - 1 : 5}))}
                      className="w-10 h-8 md:w-12 md:h-10 flex items-center justify-center bg-[#4e342e] rounded-b hover:bg-[#5d4037] text-[#fffde7] active:scale-95 transition-transform"
                    >▼</button>
                  </div>

                  <div className="text-xl md:text-2xl font-mono text-[#8d6e63]">,</div>

                  {/* Row */}
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => setTargetPos(p => ({...p, row: p.row < 5 ? p.row + 1 : 1}))}
                      className="w-10 h-8 md:w-12 md:h-10 flex items-center justify-center bg-[#4e342e] rounded-t hover:bg-[#5d4037] text-[#fffde7] active:scale-95 transition-transform"
                    >▲</button>
                    <div className="bg-[#1a0f0d] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-x border-[#4e342e]">
                      <span className="text-xl md:text-3xl font-black text-pink-400">{targetPos.row}</span>
                    </div>
                    <button 
                      onClick={() => setTargetPos(p => ({...p, row: p.row > 1 ? p.row - 1 : 5}))}
                      className="w-10 h-8 md:w-12 md:h-10 flex items-center justify-center bg-[#4e342e] rounded-b hover:bg-[#5d4037] text-[#fffde7] active:scale-95 transition-transform"
                    >▼</button>
                  </div>

                  <div className="text-xl md:text-2xl font-mono text-[#8d6e63]">)</div>
                </div>

                {/* Hit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleHit}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-red-600 rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-gradient-to-b from-red-500 to-red-700 px-6 md:px-8 py-3 md:py-5 rounded-xl border-b-4 border-red-900 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-2xl md:text-3xl mb-1">🔨</span>
                    <span className="text-white font-black text-sm md:text-lg tracking-wider">打击</span>
                  </div>
                </motion.button>
              </div>
            </div>
            <div className="w-[95%] h-2 md:h-3 bg-[#4e342e] rounded-full -mt-1 md:-mt-2 shadow-2xl border-b-2 md:border-b-4 border-black/40"></div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Intro Overlay / Start Button */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-12 md:bottom-24 z-40 flex flex-col items-center gap-6"
          >
            <div className="bg-[#fdf5e6]/95 backdrop-blur-md text-[#5c3a21] px-8 py-4 rounded-3xl border-4 border-[#dcb888] shadow-2xl text-center max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-2" style={{ fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>
                寄居蟹田园
              </h1>
              <p className="text-sm md:text-base font-bold opacity-80">
                目标：90秒内抓获<span className="text-red-600 font-black text-lg md:text-xl mx-1 drop-shadow-sm">10</span>只寄居蟹
              </p>
            </div>
            <button
              onClick={startGame}
              className="group relative bg-gradient-to-b from-[#8b5a2b] to-[#5c3a21] text-[#fdf5e6] font-serif text-2xl md:text-3xl font-black px-16 py-5 rounded-full shadow-[0_15px_35px_rgba(92,58,33,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-4 border-[#dcb888] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500"></div>
              <Play size={32} fill="currentColor" /> 开始抓捕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#fdf5e6] p-10 rounded-[40px] border-8 border-[#dcb888] shadow-2xl text-center max-w-md w-full"
            >
              <h2 className="text-4xl font-serif font-black text-[#5c3a21] mb-2">挑战结束</h2>
              <div className="text-6xl font-serif font-black text-[#8b5a2b] mb-6 drop-shadow-md">{score} 分</div>
              
              {score >= 10 ? (
                <div className="text-2xl text-green-600 font-serif font-bold mb-8">
                  太棒了！你抓到了足够的寄居蟹！
                </div>
              ) : (
                <div className="text-2xl text-red-600 font-serif font-bold mb-8">
                  还差一点点，再来一次吧！
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={startGame}
                  className="w-full py-4 bg-[#8b5a2b] text-[#fdf5e6] text-xl rounded-full font-serif font-bold hover:bg-[#5c3a21] transition-colors shadow-lg"
                >
                  重新开始
                </button>
                <button 
                  onClick={onBack}
                  className="w-full py-4 bg-transparent text-[#8b5a2b] text-xl border-4 border-[#dcb888] rounded-full font-serif font-bold hover:bg-[#f5deb3] transition-colors shadow-sm"
                >
                  返回地图
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

