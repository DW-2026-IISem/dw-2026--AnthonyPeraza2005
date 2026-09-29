/**
 * Documentación OpenAPI del feature Reward.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const rewardSwagger = {
  tags: [
    {
      name: "Recompensas",
      description: "CRUD de recompensas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/recompensas": {
      get: {
        tags: ["Recompensas"],
        summary: "Listar recompensas activas",
        description: "SIN AUTH — retorna recompensas con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de recompensas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { rewards: { type: "array", items: { $ref: "#/components/schemas/Reward" } } },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Recompensas"],
        summary: "Crear recompensa",
        description: "SIN AUTH — valida que project_id exista y esté activo",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RewardCreate" } } },
        },
        responses: {
          "201": {
            description: "Recompensa creada",
            content: {
              "application/json": {
                schema: { type: "object", properties: { reward: { $ref: "#/components/schemas/Reward" } } },
              },
            },
          },
          "400": { description: "Proyecto inactivo" },
          "404": { description: "Proyecto no encontrado" },
        },
      },
    },
    "/api/recompensas/{id}": {
      get: {
        tags: ["Recompensas"],
        summary: "Obtener recompensa por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Recompensa encontrada",
            content: {
              "application/json": {
                schema: { type: "object", properties: { reward: { $ref: "#/components/schemas/Reward" } } },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Recompensas"],
        summary: "Actualizar recompensa (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RewardUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Recompensas"],
        summary: "Actualizar recompensa (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RewardPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Recompensas"],
        summary: "Eliminar recompensa (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/recompensas/{id}/deactivate": {
      patch: {
        tags: ["Recompensas"],
        summary: "Eliminar recompensa (lógico)",
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
      Reward: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Camiseta conmemorativa" },
          description: { type: "string", example: "Camiseta del proyecto" },
          min_amount: { type: "number", example: 50000 },
          project_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RewardCreate: {
        type: "object",
        required: ["title", "description", "min_amount", "project_id"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          min_amount: { type: "number" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      RewardUpdate: {
        type: "object",
        required: ["title", "description", "min_amount", "project_id"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          min_amount: { type: "number" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      RewardPatch: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          min_amount: { type: "number" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
