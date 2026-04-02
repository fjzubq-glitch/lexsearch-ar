---
name: lex-repo-architect
description: Gestión de Repositorio Maestro y Sincronización PC/Netbook.
---

# Skill: Lex Repo Architect

Esta skill define la arquitectura de sincronización para LexSearch Gold, asegurando que la transición entre PC y Netbook sea transparente y libre de errores.

## Reglas de Arquitectura
1.  **Raíz Limpia**: La raíz del proyecto debe contener únicamente archivos esenciales (`package.json`, `index.html`, `master_leyes_index.json`, `.agents/`). Cualquier otro archivo temporal o de respaldo debe moverse a `/stitch` o eliminarse.
2.  **Sincronización Git**: Antes de cada cierre de jornada, se debe ejecutar un `git push` forzado a `main` para asegurar la paridad de la nube.
3.  **Conflictos**: En caso de conflicto de archivos entre dispositivos, la versión de la PC (Desktop) tiene prioridad sobre la Netbook.

## Flujo de Trabajo
1.  `git pull origin main` al iniciar en un nuevo dispositivo.
2.  Desarrollo de features en ramas temporales si es necesario.
3.  `npm run build` para verificar integridad antes del push final.
