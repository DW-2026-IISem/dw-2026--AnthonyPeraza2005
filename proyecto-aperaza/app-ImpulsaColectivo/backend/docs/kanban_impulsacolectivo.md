# KANBAN — ImpulsaColectivo
## Semana 04 · Desarrollo Web y Base de Datos II · 2026-II

**Responsable:** estudiante-impulsacolectivo *(reemplaza por tu usuario de GitHub)*
**Política del tablero:** WIP = 1 por estudiante — solo una Issue en «En desarrollo» a la vez. «Bloqueado» es un indicador visible sobre la tarjeta, no una columna.

---

## Columnas y políticas

| Columna | Significado | Política de entrada / salida |
|---|---|---|
| Por especificar | Necesidad vinculada a un resultado de aprendizaje. | Sale al completar la especificación SDD. |
| Especificada | OBJ/SPEC/REQ/AC y fuentes definidos. | Sale con aprobación docente (DoR) para iniciar. |
| En desarrollo | Unidad de trabajo dentro del WIP acordado. | Sale con cambio versionado, prueba y evidencia. |
| En revisión humana | Entrega presentada con evidencia. | Sale sin hallazgos bloqueantes. |
| En ajustes | Hallazgos registrados en la revisión. | Sale con correcciones trazables y verificación superada. |
| Aceptada/Evidenciada | Criterios de finalización (DoD) cumplidos. | Evidencia vinculada y decisión de cierre. |

---

## Tablero — Semana 04

### Por especificar
- [ ] **#03** — Definir arquitectura por capas
- [ ] **#04** — Definir contratos (DTO/API)
- [ ] **#06** — Actualizar `docs/sdd.md` y `docs/kanban.md`

### Especificada
- [ ] **#01** — Documentar problema, actores y requisitos del dominio de ImpulsaColectivo
- [ ] **#02** — Modelar dominio (Persona, Promotor, Aportante, Proyecto, Meta, Recompensa, Aporte, TransaccionPago, Comision, Desembolso, Devolucion, AuditoriaProyecto)
- [ ] **#05** — Crear base del backend NestJS (config, common, database, logging, health, Swagger)

### En desarrollo
*(vacío — máximo 1 issue aquí a la vez)*

### En revisión humana
*(vacío)*

### En ajustes
*(vacío)*

### Aceptada/Evidenciada
*(vacío)*

---

## Detalle de issues

### #01 — Documentar problema, actores y requisitos del dominio
- **REQ:** REQ-S04-01
- **DoR (entrada):** Proyecto asignado (S01)
- **DoD (salida):** `docs/sdd.md` con secciones 1-4 completas (problema, actores, alcance, requisitos)
- **Responsable:** estudiante-impulsacolectivo
- **Bloqueado:** No
- **Motivo/acción:** Proyecto asignado (S01)

### #02 — Modelar dominio: entidades, relaciones y agregado
- **REQ:** REQ-S04-02
- **DoR (entrada):** Requisitos definidos (#01)
- **DoD (salida):** Diagrama de dominio + `docs/sdd.md` secciones 5-7 (separación identidad/seguridad, modelo, relaciones)
- **Responsable:** estudiante-impulsacolectivo
- **Bloqueado:** No
- **Motivo/acción:** Depende de #01

### #03 — Definir arquitectura por capas
- **REQ:** REQ-S04-03
- **DoR (entrada):** Modelo de dominio (#02)
- **DoD (salida):** Diagrama de arquitectura + `docs/sdd.md` sección 8
- **Responsable:** estudiante-impulsacolectivo
- **Bloqueado:** No
- **Motivo/acción:** Depende de #02

### #04 — Definir contratos (DTO/API)
- **REQ:** REQ-S04-04
- **DoR (entrada):** Modelo de dominio (#02)
- **DoD (salida):** Contratos documentados en `docs/sdd.md` sección 9 (proyectos, aportes, desembolsos, devoluciones)
- **Responsable:** estudiante-impulsacolectivo
- **Bloqueado:** No
- **Motivo/acción:** Depende de #02

### #05 — Crear base del backend NestJS
- **REQ:** REQ-S04-05
- **DoR (entrada):** Node LTS + npm verificado (S03)
- **DoD (salida):** Backend arranca; `/health` responde; Swagger accesible en `/docs`
- **Responsable:** estudiante-impulsacolectivo
- **Bloqueado:** No
- **Motivo/acción:** Node LTS verificado

### #06 — Actualizar docs/sdd.md y docs/kanban.md
- **REQ:** REQ-S04-06
- **DoR (entrada):** #01–#05 completados
- **DoD (salida):** SDD y Kanban reflejan OBJ/SPEC/REQ/AC/Issues con trazabilidad completa
- **Responsable:** estudiante-impulsacolectivo
- **Bloqueado:** No
- **Motivo/acción:** Depende de #01–#05

---

## Ruta crítica

```
#01 (dominio/requisitos)
  └─→ #02 (modelo de dominio)
         ├─→ #03 (arquitectura)   ─┐
         └─→ #04 (contratos)       ├─→ #06 (docs) ─→ GATE-S04
#05 (backend base, en paralelo, requiere Node de S03) ─┘
```

## Bloqueos y riesgos (registrar aquí si aparecen)

| Bloqueo / riesgo | Plan alterno | Estado |
|---|---|---|
| No se comprende el dominio de ImpulsaColectivo (campañas, aportes, desembolsos) | Releer la narrativa del proyecto y resolver dudas con el docente/IA al inicio. | No activo |
| Base de código previa inexistente | Definir primero arquitectura y contratos antes de implementar. | No activo |
| NestJS no arranca por configuraciones | Verificar Node/npm, dependencias y documentar en bitácora. | No activo |
| Conexión remota a BD pendiente | Se aborda en semana 5; esta semana solo se deja config/database listos. | No activo |
| Confusión entre Persona/Promotor/Aportante y Cuenta/Rol | Modelar ambas por separado desde el inicio (`persona_id` opcional en `Cuenta`). | No activo |
