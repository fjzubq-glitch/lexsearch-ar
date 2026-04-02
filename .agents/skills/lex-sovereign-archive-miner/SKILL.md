---
name: lex-sovereign-archive-miner
description: Minería de Repositorios Jurídicos Soberanos (Infoleg, SAIJ, HernanCC)
---

# LexSearch Gold: Sovereign Archive Miner Protocol

Este protocolo define la metodología para la extracción, unificación y presentación de normativas provenientes de fuentes estatales argentinas y repositorios de código abierto.

## 1. Fuentes de Datos Críticas
- **Infoleg (Servicios Parlamentarios):** Acceso directo a la base de datos de leyes nacionales.
- **SAIJ (Hugging Face / Dataset):** Repositorio de jurisprudencia y dictámenes digitalizados.
- **HernanCC (Metodología Franklin):** Uso del índice gestionado por Hernán García para la reconstrucción de la genealogía legislativa argentina.

## 2. Protocolo de Unificación
Los datos deben convertirse a la estructura estándar de LexSearch Platinum:
- `id`: Identificador único con prefijo de fuente (ej: `INF-19549`).
- `titulo`: Nombre oficial de la norma (Serif Italic en UI).
- `fuente`: Origen del dato (Metadata Sans Uppercase).
- `snippet`: Fragmento relevante con resaltado de términos.
- `url`: Enlace persistente al documento original.

## 3. Filosofía "Sovereign First"
Se priorizan los resultados de fuentes oficiales sobre interpretaciones de terceros. El sistema debe denotar claramente la procedencia del dato mediante etiquetas de identidad institucional.

---
*Protocolo de Minería v1.0 - LexSearch Platinum Elite*
