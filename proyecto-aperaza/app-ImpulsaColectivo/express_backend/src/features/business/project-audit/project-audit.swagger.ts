/**
 * Documentación OpenAPI del feature ProjectAudit (tabla project_audits).
 */
export const projectAuditSwagger = {
  tags: [{ name: "ProjectAudits", description: "Registro de auditoría sobre proyectos" }],
  paths: {
    "/api/auditorias-proyecto": {
      get: {
        tags: ["ProjectAudits"],
        summary: "Listar auditorías de proyecto",
        description: "SIN AUTH — retorna todas las auditorías",
        responses: {
          "200": {
            description: "Lista de auditorías",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project_audits: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProjectAudit" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["ProjectAudits"],
        summary: "Crear auditoría de proyecto",
        description: "SIN AUTH — valida proyecto activo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectAuditCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Auditoría creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    project_audit: { $ref: "#/components/schemas/ProjectAudit" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auditorias-proyecto/{id}": {
      get: {
        tags: ["ProjectAudits"],
        summary: "Obtener auditoría por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Auditoría encontrada" }, "404": { description: "No encontrada" } },
      },
      put: {
        tags: ["ProjectAudits"],
        summary: "Actualizar auditoría (reemplazo total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectAuditUpdate" } },
          },
        },
        responses: { "200": { description: "Auditoría actualizada" } },
      },
      patch: {
        tags: ["ProjectAudits"],
        summary: "Actualizar auditoría (parcial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ProjectAuditPatch" } },
          },
        },
        responses: { "200": { description: "Auditoría actualizada parcialmente" } },
      },
    },
    "/api/auditorias-proyecto/{id}/fisico": {
      delete: {
        tags: ["ProjectAudits"],
        summary: "Eliminar auditoría físicamente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" } },
      },
    },
    "/api/auditorias-proyecto/{id}/logico": {
      patch: {
        tags: ["ProjectAudits"],
        summary: "Desactivar auditoría (borrado lógico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" } },
      },
    },
  },
  components: {
    schemas: {
      ProjectAudit: {
        type: "object",
        properties: {
          id: { type: "integer" },
          action: { type: "string" },
          detail: { type: "string" },
          audit_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProjectAuditCreate: {
        type: "object",
        required: ["action", "detail", "audit_date", "project_id"],
        properties: {
          action: { type: "string" },
          detail: { type: "string" },
          audit_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProjectAuditUpdate: {
        type: "object",
        required: ["action", "detail", "audit_date", "project_id", "status"],
        properties: {
          action: { type: "string" },
          detail: { type: "string" },
          audit_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ProjectAuditPatch: {
        type: "object",
        properties: {
          action: { type: "string" },
          detail: { type: "string" },
          audit_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
