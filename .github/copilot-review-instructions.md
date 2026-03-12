# Instrucciones para Code Review de Copilot

## Prioridades de Revisión

Al revisar Pull Requests, enfócate en este orden de prioridad:

1. **Seguridad**: Inyecciones SQL/NoSQL, XSS, secrets expuestos, inputs sin validar
2. **Errores de lógica**: Condiciones incorrectas, off-by-one, null/undefined no manejados
3. **Manejo de errores**: Try/catch faltantes, errores silenciados, promesas sin catch
4. **Performance**: Queries N+1, loops innecesarios, memory leaks
5. **Mejores prácticas**: Código duplicado, funciones muy largas, naming poco claro

## Formato de Comentarios

Cada comentario de revisión debe incluir:
- **Severidad**: 🔴 Crítico | 🟡 Mejora sugerida | 🔵 Nit/Estilo
- **Explicación** breve del problema
- **Sugerencia** de código corregido cuando sea posible

## Reglas Específicas del Proyecto

- Verificar que todas las rutas tienen middleware de autenticación donde corresponde
- Verificar que los inputs se validan con `express-validator`
- Verificar que las respuestas siguen el formato estándar del proyecto
- Verificar que no hay `console.log` (usar `winston` en su lugar)
- Verificar que las funciones async tienen manejo de errores
- Verificar que no hay secrets o credenciales hardcodeadas
