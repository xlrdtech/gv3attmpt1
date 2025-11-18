import React, { useEffect, useState } from 'react';
import { Activity, Radio, Wifi, Crosshair, Aperture } from 'lucide-react';

export const Overlay: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        x: Math.floor(Math.random() * 9999),
        y: Math.floor(Math.random() * 9999),
        z: Math.floor(Math.random() * 9999)
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none">
      
      {/* Cinematic Letterbox Bars */}
      <div className="absolute top-0 left-0 w-full h-[8vh] bg-black z-10 flex items-end justify-center pb-2">
         <div className="text-[10px] text-white/20 font-mono tracking-[1em]">REC ● [00:01:42:19]</div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[8vh] bg-black z-10 flex items-start justify-center pt-2">
         <div className="text-[10px] text-white/20 font-mono tracking-[1em]">ISO 8000 // F2.8</div>
      </div>

      {/* Top Left: Status */}
      <div className="absolute top-[10vh] left-8 flex flex-col gap-2">
        <div className="flex items-center gap-3 text-cyan-400/90 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
          <Aperture className="w-5 h-5 animate-spin-slow" style={{animationDuration: '10s'}} />
          <span className="font-display font-bold tracking-widest text-sm">OPTICAL LINK</span>
        </div>
        <div className="h-px w-32 bg-gradient-to-r from-cyan-500/80 to-transparent" />
        <div className="font-mono text-[10px] text-cyan-300/70 leading-tight">
          COORD: {coords.x}.{coords.y}<br />
          VECTOR: {coords.z} RELATIVE
        </div>
      </div>

      {/* Top Right: Connection */}
      <div className="absolute top-[10vh] right-8 flex flex-col items-end gap-2">
        <div className="flex items-center gap-3 text-pink-400/90 drop-shadow-[0_0_5px_rgba(255,0,120,0.8)]">
          <span className="font-display font-bold tracking-widest text-sm">LIVE FEED</span>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
        </div>
        <div className="h-px w-32 bg-gradient-to-l from-pink-500/80 to-transparent" />
        <div className="font-mono text-[10px] text-pink-300/70 text-right leading-tight">
          BUFFER: OPTIMAL<br />
          ENCRYPTION: AES-4096
        </div>
      </div>

      {/* Center: Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 scale-50 md:scale-100">
         <div className="relative w-64 h-64 border border-white/10 rounded-full flex items-center justify-center">
            <div className="w-60 h-60 border border-white/5 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
            <Crosshair className="absolute w-4 h-4 text-cyan-400" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-4 bg-cyan-500/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-1 h-4 bg-cyan-500/50" />
            <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-4 h-1 bg-cyan-500/50" />
            <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-4 h-1 bg-cyan-500/50" />
         </div>
      </div>

      {/* Bottom Left: Instructions */}
      <div className="absolute bottom-[10vh] left-8">
         <div className="flex items-center gap-4">
            <div className="w-[2px] h-12 bg-white/10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1/2 bg-cyan-400 animate-[slideDown_1.5s_linear_infinite]"></div>
            </div>
            <div className="text-[9px] font-mono text-white/50 tracking-widest uppercase">
               Scroll to Traverse<br />
               <span className="text-cyan-400">Neural Pathway</span>
            </div>
         </div>
      </div>

      {/* Bottom Right: Signature */}
      <div className="absolute bottom-[10vh] right-8 text-right group cursor-help pointer-events-auto">
         <h1 className="font-display font-bold text-3xl text-white tracking-widest drop-shadow-lg">NEXUS</h1>
         <div className="flex items-center justify-end gap-2 mt-1">
             <div className="h-[1px] w-8 bg-white/30 group-hover:w-16 transition-all duration-500" />
             <p className="text-[8px] text-white/40 tracking-[0.4em] uppercase">System v2.0.4</p>
         </div>
      </div>

      {/* Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-[-1]" />
    </div>
  );
};