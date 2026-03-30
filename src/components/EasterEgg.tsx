import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowLeft, Eraser, Star, Heart, Sun, Smile, Award } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface EasterEggProps {
  onBack: () => void;
}

type ColorKey = 'blue' | 'red' | 'yellow' | 'green';

const COLORS: Record<ColorKey, { hex: string, name: string }> = {
  blue: { hex: '#3b82f6', name: '海蓝色' },
  red: { hex: '#ef4444', name: '珊瑚红' },
  yellow: { hex: '#eab308', name: '阳光黄' },
  green: { hex: '#22c55e', name: '海草绿' }
};

// 16x16 Pixel Art Coordinates
const TARGETS: Record<ColorKey, number[][]> = {
  yellow: [
    [14,16], [12,16], [16,16],
    [13,15], [14,15], [15,15],
    [12,14], [13,14], [14,14], [15,14], [16,14],
    [13,13], [14,13], [15,13],
    [12,12], [14,12], [16,12]
  ],
  red: [
    [3,15], [5,15],
    [2,14], [3,14], [4,14], [5,14], [6,14],
    [2,13], [3,13], [4,13], [5,13], [6,13],
    [3,12], [4,12], [5,12],
    [4,11]
  ],
  green: [
    [3,1], [3,2], [4,3], [3,4], [2,5], [3,6], [4,7],
    [13,1], [13,2], [12,3], [13,4], [14,5], [13,6]
  ],
  blue: [
    [8,7],
    [7,6], [8,6], [9,6],
    [6,5], [7,5], [8,5], [9,5], [10,5],
    [6,4], [7,4], [8,4], [9,4], [10,4],
    [7,3], [8,3], [9,3]
  ]
};

const COLOR_ORDER: ColorKey[] = ['yellow', 'blue', 'red', 'green'];

const GRID_SIZE = 16;
const ROWS = [...Array(GRID_SIZE)].map((_, i) => GRID_SIZE - i);
const COLS = [...Array(GRID_SIZE)].map((_, i) => i + 1);

const playDing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

const playWave = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {}
};

const Dolphin = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-2xl">
    <style>{`
      @keyframes tail-wag {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(15deg); }
      }
      @keyframes blink {
        0%, 96%, 98%, 100% { transform: scaleY(1); }
        97%, 99% { transform: scaleY(0.1); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .dolphin-tail { animation: tail-wag 2s ease-in-out infinite; transform-origin: 150px 75px; }
      .dolphin-eye { animation: blink 4s infinite; transform-origin: 45px 65px; }
      .dolphin-body { animation: float 3s ease-in-out infinite; }
    `}</style>
    {/* Water splash */}
    <path d="M 20 130 Q 50 110 80 130 T 140 130 T 180 130" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    <path d="M 40 140 Q 70 120 100 140 T 160 140" fill="none" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    
    <g className="dolphin-body">
      {/* Back Fin (curved, not sharp) */}
      <path d="M 90 45 C 95 20, 115 15, 115 15 C 110 35, 115 50, 115 50 Z" fill="#38bdf8" />
      
      {/* Tail */}
      <path className="dolphin-tail" d="M 150 75 C 170 60, 185 40, 185 40 C 180 65, 195 85, 195 85 C 175 80, 150 75, 150 75 Z" fill="#38bdf8" />
      
      {/* Main Body (rounded forehead) */}
      <path d="M 155 75 C 155 110, 95 120, 55 95 C 35 85, 35 55, 65 45 C 95 35, 125 45, 155 75 Z" fill="#38bdf8" />
      
      {/* Beak / Snout (distinct dolphin beak) */}
      <path d="M 45 60 C 25 60, 10 65, 10 75 C 10 85, 25 85, 45 85 Z" fill="#38bdf8" />
      
      {/* Belly */}
      <path d="M 145 78 C 145 105, 95 115, 55 90 C 45 85, 25 85, 15 80 C 30 95, 100 105, 145 78 Z" fill="#e0f2fe" />
      
      {/* Pectoral Fin */}
      <path d="M 80 95 C 90 120, 105 115, 105 115 C 95 100, 90 90, 90 90 Z" fill="#0ea5e9" />
      
      {/* Eye */}
      <g className="dolphin-eye">
        <circle cx="45" cy="65" r="4" fill="white" />
        <circle cx="43" cy="64" r="2" fill="#0f172a" />
      </g>
      
      {/* Smile */}
      <path d="M 15 75 C 25 80, 35 78, 40 72" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Blush */}
      <ellipse cx="52" cy="72" rx="4" ry="2" fill="#f472b6" opacity="0.6" />
    </g>
  </svg>
);

export default function EasterEgg({ onBack }: EasterEggProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorKey | 'eraser'>('yellow');
  const [grid, setGrid] = useState<Record<string, ColorKey>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shakingCell, setShakingCell] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [certificateImg, setCertificateImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const generateCertificate = async () => {
    if (!certificateRef.current || !childName.trim()) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0a0a16',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      setCertificateImg(dataUrl);
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const paintCell = (col: number, row: number) => {
    if (isComplete) return;
    
    const key = `${col},${row}`;
    const existingColor = grid[key];

    if (existingColor) {
      const existingColorIndex = COLOR_ORDER.indexOf(existingColor);
      if (existingColorIndex < activeColorIndex) {
        setShakingCell(key);
        setToast('这个颜色已经完成啦，不能修改哦');
        setTimeout(() => setShakingCell(null), 400);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(null), 2000);
        return;
      }
    }
    
    if (selectedColor === 'eraser') {
      setGrid(prev => {
        const newGrid = { ...prev };
        delete newGrid[key];
        return newGrid;
      });
      return;
    }

    const isCorrect = TARGETS[selectedColor].some(c => c[0] === col && c[1] === row);
    
    if (isCorrect) {
      if (grid[key] !== selectedColor) {
        playDing();
        playWave();
        setGrid(prev => ({ ...prev, [key]: selectedColor }));
      }
    } else {
      setShakingCell(key);
      setToast('这个格子不在当前颜色的藏宝图里，再试试');
      setTimeout(() => setShakingCell(null), 400);
      
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast(null), 2000);
    }
  };

  useEffect(() => {
    if (isComplete) return;

    const currentColor = COLOR_ORDER[activeColorIndex];
    if (currentColor) {
      const isCurrentComplete = TARGETS[currentColor].every(
        ([col, row]) => grid[`${col},${row}`] === currentColor
      );
      
      if (isCurrentComplete) {
        if (activeColorIndex < COLOR_ORDER.length - 1) {
          playDing();
          setActiveColorIndex(prev => prev + 1);
          setSelectedColor(COLOR_ORDER[activeColorIndex + 1]);
        } else {
          setIsComplete(true);
          confetti({
            particleCount: 500,
            spread: 160,
            origin: { y: 0.4 },
            colors: ['#3b82f6', '#ef4444', '#eab308', '#22c55e', '#ffffff']
          });
        }
      }
    }
  }, [grid, activeColorIndex, isComplete]);

  return (
    <div className="w-full h-full min-h-screen bg-[#1a1a2e] font-sans flex flex-col items-center overflow-y-auto overflow-x-hidden relative">
      {/* Starry background */}
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(circle at center, #2a2a4a 0%, #1a1a2e 100%)' }}></div>
      
      {/* White Flash Animation */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border border-red-400/50 z-50 flex items-center gap-2 pointer-events-none"
          >
            <span className="text-xl">⚠️</span>
            <span className="font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {showIntro ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full h-full py-8 z-10">
          <div className="text-6xl md:text-8xl mb-6 drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] animate-bounce">🎁</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-[0.15em] text-[#fdf5e6] mb-4 shrink-0 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" style={{ fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>
            海岛的礼物
          </h1>
          <p className="text-[#dcb888] text-base md:text-xl font-serif mb-8 max-w-2xl leading-relaxed shrink-0">
            你发现了一块古老的石板和一张发光的网格！<br/>
            根据石板上的「颜色藏宝图」，在网格中亲手点亮对应的坐标，拼出海岛送给你的最终礼物吧！
          </p>
          
          <button
            onClick={() => setShowIntro(false)}
            className="shrink-0 bg-gradient-to-b from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-white font-serif text-xl md:text-2xl px-10 py-4 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-all hover:scale-105 flex items-center gap-3 border-2 border-yellow-200"
          >
            <Sparkles size={28} fill="currentColor" /> 开始拼图
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-12 w-full max-w-[1400px] p-4 md:p-8 z-10">
          
          {/* Top Bar / Back Button */}
          <div className="absolute top-4 left-4 z-50">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-white/20 transition-colors font-serif border border-white/20"
            >
              <ArrowLeft size={20} /> 返回地图
            </button>
          </div>

          {/* Left: Stone Tablet */}
          <div className="w-full max-w-md bg-[#57534e] p-6 md:p-8 rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#44403c] relative mt-12 xl:mt-0 shrink-0">
            {/* Tablet Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.1\' numOctaves=\'5\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}></div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-[#d6d3d1] mb-6 text-center tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>
              颜色藏宝图
            </h2>

            <div className="space-y-4 relative z-10">
              <AnimatePresence mode="popLayout">
                {COLOR_ORDER.map((key, index) => {
                  const color = COLORS[key];
                  const isActive = index === activeColorIndex;
                  const isCompleted = index < activeColorIndex;
                  const isLocked = index > activeColorIndex;

                  if (isLocked) return null;

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={key}
                      onClick={() => {
                        if (isActive) setSelectedColor(key);
                      }}
                      className={`p-3 rounded-md transition-all border-2 ${
                        selectedColor === key && isActive ? 'bg-white/10 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 
                        isCompleted ? 'bg-green-900/40 border-green-500/30 opacity-70 cursor-default' :
                        'bg-black/20 border-transparent cursor-pointer hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-sm shadow-inner flex items-center justify-center" style={{ backgroundColor: color.hex }}>
                          {isCompleted && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="font-bold text-[#e7e5e4]">{color.name} {isCompleted && "(已完成)"}</span>
                      </div>
                      {!isCompleted && (
                        <div className="text-[#a8a29e] text-xs font-mono leading-relaxed pl-9 flex flex-wrap gap-1">
                          {TARGETS[key].map(c => {
                            const isFilled = grid[`${c[0]},${c[1]}`] === key;
                            return (
                              <span key={`${c[0]},${c[1]}`} className={`px-1 rounded flex items-center gap-0.5 ${isFilled ? 'bg-green-500/30 text-green-200' : 'bg-black/30'}`}>
                                ({c[0]},{c[1]}) {isFilled && <span className="text-[10px]">✓</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Eraser Tool */}
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedColor('eraser')}
                  className={`p-3 rounded-md cursor-pointer transition-all border-2 flex items-center gap-3 mt-4 ${selectedColor === 'eraser' ? 'bg-white/10 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-black/20 border-transparent hover:bg-white/5'}`}
                >
                  <div className="w-6 h-6 rounded-sm bg-gray-300 flex items-center justify-center text-gray-700">
                    <Eraser size={14} />
                  </div>
                  <span className="font-bold text-[#e7e5e4]">橡皮擦</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Glowing Grid & Completion Animation */}
          <div className="flex flex-col items-center w-full max-w-2xl relative">
            
            <div className="relative p-2 md:p-6 bg-[#0f0f1a]/80 rounded-2xl border border-indigo-900/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm w-full flex justify-center">
              
              <div className="flex flex-col w-full max-w-[600px]">
                <div className="flex w-full">
                  {/* Y-axis labels */}
                  <div className="w-6 md:w-8 flex flex-col pr-1 md:pr-2 text-yellow-200/60 font-mono text-[10px] md:text-xs select-none">
                    {ROWS.map(n => <div key={n} className="flex-1 flex items-center justify-end">{n}</div>)}
                  </div>
                  
                  <div className="flex-1">
                    {/* The Grid */}
                    <div 
                      className="w-full aspect-square bg-yellow-200/10 border border-yellow-600/30 rounded-sm shadow-[0_0_20px_rgba(253,224,71,0.1)] touch-none"
                      style={{ 
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
                      }}
                      onPointerDown={() => setIsDrawing(true)}
                      onPointerUp={() => setIsDrawing(false)}
                      onPointerLeave={() => setIsDrawing(false)}
                    >
                      {ROWS.flatMap(row => 
                        COLS.map(col => {
                          const key = `${col},${row}`;
                          const cellColor = grid[key];
                          const colorData = cellColor ? COLORS[cellColor] : null;

                          return (
                            <motion.div
                              key={key}
                              className="border border-white/5 cursor-pointer transition-colors duration-75"
                              onPointerDown={() => paintCell(col, row)}
                              onPointerEnter={() => { if (isDrawing) paintCell(col, row); }}
                              style={{ backgroundColor: colorData ? colorData.hex : 'transparent' }}
                              animate={shakingCell === key ? { x: [-3, 3, -3, 3, 0] } : {}}
                              transition={{ duration: 0.3 }}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="flex w-full mt-2">
                  <div className="w-6 md:w-8 shrink-0"></div>
                  <div className="flex-1 flex text-yellow-200/60 font-mono text-[10px] md:text-xs select-none">
                    {COLS.map(n => <div key={n} className="flex-1 flex justify-center">{n}</div>)}
                  </div>
                </div>
              </div>

            </div>
            
            <AnimatePresence>
              {isComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-8 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40">
                    <Dolphin />
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="text-xl md:text-2xl font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" 
                    style={{ fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}
                  >
                    ✨ "每一次勇敢的尝试，都是成长路上的坐标。 —— 小海豚" ✨
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    onClick={() => setShowModal(true)}
                    className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    📸 保存航海日志
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isComplete && (
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => {
                    const autoGrid: Record<string, ColorKey> = {};
                    for (const [color, coords] of Object.entries(TARGETS)) {
                      for (const [col, row] of coords) {
                        autoGrid[`${col},${row}`] = color as ColorKey;
                      }
                    }
                    setGrid(autoGrid);
                    setActiveColorIndex(COLOR_ORDER.length - 1);
                  }}
                  className="px-6 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 rounded-full font-serif hover:bg-yellow-500/40 transition-colors shadow-[0_0_10px_rgba(253,224,71,0.2)]"
                >
                  一键生成
                </button>
                <button 
                  onClick={() => {
                    setGrid({});
                    setIsComplete(false);
                    setActiveColorIndex(0);
                    setSelectedColor('yellow');
                  }}
                  className="px-6 py-2 bg-transparent text-yellow-200/70 border border-yellow-200/30 rounded-full font-serif hover:bg-yellow-200/10 transition-colors"
                >
                  清空画布
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Off-screen Certificate DOM */}
      <div className="fixed top-[-9999px] left-[-9999px]">
        <div ref={certificateRef} className="w-[1000px] h-[700px] relative overflow-hidden flex items-center justify-center font-sans" style={{ boxSizing: 'border-box', backgroundColor: '#1e325c' }}>
          {/* Background Elements */}
          {/* Stars */}
          <div className="absolute top-12 left-20" style={{ color: '#fef08a' }}><Star size={32} fill="currentColor" /></div>
          <div className="absolute top-40 left-10 opacity-50" style={{ color: '#fef08a' }}><Star size={20} fill="currentColor" /></div>
          <div className="absolute bottom-32 left-24" style={{ color: '#fef08a' }}><Star size={40} fill="currentColor" /></div>
          <div className="absolute top-20 right-32" style={{ color: '#fef08a' }}><Star size={36} fill="currentColor" /></div>
          <div className="absolute bottom-20 right-20 opacity-70" style={{ color: '#fef08a' }}><Star size={28} fill="currentColor" /></div>

          {/* Planets / Ocean Bubbles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20" style={{ backgroundColor: '#2dd4bf' }}></div>
          <div className="absolute bottom-10 -left-16 w-48 h-48 rounded-full opacity-80 border-8" style={{ backgroundColor: '#fb923c', borderColor: '#fdba74' }}></div>
          <div className="absolute -bottom-20 right-10 w-64 h-64 rounded-full opacity-30" style={{ backgroundColor: '#3b82f6' }}></div>
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full opacity-80 border-4" style={{ backgroundColor: '#818cf8', borderColor: '#a5b4fc' }}></div>

          {/* Cute Satellite / Submarine */}
          <svg className="absolute top-12 left-32 w-32 h-32 transform -rotate-12" viewBox="0 0 100 100">
             <rect x="20" y="40" width="60" height="20" rx="10" fill="#60a5fa" />
             <rect x="30" y="30" width="40" height="10" rx="5" fill="#93c5fd" />
             <circle cx="70" cy="50" r="6" fill="#fde047" />
             <circle cx="50" cy="50" r="6" fill="#fde047" />
             <circle cx="30" cy="50" r="6" fill="#fde047" />
             <path d="M 10 50 L 20 40 L 20 60 Z" fill="#f87171" />
          </svg>

          {/* The White Cloud Center */}
          <div className="relative w-[800px] h-[500px] rounded-[50px] flex flex-col items-center p-12 mt-8" style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
             {/* Cloud bumps */}
             <div className="absolute -top-12 left-16 w-32 h-32 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
             <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
             <div className="absolute -top-10 right-20 w-36 h-36 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
             <div className="absolute -bottom-12 left-24 w-40 h-40 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
             <div className="absolute -bottom-16 right-32 w-48 h-48 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
             <div className="absolute top-20 -left-12 w-32 h-32 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
             <div className="absolute top-32 -right-12 w-32 h-32 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>

             {/* Content Container */}
             <div className="relative z-10 w-full h-full flex flex-col">
                {/* Title */}
                <h1 className="text-7xl font-bold text-center mt-2 mb-6 tracking-widest" style={{ color: '#e06c75', fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>
                  荣誉奖状
                </h1>

                {/* Badge */}
                <div className="absolute -top-20 -right-16 w-48 h-48 drop-shadow-lg">
                   <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Ribbons */}
                      <path d="M 25 50 L 10 95 L 30 85 L 45 95 Z" fill="#fcd34d" />
                      <path d="M 75 50 L 90 95 L 70 85 L 55 95 Z" fill="#fcd34d" />
                      {/* Scalloped circle */}
                      <circle cx="50" cy="45" r="32" fill="#fde047" />
                      <circle cx="50" cy="45" r="32" fill="none" stroke="#ca8a04" strokeWidth="6" strokeDasharray="8 6" />
                      <circle cx="50" cy="45" r="26" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                      <text x="50" y="42" textAnchor="middle" fill="#b45309" fontSize="14" fontWeight="bold" fontFamily="sans-serif">非常棒</text>
                      <text x="50" y="54" textAnchor="middle" fill="#b45309" fontSize="8" fontFamily="sans-serif">very good</text>
                   </svg>
                </div>

                {/* Text Body */}
                <div className="text-3xl space-y-6 px-8 font-medium w-full mt-2" style={{ color: '#374151' }}>
                   <div className="flex items-end">
                     <span className="border-b-2 px-8 pb-1 text-4xl font-bold min-w-[200px] text-center inline-block" style={{ borderColor: '#374151', color: '#000000' }}>{childName}</span>
                     <span className="ml-2">小朋友：</span>
                   </div>

                   <div className="flex items-end pl-16">
                     <span>在</span>
                     <span className="border-b-2 px-8 pb-1 mx-4 text-4xl font-bold inline-block" style={{ borderColor: '#374151', color: '#000000' }}>神秘藏宝岛之旅</span>
                     <span>中表现优秀，</span>
                   </div>

                   <div className="flex items-end pl-4 mt-4">
                     <span>被评为：</span>
                     <div className="flex-1 flex justify-center">
                       <span className="text-6xl font-bold tracking-widest" style={{ color: '#e06c75', fontFamily: '"STXingkai", "Xingkai SC", "华文行楷", "STKaiti", "Kaiti TC", serif' }}>数对探险之星</span>
                     </div>
                   </div>

                   <div className="pl-16 pt-4">
                     <span>特发此状，以资鼓励！</span>
                   </div>
                </div>

                {/* Date */}
                <div className="absolute bottom-0 right-8 text-2xl font-bold tracking-widest" style={{ color: '#374151' }}>
                   {new Date().getFullYear()} <span className="mx-1">年</span> {new Date().getMonth() + 1} <span className="mx-1">月</span> {new Date().getDate()} <span className="mx-1">日</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1a1a2e] border border-indigo-500/30 rounded-3xl p-6 md:p-8 w-full max-w-3xl flex flex-col items-center relative shadow-2xl"
            >
              <button 
                onClick={() => {
                  setShowModal(false);
                  setCertificateImg(null);
                }} 
                className="absolute top-4 right-4 text-white/50 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
              
              {!certificateImg ? (
                <>
                  <div className="text-4xl mb-4">📸</div>
                  <h2 className="text-2xl font-bold text-white mb-2">保存航海日志</h2>
                  <p className="text-indigo-300/80 text-sm mb-8 text-center">输入小朋友的名字，生成专属的像素画完成奖状吧！</p>
                  
                  <input 
                    type="text" 
                    placeholder="请输入名字 (最多10个字)" 
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    className="w-full bg-black/50 border border-indigo-500/50 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 mb-8 text-center text-lg"
                    maxLength={10}
                  />
                  
                  <button 
                    onClick={generateCertificate}
                    disabled={!childName.trim() || isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    {isGenerating ? '正在生成奖状...' : '生成专属奖状'}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2">
                    <span>✨</span> 生成成功 <span>✨</span>
                  </h2>
                  <p className="text-yellow-300 font-bold text-base mb-6 bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/20">
                    👇 长按下方图片即可保存到相册
                  </p>
                  
                  <div className="w-full max-h-[50vh] overflow-y-auto rounded-xl shadow-2xl mb-6 border border-white/10 custom-scrollbar">
                    <img src={certificateImg} alt="航海日志证书" className="w-full h-auto" />
                  </div>
                  
                  <button 
                    onClick={() => {
                      setCertificateImg(null);
                      setShowModal(false);
                    }}
                    className="w-full py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors"
                  >
                    完成
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
