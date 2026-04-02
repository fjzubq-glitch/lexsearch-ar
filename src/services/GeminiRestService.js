import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiRestService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      // Usamos el modelo más estable para REST
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  /**
   * Genera una respuesta basada en texto sin necesidad de WebSocket.
   * @param {string} message - Consulta del usuario.
   * @param {string} systemPrompt - Instrucciones de la cátedra.
   */
  async sendMessage(message, systemPrompt) {
    if (!this.apiKey) {
      return "Error: API Key no configurada.";
    }

    try {
      const fullPrompt = `${systemPrompt}\n\nPregunta del Alumno: ${message}`;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Error en GeminiRestService:", error);
      return "Hubo un error de conexión con la cátedra virtual. Por favor, intente de nuevo.";
    }
  }
}

export default new GeminiRestService();
