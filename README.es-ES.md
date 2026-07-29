# RapidSpec

Flujo de trabajo de desarrollo impulsado por especificaciones con agentes de IA para Claude Code y Cursor IDE.

## ¿Qué es RapidSpec?

RapidSpec es un flujo de trabajo basado en especificaciones con:
- **Integración Inteligente de IA** - Previene el "código imaginario" mediante agentes de verificación.
- **Comandos Slash** - `/rapid:proposal`, `/rapid:apply`, etc.
- **Revisiones Automatizadas** - Comprobaciones de seguridad, arquitectura y calidad de código.
- **Implementación Paso a Paso** - Soporta iteraciones rápidas con el flujo de trabajo "espera, cambia esto".

## Instalación

Instalación global:
```bash
npm install -g rapidspec
```

O uso en tu proyecto:
```bash
npm install --save-dev rapidspec
npx rapid init
```

Esto realizará lo siguiente:
- Crear la estructura de directorios `rapidspec/`.
- Copiar 18 agentes a `.claude/agents/`.
- Copiar 7 comandos a `.claude/commands/`.
- Copiar 7 plantillas a `.rapidspec/templates/`.
- Generar `CLAUDE.md` y `rapidspec/AGENTS.md`.
- Configurar `.cursor/mcp.json` para la integración con Cursor IDE.

Esto habilita los comandos slash `/rapid:*` en Claude Code y Cursor IDE.

## Inicio Rápido

Inicializa RapidSpec en tu proyecto:

```bash
rapid init
```

Esto hace automáticamente:
- Crea la estructura de directorios `rapidspec/`.
- Genera `CLAUDE.md` y `rapidspec/AGENTS.md`.
- Copia todos los agentes a `.claude/agents/`.
- Copia todos los comandos a `.claude/commands/`.
- Copia todas las plantillas a `.rapidspec/templates/`.

**¿Qué es AGENTS.md?**
- Única fuente de verdad para los asistentes de IA.
- Documenta el flujo de trabajo de RapidSpec, los comandos slash y los agentes.
- Sigue la [convención agents.md](https://agents.md/) para el descubrimiento agnóstico de herramientas.
- Compatible con Claude Code, Amp, Jules, Gemini CLI y otras herramientas de IA.

## Soporte de IDE

### Claude Code
Soporte nativo a través de `.claude/agents/` y `.claude/commands/`:
- **Agentes**: `@agent-code-verifier`, `@agent-security-auditor`, etc.
- **Comandos Slash**: `/rapid:proposal`, `/rapid:apply`, `/rapid:review`, etc.

### Cursor IDE
Agentes disponibles a través de [sub-agents-mcp](https://github.com/shinpr/sub-agents-mcp):
- **Configuración**: `rapid init` configura automáticamente `.cursor/mcp.json`.
- **Uso**: Reinicia Cursor y luego pregunta naturalmente (ej. "Usa el agente code-verifier para revisar este archivo").
- **Comandos Slash**: Los comandos `/rapid:*` funcionan en Cursor 2.0+.
- **Nota**: A diferencia de Claude Code, Cursor no admite menciones `@agent-*`; usa solicitudes en lenguaje natural en su lugar.

**Configuración Manual (si es necesaria):**
```json
{
  "mcpServers": {
    "sub-agents": {
      "command": "npx",
      "args": ["-y", "sub-agents-mcp"],
      "env": {
        "AGENTS_DIR": "/absolute/path/to/.claude/agents",
        "AGENT_TYPE": "cursor"
      }
    }
  }
}
```

### 1. Crea tu primera especificación
Usando comandos slash en Claude Code:
```
/rapid:proposal add-authentication
```

La IA hará lo siguiente:
1. Investigar la base de código (prevenir "código imaginario").
   - Leer archivos reales y encontrar patrones existentes.
   - Analizar el historial de git.
2. Investigar mejores prácticas.
   - Búsqueda web de los patrones más recientes.
   - Revisar la documentación del framework.
3. Presentar 2-3 opciones de implementación con sus pros y contras.

### 2. Implementar la especificación

```
/rapid:apply add-authentication
```

La IA implementa paso a paso con puntos de control:
- Puedes decir "¡espera!" (wait!) en cualquier momento.
- Cada paso es comprobable mediante pruebas.
- No hay commit automático (usa `/rapid:commit` cuando estés listo).

### 3. Revisar y confirmar (commit)

```
/rapid:review add-authentication  # Opcional: Ejecutar revisiones de agentes
/rapid:commit add-authentication  # Actualizar tasks.md y hacer commit
```

### 4. Archivar al finalizar

```
/rapid:archive add-authentication
```

Mueve a `archive/YYYYMMDDhhmmss-[nombre]/` y actualiza las especificaciones.

## Comandos Slash

Todos los comandos siguen el patrón `/rapid:*`:

### Flujo Principal
- `/rapid:proposal [nombre]` - Crear una nueva propuesta de especificación con investigación y revisión de diseño.
- `/rapid:apply [nombre]` - Implementar la especificación paso a paso con validación de arquitectura y puntos de control.
- `/rapid:review [nombre]` - Ejecutar revisiones exhaustivas de calidad de código.
- `/rapid:triage [nombre]` - Revisar los hallazgos uno por uno y añadir los elementos seleccionados a las tareas.
- `/rapid:resolve-parallel [nombre]` - Resolver múltiples tareas en paralelo con análisis de dependencias.
- `/rapid:commit [nombre]` - Revisar cambios, actualizar tareas y hacer commit.
- `/rapid:archive [nombre]` - Archivar la especificación completada y actualizar las especificaciones canónicas.

### Integración con Linear
- `/rapid:from-linear <número-de-issue>` - Crear una propuesta a partir de un issue de Linear existente.

## Comandos CLI

```bash
# Inicializar (crea la estructura de directorios rapidspec/)
rapid init [path]

# Validar estructura de propuesta
rapid validate [name]          # Validar propuesta específica
rapid validate                 # Validar todas las propuestas activas
rapid validate --strict        # Fallar ante advertencias

# Otros comandos próximamente
rapid proposal <name>          # Crear nueva propuesta
rapid list                     # Listar propuestas activas
rapid show <name>              # Mostrar detalles de la propuesta
```

### Validación CLI

El comando CLI `rapid validate` realiza una **validación de estructura**:
- ✓ Verifica que existan los archivos requeridos (proposal.md, tasks.md).
- ✓ Valida el formato de la propuesta (secciones: Resumen, Motivación, Solución, etc.).
- ✓ Verifica el formato de las tareas (sintaxis de casillas de verificación).
- ✓ Es rápido y ligero.

Para **revisiones exhaustivas impulsadas por IA**, usa los comandos slash en Claude Code:
- **Revisión de diseño** (antes de codificar): `/rapid:proposal` incluye revisión de diseño con agentes de arquitectura.
- **Revisión de calidad de código** (después de codificar): `/rapid:review` ejecuta verificación de código y auditorías de seguridad.

## Agentes

RapidSpec incluye agentes especializados para diferentes etapas del flujo de trabajo:

### Agentes de Investigación (Propuesta - Fase de Investigación)
Se ejecutan en paralelo al inicio de `/rapid:proposal`:
- **@agent-git-history-analyzer** - Análisis de evolución del código y decisiones.
- **@agent-pattern-recognition-specialist** - Encuentra patrones existentes en la base de código.
- **@agent-best-practices-researcher** - Investigación de estándares externos mediante búsqueda web.
- **@agent-framework-docs-researcher** - Documentación de librerías y código fuente.

### Agentes de Revisión de Diseño (Propuesta - Tras selección de opción)
Se ejecutan después de que el usuario selecciona una opción en `/rapid:proposal`:
- **@agent-database-architect** - Diseño de esquema, seguridad de migración, políticas RLS, estrategia de índices.
- **@agent-nextjs-architecture-expert** - Arquitectura de componentes Server/Client, enrutamiento, obtención de datos.

También se ejecutan al inicio de `/rapid:apply` para guía de implementación.

### Agentes de Revisión de Código (Revisión - Tras implementación)
Se ejecutan durante `/rapid:review` para verificar la calidad de la implementación:

**Agentes Core (siempre se ejecutan)**:
- **@agent-code-verifier** - Verifica la implementación frente a los archivos reales (evita "código imaginario").
- **@agent-security-auditor** - Revisa RLS, autenticación, cumplimiento de OWASP.

**Agentes Condicionales (según los cambios)**:
- **@agent-code-reviewer** - Seguridad de tipos, patrones, rendimiento, manejo de errores.
- **@agent-data-integrity-guardian** - Consistencia de datos, validación de restricciones.
- **@agent-test-automator** - Cobertura y generación de pruebas E2E.
- **@agent-performance-oracle** - Análisis de rendimiento y optimización.

### Agentes de Flujo de Trabajo
- **@agent-task-updater** - Revisa la implementación, actualiza tasks.md, prepara commits (usado en `/rapid:commit`).
- **@agent-pr-comment-resolver** - Resolución de comentarios de PR.

## Integración con Linear

### Configuración

1. Obtén tu clave de API de Linear en [linear.app/settings/api](https://linear.app/settings/api)

2. Añádela a tu proyecto:
```bash
# .env.local
LINEAR_API_KEY=lin_api_xxxxx
LINEAR_TEAM_ID=your-team-id
```

### Crear Propuesta desde Issue de Linear

Cuando ya tienes un issue de Linear y quieres implementarlo usando RapidSpec:

```
/rapid:from-linear 123
```

La IA hará lo siguiente:
1. Obtener el issue de Linear #123 (título, descripción, comentarios).
2. Analizar requisitos y criterios de aceptación.
3. Delegar a `/rapid:proposal` para completar el flujo de trabajo.
4. Generar todos los archivos de la propuesta con investigación y verificación completa.

Esto es útil para flujos impulsados por Product Managers donde los issues se crean primero y luego se implementan.

## Flujo de Trabajo Completo

### 1. Crear Propuesta (`/rapid:proposal`)

```
Tú: "/rapid:proposal add-smart-link-duplicate-prevention"

IA automáticamente:
1. 📖 Fase de Investigación (se ejecuta en paralelo)
   - Lee la base de código real (sin "código imaginario")
   - @agent-git-history-analyzer: Analiza el historial de git
   - @agent-pattern-recognition-specialist: Encuentra patrones existentes
   - Entiende por qué existe el comportamiento actual

2. 🔬 Fase de Investigación (se ejecuta en paralelo)
   - @agent-best-practices-researcher: Busca mejores prácticas (búsqueda web)
   - @agent-framework-docs-researcher: Revisa la documentación del framework
   - Analiza repositorios de referencia

3. 💡 Fase de Opciones
   - Presenta 2-3 enfoques de implementación
   - Muestra los pros y contras de cada opción
   - Recomienda el mejor enfoque (⭐)

Tú: "1" (seleccionar opción)

IA ejecuta Revisión de Diseño:
✓ @agent-database-architect: Valida esquema, seguridad de migración
✓ @agent-nextjs-architecture-expert: Revisa estructura de componentes
✓ Incorpora el feedback de diseño en la propuesta

IA crea:
✓ rapidspec/changes/add-smart-link-duplicate-prevention/
  - proposal.md (especificación completa con enfoque elegido + revisión de diseño)
  - tasks.md (plan de implementación paso a paso)
  - investigation.md (hallazgos del análisis de código)
  - research.md (mejores prácticas y referencias)
```

### 2. Aplicar Implementación (`/rapid:apply`)

```
Tú: "/rapid:apply add-smart-link-duplicate-prevention"

IA ejecuta Validación de Arquitectura:
✓ @agent-database-architect: Proporciona guía de implementación
✓ @agent-nextjs-architecture-expert: Confirma el enfoque de componentes
✓ Listo para implementar con arquitectura validada

IA implementa paso a paso:

┌─────────────────────────────────────┐
│ Tarea 1.1: Migración de BD (5min)    │
└─────────────────────────────────────┘
[Muestra la implementación]

Tú: "ㄱㄱ" (ir) o "wait!" (pausar)

┌─────────────────────────────────────┐
│ Tarea 1.2: Validación API (8min)    │
└─────────────────────────────────────┘
[Muestra la implementación]

Tú: "wait! Usa estado 400, no 409"

IA: [Ajusta la implementación]
"Corregido - usando 400 Bad Request. ¿Continuamos?"

Tú: "ㄱㄱ"

[... continúa a través de todas las tareas ...]

Tras completar:
✅ ¡Todas las tareas completadas!

Resumen:
- 8 archivos cambiados
- 3 migraciones creadas
- 2 tests añadidos

Próximos pasos:
- Ejecutar `/rapid:review` para una revisión exhaustiva (opcional)
- O `/rapid:commit` para confirmar directamente
```

### 3. Revisar Implementación (`/rapid:review`) - Opcional

```
Tú: "/rapid:review add-smart-link-duplicate-prevention"

IA ejecuta revisiones de agentes core + condicionales:

Agentes Core (siempre se ejecutan):
✅ Verificación de Código (@agent-code-verifier)
  ✓ Todas las referencias de archivos verificadas
  ✓ Sin código imaginario
  ✓ Se muestran diffs de todos los cambios

✅ Auditoría de Seguridad (@agent-security-auditor)
  ✓ RLS habilitado en la tabla smart_links
  ✓ Las políticas usan la función has_role()
  ✓ Validación de entrada presente

Agentes Condicionales (según los cambios):
⚠️  Revisión de Calidad de Código (@agent-code-reviewer)
  ✓ Seguridad de tipos mantenida
  ⚠️  Complejidad de función: Considerar extraer helper

✅ Integridad de Datos (@agent-data-integrity-guardian)
  ✓ Migración no bloqueante
  ✓ Índices en claves foráneas
  ✓ Validación de restricciones presente

⚠️  Cobertura de Pruebas (@agent-test-automator)
  ✓ Test E2E presente
  ✓ Unit tests presentes
  ⚠️  Falta caso borde: creación concurrente

Global: PASSED (3 advertencias - correcciones recomendadas)

Siguiente: /rapid:triage para revisar hallazgos individualmente
```

### 4. Clasificar Hallazgos (`/rapid:triage`) - Opcional

```
Tú: "/rapid:triage add-smart-link-duplicate-prevention"

IA presenta los hallazgos uno por uno:

┌─────────────────────────────────────────────────────────┐
│ Progreso Triage: 1/3 hallazgos | Est. 3 min restantes   │
└─────────────────────────────────────────────────────────┘

---
Hallazgo #1: Extraer Lógica de Validación Compleja

Severidad: 🟡 P2 (IMPORTANTE)
Categoría: Calidad de Código

Descripción:
La función validateSmartLink tiene una complejidad cognitiva de 15 (máx 10).
Múltiples condiciones anidadas hacen que sea difícil de entender.

Ubicación: src/lib/validation.ts:42

Solución Propuesta:
Extraer reglas de validación en funciones separadas:
- validateUrl(url)
- validateRelease(releaseId)
- checkDuplicate(link)

Esfuerzo Estimado: Medio (2 horas)

---
¿Añadir a tareas?
1. yes - añadir a tasks.md
2. next - omitir este hallazgo
3. custom - modificar antes de añadir

Tú: "yes"

IA:
✅ Añadido a tasks.md: Sección 3.1 - Extraer lógica de validación

┌─────────────────────────────────────────────────────────┐
│ Progreso Triage: 2/3 hallazgos | Est. 2 min restantes    │
│ (1 añadido, 0 omitidos)                                  │
└─────────────────────────────────────────────────────────┘

---
Hallazgo #2: Añadir prueba de caso borde faltante...

Tú: "yes"

[... continúa para todos los hallazgos ...]

╔═══════════════════════════════════════════════════════╗
║         Triage Completo - 3 Hallazgos Revisados       ║
╚═══════════════════════════════════════════════════════╝

Añadido a tasks.md (2 tareas):
  🟡 Tarea 3.1: Extraer lógica de validación
  🔵 Tarea 3.2: Añadir prueba de creación concurrente

Omitido (1 hallazgo):
  Hallazgo #3: Nombramiento de variables (estético)

Siguiente: /rapid:resolve-parallel o /rapid:apply para corregir tareas
```

### 5. Resolver Tareas en Paralelo (`/rapid:resolve-parallel`) - Opcional

```
Tú: "/rapid:resolve-parallel add-smart-link-duplicate-prevention"

IA analiza dependencias de tareas:

Encontradas 2 tareas no completadas

Analizando dependencias...
✓ Tarea 3.1: Extraer validación (independiente)
✓ Tarea 3.2: Añadir test (independiente)

Plan de Ejecución:

Ola 1 (2 tareas en paralelo):
  - Tarea 3.1: Extraer lógica de validación (2 horas)
  - Tarea 3.2: Añadir test concurrente (30 min)

Total: 2 horas (vs 2.5 horas secuencial)
Ganancia de Eficiencia: 20% más rápido

¿Continuar? (yes)

Tú: "yes"

IA:
Lanzando Ola 1 (2 tareas en paralelo)...

1. Tarea pr-comment-resolver(task_3_1)
2. Tarea pr-comment-resolver(task_3_2)

[Ambos agentes trabajan simultáneamente]

✅ Ola 1 Completa (2/2 tareas terminadas)

╔═══════════════════════════════════════════════════════╗
║               Todas las Tareas Completas - 2/2         ║
╚═══════════════════════════════════════════════════════╝

Archivos cambiados: 3 archivos
Tests: Todos pasando

Actualizado: rapidspec/changes/add-smart-link-duplicate-prevention/tasks.md

Siguiente: /rapid:commit para confirmar cambios
```

### 6. Confirmar Cambios (`/rapid:commit`)

```
Tú: "/rapid:commit add-smart-link-duplicate-prevention"

IA (@agent-task-updater):
Revisando cambios...
✓ Estado de git verificado
✓ Diff de git analizado
✓ Cambios emparejados con tareas

Archivos cambiados (8):
  Modificados: 3 archivos
  Añadidos: 5 archivos
  Total: +245 -18 líneas

Tareas completadas (5/6):
✓ 1.1 Migración de BD
✓ 1.2 Validación API
✓ 1.3 Toast de UI
✓ 2.1 Test E2E
✓ 2.2 Unit Test
⏳ 3.1 Documentación (no terminada)

Trabajo descubierto:
📝 Añadido índice en release_id (rendimiento)
📝 Extraída lógica de validación (calidad de código)

Actualizando tasks.md...
✓ Marcadas 5 tareas [x]
✓ Añadidas tareas descubiertas

Mensaje de commit:
────────────────────────────────────────
feat(smart-links): prevent duplicate links per release

Completed Tasks (5/6):
- Database Migration: unique constraint
- API Validation: 400 error handling
- UI Toast: duplicate warning
- E2E Test: duplicate.spec.ts
- Unit Test: validation.test.ts

Additional Improvements:
- Added index on release_id for performance
- Extracted validation logic to helper

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
────────────────────────────────────────

¿Listo para hacer commit? (ㄱㄱ)

Tú: "ㄱㄱ"

IA:
✓ Committed: abc1234
```

### 7. Archivar Finalización (`/rapid:archive`)

```
Tú: "/rapid:archive add-smart-link-duplicate-prevention"

IA:
1. Verifica finalización
   ✓ Todas las tareas marcadas [x]
   ✓ Tests pasando
   ✓ Confirmado en git

2. Archiva la especificación
   ✓ Movido a: archive/20251111123045-add-smart-link-duplicate-prevention/

3. Actualiza especificaciones canónicas
   ✓ Actualizado: specs/smart-links/spec.md
   ✓ Añadida documentación de lógica de prevención

¡Hecho! 🎉
```

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                     /rapid:proposal                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Investigación (auto - se ejecuta en paralelo)            │
│    - Leer base de código real (evitar "código imaginario")   │
│    - @agent-git-history-analyzer: Entender historial        │
│    - @agent-pattern-recognition-specialist: Buscar patrones  │
│                                                              │
│ 2. Investigación (auto - se ejecuta en paralelo)            │
│    - @agent-best-practices-researcher: Web + docs           │
│    - @agent-framework-docs-researcher: Docs de librería     │
│                                                              │
│ 3. Opciones (interactivo)                                   │
│    - Presentar 2-3 enfoques con pros y contras              │
│    - El usuario selecciona (1, 2, 3)                         │
│                                                              │
│ 4. Revisión de Diseño (auto - tras selección)                │
│    - @agent-database-architect: Esquema, seguridad migración │
│    - @agent-nextjs-architecture-expert: Estructura componentes│
│    - Incorporar feedback de diseño en la propuesta           │
│                                                              │
│ → Archivos creados:                                          │
│   - proposal.md, tasks.md, investigation.md, research.md     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:apply                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Leer archivos de especificación                            │
│    - proposal.md, tasks.md, investigation.md                │
│                                                              │
│ 2. Validación de Arquitectura (auto - antes de implementar)   │
│    - @agent-database-architect: Guía de implementación       │
│    - @agent-nextjs-architecture-expert: Enfoque concreto      │
│                                                              │
│ 3. Implementación (paso a paso con puntos de control)        │
│    Para cada tarea:                                          │
│      1. Mostrar qué se hará                                 │
│      2. Esperar "ㄱㄱ" (ir) o "wait!" (pausar)              │
│      3. Implementar y mostrar diff                           │
│      4. Soporte "잠깐" (espera) para cambiar dirección        │
│                                                              │
│ Tras completar todas las tareas:                             │
│   → Mostrar resumen (archivos cambiados, tests añadidos)    │
│   → Sugerir /rapid:review (opcional) o /rapid:commit       │
│                                                              │
│ → Implementación completa (sin commit)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    /rapid:review (opcional)                 │
├─────────────────────────────────────────────────────────────┤
│ Revisiones Core (siempre se ejecutan en paralelo):           │
│   - @agent-code-verifier: Verificar implementación         │
│   - @agent-security-auditor: RLS, auth, OWASP                │
│                                                              │
│ Revisiones Condicionales (según cambios):                   │
│   - @agent-code-reviewer: Calidad, tipos, patrones           │
│   - @agent-data-integrity-guardian: Consistencia de datos   │
│   - @agent-test-automator: Análisis de cobertura             │
│   - @agent-performance-oracle: Optimización de rendimiento   │
│                                                              │
│ Nota: Los agentes de arquitectura se ejecutan en /rapid:proposal│
│       y /rapid:apply (no aquí)                               │
│                                                              │
│ → Informe de revisión (Crítico/Advertencia/Info)             │
│ → Sugerir /rapid:triage para revisar hallazgos              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  /rapid:triage (opcional)                   │
├─────────────────────────────────────────────────────────────┤
│ Revisar hallazgos uno por uno:                               │
│   1. Presentar cada hallazgo con severidad e impacto         │
│   2. El usuario decide: yes/next/custom                     │
│   3. Hallazgos aceptados → Añadir a tasks.md                 │
│   4. Hallazgos omitidos → Documentar para más tarde         │
│                                                              │
│ → Hallazgos convertidos en tareas accionables                │
│ → Sugerir /rapid:resolve-parallel o /rapid:apply            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              /rapid:resolve-parallel (opcional)              │
├─────────────────────────────────────────────────────────────┤
│ Resolver múltiples tareas en paralelo:                       │
│   1. Analizar dependencias de tareas                          │
│   2. Generar plan de ejecución (diagrama Mermaid)            │
│   3. Ejecutar en olas (paralelo dentro de la ola)           │
│   4. Actualizar tasks.md tras cada ola                       │
│                                                              │
│ → Tareas completadas 30-50% más rápido que secuencial        │
│ → Sugerir /rapid:commit tras la finalización                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:commit                           │
├─────────────────────────────────────────────────────────────┤
│ Preparación del commit (@agent-task-updater):                │
│   1. Revisar estado de git y diff de git                     │
│   2. Emparejar cambios con tasks.md                          │
│   3. Marcar tareas completadas [x]                           │
│   4. Capturar trabajo descubierto                           │
│   5. Generar mensaje de commit desde las tareas              │
│   6. Crear commit con formato convencional                  │
│                                                              │
│ → Confirmado en git                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     /rapid:archive                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Verificar finalización (tareas hechas, tests pasan)       │
│ 2. Mover a archive/YYYYMMDDhhmmss-[nombre]/                 │
│    (Formato timestamp: 20251111123045)                       │
│ 3. Actualizar especificaciones canónicas con los cambios      │
│                                                              │
│ → Especificación archivada, especificaciones actualizadas     │
└─────────────────────────────────────────────────────────────┘
```

## Mejores Prácticas

### 1. Siempre Verificar Antes de Codificar
RapidSpec evita el "código imaginario" mediante:
- Lectura de archivos reales antes de sugerir cambios.
- Revisión del historial de git para obtener contexto.
- Generación de diffs antes de la implementación.

### 2. Usar Implementación Paso a Paso
Divide las características grandes en pasos pequeños y comprobables:
- Cada paso es un punto de control.
- Di "¡espera!" (wait!) para cambiar de dirección.
- No hay necesidad de prototipos desechables.

### 3. Deja que la IA Investigue
La IA hace automáticamente:
- Búsqueda de mejores prácticas (búsqueda web).
- Análisis de repositorios de referencia.
- Revisión de la documentación de las librerías.

### 4. Soporte para el Flujo "ㄱㄱ / 잠깐"
- "ㄱㄱ" (ir): Continuar al siguiente paso.
- "잠깐" (espera): Pausar y ajustar.
- Permite una iteración rápida sin necesidad de reiniciar.

## Filosofía

RapidSpec se basa en tres principios:

1. **La Especificación es la Verdad** - El código sigue a la especificación, y no al revés.
2. **Verificar, No Imaginar** - Siempre revisar el código real antes de sugerir cambios.
3. **Iteración Rápida** - Soporte para el flujo de trabajo rápido de "espera, cambia esto".

Inspirado por [OpenSpec](https://github.com/Fission-AI/OpenSpec) y [Every's Compounding Engineering](https://github.com/EveryInc/every-marketplace).

## Contribución

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

MIT © BAK Chanhee
