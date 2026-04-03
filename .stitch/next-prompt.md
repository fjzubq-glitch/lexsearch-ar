---
page: landing_v2
---
# Rediseño de Alta Fidelidad - LexSearch Gold (Azure Stitch)

Rediseño completo de la Landing Page con estética UBA/Azure, integrando la Bóveda Académica y el VoiceTutor lateral.

**DESIGN SYSTEM (REQUIRED):**
- Global Background: #F0F7FF
- Text Color: #050505
- Borders: 0.5px solid (Institutional Precision)
- Radius: 0px (Absolute Square Geometry)
- Typography: Use Noto Serif for titles (Italic) and Manrope for body/metadata.
- Aesthetics: Zero noise, minimal shadows, generous whitespace.
- Accent: #2563EB for primary actions.

**Page Structure:**
1. **Header Premium:** Logo, acceso Platinum y botón de despliegue de VoiceTutor.
2. **Hero de Búsqueda:** Centrado, tipografía Serif Italic gigante, integración de búsqueda soberana.
3. **Bóveda Académica (Dashboard):** Grid de 10 tarjetas (5 Administrativo / 5 Contratos). Cada tarjeta muestra: Clase, Fecha, Tópicos y botón de Reproducción.
4. **VoiceTutor Lateral (Sidebar):** Widget colapsable a la derecha. Debe incluir:
   - Chat interface.
   - **API Rotator Status:** 6 círculos/indicadores pequeños en la parte inferior que muestran qué API de Google está activa (VITE_GOOGLE_AI_1 a 6).
5. **Responsive:** Adaptar grid para móviles (1 columna) y netbook (grid bento).
