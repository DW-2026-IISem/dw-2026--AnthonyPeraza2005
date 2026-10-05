import { invalidIdResponse, notFoundResponse } from "../../../shared/http/swagger-security";

const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer" } }];

/**
 * Documentación OpenAPI del feature RoleUsers: asignaciones usuario ↔ rol.
 * Modalidad: JWT + RBAC (authenticate + authorize).
 *
 * `POST /api/asignaciones-rol` asigna un rol a un usuario, primer eslabón de la
 * cadena. Sin asignación activa no hay permisos, por muchos roles que existan.
 */
export const roleUsersSwagger = {
  tags: [
    {
      name: "Asignaciones usuario-rol",
      description: "Asignar / retirar / reactivar el rol de un usuario (`role_users`)",
    },
  ],
  paths: {
    "/api/asignaciones-rol": {
      get: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Listar asignaciones activas",
        description: "JWT + RBAC — incluye un resumen del usuario (sin `password`) y del rol",
        responses: { "200": { description: "Lista de asignaciones (`{ assignments: [...] }`)" } },
      },
      post: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Asignar rol a usuario",
        description:
          "JWT + RBAC — cuerpo `{ user_id, role_id }`. Idempotente: si la pareja existía " +
          "desactivada, se reactiva. El usuario y el rol deben estar activos.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleUserCreate" } } },
        },
        responses: {
          "201": { description: "Asignación creada (`{ assignment }`)" },
          "400": { description: "Faltan `user_id` o `role_id`" },
          "404": { description: "Usuario o rol inexistente o inactivo" },
          "409": { description: "El rol ya está asignado a ese usuario" },
        },
      },
    },
    "/api/asignaciones-rol/{id}": {
      get: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Obtener asignación por id",
        parameters: idParam,
        responses: {
          "200": { description: "Asignación (`{ assignment }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/asignaciones-rol/{id}/deactivate": {
      patch: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Retirar rol a usuario (borrado lógico)",
        description:
          "Rompe el eslabón `role_users`: el usuario pierde los permisos de ese rol de inmediato.",
        parameters: idParam,
        responses: {
          "200": { description: "Asignación desactivada (`{ message, assignment }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/asignaciones-rol/{id}/reactivate": {
      patch: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Reactivar asignación",
        description: "Reversible: vuelve a conceder los permisos del rol.",
        parameters: idParam,
        responses: {
          "200": { description: "Asignación reactivada (`{ message, assignment }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "La asignación ya estaba activa" },
        },
      },
    },
  },
  components: {
    schemas: {
      RoleUser: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          user_id: { type: "integer", example: 2 },
          role_id: { type: "integer", example: 2 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string", example: "promoter" },
              email: { type: "string", format: "email" },
            },
          },
          role: {
            type: "object",
            properties: { id: { type: "integer" }, name: { type: "string", example: "PROMOTER" } },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleUserCreate: {
        type: "object",
        required: ["user_id", "role_id"],
        properties: {
          user_id: { type: "integer", example: 4 },
          role_id: { type: "integer", example: 3 },
        },
      },
    },
  },
};
