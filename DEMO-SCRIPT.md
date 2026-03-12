# 🎬 Script de la Demo - Paso a Paso

## Pre-requisitos

- [ ] GitHub Copilot Pro/Pro+/Business/Enterprise activo
- [ ] VS Code con extensión GitHub Copilot instalada
- [ ] GitHub CLI (`gh`) instalado y autenticado
- [ ] Node.js 18+ instalado
- [ ] Repo creado en GitHub (público o privado)

## Preparación (antes de la demo)

```bash
# 1. Crear el repo en GitHub
gh repo create copilot-demo-repo --public --source=. --remote=origin --push

# 2. Verificar que todo está subido
git status
```

---

## 🎯 DEMO 1: Custom Instructions (5 min)

### Qué mostrar
Las instrucciones globales en `.github/copilot-instructions.md` se cargan automáticamente.

### Pasos
1. Abre VS Code con el repositorio
2. Abre Copilot Chat (Ctrl+Shift+I o Cmd+Shift+I)
3. Muestra el archivo `.github/copilot-instructions.md` al público
4. Escribe en chat:

   > "Crea una función para conectar a Redis como cache"

5. **Punto a destacar**: Copilot genera código con:
   - `async/await` (no callbacks)
   - `try/catch` para errores
   - JSDoc documentation
   - Variables de entorno (no hardcoded)
   - Logger de winston (no console.log)

6. Ahora escribe:

   > "Crea un endpoint para buscar usuarios por nombre"

7. **Punto a destacar**: Copilot sigue el formato de respuesta del proyecto:
   ```json
   { "success": true, "data": {...}, "meta": {...} }
   ```

---

## 🎯 DEMO 2: Scoped Instructions (5 min)

### Qué mostrar
Instrucciones específicas por tipo de archivo.

### Pasos
1. Muestra `.github/instructions/nodejs.instructions.md` - nota el `applyTo: "src/**/*.js"`
2. Muestra `.github/instructions/tests.instructions.md` - nota el `applyTo: "tests/**/*.test.js"`
3. Abre `src/routes/users.js` y pide en chat:

   > "Agrega un endpoint PUT para actualizar un usuario"

4. **Punto a destacar**: Usa el patrón de rutas Express definido en `nodejs.instructions.md`

5. Ahora abre `tests/users.test.js` y pide:

   > "Agrega un test para el endpoint de login exitoso"

6. **Punto a destacar**: Usa patrón AAA, naming con "should...when...", y los imports correctos

---

## 🎯 DEMO 3: Prompt Files (10 min)

### Qué mostrar
Comandos reutilizables invocados con `/nombre`.

### Pasos

#### Prompt 1: `/create-endpoint`
1. En Copilot Chat, escribe:

   > `/create-endpoint productos con campos: nombre, precio, categoría, stock`

2. **Punto a destacar**: Copilot crea automáticamente:
   - `src/models/product.js` - Modelo Mongoose
   - `src/routes/products.js` - CRUD completo
   - Registra la ruta en `src/app.js`
   - Validaciones con express-validator

#### Prompt 2: `/code-review`
1. Abre `src/routes/users.js`
2. En chat escribe:

   > `/code-review`

3. **Punto a destacar**: Copilot identifica los bugs intencionales:
   - 🔴 Secret hardcodeado
   - 🔴 Password expuesto
   - 🟡 console.log en lugar de logger
   - 🟡 Falta autenticación en GET /users
   - etc.

#### Prompt 3: `/generate-tests`
1. Asegúrate de tener `src/routes/users.js` abierto
2. En chat escribe:

   > `/generate-tests`

3. **Punto a destacar**: Genera tests para cada endpoint con todos los escenarios

---

## 🎯 DEMO 4: Agent Skills (10 min)

### Qué mostrar
Skills como paquetes de capacidades que Copilot carga automáticamente.

### Pasos
1. Muestra la estructura `.github/skills/api-endpoint/SKILL.md`
2. Explica: el skill tiene `name` y `description` - Copilot lo carga cuando es relevante
3. En **Agent Mode** (no Ask mode), escribe:

   > "Necesito crear un módulo CRUD completo para gestionar pedidos (orders) con: userId, productos, total, estado, dirección de envío"

4. **Punto a destacar**: Copilot detecta que el skill `api-endpoint` es relevante y:
   - Sigue la estructura exacta del SKILL.md
   - Crea modelo, rutas, validaciones
   - Todo siguiendo las convenciones del proyecto

5. Ahora escribe:

   > "Genera los tests para el módulo de orders que acabamos de crear"

6. **Punto a destacar**: Copilot detecta el skill `unit-testing` y genera tests con el patrón AAA

---

## 🎯 DEMO 5: Custom Agents con Handoffs (15 min)

### Qué mostrar
Agentes especializados que actúan como "compañeros de equipo" con roles específicos y flujos de trabajo encadenados (handoffs).

### Concepto Clave
A diferencia de los **prompts** (tareas únicas) y los **skills** (capacidades que se cargan automáticamente), los **agentes** son **personas persistentes** con:
- Un rol definido (planificador, implementador, QA, etc.)
- Herramientas restringidas (el security-reviewer no puede editar código)
- Handoffs que encadenan agentes en flujos de trabajo

### Diagrama del Flujo

```
@planner ──→ @implementer ──→ @test-writer
   │              │
   │              └──→ @security-reviewer ──→ @implementer
   │                        (fix loop)
   └──→ @security-reviewer
         (revisión pre-implementación)

@docs-writer (standalone)
```

### Pasos

#### Parte A: Flujo completo con Handoffs (el plato fuerte)

1. Muestra los archivos en `.github/agents/` al público
2. Explica brevemente la anatomía de un agente: frontmatter YAML + prompt Markdown
3. Muestra el frontmatter de `planner.agent.md` y señala los `handoffs`

4. En VS Code, abre Copilot Chat → dropdown de agentes → selecciona **@planner**
5. Escribe:

   > "Planifica un sistema de notificaciones para usuarios. Debe soportar notificaciones por email y push, con preferencias configurables por usuario y un endpoint para marcarlas como leídas."

6. **Punto a destacar**: El planner:
   - Lee el código existente para entender la arquitectura
   - Genera un plan detallado con modelo de datos, endpoints, consideraciones de seguridad
   - **NO toca ningún archivo** (herramientas limitadas a `read` y `search`)

7. Al terminar, aparece el botón **"Implementar Plan"** en el chat
8. Haz clic en el botón → se abre **@implementer** con el prompt pre-cargado
9. Opcionalmente modifica el prompt antes de enviarlo, o envíalo directamente

10. **Punto a destacar**: El implementer:
    - Recibe el contexto completo del plan
    - Crea `src/models/notification.js`, `src/routes/notifications.js`
    - Registra la ruta en `src/app.js`
    - Sigue todas las convenciones del proyecto

11. Al terminar, aparecen los botones **"Ejecutar Tests"** y **"Revisar Seguridad"**
12. Haz clic en **"Ejecutar Tests"** → se abre **@test-writer**

13. **Punto a destacar**: El test-writer:
    - Solo puede escribir en `tests/`
    - Genera tests para todos los endpoints del nuevo módulo
    - Ejecuta `npm test` para verificar

#### Parte B: Agente de Seguridad standalone

1. Selecciona **@security-reviewer** del dropdown
2. Escribe:

   > "Audita el archivo src/routes/users.js"

3. **Punto a destacar**: El security-reviewer:
   - Solo puede LEER archivos (tools: `read`, `search`)
   - Genera un reporte estructurado con severidades (🔴🟡🔵)
   - Encuentra los 8 bugs intencionales
   - Al terminar, ofrece el botón **"Aplicar Correcciones"** → handoff a @implementer

#### Parte C: Agente de Documentación

1. Selecciona **@docs-writer**
2. Escribe:

   > "Genera la documentación API completa para el módulo de usuarios"

3. **Punto a destacar**: Crea `docs/api.md` con tablas de parámetros, respuestas, códigos de error

### Diferencias clave: Agents vs Prompts vs Skills

| | Prompts | Skills | Agents |
|---|---------|--------|--------|
| **Invocación** | `/nombre` manual | Automática por relevancia | `@nombre` o dropdown |
| **Persistencia** | Una sola tarea | Se carga cuando es necesario | Persona continua |
| **Herramientas** | Todas disponibles | Todas disponibles | Restringibles por agente |
| **Encadenamiento** | No | No | Sí, con handoffs |
| **Dónde funciona** | VS Code, Visual Studio | VS Code, CLI, Coding Agent | VS Code, CLI, github.com |

---

## 🎯 DEMO 6: Code Review en PRs (10 min)

### Qué mostrar
Copilot como reviewer automático en Pull Requests.

### Preparación
El archivo `src/routes/users.js` ya tiene bugs intencionales.

### Pasos

```bash
# 1. Crear una rama
git checkout -b feature/user-improvements

# 2. Hacer algún cambio adicional (opcional)
# Por ejemplo, agregar un endpoint nuevo con algún bug

# 3. Commit y push
git add .
git commit -m "feat: mejoras en módulo de usuarios"
git push -u origin feature/user-improvements

# 4. Crear PR con Copilot como reviewer
gh pr create \
  --title "feat: mejoras en módulo de usuarios" \
  --body "Mejoras en el módulo de usuarios incluyendo nuevos endpoints" \
  --reviewer @copilot
```

4. Abre el PR en GitHub.com
5. Espera ~30 segundos a que Copilot complete la revisión
6. **Punto a destacar**: Copilot deja comentarios con:
   - Descripción del problema
   - Sugerencia de código corregido
   - Botón "Apply suggestion" para aplicar el fix
   - Botón "Implement suggestion" para que el Coding Agent lo implemente

### Alternativa: Review Automático
1. Ve a Repo → Settings → Rules → Rulesets
2. New ruleset → Branch ruleset
3. Aplica a `main`
4. Habilita "Automatically request Copilot code review"
5. Marca "Review new pushes" y "Review draft PRs"
6. Ahora cada PR recibe review automático

### Desde CLI (novedad reciente)
```bash
# Agregar Copilot como reviewer a PR existente
gh pr edit 1 --add-reviewer @copilot

# Crear PR con Copilot reviewer
gh pr create --reviewer @copilot
```

---

## 📊 Resumen de la Demo

| Demo | Feature | Archivo clave | Tiempo |
|------|---------|---------------|--------|
| 1 | Custom Instructions | `.github/copilot-instructions.md` | 5 min |
| 2 | Scoped Instructions | `.github/instructions/*.instructions.md` | 5 min |
| 3 | Prompt Files | `.github/prompts/*.prompt.md` | 10 min |
| 4 | Agent Skills | `.github/skills/*/SKILL.md` | 10 min |
| 5 | Custom Agents + Handoffs | `.github/agents/*.agent.md` | 15 min |
| 6 | Code Review en PRs | `.github/copilot-review-instructions.md` | 10 min |

**Tiempo total estimado: ~55 minutos**

---

## 💡 Tips para la Demo

- Usa **Agent Mode** (no Ask mode) para las demos 3 y 4
- Para la demo de agentes (Demo 5), usa el **dropdown de agentes** en Copilot Chat
- Los handoffs aparecen como botones al final de la respuesta del agente
- Si Copilot no detecta un skill automáticamente, puedes escribir `/skills` para invocarlo
- El Code Review funciona mejor con PRs que tengan cambios sustanciales
- Los bugs intencionales en `users.js` están documentados con comentarios `// 🔴 BUG`
- Puedes borrar los comentarios de bugs antes de la demo para hacerlo más realista
- Los agentes también funcionan en el **Copilot Coding Agent** en github.com: asigna un issue a Copilot y selecciona el agente desde el dropdown
