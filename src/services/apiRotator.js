/**
 * LexSearch API Rotator Master - apiRotator.js
 * Gestiona la alternancia entre múltiples llaves de Google AI Studio
 * para maximizar la disponibilidad y evitar errores 429.
 */

class ApiRotator {
  constructor() {
    this.keys = [
      import.meta.env.VITE_GOOGLE_AI_KEY_1,
      import.meta.env.VITE_GOOGLE_AI_KEY_2,
      import.meta.env.VITE_GOOGLE_AI_KEY_3,
      import.meta.env.VITE_GOOGLE_AI_KEY_4,
      import.meta.env.VITE_GOOGLE_AI_KEY_5,
      import.meta.env.VITE_GOOGLE_AI_KEY_6
    ].filter(key => key && !key.includes('LLAVE_')); // Filtrar placeholders

    this.currentIndex = 0;
    
    if (this.keys.length === 0) {
      console.warn("[Rotator] No se detectaron llaves válidas. Usando VITE_GEMINI_API_KEY como fallback.");
      const fallback = import.meta.env.VITE_GEMINI_API_KEY;
      if (fallback) this.keys.push(fallback);
    }
  }

  /**
   * Retorna la siguiente llave disponible en el pool.
   * @returns {string|null}
   */
  getNextKey() {
    if (this.keys.length === 0) return null;
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    console.log(`[Rotator] Usando llave ${this.currentIndex + 1} de ${this.keys.length}`);
    return key;
  }

  /**
   * Obtiene la llave actual sin rotar el índice.
   * @returns {string|null}
   */
  getCurrentKey() {
    if (this.keys.length === 0) return null;
    return this.keys[this.currentIndex];
  }

  /**
   * Marca la llave actual como fallida y rota a la siguiente inmediatamente.
   */
  handleFail() {
    console.error(`[Rotator] Falla detectada en llave ${this.currentIndex + 1}. Rotando pool...`);
    this.getNextKey();
  }
}

export default new ApiRotator();
