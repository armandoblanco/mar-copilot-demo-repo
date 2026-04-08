# 🤖 Workshop: Personalización Avanzada de GitHub Copilot

## Instructions, Prompts, Skills, Agents y Code Review con Node.js

[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Enabled-green)](https://github.com/features/copilot)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![Duración](https://img.shields.io/badge/Duración-2%20horas-red)](.)

---

## 📋 Tabla de Contenidos

- [Introducción](#-introducción)
- [Conceptos Clave: El Ecosistema de Personalización](#-conceptos-clave-el-ecosistema-de-personalización)
- [Pre-requisitos](#️-pre-requisitos)
- [Agenda del Workshop](#-agenda-del-workshop)
- [Ejercicio 1: Instructions — La Base del Proyecto](#-ejercicio-1-instructions--la-base-del-proyecto-25-30-min)
- [Ejercicio 2: Prompt Files y Skills — Automatización Reutilizable](#-ejercicio-2-prompt-files-y-skills--automatización-reutilizable-25-30-min)
- [Ejercicio 3: Custom Agents con Handoffs](#-ejercicio-3-custom-agents-con-handoffs-30-35-min)
- [Ejercicio 4: Code Review en Pull Requests](#-ejercicio-4-code-review-en-pull-requests-15-20-min)
- [Referencia Rápida](#-referencia-rápida)
- [Recursos Adicionales](#-recursos-adicionales)

---

## 🎯 Introducción

Este workshop práctico de **2 horas** te lleva más allá del autocompletado básico de Copilot. Aprenderás a **personalizar** cómo Copilot entiende, genera y revisa código en tu proyecto usando todo el ecosistema de configuración disponible. Construirás una API REST con Node.js y Express que servirá como terreno de pruebas para cada feature.

Al terminar, sabrás:

- ✅ Configurar instrucciones globales y por tipo de archivo que Copilot aplica automáticamente
- ✅ Crear prompt files reutilizables que tu equipo invoca con `/comando`
- ✅ Definir skills que Copilot carga automáticamente cuando son relevantes
- ✅ Construir agentes personalizados con roles, herramientas restringidas y handoffs
- ✅ Activar Copilot como reviewer automático en Pull Requests

### Escenario: API de Gestión de Usuarios

Trabajarás sobre una API Express con un módulo de usuarios que incluye **bugs intencionales**. Estos bugs no son accidentales — están ahí para que los detectes con las herramientas de personalización que irás construyendo. A medida que avances, agregarás nuevos módulos (productos, pedidos, notificaciones) usando los distintos niveles de personalización.

### ¿Cómo se relacionan las piezas?

Copilot tiene un sistema de personalización por capas. Cada componente tiene un propósito distinto y se complementan entre sí:

```
┌─────────────────────────────────────────────────────────────────┐
│                 SIEMPRE (automáticas)                            │
│                                                                 │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │ copilot-instructions.md      │  │ instructions/*.md        │ │
│  │ Reglas globales del repo     │  │ Reglas por tipo archivo   │ │
│  └──────────────────────────────┘  └──────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                 MANUALES (invocación explícita)                  │
│                                                                 │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │ prompts/*.prompt.md          │  │ agents/*.agent.md        │ │
│  │ Tareas con /comando          │  │ Especialistas con @nombre│ │
│  └──────────────────────────────┘  └──────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                 AUTOMÁTICAS POR RELEVANCIA                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ skills/*/SKILL.md                                         │   │
│  │ Capacidades con scripts y recursos — Copilot las detecta  │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                 EN PULL REQUESTS                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ copilot-review-instructions.md                            │   │
│  │ Reglas para Code Review automático                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

Las instrucciones globales y scoped son la base: se inyectan automáticamente en cualquier interacción con Copilot, ya sea al usar un prompt, un agente, un skill o un code review.

### Estándares del Proyecto

| Aspecto | Estándar |
|---------|----------|
| Runtime | Node.js 18+ |
| Framework | Express 4.x |
| Validación | express-validator |
| Testing | Jest + Supertest |
| Documentación | JSDoc |
| Estilo | async/await, ESM o CommonJS según setup |
| Idioma | Español (código, comentarios, documentación) |

### Arquitectura de la Solución

```
┌──────────────────────────────────────────────────────────┐
│                   CLIENTE HTTP                            │
│          (Postman, curl, Thunder Client)                  │
└────────────────────┬─────────────────────────────────────┘
                     │  HTTP
                     ▼
┌──────────────────────────────────────────────────────────┐
│              SERVIDOR Express (app.js)                     │
│                                                          │
│  ┌────────────────┐  ┌──────────────────────────────┐    │
│  │  Middleware     │  │  Rutas (routes/)              │    │
│  │  auth.js        │  │  users.js     → CRUD + bugs  │    │
│  │  errorHandler   │  │  products.js  → CRUD (Ej. 2) │    │
│  │                 │  │  orders.js    → CRUD (Ej. 3) │    │
│  └────────────────┘  │  notifications.js (Ej. 3)    │    │
│                      └──────────┬────────────────────┘    │
│                                 │                         │
│                      ┌──────────▼───────────────────┐     │
│                      │  Modelos (models/)            │     │
│                      │  user.js                      │     │
│                      │  product.js    (Ej. 2)        │     │
│                      │  order.js      (Ej. 3)        │     │
│                      │  notification.js (Ej. 3)      │     │
│                      │                               │     │
│                      │  Utilidades (utils/)           │     │
│                      │  validator.js                  │     │
│                      │                               │     │
│                      │  Datos en memoria (arrays)     │     │
│                      └───────────────────────────────┘     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐     │
│  │  npm test                                         │     │
│  │  tests/users.test.js                              │     │
│  │  tests/products.test.js  (Ej. 2)                  │     │
│  │  tests/orders.test.js    (Ej. 3)                  │     │
│  └──────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

**Flujo de la aplicación:**

1. El cliente envía una petición HTTP a `http://localhost:3000/api/...`
2. Express la enruta al middleware de autenticación (si aplica) y luego a la ruta correspondiente
3. La ruta ejecuta validaciones, procesa la lógica y opera sobre datos en memoria
4. La respuesta sigue el formato estándar: `{ success: true, data: {...}, meta: {...} }`
5. Los tests usan Supertest para levantar la app en memoria y probar cada endpoint

---

## 🧠 Conceptos Clave: El Ecosistema de Personalización

### Comparativa de Componentes

| Componente | Ubicación | Activación | Modifica archivos | Encadenable |
|-----------|-----------|------------|-------------------|-------------|
| **Custom Instructions** | `.github/copilot-instructions.md` | Automática (siempre) | N/A — son reglas | No |
| **Scoped Instructions** | `.github/instructions/*.instructions.md` | Automática (por tipo de archivo) | N/A — son reglas | No |
| **Prompt Files** | `.github/prompts/*.prompt.md` | Manual con `/comando` | Sí (en Agent mode) | No |
| **Skills** | `.github/skills/*/SKILL.md` | Automática por relevancia | Sí | No |
| **Custom Agents** | `.github/agents/*.agent.md` | Manual con `@nombre` o dropdown | Configurable por agente | Sí (handoffs) |
| **Code Review** | `.github/copilot-review-instructions.md` | En Pull Requests | Sugiere cambios | Handoff a Coding Agent |

### ¿Cuándo usar cada uno?

Piensa en las **instructions** como las reglas del equipo que todos siguen. Los **prompt files** como plantillas de tareas que repites frecuentemente. Los **skills** como mini-runbooks que incluyen todo lo necesario para una tarea compleja. Los **agents** como compañeros especialistas con un rol definido y herramientas restringidas. Y el **code review** como un par de ojos extra automatizado en cada PR.

### Modos de Copilot Chat

> ⚠️ **Nota:** La interfaz (íconos, ubicación del selector, nombres) puede variar según tu versión de VS Code. Si ves algo diferente, consulta con el instructor o la [documentación oficial](https://docs.github.com/en/copilot).

| Modo | Ícono | Función | Uso en este workshop |
|------|-------|---------|---------------------|
| **Ask** 💬 | Burbuja de mensaje | Solo responde, NO modifica archivos | Explorar, entender, planificar |
| **Agent** 🤖 | Robot o chispa | PUEDE crear y modificar archivos | Implementar código, crear archivos de config |
| **Plan** 📋 | Lista o documento | Genera plan ANTES de ejecutar | Tareas complejas multi-archivo |

---

## 🛠️ Pre-requisitos

### Software Necesario

```bash
# Verificar instalaciones
node --version    # Debe ser 18+ (ejemplo: v18.20.0 o v20.x)
npm --version     # Incluido con Node.js
code --version    # Visual Studio Code
git --version     # Git
gh --version      # GitHub CLI (para Ejercicio 4)
```

### Extensiones de VS Code

1. **GitHub Copilot** — Extensión principal
2. **GitHub Copilot Chat** — Chat integrado

### Cuenta de GitHub

- Necesitas una cuenta con acceso a **GitHub Copilot Pro, Pro+, Business o Enterprise**
- GitHub CLI (`gh`) autenticado: `gh auth login`

---

## 📅 Agenda del Workshop

| Hora | Bloque | Actividad | Feature de Copilot |
|------|--------|-----------|-------------------|
| 0:00 – 0:10 | Bienvenida | Setup, clonado del repo, `npm install` | — |
| 0:10 – 0:40 | Ejercicio 1 | Custom Instructions + Scoped Instructions | Instrucciones automáticas |
| 0:40 – 0:45 | ☕ Break | Descanso y Q&A | — |
| 0:45 – 1:15 | Ejercicio 2 | Prompt Files + Skills | `/comando` y detección automática |
| 1:15 – 1:50 | Ejercicio 3 | Custom Agents con Handoffs | @planner → @implementer → @test-writer |
| 1:50 – 2:00 | Ejercicio 4 | Code Review en PRs + cierre | Copilot como reviewer |

> ⏱️ Los tiempos son aproximados. Ajusta según el ritmo del grupo, pero **nunca excedas 2 horas**.

> 🎓 **Nota para el instructor:** Si la configuración inicial toma más de 10 minutos, compensa reduciendo el Ejercicio 4 a una demostración en vivo sin que los participantes lo hagan. Lo esencial es que completen los Ejercicios 1–3.

---

## 🔬 Ejercicio 1: Instructions — La Base del Proyecto (25-30 min)

### Objetivos

- ✅ Crear instrucciones globales que Copilot aplica automáticamente en todo el repo
- ✅ Crear instrucciones scoped que aplican solo a ciertos tipos de archivo
- ✅ Verificar que Copilot respeta las convenciones al generar código
- ✅ Entender la diferencia entre instrucciones globales y scoped

### Paso 1.1: Clonar el repo y preparar el entorno

🤖 **En tu terminal:**

```bash
git clone https://github.com/TU-USUARIO/copilot-demo-repo.git
cd copilot-demo-repo
npm install
npm run dev
```

Verifica que la API responde:

```bash
curl http://localhost:3000/api/users
```

> 📝 El repo ya incluye un módulo de usuarios con bugs intencionales en `src/routes/users.js`. No los corrijas todavía — los usaremos en ejercicios posteriores.

---

### Paso 1.2: Explorar el código existente con Modo Ask 🔍

> 💡 **IMPORTANTE:** Asegúrate de estar en **Modo Ask** (ícono de mensaje 💬). Este modo NO modifica archivos.

📍 **Cómo activar Modo Ask:**

1. Abre Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`)
2. Busca el selector de modo en la parte superior
3. Selecciona **"Ask"** o el ícono de mensaje

🤖 **PROMPT — Copia y pega en Copilot Chat:**

```
Analiza la estructura de este proyecto Node.js y dime:

1. ¿Qué framework y patrones usa?
2. ¿Cómo están organizadas las rutas, modelos y middleware?
3. ¿Qué convenciones de código detectas (async/await, callbacks, promesas)?
4. ¿Ves algún problema obvio en src/routes/users.js?
```

📝 **Observa:** Copilot analiza el proyecto y probablemente detectará algunos de los bugs intencionales. Pero sin instrucciones configuradas, sus respuestas seguirán convenciones genéricas, no las de tu equipo.

---

### Paso 1.3: Crear instrucciones globales de Copilot

> 💡 **¿Por qué?** Sin instrucciones, Copilot genera código con convenciones genéricas. El archivo `copilot-instructions.md` define las reglas que Copilot aplicará **automáticamente** en cada interacción dentro de este repositorio — chat, autocompletado, agentes, todo.

> 💡 Cambia a **Modo Agent** (ícono de robot 🤖).

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/copilot-instructions.md con instrucciones globales para este proyecto Node.js.

El contenido debe incluir estas reglas:

# Instrucciones Globales - Copilot

## Stack Tecnológico
- Node.js 18+ con Express 4.x
- Validación con express-validator
- Testing con Jest + Supertest
- Datos en memoria (arrays de objetos), sin base de datos externa

## Idioma
- Todo el código, comentarios, variables y documentación en español
- Mensajes de error en español
- Excepciones: palabras técnicas estándar (middleware, router, request, response, async, await)

## Convenciones de Código
- SIEMPRE usar async/await (nunca callbacks ni .then())
- SIEMPRE usar try/catch para manejo de errores
- SIEMPRE documentar funciones con JSDoc en español
- SIEMPRE usar variables de entorno para configuración sensible (nunca hardcodear secrets)
- NUNCA usar console.log — usar un logger estructurado (winston o similar)
- Formato de respuesta API estándar: { "success": true/false, "data": {...}, "meta": {...}, "error": {...} }

## Estructura del Proyecto
- Modelos en src/models/ — clases o funciones que definen la forma de los datos
- Rutas en src/routes/ — endpoints Express con validación
- Middleware en src/middleware/ — autenticación, error handling
- Utilidades en src/utils/ — funciones helper reutilizables
- Tests en tests/ — un archivo .test.js por módulo

## Seguridad
- Validar TODOS los inputs del usuario
- No exponer passwords ni tokens en respuestas
- Usar middleware de autenticación en rutas protegidas
- Sanitizar datos antes de procesarlos
```

📝 **Verifica:** Abre el archivo creado y confirma que las reglas están completas. Estas instrucciones se aplicarán a partir de ahora en cada interacción con Copilot.

---

### Paso 1.4: Verificar que las instrucciones funcionan

Ahora vamos a comprobar que Copilot respeta las instrucciones que acabamos de crear.

🤖 **PROMPT en Modo Agent:**

```
Crea una función para conectar a Redis como cache
```

📝 **Observa en el código generado:**
- ¿Usa `async/await`? (no callbacks)
- ¿Tiene `try/catch`?
- ¿Incluye documentación JSDoc en español?
- ¿Usa variables de entorno en vez de hardcodear host/puerto?
- ¿Usa logger en vez de `console.log`?

Si Copilot no sigue alguna convención, verifica que el archivo `.github/copilot-instructions.md` esté guardado correctamente.

> 🌟 **Momento wow:** Compara este resultado con el del Paso 1.2. Sin instrucciones, Copilot genera código genérico. Con instrucciones, genera código que sigue las convenciones de tu equipo desde el primer momento.

---

### Paso 1.5: Crear instrucciones scoped por tipo de archivo

> 💡 **¿Qué son?** Las scoped instructions aplican reglas adicionales solo cuando trabajas con ciertos tipos de archivo. Se activan automáticamente basándose en el campo `applyTo` del frontmatter YAML.

🤖 **PROMPT en Modo Agent:**

```
Crea dos archivos de instrucciones scoped:

1. .github/instructions/nodejs.instructions.md con frontmatter YAML:
   ---
   applyTo: "src/**/*.js"
   ---
   Y las siguientes instrucciones para archivos de código fuente:
   - Usar el patrón de rutas Express: router.METHOD('/ruta', validaciones, async (req, res, next) => {...})
   - Siempre extraer parámetros con destructuring
   - Manejar errores con next(error) para que lleguen al middleware centralizado
   - Cada ruta debe tener validación de inputs con express-validator
   - Los modelos usan clases o factories que retornan objetos con id generado (uuid o incremental)
   - Los servicios/rutas nunca acceden directamente a los datos — siempre a través del modelo

2. .github/instructions/tests.instructions.md con frontmatter YAML:
   ---
   applyTo: "tests/**/*.test.js"
   ---
   Y las siguientes instrucciones para archivos de test:
   - Framework: Jest con Supertest para tests de integración HTTP
   - Patrón AAA estricto: Arrange, Act, Assert (con comentarios que lo marquen)
   - Naming: "should [resultado esperado] when [condición]" en español
   - Cada test debe ser independiente — no compartir estado entre tests
   - Cubrir: caso exitoso, error de validación, recurso no encontrado, error de autenticación
   - Usar beforeEach para resetear datos de prueba
   - Imports: const request = require('supertest'); const app = require('../src/app');
```

---

### Paso 1.6: Verificar las instrucciones scoped

📍 **Instrucciones:**

1. Abre `src/routes/users.js` y pide en Copilot Chat:

🤖 **PROMPT:**

```
Agrega un endpoint PUT /api/users/:id para actualizar un usuario
```

📝 **Observa:** ¿Sigue el patrón de `nodejs.instructions.md` — validación con express-validator, destructuring, `next(error)`?

2. Ahora abre `tests/users.test.js` y pide:

🤖 **PROMPT:**

```
Agrega un test para el endpoint de login exitoso
```

📝 **Observa:** ¿Usa patrón AAA, naming con "should...when...", Supertest?

> 🌟 **Momento wow:** Las sugerencias cambian automáticamente según el tipo de archivo que tengas abierto, sin que tengas que repetir las convenciones cada vez.

---

### Paso 1.7: Crear instrucciones de Code Review para PRs

> 💡 Este archivo define las reglas que Copilot seguirá cuando actúe como reviewer en Pull Requests. Lo usaremos en el Ejercicio 4.

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/copilot-review-instructions.md con reglas para el code review automático de Copilot en Pull Requests:

# Instrucciones de Code Review para Copilot

## Prioridades de Revisión (en orden)
1. Seguridad: secrets hardcodeados, inyección, datos expuestos, falta de autenticación
2. Errores lógicos: condiciones incorrectas, race conditions, datos mutados inesperadamente
3. Manejo de errores: try/catch faltante, errores silenciados, respuestas sin código HTTP correcto
4. Convenciones del proyecto: formato de respuesta estándar, async/await, JSDoc, logger vs console.log
5. Performance: queries N+1, loops innecesarios, datos cargados sin necesidad

## Formato de Comentarios
- Clasificar por severidad: 🔴 Crítico, 🟡 Importante, 🔵 Sugerencia
- Incluir sugerencia de código corregido cuando sea posible
- Explicar el "por qué" del problema, no solo el "qué"

## No Comentar
- Preferencias estilísticas subjetivas (tabs vs spaces, punto y coma)
- Cambios que no están en el diff del PR
```

---

### 🛠️ Troubleshooting Ejercicio 1

| Problema | Solución |
|----------|----------|
| `node: command not found` | Instala Node.js 18+ desde https://nodejs.org |
| `npm install` falla | Verifica tu versión de Node: `node --version` |
| Copilot no sigue las instrucciones | Verifica que `.github/copilot-instructions.md` exista y esté guardado |
| Las scoped instructions no aplican | Verifica el campo `applyTo` en el frontmatter YAML y que el archivo esté en `.github/instructions/` |
| Copilot genera en inglés | Agrega al prompt: "Sigue las instrucciones de .github/copilot-instructions.md" |

---

## 🔬 Ejercicio 2: Prompt Files y Skills — Automatización Reutilizable (25-30 min)

> ⚠️ **PRERREQUISITO:** Ejercicio 1 completado con las instrucciones configuradas.

### Objetivos

- ✅ Crear prompt files reutilizables invocables con `/comando`
- ✅ Crear skills que Copilot detecta y carga automáticamente
- ✅ Usar prompt files para generar endpoints, hacer code review y generar tests
- ✅ Entender la diferencia entre prompts (manuales) y skills (automáticos)

### Paso 2.1: Crear el prompt file para generar endpoints

> 💡 **¿Qué es un prompt file?** Es una plantilla Markdown con frontmatter YAML que defines una vez y tu equipo invoca con `/nombre` en Copilot Chat. Piénsalo como un alias de prompt que encapsula las mejores prácticas para una tarea específica.

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/prompts/create-endpoint.prompt.md con un prompt reutilizable para crear endpoints REST.

El frontmatter YAML debe tener:
---
mode: "agent"
description: "Crear un endpoint REST completo con modelo, rutas y validaciones"
---

Y el cuerpo del prompt debe instruir a Copilot para que, dado un nombre de recurso y sus campos:

1. Cree el modelo en src/models/ con:
   - Almacenamiento en memoria (array)
   - Id auto-incremental
   - Métodos: obtenerTodos, obtenerPorId, crear, actualizar, eliminar
   - Datos de ejemplo precargados (3 registros)
   - Documentación JSDoc en español

2. Cree las rutas en src/routes/ con:
   - CRUD completo: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
   - Validación de inputs con express-validator
   - Formato de respuesta estándar del proyecto
   - Manejo de errores con try/catch y next(error)

3. Registre la ruta en src/app.js

4. Siga todas las convenciones de .github/copilot-instructions.md

El prompt debe usar la variable {{input}} para recibir el nombre del recurso y sus campos.
```

---

### Paso 2.2: Probar el prompt file `/create-endpoint`

📍 **Instrucciones:**

1. Abre Copilot Chat en **Modo Agent**
2. Escribe:

🤖 **PROMPT:**

```
/create-endpoint productos con campos: nombre (string, requerido), precio (number, requerido), categoría (string), stock (number, default 0)
```

📝 **Observa:**
- ¿Copilot creó `src/models/product.js` con el modelo?
- ¿Creó `src/routes/products.js` con CRUD completo?
- ¿Registró la ruta en `src/app.js`?
- ¿Siguió las convenciones de las instrucciones globales (async/await, JSDoc, formato de respuesta)?

> 🌟 **Momento wow:** Con un solo comando `/create-endpoint`, Copilot genera toda la estructura de un módulo nuevo siguiendo tus convenciones. Esto es reutilizable — cualquier miembro del equipo que clone el repo tiene acceso al mismo prompt.

---

### Paso 2.3: Crear el prompt file para code review

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/prompts/code-review.prompt.md con un prompt para revisar código.

Frontmatter YAML:
---
mode: "ask"
description: "Revisar el archivo actual buscando bugs, seguridad y convenciones"
---

El cuerpo debe instruir a Copilot para que analice el archivo activo en el editor y genere un reporte con:

1. Problemas de seguridad (🔴 Crítico)
2. Errores lógicos o bugs (🟡 Importante)  
3. Violaciones de convenciones del proyecto (🔵 Sugerencia)
4. Resumen con conteo por severidad

Para cada problema: línea aproximada, descripción del problema, sugerencia de corrección.
Debe referenciar las reglas de .github/copilot-instructions.md como base para evaluar convenciones.
```

---

### Paso 2.4: Probar el prompt `/code-review`

📍 **Instrucciones:**

1. Abre `src/routes/users.js` en el editor
2. En Copilot Chat escribe:

🤖 **PROMPT:**

```
/code-review
```

📝 **Observa:** Copilot debería identificar los bugs intencionales del archivo: secrets hardcodeados, passwords expuestos en respuestas, `console.log` en vez de logger, falta de autenticación en ciertos endpoints, etc.

---

### Paso 2.5: Crear el prompt file para generar tests

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/prompts/generate-tests.prompt.md con un prompt para generar tests.

Frontmatter YAML:
---
mode: "agent"
description: "Generar tests completos con Jest y Supertest para el archivo activo"
---

El cuerpo debe instruir a Copilot para que, basándose en el archivo activo:

1. Cree un archivo de tests en tests/ con el nombre correspondiente (ej: users.js → users.test.js)
2. Genere tests de integración con Supertest para cada endpoint
3. Use patrón AAA (Arrange, Act, Assert) con comentarios
4. Cubra: caso exitoso, validación fallida, recurso no encontrado, error de autenticación
5. Use beforeEach para resetear datos
6. Naming en español: "debería [resultado] cuando [condición]"
7. Ejecute npm test al final para verificar
```

---

### Paso 2.6: Crear un skill para endpoints REST

> 💡 **¿Qué es un skill?** A diferencia de los prompt files (que invocas manualmente), un skill es un paquete de instrucciones que Copilot **detecta y carga automáticamente** cuando la tarea es relevante. Un skill puede incluir scripts, templates y recursos adicionales.

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/skills/api-endpoint/SKILL.md con un skill para crear endpoints REST.

El frontmatter YAML debe tener:
---
name: "api-endpoint"
description: "Crear endpoints REST completos siguiendo los patrones del proyecto"
---

El cuerpo debe definir el proceso paso a paso que Copilot debe seguir cuando detecte que necesita crear un endpoint:

1. Verificar la estructura existente del proyecto (leer src/app.js, src/routes/, src/models/)
2. Crear el modelo siguiendo el patrón de src/models/user.js
3. Crear las rutas siguiendo el patrón de src/routes/users.js (pero sin los bugs)
4. Registrar la nueva ruta en src/app.js
5. Verificar que el servidor arranca sin errores

Incluir la estructura de archivos esperada y el formato de respuesta estándar como referencia inline.
```

---

### Paso 2.7: Crear un skill para testing

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/skills/unit-testing/SKILL.md con un skill para generar tests.

Frontmatter YAML:
---
name: "unit-testing"
description: "Generar tests de integración con Jest y Supertest siguiendo las convenciones del proyecto"
---

El cuerpo debe definir:

1. Framework: Jest + Supertest
2. Patrón estricto: AAA con comentarios (// Arrange, // Act, // Assert)
3. Estructura de cada test file
4. Escenarios obligatorios a cubrir por endpoint
5. Cómo importar y configurar la app para testing
6. Cómo manejar datos de prueba con beforeEach/afterEach
```

---

### Paso 2.8: Probar el skill automático

📍 **Instrucciones:**

1. En **Modo Agent**, escribe un prompt que active el skill sin mencionarlo explícitamente:

🤖 **PROMPT:**

```
Necesito crear un módulo CRUD completo para gestionar pedidos (orders) con los campos: userId, productos (array), total (number), estado (string: pendiente/enviado/entregado), direccionEnvio (string)
```

📝 **Observa:** Copilot debería detectar automáticamente el skill `api-endpoint` y seguir su estructura. No necesitaste invocar `/create-endpoint` — el skill se activó por relevancia.

2. Ahora escribe:

🤖 **PROMPT:**

```
Genera los tests para el módulo de orders que acabamos de crear
```

📝 **Observa:** Copilot debería detectar el skill `unit-testing` y generar tests con patrón AAA.

---

### 🛠️ Troubleshooting Ejercicio 2

| Problema | Solución |
|----------|----------|
| `/create-endpoint` no se reconoce | Verifica que el archivo esté en `.github/prompts/` con extensión `.prompt.md` |
| El skill no se detecta automáticamente | Verifica que `SKILL.md` esté en `.github/skills/nombre-skill/SKILL.md` con frontmatter correcto |
| El prompt genera código incompleto | Ajusta el prompt del archivo `.prompt.md` — sé más específico en las instrucciones |
| `npm test` falla | Verifica que Jest y Supertest estén instalados: `npm install --save-dev jest supertest` |
| Copilot no crea los archivos | Asegúrate de estar en **Modo Agent**, no en Modo Ask |

---

## 🔬 Ejercicio 3: Custom Agents con Handoffs (30-35 min)

> ⚠️ **PRERREQUISITO:** Ejercicios 1 y 2 completados.

### Objetivos

- ✅ Crear agentes personalizados con roles, herramientas restringidas y handoffs
- ✅ Ejecutar un flujo completo: planificar → implementar → testear → auditar
- ✅ Entender la diferencia entre agentes (persona persistente) y prompts (tarea única)
- ✅ Usar handoffs para encadenar agentes en flujos de trabajo

### Concepto Clave: Agentes como Equipo de Especialistas

Los agentes funcionan como un equipo donde cada miembro tiene un rol definido, acceso limitado a herramientas y la capacidad de pasar el trabajo al siguiente especialista. A diferencia de los prompts (una tarea puntual) y los skills (capacidades automáticas), los agentes mantienen una **persona persistente** durante toda la conversación.

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│ @planner │────→│ @implementer │────→│ @test-writer │
│ Solo lee │     │ Crea y edita │     │ Solo tests/  │
│ No edita │     │    código    │     │  Ejecuta npm │
└────┬─────┘     └──────┬───────┘     └──────────────┘
     │                  │
     │                  ▼
     │           ┌────────────────────┐
     └──────────→│ @security-reviewer │
                 │    Solo lectura    │
                 │  Genera reportes   │
                 └────────┬───────────┘
                          │
                          ▼
                   @implementer
                   (aplica fixes)

@docs-writer (standalone — genera docs/)
```

### Paso 3.1: Crear el agente @planner

> 💡 **Anatomía de un agente:** Un archivo Markdown con frontmatter YAML que define nombre, descripción, herramientas permitidas y handoffs (botones que aparecen al final de su respuesta para pasar el trabajo a otro agente).

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/agents/planner.agent.md con un agente planificador.

Frontmatter YAML:
---
name: "planner"
description: "Planifica features analizando el código existente. Solo lee, nunca modifica archivos."
tools:
  - read
  - search
  - fetch
handoffs:
  - name: "implementer"
    description: "Implementar Plan"
  - name: "security-reviewer"
    description: "Revisar Seguridad"
---

El cuerpo del prompt debe definir al agente como un arquitecto senior que:

- Analiza el código existente ANTES de proponer cambios (lee src/app.js, src/routes/, src/models/)
- Genera un plan detallado con: modelo de datos, endpoints, validaciones, consideraciones de seguridad
- Identifica archivos que se crearán y archivos existentes que se modificarán
- NUNCA modifica ni crea archivos — solo planifica
- Presenta el plan en formato estructurado con pasos numerados
- Sigue las convenciones de .github/copilot-instructions.md
```

---

### Paso 3.2: Crear el agente @implementer

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/agents/implementer.agent.md con un agente implementador.

Frontmatter YAML:
---
name: "implementer"
description: "Implementa código siguiendo planes y convenciones del proyecto."
tools:
  - read
  - edit
  - create
  - terminal
handoffs:
  - name: "test-writer"
    description: "Ejecutar Tests"
  - name: "security-reviewer"
    description: "Revisar Seguridad"
---

El cuerpo debe definir al agente como un desarrollador senior que:

- Recibe un plan (del @planner o del usuario) y lo implementa
- Crea modelos, rutas, middleware y registra todo en src/app.js
- Sigue estrictamente las convenciones de .github/copilot-instructions.md y las scoped instructions
- Usa los patrones existentes del proyecto como referencia (lee antes de crear)
- Verifica que el servidor arranca sin errores después de cada cambio (npm run dev)
- Cuando recibe correcciones de seguridad del @security-reviewer, las aplica
```

---

### Paso 3.3: Crear el agente @test-writer

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/agents/test-writer.agent.md con un agente escritor de tests.

Frontmatter YAML:
---
name: "test-writer"
description: "Genera y ejecuta tests. Solo escribe en tests/."
tools:
  - read
  - edit
  - create
  - terminal
handoffs:
  - name: "security-reviewer"
    description: "Revisar Seguridad"
---

El cuerpo debe definir al agente como un QA engineer que:

- Lee el código fuente para entender qué testear (pero NUNCA modifica archivos en src/)
- Solo crea y modifica archivos dentro de tests/
- Genera tests de integración con Jest + Supertest
- Sigue el patrón AAA estricto con comentarios
- Cubre: caso exitoso, validación fallida, no encontrado, error de auth
- Ejecuta npm test para verificar que los tests pasan
- Reporta cobertura y tests que fallaron si los hay
```

---

### Paso 3.4: Crear el agente @security-reviewer

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/agents/security-reviewer.agent.md con un agente auditor de seguridad.

Frontmatter YAML:
---
name: "security-reviewer"
description: "Audita código buscando vulnerabilidades. Solo lectura."
tools:
  - read
  - search
handoffs:
  - name: "implementer"
    description: "Aplicar Correcciones"
---

El cuerpo debe definir al agente como un security engineer que:

- Audita el código en modo solo lectura — NUNCA modifica archivos
- Busca: secrets hardcodeados, inyección, datos sensibles expuestos, falta de autenticación, falta de validación, falta de rate limiting
- Clasifica cada hallazgo por severidad: 🔴 Crítico, 🟡 Importante, 🔵 Sugerencia
- Para cada hallazgo: describe el problema, el riesgo y la corrección recomendada con código
- Genera un reporte final con resumen y conteo por severidad
```

---

### Paso 3.5: Crear el agente @docs-writer

🤖 **PROMPT en Modo Agent:**

```
Crea el archivo .github/agents/docs-writer.agent.md con un agente de documentación.

Frontmatter YAML:
---
name: "docs-writer"
description: "Genera documentación técnica y API docs."
tools:
  - read
  - edit
  - create
---

El cuerpo debe definir al agente como un technical writer que:

- Lee el código fuente para extraer endpoints, parámetros, respuestas
- Genera documentación en docs/ en formato Markdown
- Incluye para cada endpoint: método HTTP, ruta, parámetros, body esperado, respuestas posibles con códigos, ejemplo de request/response
- Documenta modelos de datos con sus campos y tipos
- Todo en español
```

---

### Paso 3.6: Ejecutar el flujo completo con handoffs

Este es el ejercicio central del workshop. Vas a encadenar agentes en un flujo de trabajo real.

📍 **Instrucciones:**

1. En VS Code, abre Copilot Chat → dropdown de agentes → selecciona **@planner**
2. Escribe:

🤖 **PROMPT:**

```
Planifica un sistema de notificaciones para usuarios. Debe soportar notificaciones por email y push, con preferencias configurables por usuario y un endpoint para marcarlas como leídas.
```

📝 **Observa:** El planner lee el código existente, genera un plan detallado y **NO toca ningún archivo**. Al terminar, aparece el botón **"Implementar Plan"**.

3. Haz clic en **"Implementar Plan"** → se abre **@implementer** con el contexto del plan
4. El implementer crea los archivos. Al terminar, aparecen **"Ejecutar Tests"** y **"Revisar Seguridad"**
5. Haz clic en **"Ejecutar Tests"** → se abre **@test-writer**
6. El test-writer genera tests en `tests/` y ejecuta `npm test`

> 🌟 **Momento wow:** Acabas de ejecutar un flujo completo de planificación → implementación → testing usando agentes encadenados, cada uno con su rol y herramientas restringidas. Esto es desarrollo agéntico con control.

---

### Paso 3.7: Agente de seguridad standalone

📍 **Instrucciones:**

1. Selecciona **@security-reviewer** del dropdown
2. Escribe:

🤖 **PROMPT:**

```
Audita el archivo src/routes/users.js
```

📝 **Observa:** El agente genera un reporte con los bugs intencionales clasificados por severidad. Al terminar, ofrece el botón **"Aplicar Correcciones"** que hace handoff a @implementer.

3. Si quieres, haz clic en **"Aplicar Correcciones"** para que @implementer arregle los bugs.

---

### 🛠️ Troubleshooting Ejercicio 3

| Problema | Solución |
|----------|----------|
| El agente no aparece en el dropdown | Verifica que el archivo esté en `.github/agents/` con extensión `.agent.md` y frontmatter YAML correcto |
| Los handoffs no aparecen como botones | Verifica el campo `handoffs` en el frontmatter del agente — debe ser un array con `name` y `description` |
| El agente modifica archivos cuando no debería | Revisa el campo `tools` — un agente con solo `read` y `search` no puede editar |
| El flujo se interrumpe | Puedes retomar seleccionando manualmente el siguiente agente del dropdown |
| @test-writer escribe en src/ | Refuerza en el prompt del agente: "SOLO escribe en tests/, NUNCA modifiques archivos en src/" |

---

## 🔬 Ejercicio 4: Code Review en Pull Requests (15-20 min)

> ⚠️ **PRERREQUISITO:** El repo debe estar en GitHub (público o privado). GitHub CLI (`gh`) autenticado.

> 🎓 **Nota para el instructor:** Si el tiempo es limitado, este ejercicio puede hacerse como demostración en vivo. Lo esencial es que los participantes vean el flujo completo.

### Objetivos

- ✅ Activar Copilot como reviewer en un Pull Request
- ✅ Ver cómo Copilot usa las reglas de `copilot-review-instructions.md`
- ✅ Aplicar sugerencias de Copilot directamente desde el PR
- ✅ Configurar review automático con Rulesets (opcional)

### Paso 4.1: Crear una rama y un PR

🤖 **En tu terminal:**

```bash
# Asegúrate de que todos los cambios de los ejercicios anteriores estén commiteados
git add .
git commit -m "feat: configuración completa de personalización de Copilot"
git push origin main

# Crear una rama con cambios
git checkout -b feature/user-improvements

# Hacer algún cambio en users.js (o simplemente usar los bugs existentes)
git add .
git commit -m "feat: mejoras en módulo de usuarios"
git push -u origin feature/user-improvements

# Crear PR con Copilot como reviewer
gh pr create \
  --title "feat: mejoras en módulo de usuarios" \
  --body "Mejoras en el módulo de usuarios incluyendo nuevos endpoints" \
  --reviewer @copilot
```

---

### Paso 4.2: Revisar los comentarios de Copilot

📍 **Instrucciones:**

1. Abre el PR en GitHub.com
2. Espera ~30 segundos a que Copilot complete la revisión
3. Revisa los comentarios que Copilot dejó en el código

📝 **Observa:**
- Copilot clasifica los problemas usando las severidades de `copilot-review-instructions.md`
- Cada comentario incluye una sugerencia de código corregido
- Puedes hacer clic en **"Apply suggestion"** para aplicar el fix directamente como commit
- Para sugerencias más complejas, **"Implement suggestion"** delega al Coding Agent

> 🌟 **Momento wow:** Copilot como reviewer aplica las reglas específicas de tu proyecto, no reglas genéricas. Los bugs intencionales de `users.js` deberían aparecer todos clasificados.

---

### Paso 4.3: Configurar review automático (⭐ bonus)

> 📝 Este paso es **opcional**. Configura Copilot para que revise automáticamente cada PR sin tener que agregarlo manualmente.

📍 **Instrucciones:**

1. En GitHub.com → tu repo → **Settings** → **Rules** → **Rulesets**
2. **New ruleset** → Branch ruleset
3. Aplica a la rama `main`
4. Habilita **"Automatically request Copilot code review"**
5. Opcionalmente marca **"Review new pushes"** y **"Review draft PRs"**

A partir de ahora, cada PR recibirá review automático de Copilot con tus reglas personalizadas.

---

### 🛠️ Troubleshooting Ejercicio 4

| Problema | Solución |
|----------|----------|
| `gh: command not found` | Instala GitHub CLI: https://cli.github.com |
| `gh pr create` falla | Verifica autenticación: `gh auth status` |
| Copilot no deja comentarios | Verifica que tu plan de Copilot soporte Code Review (Pro+, Business, Enterprise) |
| Los comentarios no siguen las reglas | Verifica que `.github/copilot-review-instructions.md` esté en la rama del PR |
| "Implement suggestion" no aparece | Requiere Copilot Coding Agent habilitado en la configuración del repo |

---

## 📖 Referencia Rápida

### Archivos de Configuración de Copilot

| Archivo | Propósito | Activación |
|---------|-----------|------------|
| `.github/copilot-instructions.md` | Reglas globales del repo | Automática (siempre) |
| `.github/copilot-review-instructions.md` | Reglas para Code Review en PRs | En Pull Requests |
| `.github/instructions/*.instructions.md` | Reglas por tipo de archivo | Automática (por `applyTo`) |
| `.github/prompts/*.prompt.md` | Tareas reutilizables | Manual con `/nombre` |
| `.github/skills/*/SKILL.md` | Capacidades con recursos | Automática por relevancia |
| `.github/agents/*.agent.md` | Especialistas con handoffs | Manual con `@nombre` o dropdown |

### Comandos de Copilot Chat

| Comando | Descripción |
|---------|-------------|
| `/create-endpoint` | Genera un módulo CRUD completo |
| `/code-review` | Analiza el archivo activo buscando bugs |
| `/generate-tests` | Genera tests para el archivo activo |
| `/tests` | Comando nativo — genera tests para código seleccionado |
| `/doc` | Comando nativo — genera documentación |
| `/fix` | Comando nativo — propone corrección |
| `/explain` | Comando nativo — explica código seleccionado |

### Agentes del Proyecto

| Agente | Rol | Herramientas | Handoffs |
|--------|-----|-------------|----------|
| `@planner` | Arquitecto — planifica sin modificar | read, search, fetch | → @implementer, → @security-reviewer |
| `@implementer` | Desarrollador — crea y edita código | read, edit, create, terminal | → @test-writer, → @security-reviewer |
| `@test-writer` | QA — solo escribe en tests/ | read, edit, create, terminal | → @security-reviewer |
| `@security-reviewer` | Auditor — solo lectura | read, search | → @implementer |
| `@docs-writer` | Technical writer — genera docs/ | read, edit, create | — |

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+I` / `Cmd+I` | Abrir Copilot inline en el editor |
| `Ctrl+Shift+I` / `Cmd+Shift+I` | Abrir panel de Copilot Chat |
| `Tab` | Aceptar sugerencia de Copilot |
| `Esc` | Rechazar sugerencia |
| `Alt+]` | Ver siguiente sugerencia |
| `Alt+[` | Ver sugerencia anterior |

---

## ✅ Checklist Final del Workshop

Al terminar, deberías tener:

### Instrucciones (Ejercicio 1)
- `.github/copilot-instructions.md` — Reglas globales
- `.github/instructions/nodejs.instructions.md` — Reglas para código fuente
- `.github/instructions/tests.instructions.md` — Reglas para tests
- `.github/copilot-review-instructions.md` — Reglas para Code Review en PRs

### Prompts (Ejercicio 2)
- `.github/prompts/create-endpoint.prompt.md` — Generar endpoints REST
- `.github/prompts/code-review.prompt.md` — Revisar código
- `.github/prompts/generate-tests.prompt.md` — Generar tests

### Skills (Ejercicio 2)
- `.github/skills/api-endpoint/SKILL.md` — Skill para crear endpoints
- `.github/skills/unit-testing/SKILL.md` — Skill para generar tests

### Agentes (Ejercicio 3)
- `.github/agents/planner.agent.md` — Planificador (solo lectura)
- `.github/agents/implementer.agent.md` — Implementador (crea/edita código)
- `.github/agents/test-writer.agent.md` — Escritor de tests (solo tests/)
- `.github/agents/security-reviewer.agent.md` — Auditor de seguridad (solo lectura)
- `.github/agents/docs-writer.agent.md` — Documentación

### Código generado durante el workshop
- `src/models/product.js` — Modelo de productos (Ej. 2)
- `src/routes/products.js` — Rutas de productos (Ej. 2)
- `src/models/order.js` — Modelo de pedidos (Ej. 2)
- `src/routes/orders.js` — Rutas de pedidos (Ej. 2)
- `src/models/notification.js` — Modelo de notificaciones (Ej. 3)
- `src/routes/notifications.js` — Rutas de notificaciones (Ej. 3)
- `tests/products.test.js` — Tests de productos
- `tests/orders.test.js` — Tests de pedidos

---

## 🆘 ¿Te quedaste atrás?

| Situación | Qué hacer |
|-----------|-----------|
| No terminé el Ejercicio 1 | Las instrucciones son la base. Pide al instructor la solución de referencia antes de continuar |
| No terminé el Ejercicio 2 | Puedes hacer el Ejercicio 3 sin los prompts/skills — los agentes funcionan independientemente |
| No terminé el Ejercicio 3 | El Ejercicio 4 solo necesita un PR — puedes hacerlo con los cambios que tengas |
| Los agentes generan algo diferente | Eso es **normal y esperado**. Comparen resultados — es un buen ejercicio |

> 🎓 **Para el instructor:** Se recomienda tener una rama `solucion` en el repositorio con todos los archivos de configuración ya creados. Así, participantes que se queden atrás pueden hacer `git checkout solucion -- .github/` para obtener la configuración completa y continuar.

---

## 🙋 Preguntas Frecuentes

### ¿Las instrucciones de Copilot afectan el autocompletado o solo el chat?

Afectan **ambos**. Las instrucciones globales y scoped se inyectan como contexto tanto en el autocompletado inline como en Copilot Chat, agentes y code review.

### ¿Cuál es la diferencia entre un prompt file y un skill?

El prompt file lo invocas tú con `/comando` — es explícito. El skill lo detecta Copilot automáticamente cuando la tarea es relevante, sin que lo pidas. Piensa en los prompts como atajos manuales y los skills como conocimiento que Copilot activa solo.

### ¿Los agentes funcionan fuera de VS Code?

Sí. Los agentes también funcionan en la CLI de Copilot (`gh copilot`), en el Coding Agent de github.com (asigna un issue a Copilot y selecciona el agente), y en Visual Studio.

### ¿Qué plan de Copilot necesito para usar todo esto?

Las instrucciones, prompts, skills y agentes funcionan con cualquier plan de Copilot (Free, Pro, Pro+, Business, Enterprise). El **Code Review en PRs** requiere Pro+, Business o Enterprise. Los **handoffs entre agentes** requieren que la extensión de Copilot esté actualizada.

### ¿Los archivos de configuración se comparten con el equipo?

Sí, todos viven dentro de `.github/` y se versionan con git. Al clonar el repo, cualquier miembro del equipo tiene acceso a las mismas instrucciones, prompts, skills y agentes.

### ¿Copilot genera código diferente para cada persona?

Sí. Copilot aprende del contexto (tu código, tus comentarios, tu estilo) y puede producir soluciones ligeramente diferentes. Las instrucciones reducen esa variabilidad al establecer convenciones comunes, pero no la eliminan por completo.

### ¿Los handoffs de agentes son obligatorios?

No. Los handoffs aparecen como **botones opcionales** al final de la respuesta del agente. Puedes ignorarlos y seleccionar cualquier agente manualmente desde el dropdown.

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Prompt Files](https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files)
- [Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Copilot Code Review](https://docs.github.com/en/copilot/using-github-copilot/code-review/using-copilot-code-review)
- [VS Code + Copilot](https://code.visualstudio.com/docs/copilot/overview)

### Patrones y Buenas Prácticas

- [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) — Agentes, instrucciones y skills de la comunidad
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

## 📁 Estructura Final del Proyecto

```
copilot-demo-repo/
├── .github/
│   ├── copilot-instructions.md              # Instrucciones globales
│   ├── copilot-review-instructions.md       # Instrucciones para Code Review en PRs
│   ├── instructions/
│   │   ├── nodejs.instructions.md           # Reglas para archivos .js en src/
│   │   └── tests.instructions.md            # Reglas para archivos de test
│   ├── prompts/
│   │   ├── create-endpoint.prompt.md        # /create-endpoint
│   │   ├── code-review.prompt.md            # /code-review
│   │   └── generate-tests.prompt.md         # /generate-tests
│   ├── agents/
│   │   ├── planner.agent.md                 # @planner — solo lectura
│   │   ├── implementer.agent.md             # @implementer — crea/edita
│   │   ├── security-reviewer.agent.md       # @security-reviewer — auditoría
│   │   ├── test-writer.agent.md             # @test-writer — solo tests/
│   │   └── docs-writer.agent.md             # @docs-writer — documentación
│   └── skills/
│       ├── api-endpoint/
│       │   └── SKILL.md                     # Skill: crear endpoints REST
│       └── unit-testing/
│           └── SKILL.md                     # Skill: generar tests
├── src/
│   ├── app.js                               # Express app principal
│   ├── routes/
│   │   └── users.js                         # Rutas de usuarios (con bugs intencionales)
│   ├── models/
│   │   └── user.js                          # Modelo de usuario
│   ├── middleware/
│   │   └── auth.js                          # Middleware de autenticación
│   └── utils/
│       └── validator.js                     # Utilidades de validación
├── tests/
│   └── users.test.js                        # Tests de ejemplo
├── package.json
├── DEMO-SCRIPT.md                           # Guía para el instructor
└── README.md                                # Este archivo
```

---

## 👥 Créditos

**Workshop desarrollado para:** Demostración avanzada de personalización de GitHub Copilot

**Tecnologías:** GitHub Copilot, Node.js 18+, Express 4.x, Jest, Supertest, express-validator

**Duración:** 2 horas

**Nivel:** Intermedio — se asume conocimiento básico de Copilot (autocompletado, chat)

---

> 🎉 **¡Gracias por participar!** Ahora tienes las herramientas para personalizar GitHub Copilot a la medida de tu equipo y tus proyectos.
