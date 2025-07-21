import { useEffect, useState } from 'react';
import { Activity, Eye, FlaskConical, Microscope, Search } from 'lucide-react';

const MonsterPlaceholder = () => {
  const [pulseActive, setPulseActive] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseActive((prev) => !prev);
    }, 2000);

    const scanInterval = setInterval(() => {
      setScanLine((prev) => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="flex w-full justify-center items-center min-h-[400px] relative">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '20px 20px'
          }}
        ></div>
      </div>

      {/* Scanning Line */}
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
        style={{
          top: `${scanLine}%`,
          transition: 'top 0.05s linear'
        }}
      ></div>

      <div className="text-center space-y-6 z-10 max-w-md mx-auto px-6">
        {/* Main Icon with Pulse Effect */}
        <div className="relative flex justify-center">
          <div
            className={`absolute w-20 h-20 rounded-full border-2 border-cyan-400/30 ${pulseActive ? 'animate-ping' : ''}`}
          ></div>
          <div className="relative bg-slate-800/80 p-4 rounded-full border-2 border-cyan-500/30">
            <Search className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-mono text-sm tracking-wider">
              ALAT PEMERIKSA MONSTER
            </span>
          </div>

          <h3 className="text-xl font-bold text-cyan-300 mb-2">
            MENUNGGU PEMILIHAN MONSTER
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Pilih monster di sebelah kiri untuk memulai...
          </p>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-700/50 rounded p-2">
              <Microscope className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-xs text-green-400">PEMINDAI</div>
              <div className="text-xs text-slate-400">SIAP</div>
            </div>
            <div className="bg-slate-700/50 rounded p-2">
              <FlaskConical className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-xs text-blue-400">PENGANALISA</div>
              <div className="text-xs text-slate-400">AKTIF</div>
            </div>
            <div className="bg-slate-700/50 rounded p-2">
              <Eye className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-xs text-purple-400">PENAMPIL</div>
              <div className="text-xs text-slate-400">STANDBY</div>
            </div>
          </div>
        </div>

        {/* Animated Prompt */}
        <div className="flex items-center justify-center gap-2 text-cyan-400">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
          <span className="text-sm font-mono">Pilih monster untuk lanjut</span>
        </div>

        {/* System Info */}
        <div className="text-center text-slate-500 text-xs">
          <p>█ SISTEM LABORATORIUM v2.1 █</p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 text-cyan-400/30">
        <div className="w-6 h-6 border-l-2 border-t-2 border-cyan-400/30"></div>
      </div>
      <div className="absolute top-4 right-4 text-cyan-400/30">
        <div className="w-6 h-6 border-r-2 border-t-2 border-cyan-400/30"></div>
      </div>
      <div className="absolute bottom-4 left-4 text-cyan-400/30">
        <div className="w-6 h-6 border-l-2 border-b-2 border-cyan-400/30"></div>
      </div>
      <div className="absolute bottom-4 right-4 text-cyan-400/30">
        <div className="w-6 h-6 border-r-2 border-b-2 border-cyan-400/30"></div>
      </div>
    </div>
  );
};

export default MonsterPlaceholder;
