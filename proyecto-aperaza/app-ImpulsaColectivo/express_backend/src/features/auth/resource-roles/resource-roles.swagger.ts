import { invalidIdResponse, notFoundResponse } from "../../../shared/http/swagger-security";

const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer" } }];

/**
 * Documentación OpenAPI del feature ResourceRoles: la gestión de permisos.
 * TEMPORAL: SIN AUTH hasta ISS-21 (entonces pasa a JWT + RBAC).
 *
 * No existe una entidad `Permission`: conceder un permiso es crear (o
 * reactivar) una fila en `resource_roles`; el permiso es la tupla (rol, recurso).
 */
export const resourceRolesSwagger = {
  tags: [
    {
      name: "Concesiones rol-recurso",
      description: "Conceder / retirar / reactivar recursos a un rol: el permiso",
    },
  ],
  paths: {
    "/api/concesiones-rol": {
      get: {
        tags: ["Concesiones rol-recurso"],
        summary: "Listar concesiones activas",
        description:
          "SIN AUTH (temporal) — filtros opcionales: `?role_id=` (permisos de un rol) y " +
          "`?resource_id=` (roles que conceden un recurso).",
        parameters: [
          { name: "role_id", in: "query", required: false, schema: { type: "integer" } },
          { name: "resource_id", in: "query", required: false, schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Lista de concesiones (`{ grants: [...] }`)" } },
      },
      post: {
        tags: ["Concesiones rol-recurso"],
        summary: "Conceder recurso a rol (crear permiso)",
        description:
          "SIN AUTH (temporal) — cuerpo `{ role_id, resource_id }`. Idempotente: si la concesión " +
          "existía retirada, se reactiva. Efecto inmediato y sin despliegue.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResourceRoleCreate" } } },
        },
        responses: {
          "201": { description: "Permiso concedido (`{ message, grant }`)" },
          "400": { description: "Faltan `role_id` o `resource_id`" },
          "404": { description: "Rol o recurso inexistente o inactivo" },
          "409": { description: "El rol ya tiene concedido ese recurso" },
        },
      },
    },
    "/api/concesiones-rol/{id}": {
      get: {
        tags: ["Concesiones rol-recurso"],
        summary: "Obtener concesión por id",
        parameters: idParam,
        responses: {
          "200": { description: "Concesión (`{ grant }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/concesiones-rol/{id}/deactivate": {
      patch: {
        tags: ["Concesiones rol-recurso"],
        summary: "Retirar permiso (borrado lógico)",
        description: "Solo se pierde esa operación; el resto de permisos del rol siguen vigentes.",
        parameters: idParam,
        responses: {
          "200": { description: "Permiso retirado (`{ message, grant }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/concesiones-rol/{id}/reactivate": {
      patch: {
        tags: ["Concesiones rol-recurso"],
        summary: "Reactivar permiso",
        parameters: idParam,
        responses: {
          "200": { description: "Permiso reactivado (`{ message, grant }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "La concesión ya estaba activa" },
        },
      },
    },
  },
  components: {
    schemas: {
      ResourceRole: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          role_id: { type: "integer", example: 2 },
          resource_id: { type: "integer", example: 15 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          role: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string", example: "PROMOTER" } },
          },
          resource: {
            type: "object",
            properties: {
              id: { type: "integer" },
              method: { type: "string", example: "POST" },
              path: { type: "string", example: "/api/proyectos" },
              description: { type: "string", nullable: true, example: "Crear proyecto" },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceRoleCreate: {
        type: "object",
        required: ["role_id", "resource_id"],
        properties: {
          role_id: { type: "integer", example: 3 },
          resource_id: { type: "integer", example: 2 },
        },
      },
    },
  },
};
