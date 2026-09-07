# SDD — Especificación de dominio y diseño
## Proyecto: ImpulsaColectivo — Financiación colaborativa

**Semana 04 · Unidad 01 · Desarrollo Web y Base de Datos II · 2026-II**
**Autor:** estudiante-impulsacolectivo *(reemplaza por tu usuario de GitHub)*

---

## 1. Problema

ImpulsaColectivo es una plataforma de financiación colaborativa (crowdfunding). Los promotores publican campañas con una meta económica, recompensas y una fecha límite. Los aportantes contribuyen dinero a las campañas que les interesan. La plataforma debe:

- Registrar aportes y sus transacciones de pago.
- Confirmar la llegada efectiva de los fondos.
- Calcular la comisión de la plataforma.
- Decidir, al cierre de la campaña, si procede el desembolso al promotor o la devolución a los aportantes.
- Restringir y auditar cualquier cambio a una campaña después de haber recibido su primer aporte.

## 2. Actores

| Actor | Descripción | Rol de seguridad asociado |
|---|---|---|
| Promotor | Persona o entidad que publica y gestiona una campaña. | `PROMOTOR` |
| Aportante | Persona que contribuye dinero a una o varias campañas. | `APORTANTE` |
| Cumplimiento | Verifica que las campañas y sus cambios respeten las reglas de auditoría y restricción post-aporte. | `CUMPLIMIENTO` |
| Finanzas | Aprueba desembolsos y gestiona devoluciones. | `FINANZAS` |
| Administrador | Gestiona cuentas, roles y configuración general de la plataforma. | `ADMIN` |

> Importante: estos roles son conceptos del **subsistema de seguridad** (autorizan qué endpoints puede llamar una cuenta). Un Promotor o un Aportante, como entidades de **dominio**, pueden existir sin tener nunca una cuenta de acceso asociada (ver sección 5).

## 3. Alcance de la semana 04

**Incluye:** modelado del dominio, arquitectura por capas, contratos iniciales (DTO/API), base técnica del backend NestJS (config, common, database, logging, health, Swagger).

**No incluye (semanas siguientes):** CRUD completo con reglas de negocio, autenticación productiva, autorización RBAC completa, frontend, despliegue, pruebas de carga.

## 4. Requisitos del dominio

| ID | Requisito |
|---|---|
| RF-01 | El sistema debe permitir crear una campaña (`Proyecto`) asociada a un `Promotor`, con meta, moneda, fechas y estado. |
| RF-02 | El sistema debe permitir definir metas (`Meta`) y recompensas (`Recompensa`) dentro de una campaña. |
| RF-03 | El sistema debe permitir registrar un aporte (`Aporte`) de un `Aportante` a un `Proyecto`, opcionalmente ligado a una `Recompensa`. |
| RF-04 | El sistema debe registrar la transacción de pago (`TransaccionPago`) asociada a cada aporte y su estado. |
| RF-05 | El sistema debe calcular la comisión (`Comision`) aplicable sobre la campaña o el aporte. |
| RF-06 | El sistema debe decidir y registrar un desembolso (`Desembolso`) o una devolución (`Devolucion`) según el resultado de la campaña. |
| RF-07 | El sistema debe restringir la edición de una campaña después de recibir su primer aporte confirmado. |
| RF-08 | El sistema debe auditar (`AuditoriaProyecto`) cualquier cambio relevante sobre una campaña. |
| RNF-01 | El subsistema de seguridad (cuentas, roles, permisos) debe permanecer desacoplado del subsistema de dominio. |
| RNF-02 | El dinero se representa con precisión decimal (`numeric`), nunca con punto flotante. |
| RNF-03 | Toda tabla transaccional usa UUID como clave primaria y marcas de tiempo con zona horaria. |

## 5. Principio de separación: dominio vs. seguridad

- **Persona** (dato de negocio compartido): identidad real de quien participa — nombre, documento, contacto.
- **Promotor** / **Aportante**: perfiles de negocio que referencian a una `Persona`.
- **Cuenta** (seguridad): credenciales de acceso, con una referencia **opcional** `persona_id` (0..1) hacia `Persona`.
- Consecuencia: una persona puede existir sin cuenta; una cuenta puede no estar ligada a ninguna persona (cuentas de servicio); una misma persona puede ser Promotor y Aportante a la vez.
- El dominio nunca importa entidades de seguridad. Cuando necesita saber "quién hizo esto" (aprobó un desembolso, registró un cambio), guarda un `account_id` plano (UUID), sin relación física entre esquemas.

## 6. Modelo de dominio

### 6.1 Identidad de negocio

**Persona**
- `id` (UUID, PK)
- `tipo_documento`, `numero_documento` (únicos)
- `nombres`, `apellidos` o `razon_social`
- `email_contacto`, `telefono`
- `created_at`, `updated_at`

**Promotor**
- `id` (PK), `persona_id` (FK → Persona, único)
- `alias_publico`, `verificado` (bool), `fecha_verificacion`
- `created_at`, `updated_at`

**Aportante**
- `id` (PK), `persona_id` (FK → Persona, único)
- `created_at`, `updated_at`

### 6.2 Campañas

**Proyecto**
- `id` (PK), `promotor_id` (FK)
- `titulo`, `descripcion`, `categoria`
- `moneda`, `monto_meta` (numeric 14,2)
- `fecha_inicio`, `fecha_limite`
- `estado` (enum: `borrador`, `publicado`, `en_financiacion`, `exitoso`, `fallido`, `cancelado`)
- `bloqueado_desde` (timestamp, nulo hasta el primer aporte confirmado)
- `created_at`, `updated_at`

**Meta**
- `id` (PK), `proyecto_id` (FK)
- `descripcion`, `monto_objetivo`, `orden`, `alcanzada` (bool)

**Recompensa**
- `id` (PK), `proyecto_id` (FK)
- `titulo`, `descripcion`, `monto_minimo_aporte`
- `cupo_maximo`, `cupo_entregado`
- `created_at`, `updated_at`

### 6.3 Aportes y dinero

**Aporte**
- `id` (PK), `proyecto_id` (FK), `aportante_id` (FK), `recompensa_id` (FK, nullable)
- `monto`, `moneda`
- `estado` (enum: `pendiente`, `confirmado`, `fallido`, `reembolsado`)
- `created_at`, `updated_at`

**TransaccionPago**
- `id` (PK), `aporte_id` (FK)
- `pasarela`, `referencia_externa`
- `fecha`, `valor`, `estado`, `observaciones`

**Comision**
- `id` (PK), `proyecto_id` (FK)
- `porcentaje_aplicado`, `valor_calculado`, `fecha`, `estado`

**Desembolso**
- `id` (PK), `proyecto_id` (FK)
- `monto`, `cuenta_destino`
- `fecha_solicitud`, `fecha_pago`
- `estado` (enum: `pendiente`, `aprobado`, `pagado`, `rechazado`)
- `aprobado_por_account_id` (UUID plano, sin FK física a seguridad)

**Devolucion**
- `id` (PK), `aporte_id` (FK)
- `motivo`, `total`, `fecha`, `estado`

### 6.4 Cumplimiento

**AuditoriaProyecto** (solo `INSERT`, nunca `UPDATE`/`DELETE`)
- `id` (PK), `proyecto_id` (FK)
- `entidad_afectada`, `accion`
- `valor_anterior` (jsonb), `valor_nuevo` (jsonb)
- `realizado_por_account_id` (UUID plano)
- `fecha`

### 6.5 Subsistema de seguridad (independiente)

- **Cuenta**: `id`, `email`, `password_hash`, `is_active`, `mfa_enabled`, `last_login_at`, `persona_id` (FK opcional 0..1)
- **Rol**: `id`, `nombre` (`ADMIN`, `PROMOTOR`, `APORTANTE`, `CUMPLIMIENTO`, `FINANZAS`)
- **Permiso**: `id`, `recurso`, `accion`
- **RolPermiso** (N:M)
- **CuentaRol** (N:M)
- **RefreshToken**: `id`, `cuenta_id`, `token_hash`, `expira_en`, `revocado`

## 7. Relaciones de negocio

- Persona 1:0..1 Promotor; Persona 1:0..1 Aportante
- Promotor 1:N Proyecto
- Proyecto 1:N Meta; Proyecto 1:N Recompensa
- Aportante 1:N Aporte; Proyecto 1:N Aporte
- Aporte 0..1 Recompensa
- Aporte 1:N TransaccionPago
- Proyecto 1:N Comision; Proyecto 1:N Desembolso
- Aporte 0..N Devolucion
- Proyecto 1:N AuditoriaProyecto
- Cuenta 0..1 Persona (única FK cruzada, de seguridad hacia dominio)

## 8. Arquitectura por capas

```
src/
  core/                     # config, guards, interceptores, filtros globales
  identity/                 # SUBSISTEMA DE SEGURIDAD
    auth/                   # login, refresh, mfa
    accounts/               # Cuenta
    roles/                  # Rol, Permiso, RolPermiso, CuentaRol
  domain/                   # SUBSISTEMA DE DOMINIO
    people/                 # Persona
    promoters/              # Promotor
    backers/                # Aportante
    campaigns/              # Proyecto, Meta, Recompensa
    contributions/          # Aporte
    payments/               # TransaccionPago
    commissions/            # Comision
    disbursements/          # Desembolso
    refunds/                # Devolucion
    compliance/             # AuditoriaProyecto
  shared/                   # DTOs, value objects, decoradores comunes
```

**Responsabilidad por capa (dentro de cada módulo de dominio):**
- **Presentation**: DTO, controlador, contrato de la API.
- **Application**: casos de uso y puertos (ej. `RegistrarAporte`, `SolicitarDesembolso`).
- **Domain**: entidades y reglas de negocio (ej. "no se puede editar un proyecto tras recibir aportes").
- **Infrastructure**: adaptadores Sequelize/TypeORM, relaciones, transacciones.

**Regla de dependencia:** `domain/*` nunca importa entidades de `identity/*`. Recibe `accountId` como dato plano desde el controller. `identity/*` puede resolver `persona_id` al crear una cuenta, nunca al revés.

## 9. Contratos iniciales (DTO/API)

### POST /proyectos
**Request**
```json
{
  "promotorId": "uuid",
  "titulo": "Cocina comunitaria La Guajira",
  "descripcion": "Equipamiento para comedor comunitario",
  "categoria": "social",
  "moneda": "COP",
  "montoMeta": 8000000,
  "fechaInicio": "2026-09-10",
  "fechaLimite": "2026-11-10"
}
```
**Response 201**
```json
{
  "id": "uuid",
  "estado": "borrador",
  "createdAt": "2026-09-02T10:00:00Z"
}
```

### POST /aportes
**Request**
```json
{
  "proyectoId": "uuid",
  "aportanteId": "uuid",
  "recompensaId": "uuid | null",
  "monto": 50000,
  "moneda": "COP"
}
```
**Response 201**
```json
{
  "id": "uuid",
  "estado": "pendiente",
  "createdAt": "2026-09-02T10:05:00Z"
}
```

### POST /desembolsos
**Request**
```json
{
  "proyectoId": "uuid",
  "monto": 7500000,
  "cuentaDestino": "encriptado o referencia externa"
}
```
**Response 201**
```json
{
  "id": "uuid",
  "estado": "pendiente"
}
```

### POST /devoluciones
**Request**
```json
{
  "aporteId": "uuid",
  "motivo": "campaña fallida"
}
```
**Response 201**
```json
{
  "id": "uuid",
  "estado": "pendiente",
  "total": 50000
}
```

## 10. RBAC aplicado

| Recurso : acción | Rol autorizado |
|---|---|
| `proyectos:create/update/publish` | `PROMOTOR` (solo sobre proyectos propios) o `ADMIN` |
| `aportes:create` | `APORTANTE` |
| `desembolsos:approve` | `FINANZAS` |
| `devoluciones:create` | `FINANZAS` o `CUMPLIMIENTO` |
| `auditoria:read` | `CUMPLIMIENTO` o `ADMIN` |

La comprobación de acceso combina dos pasos: (1) guard de rol/permiso (seguridad), (2) regla de pertenencia en el servicio de dominio (¿el `promotor_id` del proyecto corresponde a la persona vinculada a esta cuenta?).

## 11. Base técnica del backend (semana 04)

- `core/config`: variables de entorno (`DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, JWT).
- `core/common`: filtros de excepción, interceptores de respuesta, decoradores.
- `core/database`: conexión Sequelize/TypeORM (sin migraciones de dominio todavía).
- `core/logging`: logger estructurado.
- `core/health`: endpoint `/health`.
- `core/swagger`: documentación OpenAPI accesible en `/docs`.

## 12. Historial de decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-09-02 | Separar `Persona`/`Promotor`/`Aportante` de `Cuenta`/`Rol` | Evitar acoplar identidad de negocio con acceso; permitir personas sin cuenta y cuentas de servicio. |
| 2026-09-02 | `AuditoriaProyecto` como tabla append-only | Cumplir el requisito de auditoría inmutable tras el primer aporte. |
