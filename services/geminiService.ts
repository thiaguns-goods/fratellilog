
import { GoogleGenAI, Type } from "@google/genai";
import { Delivery, DeliveryStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    clientName: { type: Type.STRING, description: "Name of the client or establishment" },
    address: { type: Type.STRING, description: "Full delivery address" },
    phone: { type: Type.STRING, description: "Contact phone number" },
    timeWindow: { type: Type.STRING, description: "Preferred delivery time window" },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Item name (e.g., Pilsen 50L)" },
          type: { type: Type.STRING, description: "Item type (e.g., Steel Keg)" },
          quantity: { type: Type.NUMBER, description: "Quantity of items" }
        },
        required: ["name", "quantity"]
      }
    }
  },
  required: ["clientName", "address", "items"]
};

export async function parseOrderFromText(text: string): Promise<Partial<Delivery>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extraia os detalhes do pedido da seguinte mensagem do WhatsApp: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "Você é um assistente de logística especializado em cervejarias. Extraia endereços, nomes de clientes e itens de barris (Kegs) de mensagens de texto."
      }
    });

    const parsed = JSON.parse(response.text);
    
    return {
      clientName: parsed.clientName || "Cliente Desconhecido",
      address: parsed.address || "",
      phone: parsed.phone || "",
      timeWindow: parsed.timeWindow || "A combinar",
      items: parsed.items?.map((i: any, index: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: i.name,
        type: i.type || "Barril",
        quantity: i.quantity
      })) || []
    };
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw error;
  }
}
