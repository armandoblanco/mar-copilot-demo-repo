---
agent: 'agent'
description: 'Genera tests unitarios y de integración para el archivo o módulo seleccionado'
tools: ['search/codebase']
---

# Generar Tests

Genera tests completos para el archivo o módulo seleccionado.

## Instrucciones

1. Analiza el código fuente del archivo seleccionado
2. Identifica todas las funciones y métodos exportados
3. Genera tests siguiendo el patrón **Arrange-Act-Assert**
4. Crea el archivo de tests en la carpeta `tests/` con el sufijo `.test.js`

## Tipos de Tests a Generar

### Para Endpoints HTTP (rutas Express):
- ✅ Happy path con datos válidos
- ❌ Request con datos inválidos (400)
- 🔒 Request sin token de autenticación (401)
- 🚫 Recurso inexistente (404)
- 💥 Simulación de error interno (500)

### Para Funciones/Utilidades:
- ✅ Inputs válidos con resultado esperado
- ❌ Inputs inválidos o edge cases
- 🔄 Valores límite (strings vacíos, arrays vacíos, null, undefined)
- 💥 Manejo de excepciones

## Template Base

```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('[NombreDelModulo]', () => {
  // Setup y teardown si es necesario
  beforeAll(async () => { /* conexión DB mock */ });
  afterAll(async () => { /* limpiar */ });

  describe('[metodo/endpoint]', () => {
    it('should [resultado] when [condición]', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

Sigue las convenciones de testing en [tests.instructions.md](../instructions/tests.instructions.md).
