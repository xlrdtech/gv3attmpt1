import React, { Suspense } from 'react';
import { Scene } from './components/3D/Scene';
import { Overlay } from './components/UI/Overlay';
import { ChatInterface } from './components/UI/ChatInterface';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
        <div className="font-display tracking-widest text-xs text-cyan-500 animate-pulse">INITIALIZING SIMULATION...</div>
      </div>
    </div>
  );
};

function App() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden cursor-crosshair">
      
      {/* 3D World */}
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>

      {/* UI HUD Layer */}
      <div className="relative z-10 pointer-events-none">
        <Overlay />
      </div>

      {/* Interactive Elements (Pointer events auto enabled inside) */}
      <div className="relative z-20">
        <ChatInterface />
      </div>
      
    </main>
  );
}

export default App;