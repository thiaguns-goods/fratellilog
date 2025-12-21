
import React, { useState } from 'react';
import { parseOrderFromText } from '../services/geminiService';
import { Delivery } from '../types';

interface Props {
  onCancel: () => void;
  onImported: (delivery: Partial<Delivery>) => void;
}

const OrderImport: React.FC<Props> = ({ onCancel, onImported }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const parsed = await parseOrderFromText(text);
      onImported(parsed);
    } catch (err) {
      setError('Erro ao processar o pedido. Verifique sua conexão e o formato da mensagem.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
    } catch (err) {
      console.error('Falha ao colar:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-20 w-full bg-background-light dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 h-14 flex items-center justify-between">
        <button onClick={onCancel} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          Cancelar
        </button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Importar Pedido</h1>
        <div className="w-[60px]"></div>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto relative overflow-hidden">
        <div className="px-5 pt-6 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Nova importação</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Copie a mensagem do cliente no WhatsApp e cole abaixo. Nossa IA extrairá o endereço e os itens automaticamente.
          </p>
        </div>

        <div className="flex-1 px-4 py-3 flex flex-col gap-4">
          <div className="relative flex-1 flex flex-col">
            <textarea
              className="flex-1 w-full resize-none rounded-xl border-0 bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary p-4 text-base leading-relaxed shadow-sm"
              placeholder="Exemplo: Olá, gostaria de 2 barris de Pilsen. Endereço: Rua das Flores, 123 - Centro."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <div className="absolute bottom-4 right-4 z-10">
              <button 
                onClick={handlePaste}
                className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white text-xs font-bold py-2 px-3 rounded-lg"
              >
                <span className="material-symbols-outlined text-[16px]">content_paste</span>
                <span>Colar</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex items-start gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Certifique-se de que a mensagem contém o endereço completo e a quantidade de barris.
            </p>
          </div>
        </div>

        <div className="p-4 w-full bg-background-light dark:bg-background-dark/80 backdrop-blur-xl sticky bottom-0 z-20">
          <button 
            disabled={loading || !text}
            onClick={handleProcess}
            className={`flex w-full items-center justify-center rounded-xl h-14 bg-primary text-background-dark text-lg font-bold shadow-lg transition-all 
              ${loading || !text ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark active:scale-[0.98]'}`}
          >
            {loading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <span className="flex items-center gap-2">
                Processar Pedido <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderImport;
