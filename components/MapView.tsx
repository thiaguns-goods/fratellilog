
import React, { useState } from 'react';
import { Delivery, Settings } from '../types';

interface Props {
  deliveries: Delivery[];
  settings: Settings;
  onBack: () => void;
}

const MapView: React.FC<Props> = ({ deliveries, settings, onBack }) => {
  const activeDeliveries = deliveries.filter(d => d.status !== 'DELIVERED');
  const [selectedIds, setSelectedIds] = useState<string[]>(activeDeliveries.map(d => d.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleOpenMaps = () => {
    const selectedDeliveries = deliveries.filter(d => selectedIds.includes(d.id));
    if (selectedDeliveries.length === 0) return;

    // Constrói a URL do Google Maps com múltiplos pontos
    // Base -> Ponto 1 -> Ponto 2 -> Base
    const origin = encodeURIComponent(settings.breweryAddress);
    const destination = encodeURIComponent(settings.breweryAddress);
    const waypoints = selectedDeliveries
      .map(d => encodeURIComponent(d.address))
      .join('|');

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2XCOTnPeRxlZmJhzDqOaR-RufR8H9MC91zyOFqG1txSGFGeQgrtqlHNazeSfRwKGOPDMikKCLpBIDvdZ1zycmMIdDi_IyWL6oqt4A2DWHu2W5mqcT2-VU-zKLMdLXU9zzeEElqlH8xgbxsE_gGoYkqYJoOt4tpb0yWrlwLXFz0eSqKXZeSGCzyoIjtPk7ZOFUrFrIzPD5aUv56oDdgsP01_o2TSzNmNYdE8s9P9r1Cl2C17gCRPrWsTu0tXekBtB_vmyqCCcReA" 
          alt="Map"
          className="w-full h-full object-cover opacity-40 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-background-dark h-full"></div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 pt-12">
        <button onClick={onBack} className="flex size-12 items-center justify-center rounded-2xl bg-surface-dark/80 backdrop-blur-md text-white border border-white/10 shadow-2xl">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-xs font-black tracking-[0.4em] uppercase fratelli-font">Otimização</h1>
          <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">Rota Inteligente</p>
        </div>
        <div className="w-12"></div>
      </header>

      <div className="flex-1"></div>

      <div className="relative z-20 w-full bg-background-dark rounded-t-[3rem] shadow-2xl border-t border-white/5 flex flex-col max-h-[65vh]">
        <div className="w-full flex justify-center py-4">
          <div className="h-1 w-12 rounded-full bg-surface-dark"></div>
        </div>

        <div className="px-8 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white text-2xl font-black italic fratelli-font tracking-tight">Cargas Ativas</h2>
              <p className="text-text-secondary-dark text-[10px] font-bold uppercase tracking-widest mt-1">
                {selectedIds.length} paradas selecionadas
              </p>
            </div>
            <div className="bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
              <span className="text-primary font-black text-xs uppercase tracking-tighter">
                {/* Fixed invalid function as child to direct expression for total items */}
                {deliveries.filter(d => selectedIds.includes(d.id)).reduce((acc, d) => acc + d.items.reduce((sum, i) => sum + i.quantity, 0), 0)} BARRIS
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 space-y-4 pb-32">
          {activeDeliveries.map((delivery, index) => (
            <div key={delivery.id} className="flex gap-4 items-start group">
              <div className="flex flex-col items-center pt-2">
                <div className={`size-4 rounded-full ring-4 ring-background-dark z-10 transition-all ${selectedIds.includes(delivery.id) ? 'bg-primary ring-primary/20 shadow-[0_0_15px_rgba(242,124,34,0.5)]' : 'bg-surface-dark ring-surface-dark/40'}`}></div>
                {index < activeDeliveries.length - 1 && <div className="w-0.5 h-16 bg-surface-dark mt-1"></div>}
              </div>
              <div className="flex-1">
                <button 
                  onClick={() => toggleSelect(delivery.id)}
                  className={`w-full bg-surface-dark rounded-2xl p-5 border transition-all text-left flex justify-between items-center shadow-lg
                    ${selectedIds.includes(delivery.id) ? 'border-primary/30' : 'border-white/5 opacity-60'}
                  `}
                >
                  <div className="pr-4">
                    <h3 className="text-white font-bold text-sm tracking-tight">{delivery.clientName}</h3>
                    <p className="text-text-secondary-dark text-[10px] font-medium mt-1 uppercase tracking-tighter line-clamp-1">{delivery.address}</p>
                  </div>
                  <div className={`size-6 rounded-lg border flex items-center justify-center transition-all ${selectedIds.includes(delivery.id) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                    {selectedIds.includes(delivery.id) && <span className="material-symbols-outlined text-black text-xs font-bold">check</span>}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-40">
          <button 
            disabled={selectedIds.length === 0}
            onClick={handleOpenMaps}
            className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all text-black rounded-2xl h-16 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(242,124,34,0.3)] disabled:opacity-30 disabled:grayscale"
          >
            <span className="material-symbols-outlined font-black">directions</span>
            <span className="font-black text-xs uppercase tracking-[0.2em]">INICIAR ROTA NO GOOGLE MAPS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
