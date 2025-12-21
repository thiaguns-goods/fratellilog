
import React, { useState, useEffect } from 'react';
import { ViewType, Delivery, DeliveryStatus, Settings } from './types';
import DeliveryList from './components/DeliveryList';
import OrderDetails from './components/OrderDetails';
import OrderImport from './components/OrderImport';
import SettingsView from './components/SettingsView';
import MapView from './components/MapView';
import HomeView from './components/HomeView';

const INITIAL_DELIVERIES: Delivery[] = [];

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
    try {
      const saved = localStorage.getItem('deliveries');
      return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
    } catch {
      return INITIAL_DELIVERIES;
    }
  });
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
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
    <nav className="fixed bottom-0 w-full z-30 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 pb-safe-bottom max-w-md mx-auto left-0 right-0">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => setView('HOME')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === 'HOME' ? 'text-primary' : 'text-white/20'}`}>
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">Início</span>
        </button>
        <button onClick={() => setView('LIST')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === 'LIST' ? 'text-primary' : 'text-white/20'}`}>
          <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">Entregas</span>
        </button>
        <button onClick={() => setView('MAP')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === 'MAP' ? 'text-primary' : 'text-white/20'}`}>
          <span className="material-symbols-outlined text-[24px]">map</span>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">Rota</span>
        </button>
        <button onClick={() => setView('SETTINGS')} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === 'SETTINGS' ? 'text-primary' : 'text-white/20'}`}>
          <span className="material-symbols-outlined text-[24px]">settings</span>
          <span className="text-[10px] font-black uppercase tracking-widest mt-1">Ajustes</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto overflow-hidden bg-background-dark relative shadow-2xl">
      <div className="flex-1">
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
