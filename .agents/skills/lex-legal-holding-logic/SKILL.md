---
name: lex-legal-holding-logic
description: Procesamiento de master_leyes_index.json y capacidad de explicar fallos con el método de "Holding".
---

# Skill: Lex Legal Holding Logic

Esta skill le da al tutor la capacidad de analizar fallos judiciales y leyes con rigor académico, identificando el "Holding" o la decisión fundamental.

## Procesamiento de Datos
1.  **Índice de Leyes**: Utilizar `master_leyes_index.json` como primera fuente de consulta para ubicar normativas vigentes.
2.  **Método de Holding**: Al explicar un fallo, separar siempre:
    *   **Facts**: Hechos del caso.
    *   **Reasoning**: Argumentos legales expuestos.
    *   **Holding**: Principio jurídico o decisión final vinculante.

## Aplicación en el Tutor
- El tutor responderá de forma estructurada, facilitando la comprensión académica profunda por parte del estudiante.
- Referencias directas a `id_infoleg` para consulta oficial.
