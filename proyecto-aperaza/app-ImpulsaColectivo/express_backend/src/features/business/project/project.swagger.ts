/**
 * Documentación OpenAPI del feature Project.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const projectSwagger = {
  tags: [
    {
      name: "Proyectos",
      description: "CRUD de proyectos — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/proyectos": {
      get: {
        tags: ["Proyectos"],
        summary: "Listar proyectos activos",
        description: "SIN AUTH — retorna proyectos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de proyectos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    projects: { type: "array", items: { $ref: "#/components/schemas/Project" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Proyectos"],
        summary: "Crear proyecto",
        description: "SIN AUTH — valida que promoter_id exista y esté activo",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectCreate" } },
          },
        },
        responses: {
          "201": {
            description: "Proyecto creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { project: { $ref: "#/components/schemas/Project" } },
                },
              },
            },
          },
          "400": { description: "Promotor inactivo" },
          "404": { description: "Promotor no encontrado" },
        },
      },
    },
    "/api/proyectos/{id}": {
      get: {
        tags: ["Proyectos"],
        summary: "Obtener proyecto por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Proyecto encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { project: { $ref: "#/components/schemas/Project" } },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Proyectos"],
        summary: "Actualizar proyecto (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectUpdate" } },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Proyectos"],
        summary: "Actualizar proyecto (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectPatch" } },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Proyectos"],
        summary: "Eliminar proyecto (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/proyectos/{id}/deactivate": {
      patch: {
        tags: ["Proyectos"],
        summary: "Eliminar proyecto (lógico)",
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
      Project: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Reforestación del río Rancheria" },
          description: { type: "string", example: "Siembra de árboles nativos" },
          start_date: { type: "string", format: "date", example: "2026-10-01" },
          end_date: { type: "string", format: "date", example: "2026-12-31" },
          promoter_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProjectCreate: {
        type: "object",
        required: ["title", "description", "start_date", "end_date", "promoter_id"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          start_date: { type: "string", format: "date" },
          end_date: { type: "string", format: "date" },
          promoter_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ProjectUpdate: {
        type: "object",
        required: ["title", "description", "start_date", "end_date", "promoter_id"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          start_date: { type: "string", format: "date" },
          end_date: { type: "string", format: "date" },
          promoter_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProjectPatch: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          start_date: { type: "string", format: "date" },
          end_date: { type: "string", format: "date" },
          promoter_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
