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

## 🎯 DEMO 5: Code Review en PRs (10 min)

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
| 5 | Code Review en PRs | `.github/copilot-review-instructions.md` | 10 min |

**Tiempo total estimado: ~40 minutos**

---

## 💡 Tips para la Demo

- Usa **Agent Mode** (no Ask mode) para las demos 3 y 4
- Si Copilot no detecta un skill automáticamente, puedes escribir `/skills` para invocarlo
- El Code Review funciona mejor con PRs que tengan cambios sustanciales
- Los bugs intencionales en `users.js` están documentados con comentarios `// 🔴 BUG`
- Puedes borrar los comentarios de bugs antes de la demo para hacerlo más realista
