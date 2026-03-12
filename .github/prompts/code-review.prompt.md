---
agent: 'agent'
description: 'Realiza un code review del archivo actual siguiendo los estándares del proyecto'
tools: ['search/codebase']
---

# Code Review

Realiza un code review exhaustivo del archivo actualmente seleccionado.

## Checklist de Revisión

Revisa cada uno de estos aspectos y reporta los hallazgos:

### 🔴 Seguridad (Crítico)
- [ ] ¿Hay inputs sin validar o sanitizar?
- [ ] ¿Hay secrets o credenciales hardcodeadas?
- [ ] ¿Hay vulnerabilidades de inyección (SQL/NoSQL/XSS)?
- [ ] ¿Se manejan correctamente los permisos/autenticación?

### 🟡 Calidad de Código (Mejoras)
- [ ] ¿Hay errores de lógica o edge cases no manejados?
- [ ] ¿Todas las operaciones async tienen try/catch?
- [ ] ¿Se siguen las convenciones de naming del proyecto?
- [ ] ¿Hay código duplicado que se pueda refactorizar?
- [ ] ¿Las funciones son cortas y con responsabilidad única?

### 🔵 Estilo (Nits)
- [ ] ¿Hay `console.log` que debería ser `winston`?
- [ ] ¿Falta documentación JSDoc en funciones públicas?
- [ ] ¿El formato de respuesta sigue el estándar del proyecto?

## Formato de Salida

Para cada hallazgo, incluye:
1. **Severidad**: 🔴 / 🟡 / 🔵
2. **Línea**: número de línea aproximado
3. **Problema**: descripción breve
4. **Sugerencia**: código corregido

Termina con un **resumen** y una **calificación general** del 1 al 10.
