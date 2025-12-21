
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
  const [mode, setMode] = useState<'AI' | 'MANUAL'>('AI');

  const [manualData, setManualData] = useState({
    clientName: '',
    address: '',
    phone: ''
  });

  const handleProcess = async () => {
    if (mode === 'AI') {
      if (!text.trim()) {
        setError('Por favor, cole a mensagem do pedido.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const parsed = await parseOrderFromText(text);
        onImported(parsed);
      } catch (err: any) {
        console.error("Erro na importação:", err);
        if (err.message === "API_KEY_MISSING") {
          setError('Chave de API não encontrada no Netlify. Usando Modo Manual.');
          setMode('MANUAL');
        } else {
          setError('Não conseguimos ler esta mensagem. Verifique a chave de API ou tente o Modo Manual.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!manualData.clientName || !manualData.address) {
        setError('O nome do cliente e o endereço são obrigatórios.');
        return;
      }
      onImported({
        ...manualData,
        items: [] 
      });
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      setError('Não conseguimos acessar sua área de transferência. Por favor, cole manualmente.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark selection:bg-primary/30">
      <header className="sticky top-0 z-20 w-full bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between pt-safe-top">
        <button onClick={onCancel} className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
          CANCELAR
        </button>
        <h1 className="text-xs font-black text-white tracking-[0.4em] uppercase fratelli-font">Entrada de Pedido</h1>
        <div className="w-[80px]"></div>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-md mx-auto overflow-y-auto pb-32">
        <div className="px-6 pt-8 pb-4">
          <div className="flex p-1 bg-surface-dark rounded-2xl mb-8 border border-white/5 shadow-inner">
            <button 
              onClick={() => setMode('AI')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'AI' ? 'bg-primary text-black shadow-lg' : 'text-white/30'}`}
            >
              Inteligência Artificial
            </button>
            <button 
              onClick={() => setMode('MANUAL')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'MANUAL' ? 'bg-primary text-black shadow-lg' : 'text-white/30'}`}
            >
              Manual
            </button>
          </div>

          <h2 className="text-3xl font-black text-white italic fratelli-font leading-none uppercase">
            {mode === 'AI' ? 'Scanner de Mensagem' : 'Cadastro Direto'}
          </h2>
          <p className="mt-3 text-[11px] text-text-secondary-dark font-bold leading-relaxed uppercase tracking-tighter opacity-60">
            {mode === 'AI' 
              ? 'Cole o texto do WhatsApp e nossa IA fará o resto.' 
              : 'Preencha os campos abaixo para criar o roteiro manualmente.'}
          </p>
        </div>

        <div className="px-6 flex flex-col gap-5">
          {mode === 'AI' ? (
            <div className="relative group">
              <textarea
                className="w-full h-72 resize-none rounded-[2.5rem] border border-white/5 bg-surface-dark text-white placeholder:text-white/10 focus:border-primary/50 focus:ring-0 p-8 text-sm leading-relaxed shadow-2xl transition-all"
                placeholder="Copie a conversa do cliente aqui..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
              />
              {!text && (
                <button 
                  onClick={handlePaste}
                  className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-full border border-white/10 backdrop-blur-md transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-[16px]">content_paste</span> Colar Texto
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-primary uppercase ml-4 tracking-widest">Estabelecimento</p>
                <input 
                  placeholder="EX: BAR DO ZE"
                  className="w-full h-16 px-6 rounded-2xl bg-surface-dark border border-white/5 text-sm font-bold text-white placeholder:text-white/5 focus:border-primary outline-none"
                  value={manualData.clientName}
                  onChange={e => setManualData({...manualData, clientName: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-primary uppercase ml-4 tracking-widest">Localização</p>
                <textarea 
                  placeholder="ENDEREÇO COMPLETO"
                  className="w-full h-32 p-6 rounded-2xl bg-surface-dark border border-white/5 text-sm font-medium text-white placeholder:text-white/5 focus:border-primary outline-none resize-none leading-relaxed"
                  value={manualData.address}
                  onChange={e => setManualData({...manualData, address: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-primary uppercase ml-4 tracking-widest">Contato</p>
                <input 
                  placeholder="TELEFONE (OPCIONAL)"
                  className="w-full h-16 px-6 rounded-2xl bg-surface-dark border border-white/5 text-sm font-bold text-white placeholder:text-white/5 focus:border-primary outline-none"
                  value={manualData.phone}
                  onChange={e => setManualData({...manualData, phone: e.target.value})}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-red-500/20 text-center leading-relaxed">
              {error}
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-30 max-w-md mx-auto pb-safe-bottom">
        <button 
          disabled={loading || (mode === 'AI' && !text && !loading)}
          onClick={handleProcess}
          className={`flex w-full items-center justify-center rounded-2xl h-16 bg-primary text-black text-xs font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(242,124,34,0.3)] transition-all active:scale-95
            ${loading || (mode === 'AI' && !text) ? 'opacity-20 grayscale' : 'hover:bg-primary-dark'}`}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="size-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
              PROCESSANDO...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {mode === 'AI' ? 'Gerar com IA' : 'Confirmar Pedido'} 
              <span className="material-symbols-outlined font-black">arrow_forward</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderImport;
