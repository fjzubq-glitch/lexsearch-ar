---
name: lex-gatekeeper-pro
description: Sistema de Autenticación Firebase y Gestión de permisos Freemium.
---

# Skill: Lex Gatekeeper Pro

Define el sistema de acceso y seguridad para LexSearch Gold, diferenciando entre usuarios libres e institucionales.

## Lógica de Acceso
1.  **Público**: Acceso a la búsqueda básica de leyes y resúmenes generales.
2.  **Sovereign Archive (Bloqueado)**: Análisis profundo de fallos y acceso al Tutor de Voz requiere login via Firebase Auth.
3.  **Institucional**: Desbloqueo total basado en el dominio del email corporativo/universitario.

## Integración Firebase
1.  Utilizar Firebase SDK para Google Sign-In.
2.  Almacenar el perfil de usuario en `firestore` para rastrear historial de consultas legales.
