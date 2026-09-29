/**
 * Documentación OpenAPI del feature Goal.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const goalSwagger = {
  tags: [
    {
      name: "Metas",
      description: "CRUD de metas de financiamiento — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/metas": {
      get: {
        tags: ["Metas"],
        summary: "Listar metas activas",
        description: "SIN AUTH — retorna metas con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de metas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { goals: { type: "array", items: { $ref: "#/components/schemas/Goal" } } },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Metas"],
        summary: "Crear meta",
        description: "SIN AUTH — valida que project_id exista y esté activo",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GoalCreate" } } },
        },
        responses: {
          "201": {
            description: "Meta creada",
            content: {
              "application/json": {
                schema: { type: "object", properties: { goal: { $ref: "#/components/schemas/Goal" } } },
              },
            },
          },
          "400": { description: "Proyecto inactivo" },
          "404": { description: "Proyecto no encontrado" },
        },
      },
    },
    "/api/metas/{id}": {
      get: {
        tags: ["Metas"],
        summary: "Obtener meta por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Meta encontrada",
            content: {
              "application/json": {
                schema: { type: "object", properties: { goal: { $ref: "#/components/schemas/Goal" } } },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Metas"],
        summary: "Actualizar meta (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GoalUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Metas"],
        summary: "Actualizar meta (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GoalPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Metas"],
        summary: "Eliminar meta (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/metas/{id}/deactivate": {
      patch: {
        tags: ["Metas"],
        summary: "Eliminar meta (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Goal: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          description: { type: "string", example: "Recaudar $8.000.000 para insumos de siembra" },
          target_amount: { type: "number", example: 8000000 },
          project_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      GoalCreate: {
        type: "object",
        required: ["description", "target_amount", "project_id"],
        properties: {
          description: { type: "string" },
          target_amount: { type: "number" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      GoalUpdate: {
        type: "object",
        required: ["description", "target_amount", "project_id"],
        properties: {
          description: { type: "string" },
          target_amount: { type: "number" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      GoalPatch: {
        type: "object",
        properties: {
          description: { type: "string" },
          target_amount: { type: "number" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
