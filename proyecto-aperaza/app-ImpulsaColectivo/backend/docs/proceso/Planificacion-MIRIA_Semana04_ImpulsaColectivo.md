# PLANIFICACIÓN METODOLÓGICA — SEMANA 04
## Proyecto: ImpulsaColectivo — Financiación colaborativa



## 1. Identificación y temas de la semana — Momento 1 · Alineación

Actualmente, la gestión de proyectos de financiación colaborativa requiere controlar diferentes procesos relacionados con la publicación de campañas, el establecimiento de metas y recompensas, el registro de aportes, las transacciones de pago y el manejo de los fondos obtenidos.

El proyecto **ImpulsaColectivo** busca solucionar la necesidad de contar con una plataforma que permita centralizar y organizar estos procesos, facilitando la participación de los promotores y aportantes y permitiendo llevar un control sobre las operaciones financieras de cada proyecto.

Uno de los principales problemas identificados es la necesidad de determinar correctamente qué ocurre con los fondos recaudados. Dependiendo del cumplimiento de las condiciones de financiación, el sistema debe permitir decidir si corresponde realizar un **desembolso** o una **devolución** de los aportes.

Además, cuando un proyecto ya ha recibido aportes, los cambios posteriores sobre la campaña deben estar restringidos y quedar registrados mediante un mecanismo de **auditoría**, con el fin de mantener un control sobre las modificaciones realizadas.

Por lo tanto, se identifica la necesidad de desarrollar un sistema que permita gestionar de manera organizada y trazable el ciclo de financiación de un proyecto, desde su publicación y recepción de aportes hasta el procesamiento de pagos, comisiones, desembolsos o devoluciones.

**Lectura del contexto del proyecto asignado:**

¿Qué viene construido de las semanas anteriores? — WSL 2, repositorio, tablero Kanban, especificación inicial, laboratorio de 4 motores (S02) y toolchain Python/Node/DBeaver con script de comprobación (S03).

¿Qué limitaciones o condiciones reales existen? — El proyecto inicia sin una base de código previa; hay que definir arquitectura y contratos antes de implementar; las BD de Docker se consumen por conexión remota; requiere decidir la estructura de carpetas y configuraciones. Además, **el dominio de negocio y el subsistema de seguridad deben permanecer separados**: una persona (Promotor, Aportante) no equivale automáticamente a una cuenta de acceso.

¿Qué NO conviene incluir esta semana? — CRUD completo con reglas de negocio, autenticación productiva, autorización RBAC completa, frontend/interfaz (semanas 10+), despliegue ni pruebas de carga. Esta semana se sientan los fundamentos: dominio, arquitectura y base del backend.

---

## 2. Objetivo semanal — OBJ-S04 (Momento 1 · Alineación)

**OBJ-S04:** Al finalizar la semana, el estudiante comprende el dominio y la arquitectura de **ImpulsaColectivo** (problema, actores, requisitos, entidades y relaciones), define la arquitectura por capas, establece los contratos (DTO/API) y deja la base del backend NestJS (config, common, database, logging, health, Swagger) lista para construir durante la clase una primera rebanada vertical funcional y continuar su integración en las semanas siguientes.

---

## 3. Resultados esperados — Momento 2 · Especificación SDD


| ID | Resultado esperado (descompone OBJ-SNN) |
|---|---|
| **R-S04-01** | Problema, actores y requisitos del dominio de **ImpulsaColectivo** identificados y documentados, incluyendo PROMOTOR, APORTANTE, ADMIN, CUMPLIMIENTO y FINANZAS. |
| **R-S04-02** | Modelo de dominio de **ImpulsaColectivo** definido y diagramado, incluyendo las entidades Promotor, Aportante, Proyecto, Meta, Recompensa, Aporte, TransaccionPago, Comision, Desembolso, Devolucion y AuditoriaProyecto, junto con sus relaciones y agregados principales. |
| **R-S04-03** | Arquitectura por capas de **ImpulsaColectivo** definida, separando las capas de Presentation, Application, Domain e Infrastructure para organizar la lógica de proyectos, aportes, pagos, cumplimiento, desembolsos y devoluciones. |
| **R-S04-04** | Contratos iniciales de la API y DTO definidos y documentados para las principales operaciones del sistema, incluyendo la creación de proyectos, registro de aportes, gestión de desembolsos y gestión de devoluciones. |
| **R-S04-05** | Base del backend **NestJS** de ImpulsaColectivo creada y configurada, incluyendo configuración del proyecto, módulos comunes, conexión y configuración de base de datos, logging, health check y documentación mediante Swagger. |
| **R-S04-06** | Documentación del proyecto actualizada mediante **docs/sdd.md** y **docs/kanban.md**, incluyendo el problema, objetivos, actores, modelo de dominio, arquitectura, contratos iniciales, tareas de desarrollo y seguimiento del proyecto. |

## 4. SPEC semanal — SPEC-S04 y requisitos (Momento 2 · Especificación SDD)

**SPEC-S04 (estudiante-impulsacolectivo):** modelar el dominio **ImpulsaColectivo** (promotores, aportantes, campañas/proyectos con metas y recompensas, aportes, transacciones de pago, comisión, desembolso o devolución, y auditoría, con RBAC transversal manteniendo la identidad de negocio separada de la cuenta de acceso), definir la arquitectura cliente-servidor y por capas (presentation/application/domain/infrastructure), establecer los contratos iniciales y crear la base del backend NestJS (config, common, database, logging, health y Swagger) sin frontend. Todo queda documentado en `docs/sdd.md` y `docs/kanban.md`.

**Requisitos derivados:**

| ID | Requisito |
|---|---|
| REQ-S04-01 | Problema, actores y requisitos del dominio documentados (`docs/sdd.md`). |
| REQ-S04-02 | Modelo de dominio con entidades y relaciones definido y diagramado. |
| REQ-S04-03 | Arquitectura por capas definida y explicada (presentation/application/domain/infrastructure). |
| REQ-S04-04 | Contratos (DTO/API) iniciales definidos y documentados. |
| REQ-S04-05 | Base del backend NestJS operativa: config, common, database, logging, health, Swagger. |
| REQ-S04-06 | `docs/sdd.md` y `docs/kanban.md` del proyecto actualizados con trazabilidad. |

---

## 5. Criterios de aceptación y evidencia esperada (Momento 2 · Especificación SDD)

| ID | Criterio de aceptación | Evidencia |
|---|---|---|
| AC-S04-01 | Documento con problema, actores y requisitos del dominio de ImpulsaColectivo. | EVI-S04-01 (docs/sdd.md) |
| AC-S04-02 | Diagrama del modelo de dominio (entidades, relaciones, agregado). | EVI-S04-02 (diagrama) |
| AC-S04-03 | Diagrama de arquitectura por capas con responsabilidades. | EVI-S04-03 (diagrama) |
| AC-S04-04 | Contratos definidos (DTO/API) con ejemplo de request/response. | EVI-S04-04 (docs/contratos) |
| AC-S04-05 | Backend NestJS arranca; `/health` responde; Swagger accesible. | EVI-S04-05 (captura + /health) |
| AC-S04-06 | `docs/sdd.md` y `docs/kanban.md` reflejan OBJ/SPEC/REQ/AC/Issues. | EVI-S04-06 (archivos) |

*Criterios de calidad comunes: dominio y arquitectura expresados en el lenguaje del proyecto (campañas, aportes, desembolsos); capas con responsabilidades claras; contratos consistentes con el modelo de dominio; identidad de negocio (Persona/Promotor/Aportante) separada de la cuenta de acceso (Cuenta/Rol); backend arranca en WSL sin Docker para el framework; secretos excluidos; evidencia legible y trazable.*

---

## 6. Matriz de trazabilidad (Momento 2 · Especificación SDD)

| OBJ | SPEC | REQ | AC | Issue | Evidencia |
|---|---|---|---|---|---|
| OBJ-S04 | SPEC-S04 | REQ-S04-01 | AC-S04-01 | #01 | EVI-S04-01 |
| OBJ-S04 | SPEC-S04 | REQ-S04-02 | AC-S04-02 | #02 | EVI-S04-02 |
| OBJ-S04 | SPEC-S04 | REQ-S04-03 | AC-S04-03 | #03 | EVI-S04-03 |
| OBJ-S04 | SPEC-S04 | REQ-S04-04 | AC-S04-04 | #04 | EVI-S04-04 |
| OBJ-S04 | SPEC-S04 | REQ-S04-05 | AC-S04-05 | #05 | EVI-S04-05 |
| OBJ-S04 | SPEC-S04 | REQ-S04-06 | AC-S04-06 | #06 | EVI-S04-06 |

---

## 7. Issues de la semana — Momento 3 · Organización Kanban

| Issue | Descripción | REQ | DoR (entrada) | DoD (salida) |
|---|---|---|---|---|
| #01 | Documentar problema, actores y requisitos del dominio de ImpulsaColectivo | REQ-01 | Proyecto asignado (S01) | `docs/sdd.md` con dominio |
| #02 | Modelar dominio: Persona, Promotor, Aportante, Proyecto, Meta, Recompensa, Aporte, TransaccionPago, Comision, Desembolso, Devolucion, AuditoriaProyecto | REQ-02 | Requisitos definidos (#01) | Diagrama de dominio |
| #03 | Definir arquitectura por capas | REQ-03 | Modelo de dominio (#02) | Diagrama de arquitectura |
| #04 | Definir contratos (DTO/API) | REQ-04 | Modelo de dominio (#02) | Contratos documentados |
| #05 | Crear base del backend NestJS | REQ-05 | Node LTS + npm (S03) | Backend arranca + `/health` |
| #06 | Actualizar `docs/sdd.md` y `docs/kanban.md` | REQ-06 | #01–#05 | SDD + Kanban trazables |

---

## 8. Dependencias entre Issues — Momento 3 · Organización Kanban

**Ruta crítica o secuencia mínima:** #01 (dominio/requisitos) → #02 (modelo) → #03 (arquitectura) y #04 (contratos) en paralelo; #05 (backend base) requiere Node de S03; #06 (docs) depende de #01–#05. Todo converge en GATE-S04.

**Bloqueos / riesgos principales y plan alterno:**

| Bloqueo / riesgo | Plan alterno |
|---|---|
| No se comprende el dominio de ImpulsaColectivo (campañas, aportes, desembolsos) | Releer la narrativa del proyecto y resolver dudas con el docente/IA al inicio. |
| Base de código previa inexistente | Definir primero arquitectura y contratos antes de implementar. |
| NestJS no arranca por configuraciones | Verificar Node/npm, dependencias y documentar en bitácora. |
| Conexión remota a BD pendiente | Se aborda en semana 5; esta semana solo se deja config/database listos. |
| Confusión entre entidad de negocio (Persona/Promotor/Aportante) y cuenta de acceso (Cuenta) | Modelar ambas por separado desde el inicio, con `persona_id` opcional en `Cuenta`. |

---

## 9. Kanban semanal — Momento 3 · Organización Kanban

Política del tablero: **WIP = 1** por estudiante: solo una Issue en «En desarrollo». «Bloqueado» es un indicador visible sobre una tarjeta, no una columna.

| Columna | Significado | Política de entrada / salida |
|---|---|---|
| Por especificar | Necesidad vinculada a un resultado de aprendizaje. | Sale al completar la especificación SDD. |
| Especificada | OBJ/SPEC/REQ/AC y fuentes definidos. | Sale con aprobación docente (DoR) para iniciar. |
| En desarrollo | Unidad de trabajo dentro del WIP acordado. | Sale con cambio versionado, prueba y evidencia. |
| En revisión humana | Entrega presentada con evidencia. | Sale sin hallazgos bloqueantes. |
| En ajustes | Hallazgos registrados en la revisión. | Sale con correcciones trazables y verificación superada. |
| Aceptada/Evidenciada | Criterios de finalización (DoD) cumplidos. | Evidencia vinculada y decisión de cierre. |

| Issue | Columna inicial | Responsable | Bloqueado | Motivo / acción |
|---|---|---|---|---|
| #01 | Especificada | estudiante-impulsacolectivo | No | Proyecto asignado (S01) |
| #02 | Especificada | estudiante-impulsacolectivo | No | Depende de #01 |
| #03 | Por especificar | estudiante-impulsacolectivo | No | Depende de #02 |
| #04 | Por especificar | estudiante-impulsacolectivo | No | Depende de #02 |
| #05 | Especificada | estudiante-impulsacolectivo | No | Node LTS verificado |
| #06 | Por especificar | estudiante-impulsacolectivo | No | Depende de #01–#05 |

---

## 10. Plan de los momentos académicos — Guion (Momento 3 · Organización Kanban)

| Bloque | Duración aprox. | Momento MIRIA | Actividad |
|---|---|---|---|
| Apertura | 10 min | 1 | Recapitular S03; presentar OBJ-S04 y AC. |
| Dominio y requisitos | 40 min | 1–2 | Problema, actores y requisitos de ImpulsaColectivo. |
| Modelo de dominio | 40 min | 2–4 | Entidades, relaciones y agregado; diagrama. |
| Arquitectura por capas | 30 min | 3–4 | Capas y responsabilidades; contratos. |
| Base backend NestJS | 50 min | 4 | config, common, database, logging, health, Swagger. |
| Cierre | 20 min | 5–6 | SDD/Kanban, evidencias y GATE-S04 preliminar. |

**Distribución del trabajo del estudiante (Antes / Durante / Después):**

| Momento académico | Qué hace el estudiante | Dónde se registra y controla |
|---|---|---|
| ANTES de clase (M1-M3) | Prepara la semana: OBJ, SPEC, REQ, AC, Issues y tablero Kanban. | GitHub personal (`docs/sdd.md`, `docs/kanban.md`). |
| DURANTE la clase (M4) | Ejecuta las fases con apoyo responsable de IA; verifica y documenta. | GitHub personal (código + `docs/proceso.md`). |
| DESPUÉS de clase (M5-M6) | Verifica evidencias, reflexiona y cierra el Gate. Es trabajo FUERA de clase. | GitHub personal (`evidencias/` + commit de cierre). Sincroniza Kanban con SDD y actualiza en Akumaja/Moodle Uniguajira. |

*Trabajo FUERA de clase con seguimiento y control: sube a tu GitHub personal el código, la metodología MIRIA aplicada (sdd, kanban, proceso) y las evidencias, con un commit por cada Issue. Actualiza también la actividad en Akumaja/Moodle Uniguajira. Se excluyen secretos (`.env`). El docente verifica trazabilidad OBJ→SPEC→REQ→AC→Issue→EVI→Gate.*

---

## 11. Investigación con IA y Web — Momento 4 · Desarrollo con IA

Uso responsable: la IA orienta la formulación de hipótesis y comandos, pero el estudiante ejecuta, verifica y documenta.

| Pregunta / necesidad | Fuente autorizada preferente | Verificación esperada |
|---|---|---|
| ¿Cómo modelar el dominio de una plataforma de financiación colaborativa (DDD)? | Documentación oficial / libros recomendados | Diagrama de entidades y relaciones |
| ¿Cómo estructurar una arquitectura por capas en NestJS? | Documentación oficial NestJS | Diagrama de capas |
| ¿Qué es un contrato/DTO y cómo definirlo para `Aporte`, `Desembolso`, `Devolucion`? | Documentación oficial NestJS/OpenAPI | Contratos definidos |
| ¿Cómo configurar Swagger en NestJS? | Documentación oficial NestJS (Swagger) | Swagger accesible |
| ¿Cómo separar identidad de negocio (Persona) de cuenta de acceso (Cuenta) en el modelo de datos? | Documentación oficial / patrones DDD | Modelo con `persona_id` opcional en `Cuenta` |

*Contraste IA/Web: ante discrepancias, prevalece la fuente oficial; toda decisión se registra en `docs/proceso.md`.*

---

## 12. Bitácora técnica — docs/proceso.md (Momento 4 · Desarrollo con IA y registro de decisiones)

La bitácora conserva la historia mínima reproducible y el registro de decisiones.

| Entrada | Contenido mínimo |
|---|---|
| Contexto | Fecha, autor, Issue, REQ/AC que se demuestra. |
| Comando / acción | Comando reproducible y salida relevante. |
| Decisión | Qué se decidió y por qué (incluye IA utilizada). |
| Bloqueo | Causa, responsable de seguimiento y próxima acción. |
| Evidencia | Enlace relativo a la carpeta de evidencias. |

---

## 13. Evidencias — Momento 5 · Verificación

Ubicación raíz de evidencias: `evidencias/semana-04/` (subcarpetas `evi-s04-XX`).

| ID | AC que demuestra | Evidencia esperada |
|---|---|---|
| EVI-S04-01 | AC-S04-01 | Problema, actores y requisitos del dominio |
| EVI-S04-02 | AC-S04-02 | Diagrama del modelo de dominio |
| EVI-S04-03 | AC-S04-03 | Diagrama de arquitectura por capas |
| EVI-S04-04 | AC-S04-04 | Contratos (DTO/API) definidos |
| EVI-S04-05 | AC-S04-05 | Backend arranca; `/health` y Swagger |
| EVI-S04-06 | AC-S04-06 | `docs/sdd.md` y `docs/kanban.md` actualizados |

---

## 14. Gate semanal — GATE-S04 (Momento 6 · Reflexión)

**Pregunta conductora:** ¿comprendo el dominio y la arquitectura de ImpulsaColectivo, y dejo la rebanada funcional del backend NestJS arrancando: dominio, aplicación, Sequelize, API, JWT/RBAC, integración y pruebas, sin frontend?

| Criterio de decisión | Condición |
|---|---|
| Aprobado | Los 6 AC evidenciados y verificables. |
| Aprobado con acciones | AC parciales; acciones claras antes de S05. |
| No aprobado | Sin dominio/arquitectura definidos ni backend base. |

---

## 15. Gate Learning (Momento 6 · Reflexión)

| Dimensión | Pregunta de comprobación |
|---|---|
| Comprensión | ¿Puedo explicar el problema, actores y requisitos de ImpulsaColectivo? |
| Diseño | ¿Explico la arquitectura por capas y por qué así? |
| Diagnóstico | ¿Identifico por qué el backend no arranca o el Swagger no carga? |
| Transferencia | ¿Aplico el modelado de dominio y la separación identidad/seguridad a mi proyecto? |

---

## 16. Retrospectiva semanal (Momento 6 · Reflexión)

| Pregunta | Registro |
|---|---|
| ¿Qué funcionó bien? | … |
| ¿Qué se puede mejorar? | … |
| ¿Qué bloqueo requiere seguimiento? | … |
| ¿Qué se lleva a la semana siguiente? | … |

---

## 17. Seguimiento docente y acciones posteriores (Momento 6 · Reflexión)

| Estudiante / equipo | AC evidenciados | Pendiente | Acción para la semana siguiente |
|---|---|---|---|
| estudiante-impulsacolectivo | … | … | … |

---

## 18. Checklist de cierre semanal (Momento 6 · Reflexión)

- [ ] Problema, actores y requisitos de ImpulsaColectivo documentados.
- [ ] Modelo de dominio diagramado (incluye separación Persona/Promotor/Aportante vs Cuenta/Rol).
- [ ] Arquitectura por capas definida.
- [ ] Contratos (DTO/API) definidos.
- [ ] Backend NestJS arranca; `/health` y Swagger accesibles.
- [ ] `docs/sdd.md` y `docs/kanban.md` actualizados.
- [ ] Evidencias EVI-S04-01…06 enlazadas.
- [ ] GATE-S04, Gate Learning y retrospectiva diligenciados.

**Estado final de la semana:** PLAN LISTO PARA EJECUCIÓN — el cierre académico y GATE-S04 quedan pendientes hasta observar evidencias reales.

---

## 19. Elementos del proyecto ImpulsaColectivo

| Elemento | Definición para ImpulsaColectivo |
|---|---|
| Narrativa | ImpulsaColectivo publica campañas de financiación con metas, recompensas y fechas límite; registra aportes y pagos, confirma fondos, calcula comisión y decide desembolso o devolución; los cambios post-aporte quedan restringidos y auditados. |
| Dominio | Persona, Promotor, Aportante, Proyecto, Meta, Recompensa, Aporte, TransaccionPago, Comision, Desembolso, Devolucion, AuditoriaProyecto + RBAC (Cuenta, Rol, Permiso) |
| Arquitectura | Capas: presentation/application/domain/infrastructure, con `identity/` y `domain/` como bounded contexts separados |
| Backend | Base NestJS: config, common, database, logging, health, Swagger |
| Contratos | DTO/API de ImpulsaColectivo (crear proyecto, registrar aporte, confirmar pago, solicitar desembolso, registrar devolución) |
| Evidencias | EVI-S04-01…06 (ImpulsaColectivo) |
| Autor / referencia | estudiante-impulsacolectivo |

---

## 20. Preparación para la construcción funcional en clase

Antes de la sesión, llega con el proyecto ImpulsaColectivo identificado. La preparación no consiste en programar un CRUD aislado: deja listos el mapa de dominio, la SDD, el tablero y los datos de conexión para poder construir y verificar una capacidad integrada durante la clase.

| Orden | Preparación obligatoria | Salida antes de clase |
|---|---|---|
| 1 | Identificar el proyecto, actores (Promotor, Aportante, roles de Finanzas/Cumplimiento), entidades de negocio, relaciones y roles. | Mapa de dominio de ImpulsaColectivo. |
| 2 | Definir la capacidad que conectará varias entidades y su resultado observable (ej. "un aportante registra un aporte, se confirma el pago y se calcula la comisión"). | OBJ, SPEC, REQ y AC de una rebanada funcional. |
| 3 | Crear Issues dependientes para base, dominio, aplicación, Sequelize, API, seguridad, integración y pruebas. | Kanban con WIP=1, DoR, DoD y pruebas previstas. |
| 4 | Verificar WSL, Node, repositorio, motor Docker y acceso remoto por IP. | Registro técnico sin secretos. |
| 5 | Preparar `.env.example` con `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME` y variables JWT. | Configuración reproducible; `.env` queda local y excluido. |

---

## 21. Acuerdo de alcance entre los tres momentos académicos

| Momento | Responsabilidad | Resultado conectado |
|---|---|---|
| Antes de clase | Alinear, especificar y organizar; llegar con el diseño completo del dominio y del flujo. | SDD, mapa, contratos iniciales y Kanban. |
| Durante la clase | Resolver con el docente el proyecto completo en diseño y código, construyendo por capas e integrando la primera rebanada ejecutable. | Backend NestJS + Sequelize, entidades, casos de uso, API, JWT/RBAC, aportes, comisión y pruebas. |
| Después de clase | Repetir, verificar y mejorar en el proyecto asignado; documentar evidencias y cerrar hallazgos. | Actividad autónoma resuelta, pruebas, rollback, Gate y reflexión. |

**Mapa mínimo de ImpulsaColectivo para preparar la clase:** `Persona`, `Promotor`, `Aportante`, `Proyecto`, `Meta`, `Recompensa`, `Aporte`, `TransaccionPago`, `Comision`, `Desembolso`, `Devolucion`, `AuditoriaProyecto`, `Cuenta`, `Rol`, `Permiso`, `RolPermiso`, `CuentaRol`, `RefreshToken`. La capacidad integrada debe relacionar promotor, campaña, aporte, pago, comisión, desembolso/devolución, identidad y autorización; no se prepara una colección de CRUD independientes.

**Convención de implementación que se aplicará durante la clase:** cada proceso se resolverá en Domain (reglas, ej. "no se puede modificar un proyecto tras recibir aportes"), Application (casos de uso y puertos, ej. `RegistrarAporte`, `SolicitarDesembolso`) y Presentation (DTO, controlador y contrato), mientras Infrastructure/Sequelize implementará los adaptadores, relaciones y transacciones. Esta separación se repetirá para `Persona`, `Promotor`, `Aportante`, `Proyecto`, `Meta`, `Recompensa`, `Aporte`, `TransaccionPago`, `Comision`, `Desembolso`, `Devolucion`, `AuditoriaProyecto`, `Cuenta`, `Rol`, `Permiso`, `RolPermiso`, `CuentaRol` y `RefreshToken`.
