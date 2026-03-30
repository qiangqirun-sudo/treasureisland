import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Map from './components/Map';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3 from './components/Level3';
import Level4 from './components/Level4';
import EasterEgg from './components/EasterEgg';

export type View = 'map' | 'level1' | 'level2' | 'level3' | 'level4' | 'easter_egg';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('map');
  const [medals, setMedals] = useState<boolean[]>([false, false, false, false]);
  const [hasSeenTreasure, setHasSeenTreasure] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 尝试在用户第一次点击屏幕时自动播放音乐
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // 降低默认音量，使其更舒缓不吵闹
    }
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log("Autoplay prevented by browser:", err);
        });
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [isPlaying]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error("Error playing audio:", e);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleWin = (levelIndex: number) => {
    const newMedals = [...medals];
    newMedals[levelIndex] = true;
    setMedals(newMedals);
    setCurrentView('map');
  };

  return (
    <div className="w-full h-screen bg-amber-50 overflow-hidden font-sans text-stone-800 relative">
      {/* 背景音乐 (温馨、舒缓的曲目) */}
      <audio ref={audioRef} loop preload="auto">
        {/* 舒缓的纯音乐钢琴曲 (Erik Satie - Gymnopédie No. 1) */}
        <source src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Gymnop%C3%A9die_No._1.ogg" type="audio/ogg" />
        {/* 备用：舒缓的海浪声 (确保一定有声音) */}
        <source src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" type="audio/ogg" />
        {/* 备用：轻柔的风声 */}
        <source src="https://actions.google.com/sounds/v1/weather/light_wind.ogg" type="audio/ogg" />
      </audio>
      
      {/* 音乐控制悬浮按钮 (仅在首页显示) */}
      {currentView === 'map' && (
        <button 
          onClick={toggleMusic}
          className="fixed top-4 md:top-6 left-4 md:left-6 z-[9999] p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border-2 border-yellow-300 text-amber-600 hover:bg-yellow-50 hover:scale-105 active:scale-95 transition-all"
          title={isPlaying ? "暂停音乐" : "播放音乐"}
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {currentView === 'map' && <Map medals={medals} onSelectLevel={setCurrentView} hasSeenTreasure={hasSeenTreasure} onTreasureSeen={() => setHasSeenTreasure(true)} />}
      {currentView === 'level1' && <Level1 medals={medals} onWin={() => handleWin(0)} onBack={() => setCurrentView('map')} />}
      {currentView === 'level2' && <Level2 onWin={() => handleWin(1)} onBack={() => setCurrentView('map')} />}
      {currentView === 'level3' && <Level3 onWin={() => handleWin(2)} onBack={() => setCurrentView('map')} />}
      {currentView === 'level4' && <Level4 onWin={() => handleWin(3)} onBack={() => setCurrentView('map')} />}
      {currentView === 'easter_egg' && <EasterEgg onBack={() => setCurrentView('map')} />}
    </div>
  );
}
