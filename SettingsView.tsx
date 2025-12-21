
import React, { useState } from 'react';
import { Settings } from '../types';

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
  onBack: () => void;
}

const SettingsView: React.FC<Props> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
        <button onClick={onBack} className="flex items-center justify-center p-2 rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold flex-1 text-center fratelli-font tracking-widest uppercase text-xs">Configurações</h1>
        <button 
          onClick={() => onSave(localSettings)}
          className="font-bold text-primary px-2 uppercase text-xs tracking-widest"
        >
          Salvar
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col items-center pt-12 pb-10 px-4 text-center">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-black tracking-tight text-gradient italic uppercase fratelli-font">Fratelli</h2>
            <p className="text-text-secondary-dark text-[10px] font-bold uppercase tracking-[0.5em] mt-3 opacity-60 western-vibe">Logística de Excelência</p>
          </div>
        </div>

        <section className="px-6 space-y-8">
          <div className="space-y-5">
            <label className="block">
              <span className="text-[10px] font-bold mb-2 block text-text-secondary-dark uppercase tracking-widest">Nome da Unidade</span>
              <input 
                className="w-full h-14 px-5 rounded-2xl bg-surface-dark border border-white/5 focus:border-primary focus:ring-0 outline-none font-bold text-sm"
                type="text" 
                value={localSettings.breweryName}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, breweryName: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold mb-2 block text-text-secondary-dark uppercase tracking-widest">Endereço da Base</span>
              <textarea 
                className="w-full h-24 p-5 rounded-2xl bg-surface-dark border border-white/5 focus:border-primary focus:ring-0 outline-none font-medium resize-none leading-relaxed text-sm"
                value={localSettings.breweryAddress}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, breweryAddress: e.target.value }))}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <label className="block">
              <span className="text-[10px] font-bold mb-2 block text-text-secondary-dark uppercase tracking-widest">Tempo Carga (m)</span>
              <input 
                className="w-full h-14 px-5 rounded-2xl bg-surface-dark border border-white/5 focus:border-primary focus:ring-0 font-bold"
                type="number" 
                value={localSettings.installTimePerKeg}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, installTimePerKeg: Number(e.target.value) }))}
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold mb-2 block text-text-secondary-dark uppercase tracking-widest">Capacidade (un)</span>
              <input 
                className="w-full h-14 px-5 rounded-2xl bg-surface-dark border border-white/5 focus:border-primary focus:ring-0 font-bold"
                type="number" 
                value={localSettings.vehicleCapacity}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, vehicleCapacity: Number(e.target.value) }))}
              />
            </label>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] font-bold text-text-secondary-dark uppercase tracking-widest">Alcance de Entrega</span>
              <span className="text-2xl font-black text-primary fratelli-font">{localSettings.maxRadius} km</span>
            </div>
            <input 
              className="w-full h-2 accent-primary appearance-none bg-white/5 rounded-full cursor-pointer" 
              type="range" min="5" max="300" 
              value={localSettings.maxRadius}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, maxRadius: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-4 pt-4">
            {[
              { label: 'Notificar WhatsApp Automático', key: 'notifyClient' as keyof Settings, icon: 'chat' },
              { label: 'Otimizar: Evitar Pedágios', key: 'avoidTolls' as keyof Settings, icon: 'toll' }
            ].map(pref => (
              <label key={pref.key} className="flex items-center justify-between p-5 rounded-2xl bg-surface-dark border border-white/5 cursor-pointer hover:bg-white/5 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary text-[22px]">{pref.icon}</span>
                  <span className="text-sm font-bold opacity-80">{pref.label}</span>
                </div>
                <input 
                  type="checkbox" 
                  className="w-6 h-6 rounded-lg border-white/10 text-primary focus:ring-0 bg-black cursor-pointer"
                  checked={!!localSettings[pref.key]}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, [pref.key]: e.target.checked }))}
                />
              </label>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsView;
