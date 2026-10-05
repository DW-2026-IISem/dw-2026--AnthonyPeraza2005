import { invalidIdResponse, notFoundResponse } from "../../../shared/http/swagger-security";

const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer" } }];

/**
 * Documentación OpenAPI del feature Roles.
 * Modalidad: JWT + RBAC (authenticate + authorize).
 *
 * El NOMBRE del rol no autoriza nada: la autorización se decide por las filas
 * de `resource_roles`.
 */
export const rolesSwagger = {
  tags: [{ name: "Roles", description: "CRUD de roles (agrupadores de permisos)" }],
  paths: {
    "/api/roles": {
      get: {
        tags: ["Roles"],
        summary: "Listar roles activos",
        description: "JWT + RBAC",
        responses: { "200": { description: "Lista de roles (`{ roles: [...] }`)" } },
      },
      post: {
        tags: ["Roles"],
        summary: "Crear rol",
        description: "JWT + RBAC — el rol nace sin permisos",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleCreate" } } },
        },
        responses: {
          "201": { description: "Rol creado (`{ role }`)" },
          "400": { description: "Falta `name`" },
          "409": { description: "Nombre de rol ya en uso" },
        },
      },
    },
    "/api/roles/{id}": {
      get: {
        tags: ["Roles"],
        summary: "Obtener rol por id",
        parameters: idParam,
        responses: {
          "200": { description: "Rol (`{ role }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Roles"],
        summary: "Reemplazar rol (PUT)",
        parameters: idParam,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleUpdate" } } },
        },
        responses: {
          "200": { description: "Rol actualizado (`{ role }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "Nombre de rol ya en uso" },
        },
      },
      patch: {
        tags: ["Roles"],
        summary: "Modificar rol (PATCH)",
        parameters: idParam,
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/RolePatch" } } },
        },
        responses: {
          "200": { description: "Rol actualizado (`{ role }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "Nombre de rol ya en uso" },
        },
      },
      delete: {
        tags: ["Roles"],
        summary: "Eliminar rol (físico)",
        parameters: idParam,
        responses: {
          "200": { description: "Eliminado (`{ message, id }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/roles/{id}/deactivate": {
      patch: {
        tags: ["Roles"],
        summary: "Desactivar rol (borrado lógico)",
        description:
          "Efecto inmediato: todos los usuarios de ese rol pierden sus permisos (eslabón `roles` inactivo).",
        parameters: idParam,
        responses: {
          "200": { description: "Desactivado (`{ message, role }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Role: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "PROMOTER" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "AUDITOR" },
          description: { type: "string", nullable: true, example: "Solo lectura de proyectos y auditorías" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      RoleUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      RolePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
