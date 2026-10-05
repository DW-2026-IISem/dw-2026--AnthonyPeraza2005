import {
  bearerSecurity,
  bearerSecurityScheme,
  forbiddenResponse,
  openSecurity,
  unauthorizedResponse,
} from "../shared/http/swagger-security";

/**
 * Aplica el modelo de acceso de ImpulsaColectivo al documento OpenAPI ya armado.
 *
 * Las tres modalidades se clasifican por ruta:
 *
 * | Modalidad  | Rutas | `security` | Respuestas añadidas |
 * |------------|-------|------------|---------------------|
 * | OPEN       | `/api/sesion/login`, `/refresh`, `/logout` | `[]` | — |
 * | JWT        | `/api/sesion/perfil`, `/api/permisos`, `/api/sesiones*` | `bearerAuth` | 401 |
 * | JWT + RBAC | todo lo demás (negocio y administración de seguridad) | `bearerAuth` | 401 y 403 |
 *
 * Es idempotente y no sobrescribe respuestas que una operación ya documente.
 */
const OPEN_PATHS = new Set(["/api/sesion/login", "/api/sesion/refresh", "/api/sesion/logout"]);
const METHODS = ["get", "post", "put", "patch", "delete"];

const isJwtOnly = (path: string): boolean =>
  path === "/api/sesion/perfil" ||
  path === "/api/permisos" ||
  path === "/api/sesiones" ||
  path.startsWith("/api/sesiones/");

const ACCESS_DESCRIPTION = [
  "API de **ImpulsaColectivo** (plataforma de crowdfunding) — Express + Sequelize con **Auth y RBAC**.",
  "",
  "**Las tres modalidades de acceso** (se declaran por operación, no globalmente):",
  "",
  "- **OPEN** — sin identidad previa: `POST /api/sesion/login`, `/refresh`, `/logout`.",
  "- **JWT** — token de acceso válido: `/api/sesion/perfil`, `/api/permisos`, `/api/sesiones/*`.",
  "- **JWT + RBAC** — token válido **y** concesión activa de `(method, path)`: todo el CRUD de negocio y de administración de seguridad.",
  "",
  "Autenticación: obtén el `access_token` en `POST /api/sesion/login` y pulsa **Authorize** con " +
    "`Bearer <access_token>`. La autorización aplica **deny by default**: sin concesión explícita, 403.",
  "",
  "Credenciales de laboratorio: `admin / Admin123!` (ADMIN), `promoter / Promoter123!` (PROMOTER) " +
    "y `contributor / Contributor123!` (CONTRIBUTOR).",
].join("\n");

export function applyAccessModel<T extends object>(document: T): T {
  // El documento se manipula de forma estructural: `any` evita tipar todo OpenAPI.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as Record<string, any>;

  doc.components = doc.components ?? {};
  doc.components.securitySchemes = {
    ...(doc.components.securitySchemes ?? {}),
    ...bearerSecurityScheme,
  };

  // Postura *secure by default*: toda operación exige el token salvo que declare lo contrario.
  doc.security = bearerSecurity;
  doc.info = { ...(doc.info ?? {}), description: ACCESS_DESCRIPTION };

  for (const [path, item] of Object.entries<Record<string, any>>(doc.paths ?? {})) {
    for (const method of METHODS) {
      const operation = item[method];
      if (!operation) continue;

      if (OPEN_PATHS.has(path)) {
        operation.security = openSecurity;
        continue;
      }

      operation.security = bearerSecurity;
      operation.responses = operation.responses ?? {};
      operation.responses["401"] = operation.responses["401"] ?? unauthorizedResponse;
      if (!isJwtOnly(path)) {
        operation.responses["403"] = operation.responses["403"] ?? forbiddenResponse;
      }
    }
  }

  return document;
}
