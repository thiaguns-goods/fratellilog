
import React, { useState, useEffect } from 'react';
import { ViewType, Delivery, DeliveryStatus, Settings } from './types';
import DeliveryList from './components/DeliveryList';
import OrderDetails from './components/OrderDetails';
import OrderImport from './components/OrderImport';
import SettingsView from './components/SettingsView';
import MapView from './components/MapView';
import HomeView from './components/HomeView';

const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: '1',
    orderNumber: '1024',
    clientName: 'Bar do Zé - Centro',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    phone: '5511998887766',
    timeWindow: '14:00 - 16:00',
    installTime: 20,
    status: DeliveryStatus.PENDING,
    createdAt: '2023-10-12T09:45:00',
    items: [
      { id: 'i1', name: 'Pilsen 50L', type: 'Barril Aço Inox', quantity: 2 },
      { id: 'i2', name: 'IPA 30L', type: 'Barril Slim', quantity: 1 }
    ]
  }
];

const INITIAL_SETTINGS: Settings = {
  breweryName: 'Fratelli Reggiani',
  breweryAddress: 'Av. Saturnino Mauro Rangel, 1011, Vitória - ES',
  installTimePerKeg: 15,
  vehicleCapacity: 40,
  maxRadius: 45,
  avoidTolls: true,
  notifyClient: true,
  avoidDirtRoads: true
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('HOME');
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddDelivery = (newDelivery: Partial<Delivery>) => {
    const delivery: Delivery = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: (1000 + deliveries.length).toString(),
      clientName: newDelivery.clientName || 'Novo Cliente',
      address: newDelivery.address || '',
      phone: newDelivery.phone || '',
      timeWindow: newDelivery.timeWindow || 'A combinar',
      installTime: newDelivery.installTime || settings.installTimePerKeg,
      status: DeliveryStatus.PENDING,
      items: newDelivery.items || [],
      createdAt: new Date().toISOString()
    };
    setDeliveries(prev => [delivery, ...prev]);
    setView('LIST');
  };

  const handleUpdateDelivery = (id: string, updates: Partial<Delivery>) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const selectedDelivery = deliveries.find(d => d.id === selectedDeliveryId);

  const renderNav = () => (
    <nav className="fixed bottom-0 w-full z-30 bg-white/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pb-safe-bottom max-w-md mx-auto left-0 right-0">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => setView('HOME')} className={`flex flex-col items-center justify-center w-full h-full ${view === 'HOME' ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <button onClick={() => setView('LIST')} className={`flex flex-col items-center justify-center w-full h-full ${view === 'LIST' ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          <span className="text-[10px] font-medium">Entregas</span>
        </button>
        <button onClick={() => setView('MAP')} className={`flex flex-col items-center justify-center w-full h-full ${view === 'MAP' ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined text-[24px]">map</span>
          <span className="text-[10px] font-medium">Otimizar</span>
        </button>
        <button onClick={() => setView('SETTINGS')} className={`flex flex-col items-center justify-center w-full h-full ${view === 'SETTINGS' ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto overflow-hidden shadow-2xl bg-background-light dark:bg-background-dark relative border-x border-black/5 dark:border-white/5">
      <div className="flex-1 pb-16">
        {view === 'HOME' && <HomeView onStartImport={() => setView('IMPORT')} deliveries={deliveries} />}
        
        {view === 'LIST' && (
          <DeliveryList 
            deliveries={deliveries} 
            onSelect={(id) => { setSelectedDeliveryId(id); setView('DETAILS'); }}
            onAdd={() => setView('IMPORT')}
          />
        )}
        
        {view === 'IMPORT' && (
          <OrderImport 
            onCancel={() => setView('HOME')} 
            onImported={handleAddDelivery}
          />
        )}
        
        {view === 'DETAILS' && selectedDelivery && (
          <OrderDetails 
            delivery={selectedDelivery} 
            settings={settings}
            onBack={() => setView('LIST')}
            onUpdate={(updates) => handleUpdateDelivery(selectedDelivery.id, updates)}
          />
        )}

        {view === 'SETTINGS' && (
          <SettingsView 
            settings={settings}
            onSave={(s) => { setSettings(s); setView('HOME'); }}
            onBack={() => setView('HOME')}
          />
        )}

        {view === 'MAP' && (
          <MapView 
            deliveries={deliveries}
            settings={settings}
            onBack={() => setView('HOME')}
          />
        )}
      </div>
      {view !== 'DETAILS' && view !== 'IMPORT' && renderNav()}
    </div>
  );
};

export default App;
