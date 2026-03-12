# 🤖 GitHub Copilot Demo: Skills, Prompts & Code Review

Este repositorio es una **demo práctica** para mostrar las capacidades de personalización de GitHub Copilot en un solo repo.

## 🎯 ¿Qué vamos a demostrar?

| Feature | Ubicación | Descripción |
|---------|-----------|-------------|
| **Custom Instructions** | `.github/copilot-instructions.md` | Reglas globales para todo el repo |
| **Scoped Instructions** | `.github/instructions/*.instructions.md` | Reglas por tipo de archivo |
| **Prompt Files** | `.github/prompts/*.prompt.md` | Comandos reutilizables (`/comando`) |
| **Agent Skills** | `.github/skills/*/SKILL.md` | Capacidades especializadas con scripts |
| **Code Review** | PR → Reviewers → Copilot | Review automático en Pull Requests |

## 📁 Estructura del Proyecto

```
copilot-demo-repo/
├── .github/
│   ├── copilot-instructions.md          # ① Instrucciones globales
│   ├── copilot-review-instructions.md   # ② Instrucciones para Code Review en PRs
│   ├── instructions/
│   │   ├── nodejs.instructions.md       # ③ Instrucciones para archivos .js
│   │   └── tests.instructions.md        # ④ Instrucciones para archivos de test
│   ├── prompts/
│   │   ├── create-endpoint.prompt.md    # ⑤ Prompt: crear endpoint REST
│   │   ├── code-review.prompt.md        # ⑥ Prompt: revisar código
│   │   └── generate-tests.prompt.md     # ⑦ Prompt: generar tests
│   └── skills/
│       ├── api-endpoint/
│       │   └── SKILL.md                 # ⑧ Skill: crear endpoints REST
│       └── unit-testing/
│           └── SKILL.md                 # ⑨ Skill: framework de testing
├── src/
│   ├── app.js                           # Express app principal
│   ├── routes/
│   │   └── users.js                     # Rutas de ejemplo (con bugs para demo)
│   ├── models/
│   │   └── user.js                      # Modelo de usuario
│   ├── middleware/
│   │   └── auth.js                      # Middleware de autenticación
│   └── utils/
│       └── validator.js                 # Utilidades de validación
├── tests/
│   └── users.test.js                    # Tests de ejemplo
├── package.json
└── README.md
```

## 🚀 Guía de la Demo

### Demo 1: Custom Instructions (5 min)

1. Abre el repo en VS Code con Copilot activado
2. Copilot carga automáticamente `.github/copilot-instructions.md`
3. Pide en chat: *"Crea una función para conectar a la base de datos"*
4. Observa cómo Copilot sigue las convenciones del proyecto (async/await, JSDoc, manejo de errores)

### Demo 2: Scoped Instructions (5 min)

1. Abre `src/routes/users.js` → se aplican las instrucciones de `nodejs.instructions.md`
2. Abre `tests/users.test.js` → se aplican las instrucciones de `tests.instructions.md`
3. Muestra cómo las sugerencias cambian según el tipo de archivo

### Demo 3: Prompt Files (10 min)

1. En Copilot Chat escribe `/create-endpoint` → genera un endpoint REST completo
2. Escribe `/code-review` → analiza el archivo actual
3. Escribe `/generate-tests` → genera tests para el archivo actual

### Demo 4: Agent Skills (10 min)

1. En Agent Mode, pide: *"Crea un nuevo endpoint CRUD para productos"*
2. Copilot detecta automáticamente el skill `api-endpoint` y lo sigue
3. Pide: *"Genera tests para el módulo de usuarios"*
4. Copilot detecta el skill `unit-testing`

### Demo 5: Code Review en PRs (10 min)

1. Crea una rama: `git checkout -b feature/add-products`
2. Agrega código con errores intencionales (ya incluido en el repo)
3. Haz push y crea un Pull Request
4. En GitHub.com → PR → Reviewers → selecciona **Copilot**
5. Copilot deja comentarios con sugerencias de mejora
6. Opcionalmente: usa "Implement suggestion" para que el Coding Agent aplique los fixes

## ⚙️ Configurar Code Review Automático

### Opción A: Manual por PR
En cada PR → Reviewers → Copilot

### Opción B: Automático con Rulesets
1. Repo → Settings → Rules → Rulesets
2. New ruleset → Branch ruleset
3. Habilitar "Automatically request Copilot code review"
4. Opcionalmente: "Review new pushes" y "Review draft PRs"

### Opción C: Desde CLI
```bash
# Crear PR con Copilot como reviewer
gh pr create --reviewer @copilot

# Agregar Copilot a PR existente
gh pr edit --add-reviewer @copilot
```

## 📋 Requisitos

- GitHub Copilot Pro, Pro+, Business o Enterprise
- VS Code con extensión de GitHub Copilot
- Node.js 18+
- GitHub CLI (`gh`) para la demo de Code Review desde terminal

## 🏁 Setup

```bash
git clone https://github.com/TU-USUARIO/copilot-demo-repo.git
cd copilot-demo-repo
npm install
npm run dev
```
