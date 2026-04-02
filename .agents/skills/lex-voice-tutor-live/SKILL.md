---
name: lex-voice-tutor-live
description: Integración de Gemini 2.0 Flash Live para tutoría por voz en tiempo real.
---

# Skill: Lex Voice Tutor Live

Esta skill guía la integración del SDK de Gemini 2.0 Flash Live para proporcionar una experiencia de tutoría jurídica por voz con latencia mínima.

## Parámetros Técnicos
1.  **Modelo**: `gemini-2.0-flash-exp` (habilitado para Live API).
2.  **Latencia**: Se debe optimizar el buffering de audio para una respuesta menor a 500ms.
3.  **Contexto Legal**: El tutor debe recibir siempre el `master_leyes_index.json` en su prompt de sistema para actuar como experto en derecho argentino.

## Flujo de Implementación
1.  Configurar WebSocket con Google AI Studio.
2.  Capturar audio del usuario via `MediaRecorder`.
3.  Procesar respuesta multimodal (voz + texto).
