---
name: lex-sovereign-archive-miner
description: Minería de Repositorios Jurídicos Soberanos con Smart Caching y Sincronización de Cátedra.
---

# LexSearch Gold: Sovereign Archive Miner Protocol v2.0

Este protocolo define la arquitectura de extracción, persistencia y tutoría basada en fuentes legales argentinas.

## 1. Capacidades de Extracción
- **Crawler/API Infoleg:** Extracción de leyes nacionales vigentes.
- **Argentina.gob.ar:** Acceso a boletines y normativas administrativas.
- **SAIJ (Hugging Face):** Procesamiento de datasets de jurisprudencia y doctrina.
- **HernanCC (Metodología Franklin):** Seguimiento de la genealogía legislativa mediante índices de GitHub.

## 2. Smart Caching System
Para optimizar el rendimiento en Netbooks y asegurar el acceso offline:
- Los resultados de cada búsqueda se almacenan en `localStorage`.
- El sistema prioriza el "HIT" de caché para ofrecer respuestas instantáneas en consultas recurrentes.

## 3. Sincronización de Contexto Maestro
El motor de minería alimenta directamente al **Tutor de Voz (Gemini 2.0 Flash Live)**:
- Los hallazgos externos se inyectan en el prompt del sistema.
- El Tutor tiene la obligación de citar la fuente exacta (Infoleg, SAIJ, Franklin) para cada explicación académica.

## 4. Estética de Visualización
- **Bento Cards:** Visualización asimétrica con bordes de `0.5px`.
- **Azure Gold Brand:** El color `#F0F7FF` denota resultados de minería externa activa.

---
*Protocolo de Expansión v2.0 - LexSearch Platinum Elite*
