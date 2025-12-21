
import React from 'react';
import { Delivery, DeliveryStatus, Settings } from '../types';

interface Props {
  delivery: Delivery;
  settings: Settings;
  onBack: () => void;
  onUpdate: (updates: Partial<Delivery>) => void;
}

const OrderDetails: React.FC<Props> = ({ delivery, settings, onBack, onUpdate }) => {
  const handleToggleStatus = () => {
    let nextStatus = DeliveryStatus.IN_ROUTE;
    if (delivery.status === DeliveryStatus.IN_ROUTE) nextStatus = DeliveryStatus.DELIVERED;
    if (delivery.status === DeliveryStatus.DELIVERED) nextStatus = DeliveryStatus.PENDING;
    onUpdate({ status: nextStatus });
  };

  const handleUpdateItem = (itemId: string, diff: number) => {
    const newItems = delivery.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity + diff) };
      }
      return item;
    });
    onUpdate({ items: newItems });
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = delivery.phone.replace(/\D/g, '');
    const message = `Olá! A Cervejaria ${settings.breweryName} está a caminho da sua entrega. Nossa previsão de chegada é de aproximadamente 15-20 minutos.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-screen pb-24 overflow-y-auto bg-background-dark">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-dark/95 backdrop-blur-md p-4 pb-2 border-b border-white/5">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center text-white fratelli-font tracking-widest uppercase text-xs">Detalhes</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-4 pt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-black italic fratelli-font text-gradient">Pedido #{delivery.orderNumber}</h1>
            <div className="flex h-8 items-center gap-x-2 rounded-lg bg-surface-dark border border-white/5 pl-2 pr-3">
              <span className="material-symbols-outlined text-primary text-[18px]">edit_note</span>
              <p className="text-white text-xs font-bold uppercase tracking-wider">{delivery.status}</p>
            </div>
          </div>
          <p className="text-text-secondary-dark text-[10px] font-bold uppercase tracking-widest">Criado em {new Date(delivery.createdAt).toLocaleDateString()}</p>
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary">person</span>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Cliente</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-xl">
              <span className="text-text-secondary-dark text-[10px] font-bold uppercase mb-1">Nome / Local</span>
              <p className="font-bold text-lg">{delivery.clientName}</p>
            </div>
            <div className="flex flex-col bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-xl">
              <span className="text-text-secondary-dark text-[10px] font-bold uppercase mb-1">Contato</span>
              <p className="font-bold text-primary tracking-wider">{delivery.phone}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Endereço</h3>
          </div>
          <div className="bg-surface-dark p-5 rounded-2xl border border-white/5 shadow-xl">
            <p className="font-medium text-sm leading-relaxed opacity-80">{delivery.address}</p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-[#25D366]">campaign</span>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Notificar</h3>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-surface-dark p-6 border border-white/5 shadow-2xl">
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative">
              <span className="absolute -top-2 left-4 bg-[#25D366] text-[8px] text-white px-2 py-0.5 rounded-full font-black tracking-widest">WHATSAPP PREVIEW</span>
              <p className="text-xs italic text-text-secondary-dark leading-relaxed pt-1">
                "Olá! A <strong>{settings.breweryName}</strong> está a caminho. Previsão: 15-20 min."
              </p>
            </div>
            <button 
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#1EBE57] active:scale-[0.98] text-black font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all"
            >
              <span className="material-symbols-outlined font-bold">send</span> Enviar Agora
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 pb-20">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Carga</h3>
            </div>
            <button className="text-primary text-[10px] font-black tracking-[0.2em] uppercase">+ ADICIONAR</button>
          </div>
          {delivery.items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-surface-dark rounded-2xl p-4 border border-white/5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-black flex items-center justify-center shrink-0 border border-white/5">
                  <span className="material-symbols-outlined text-primary">propane_tank</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-white font-bold leading-tight">{item.name}</p>
                  <p className="text-text-secondary-dark text-[10px] font-bold uppercase tracking-tighter">{item.type}</p>
                </div>
              </div>
              <div className="flex items-center bg-black rounded-xl p-1 gap-3 border border-white/5">
                <button 
                  onClick={() => handleUpdateItem(item.id, -1)}
                  className="size-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="font-black text-white w-6 text-center fratelli-font text-lg">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdateItem(item.id, 1)}
                  className="size-10 flex items-center justify-center rounded-lg bg-primary text-black"
                >
                  <span className="material-symbols-outlined text-[18px] font-bold">add</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/95 backdrop-blur-xl border-t border-white/5 z-30 max-w-md mx-auto pb-safe-bottom">
        <button 
          onClick={handleToggleStatus}
          className="w-full h-16 rounded-2xl bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(242,124,34,0.3)]"
        >
          <span className="text-black font-black text-xs uppercase tracking-[0.3em]">
            {delivery.status === DeliveryStatus.PENDING ? 'Confirmar Saída' : 
             delivery.status === DeliveryStatus.IN_ROUTE ? 'Finalizar Entrega' : 'Reabrir Pedido'}
          </span>
          <span className="material-symbols-outlined text-black font-bold">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
