/**
 * Documentación OpenAPI del feature Disbursement (tabla disbursements).
 */
export const disbursementSwagger = {
  tags: [{ name: "Disbursements", description: "Desembolsos de fondos hacia proyectos" }],
  paths: {
    "/api/desembolsos": {
      get: {
        tags: ["Disbursements"],
        summary: "Listar desembolsos",
        description: "SIN AUTH — retorna todos los desembolsos",
        responses: {
          "200": {
            description: "Lista de desembolsos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    disbursements: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Disbursement" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Disbursements"],
        summary: "Crear desembolso",
        description: "SIN AUTH — valida proyecto activo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DisbursementCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Desembolso creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    disbursement: { $ref: "#/components/schemas/Disbursement" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/desembolsos/{id}": {
      get: {
        tags: ["Disbursements"],
        summary: "Obtener desembolso por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desembolso encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["Disbursements"],
        summary: "Actualizar desembolso (reemplazo total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/DisbursementUpdate" } },
          },
        },
        responses: { "200": { description: "Desembolso actualizado" } },
      },
      patch: {
        tags: ["Disbursements"],
        summary: "Actualizar desembolso (parcial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/DisbursementPatch" } },
          },
        },
        responses: { "200": { description: "Desembolso actualizado parcialmente" } },
      },
    },
    "/api/desembolsos/{id}/fisico": {
      delete: {
        tags: ["Disbursements"],
        summary: "Eliminar desembolso físicamente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" } },
      },
    },
    "/api/desembolsos/{id}/logico": {
      patch: {
        tags: ["Disbursements"],
        summary: "Desactivar desembolso (borrado lógico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" } },
      },
    },
  },
  components: {
    schemas: {
      Disbursement: {
        type: "object",
        properties: {
          id: { type: "integer" },
          amount: { type: "number" },
          disbursement_date: { type: "string", format: "date" },
          method: { type: "string" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      DisbursementCreate: {
        type: "object",
        required: ["amount", "disbursement_date", "method", "project_id"],
        properties: {
          amount: { type: "number" },
          disbursement_date: { type: "string", format: "date" },
          method: { type: "string" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      DisbursementUpdate: {
        type: "object",
        required: ["amount", "disbursement_date", "method", "project_id", "status"],
        properties: {
          amount: { type: "number" },
          disbursement_date: { type: "string", format: "date" },
          method: { type: "string" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      DisbursementPatch: {
        type: "object",
        properties: {
          amount: { type: "number" },
          disbursement_date: { type: "string", format: "date" },
          method: { type: "string" },
          project_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
