---
name: lex-multimodal-vision
description: Capacidad de análisis visual de documentos y capturas de pantalla integradas al tutor de voz.
---

# Skill: Lex Multimodal Vision

Extiende las capacidades del Lex Voice Tutor para permitir el análisis de evidencia visual en tiempo real.

## Capacidades de visión
1.  **Análisis de PDF**: Al recibir un PDF de un fallo, el tutor debe extraer el texto crudo y procesarlo bajo la lógica de `lex-legal-holding-logic`.
2.  **Capturas de Pantalla**: El usuario puede subir fotos de libros o pantallas de otros sistemas legales. El tutor debe realizar un OCR en tiempo real para comentarlo por voz.
3.  **Integración Live**: La API de Gemini 2.0 permite el streaming de frames de video o imágenes directamente al socket del tutor.

## Flujo de Trabajo
1.  Upload/Capture.
2.  Inferencia visual multimodal con Gemini Pro Vision / Flash.
3.  Explicación por voz del contenido visual.
