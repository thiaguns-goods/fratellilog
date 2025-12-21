
import { GoogleGenAI, Type } from "@google/genai";
import { Delivery } from "../types";

/**
 * Serviço de Inteligência Artificial da Cervejaria Fratelli.
 * Utiliza o modelo Gemini para extração de dados logísticos.
 */

// Inicialização centralizada seguindo as diretrizes de segurança
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY não encontrada no ambiente. O sistema funcionará em modo manual.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Definição do Schema de Resposta para garantir dados estruturados (JSON)
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    clientName: { 
      type: Type.STRING, 
      description: "Nome do estabelecimento ou cliente final." 
    },
    address: { 
      type: Type.STRING, 
      description: "Endereço completo para navegação no GPS." 
    },
    phone: { 
      type: Type.STRING, 
      description: "Número de telefone formatado (apenas números)." 
    },
    timeWindow: { 
      type: Type.STRING, 
      description: "Intervalo de horário para entrega (ex: 14h-18h)." 
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome do produto (ex: Pilsen)." },
          type: { type: Type.STRING, description: "Tipo de vasilhame (ex: Barril 50L)." },
          quantity: { type: Type.NUMBER, description: "Quantidade solicitada." }
        },
        required: ["name", "quantity"]
      }
    }
  },
  required: ["clientName", "address", "items"]
};

/**
 * Processa um texto (geralmente vindo do WhatsApp) e extrai um objeto de pedido.
 */
export async function parseOrderFromText(text: string): Promise<Partial<Delivery>> {
  const ai = getAiClient();
  
  if (!ai) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extraia as informações logísticas da seguinte mensagem de pedido da Cervejaria Fratelli: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "Você é o Analista de Operações da Fratelli Reggiani. Sua missão é ler mensagens de texto de clientes (donos de bares/eventos) e estruturar os dados para o roteiro de entrega. Ignore saudações e foque no QUE, ONDE e QUANTO."
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("A IA retornou um conteúdo vazio.");
    
    const parsed = JSON.parse(resultText);
    
    // Mapeamento final para o tipo Delivery
    return {
      clientName: parsed.clientName || "Cliente Identificado pela IA",
      address: parsed.address || "Endereço não identificado",
      phone: parsed.phone || "",
      timeWindow: parsed.timeWindow || "A combinar",
      items: parsed.items?.map((i: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: i.name,
        type: i.type || "Barril",
        quantity: i.quantity || 1
      })) || []
    };
  } catch (error) {
    console.error("Erro Crítico no Serviço Gemini:", error);
    throw error;
  }
}
