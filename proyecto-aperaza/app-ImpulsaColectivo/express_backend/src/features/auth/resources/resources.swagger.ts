import { invalidIdResponse, notFoundResponse } from "../../../shared/http/swagger-security";

const idParam = [{ name: "id", in: "path", required: true, schema: { type: "integer" } }];

/**
 * Documentación OpenAPI del feature Resources.
 * TEMPORAL: SIN AUTH hasta ISS-21 (entonces pasa a JWT + RBAC).
 *
 * Un recurso es un par `(method, path)` con la ruta EN PATRÓN
 * (`/api/proyectos/:id`). `GET` y `POST` sobre la misma ruta son dos recursos
 * distintos y se conceden por separado.
 */
export const resourcesSwagger = {
  tags: [
    {
      name: "Recursos",
      description: "Catálogo de puntos de acceso protegibles: par `(method, path)`",
    },
  ],
  paths: {
    "/api/recursos": {
      get: {
        tags: ["Recursos"],
        summary: "Listar recursos activos",
        description: "SIN AUTH (temporal)",
        responses: { "200": { description: "Lista de recursos (`{ resources: [...] }`)" } },
      },
      post: {
        tags: ["Recursos"],
        summary: "Crear recurso",
        description:
          "SIN AUTH (temporal) — alta de un nuevo punto de acceso; concederlo a un rol no requiere desplegar código.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResourceCreate" } } },
        },
        responses: {
          "201": { description: "Recurso creado (`{ resource }`)" },
          "400": { description: "Faltan `method` o `path`" },
          "409": { description: "La tupla `(method, path)` ya existe" },
        },
      },
    },
    "/api/recursos/{id}": {
      get: {
        tags: ["Recursos"],
        summary: "Obtener recurso por id",
        parameters: idParam,
        responses: {
          "200": { description: "Recurso (`{ resource }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Recursos"],
        summary: "Reemplazar recurso (PUT)",
        parameters: idParam,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResourceUpdate" } } },
        },
        responses: {
          "200": { description: "Recurso actualizado (`{ resource }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "La tupla `(method, path)` ya existe" },
        },
      },
      patch: {
        tags: ["Recursos"],
        summary: "Modificar recurso (PATCH)",
        parameters: idParam,
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/ResourcePatch" } } },
        },
        responses: {
          "200": { description: "Recurso actualizado (`{ resource }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "La tupla `(method, path)` ya existe" },
        },
      },
      delete: {
        tags: ["Recursos"],
        summary: "Eliminar recurso (físico)",
        parameters: idParam,
        responses: {
          "200": { description: "Eliminado (`{ message, id }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/recursos/{id}/deactivate": {
      patch: {
        tags: ["Recursos"],
        summary: "Desactivar recurso (borrado lógico)",
        description: "Efecto inmediato: ningún rol puede ya autorizar ese endpoint.",
        parameters: idParam,
        responses: {
          "200": { description: "Desactivado (`{ message, resource }`)" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Resource: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], example: "GET" },
          path: { type: "string", example: "/api/proyectos/:id" },
          description: { type: "string", nullable: true, example: "Consultar proyecto" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceCreate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], example: "GET" },
          path: { type: "string", example: "/api/reportes/proyectos/:id" },
          description: { type: "string", nullable: true, example: "Consultar reporte de un proyecto" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ResourceUpdate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      ResourcePatch: {
        type: "object",
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
    },
  },
};
