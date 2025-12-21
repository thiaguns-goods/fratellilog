
import React from 'react';
import { Delivery } from '../types';

interface Props {
  onStartImport: () => void;
  deliveries: Delivery[];
}

const HomeView: React.FC<Props> = ({ onStartImport, deliveries }) => {
  const pendingCount = deliveries.filter(d => d.status === 'PENDING').length;

  return (
    <div className="flex flex-col h-full bg-background-dark text-white selection:bg-primary/30 overflow-hidden">
      <header className="pt-20 pb-12 flex flex-col items-center px-6 text-center">
        <div className="flex flex-col items-center relative z-10">
          <p className="text-[12px] font-black tracking-[0.8em] text-white/40 uppercase mb-4 western-vibe">
            CERVEJARIA
          </p>
          <h1 className="text-[64px] font-black italic tracking-tighter leading-none fratelli-font text-gradient drop-shadow-2xl">
            FRATELLI
          </h1>
          <p className="text-[14px] font-bold tracking-[0.9em] text-white/60 uppercase mt-4 fratelli-font">
            REGGIANI
          </p>
        </div>
        
        <div className="flex items-center gap-6 mt-12 w-full px-12 opacity-30">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary"></div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary"></div>
        </div>
      </header>

      <main className="flex-1 px-6 flex flex-col gap-6">
        <button 
          onClick={onStartImport}
          className="relative overflow-hidden bg-surface-dark p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center gap-6 transition-all active:scale-[0.96] group shadow-2xl"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="z-10">
            <h3 className="text-2xl font-black tracking-tight fratelli-font uppercase text-white group-hover:text-primary transition-colors">Novo Pedido</h3>
            <p className="text-sm text-text-secondary-dark mt-2 font-medium">Processamento inteligente via WhatsApp</p>
          </div>

          <div className="w-full py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center font-bold text-primary group-hover:text-black group-hover:bg-primary transition-all uppercase tracking-[0.2em] text-xs">
            IMPORTAR AGORA <span className="material-symbols-outlined ml-2 text-[18px]">bolt</span>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-dark p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1 shadow-lg">
            <p className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest opacity-60">Aguardando</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{pendingCount}</span>
              <span className="text-[10px] font-bold text-primary uppercase">Cargas</span>
            </div>
          </div>
          <div className="bg-surface-dark p-6 rounded-[2rem] border border-white/5 flex flex-col gap-1 shadow-lg">
            <p className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest opacity-60">Status Base</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase">Operacional</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="pb-10 pt-6 flex flex-col items-center gap-1 opacity-20">
        <p className="text-[8px] font-black tracking-[0.5em] uppercase fratelli-font">Sistema de Logística Fratelli</p>
      </footer>
    </div>
  );
};

export default HomeView;
