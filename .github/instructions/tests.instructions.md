---
applyTo: "tests/**/*.test.js,tests/**/*.spec.js"
---

# Instrucciones para Tests

## Framework

- Usa **Jest** como test runner
- Usa **Supertest** para tests de endpoints HTTP
- Usa **mongodb-memory-server** para tests de base de datos

## Estructura de Tests

Sigue el patrón **Arrange-Act-Assert (AAA)**:

```javascript
describe('NombreDelModulo', () => {
  describe('nombreDelMetodo', () => {
    it('should [comportamiento esperado] when [condición]', async () => {
      // Arrange - preparar datos
      const input = { ... };

      // Act - ejecutar la acción
      const result = await modulo.metodo(input);

      // Assert - verificar resultado
      expect(result).toBeDefined();
      expect(result.status).toBe(200);
    });
  });
});
```

## Convenciones de Naming

- `describe` → nombre del módulo/clase/ruta
- `it` → empieza con "should" + comportamiento esperado + "when" + condición
- Ejemplo: `it('should return 404 when user does not exist')`

## Cobertura Mínima

Cada endpoint debe tener tests para:
- ✅ Caso exitoso (happy path)
- ❌ Validación de inputs inválidos
- 🔒 Acceso sin autenticación (401)
- 🚫 Recurso no encontrado (404)
- 💥 Error interno del servidor (500)
