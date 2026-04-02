import { GoogleGenAI } from "@google/genai";

class GeminiLiveService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = new GoogleGenAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    this.liveSession = null;
  }

  async connect(onMessage, onError) {
    if (!this.apiKey) {
      const msg = "Error: VITE_GEMINI_API_KEY no configurada. Por favor, añádela a tu archivo .env";
      console.error(msg);
      if (onError) onError(msg);
      return false;
    }

    try {
      // En una implementación real con el SDK de Live, se usaría una conexión WebSocket.
      // Aquí configuramos la sesión con el contexto legal.
      this.liveSession = this.model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2048,
        },
      });

      console.log("Conexión establecida con Gemini 2.0 Flash Live");
      return true;
    } catch (error) {
      console.error("Error en la conexión Live:", error);
      if (onError) onError(error.message);
      return false;
    }
  }

  async sendMessage(message, systemPrompt) {
    if (!this.liveSession) return "Error: Sesión no iniciada.";

    try {
      // Inyectamos el contexto legal en cada interacción si es necesario, 
      // o lo enviamos como parte del primer mensaje.
      const prompt = `${systemPrompt}\n\nUsuario: ${message}`;
      const result = await this.liveSession.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      return "Hubo un error al procesar tu consulta de voz.";
    }
  }

  disconnect() {
    this.liveSession = null;
    console.log("Sesión finalizada.");
  }
}

export default new GeminiLiveService();
