import { GoogleGenerativeAI } from "@google/generative-ai";

import ApiRotator from "./apiRotator";

class GeminiRestService {
  constructor() {
    this.updateApiKey();
  }

  updateApiKey() {
    this.apiKey = ApiRotator.getNextKey();
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
      console.error("Error en GeminiRestService, rotando llave...", error);
      this.updateApiKey();
      
      // Reintento único con la nueva llave
      if (this.apiKey) {
        try {
          const result = await this.model.generateContent(`${systemPrompt}\n\nPregunta del Alumno: ${message}`);
          const response = await result.response;
          return response.text().trim();
        } catch (retryError) {
          console.error("Error definitivo tras rotación:", retryError);
        }
      }
      
      return "Hubo un error de conexión con la cátedra virtual (Límite de cuota excedido). Por favor, intente de nuevo en unos segundos.";
    }
  }
}

export default new GeminiRestService();
