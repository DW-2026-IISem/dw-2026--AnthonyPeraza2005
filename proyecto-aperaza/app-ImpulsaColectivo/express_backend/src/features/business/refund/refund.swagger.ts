/**
 * Documentación OpenAPI del feature Refund (tabla refunds).
 */
export const refundSwagger = {
  tags: [{ name: "Refunds", description: "Reembolsos de contribuciones" }],
  paths: {
    "/api/reembolsos": {
      get: {
        tags: ["Refunds"],
        summary: "Listar reembolsos",
        description: "SIN AUTH — retorna todos los reembolsos",
        responses: {
          "200": {
            description: "Lista de reembolsos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refunds: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Refund" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Refunds"],
        summary: "Crear reembolso",
        description: "SIN AUTH — valida contribución activa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefundCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Reembolso creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    refund: { $ref: "#/components/schemas/Refund" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/reembolsos/{id}": {
      get: {
        tags: ["Refunds"],
        summary: "Obtener reembolso por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Reembolso encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["Refunds"],
        summary: "Actualizar reembolso (reemplazo total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefundUpdate" } },
          },
        },
        responses: { "200": { description: "Reembolso actualizado" } },
      },
      patch: {
        tags: ["Refunds"],
        summary: "Actualizar reembolso (parcial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefundPatch" } },
          },
        },
        responses: { "200": { description: "Reembolso actualizado parcialmente" } },
      },
    },
    "/api/reembolsos/{id}/fisico": {
      delete: {
        tags: ["Refunds"],
        summary: "Eliminar reembolso físicamente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" } },
      },
    },
    "/api/reembolsos/{id}/logico": {
      patch: {
        tags: ["Refunds"],
        summary: "Desactivar reembolso (borrado lógico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" } },
      },
    },
  },
  components: {
    schemas: {
      Refund: {
        type: "object",
        properties: {
          id: { type: "integer" },
          amount: { type: "number" },
          reason: { type: "string" },
          refund_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      RefundCreate: {
        type: "object",
        required: ["amount", "reason", "refund_date", "contribution_id"],
        properties: {
          amount: { type: "number" },
          reason: { type: "string" },
          refund_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      RefundUpdate: {
        type: "object",
        required: ["amount", "reason", "refund_date", "contribution_id", "status"],
        properties: {
          amount: { type: "number" },
          reason: { type: "string" },
          refund_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      RefundPatch: {
        type: "object",
        properties: {
          amount: { type: "number" },
          reason: { type: "string" },
          refund_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
