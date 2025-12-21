
import React, { useState } from 'react';
import { Delivery, DeliveryStatus } from '../types';

interface Props {
  deliveries: Delivery[];
  onSelect: (id: string) => void;
  onAdd: () => void;
}

const DeliveryList: React.FC<Props> = ({ deliveries, onSelect, onAdd }) => {
  const [filter, setFilter] = useState('Hoje');

  const pending = deliveries.filter(d => d.status === DeliveryStatus.PENDING).length;
  const inRoute = deliveries.filter(d => d.status === DeliveryStatus.IN_ROUTE).length;
  const delivered = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length;

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 pt-safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-black dark:bg-white flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-white dark:text-black">local_shipping</span>
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight">Roteiro de Entregas</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-200 dark:bg-surface-dark p-1">
            {['Ontem', 'Hoje', 'Amanhã'].map(d => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`flex-1 h-full flex items-center justify-center rounded-[4px] px-2 text-sm font-medium transition-all ${filter === d ? 'bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-[#9db8a8]'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 rounded-xl p-3 bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
              <p className="text-slate-500 dark:text-[#9db8a8] text-xs font-medium">Pendentes</p>
              <p className="text-orange-500 dark:text-orange-400 text-xl font-bold">{pending}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-3 bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden">
              <p className="text-slate-500 dark:text-[#9db8a8] text-xs font-medium">Em Rota</p>
              <p className="text-primary text-xl font-bold">{inRoute}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-3 bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm">
              <p className="text-slate-500 dark:text-[#9db8a8] text-xs font-medium">Entregues</p>
              <p className="text-emerald-600 dark:text-emerald-500 text-xl font-bold">{delivered}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-[#9db8a8] uppercase tracking-wider">Próximas Paradas</h3>
            <button onClick={onAdd} className="text-primary text-xs font-bold uppercase">+ Novo Pedido</button>
          </div>
          
          {deliveries.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Nenhuma entrega cadastrada.
            </div>
          )}

          {deliveries.map(delivery => (
            <div 
              key={delivery.id} 
              onClick={() => onSelect(delivery.id)}
              className={`group flex flex-col gap-3 rounded-xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-l-4 border-slate-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all
                ${delivery.status === DeliveryStatus.PENDING ? 'border-l-orange-400' : ''}
                ${delivery.status === DeliveryStatus.IN_ROUTE ? 'border-l-primary' : ''}
                ${delivery.status === DeliveryStatus.DELIVERED ? 'border-l-emerald-500 opacity-80' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-slate-900 dark:text-white text-base font-bold ${delivery.status === DeliveryStatus.DELIVERED ? 'line-through decoration-slate-400' : ''}`}>{delivery.clientName}</h4>
                    <span className="text-xs bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded">#{delivery.orderNumber}</span>
                  </div>
                  <p className="text-slate-500 dark:text-[#9db8a8] text-sm flex items-center gap-1 line-clamp-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {delivery.address}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold
                    ${delivery.status === DeliveryStatus.PENDING ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' : ''}
                    ${delivery.status === DeliveryStatus.IN_ROUTE ? 'bg-primary/10 text-green-700 dark:text-primary' : ''}
                    ${delivery.status === DeliveryStatus.DELIVERED ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : ''}
                  `}>
                    {delivery.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{delivery.timeWindow}</span>
                </div>
              </div>
              <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">propane_tank</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {delivery.items.reduce((sum, i) => sum + i.quantity, 0)} Barris
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DeliveryList;
