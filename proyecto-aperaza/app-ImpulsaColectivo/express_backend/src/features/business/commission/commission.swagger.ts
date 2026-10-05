/**
 * Documentación OpenAPI del feature Commission (tabla commissions).
 */
export const commissionSwagger = {
  tags: [{ name: "Commissions", description: "Comisiones calculadas sobre transacciones de pago" }],
  paths: {
    "/api/comisiones": {
      get: {
        tags: ["Commissions"],
        summary: "Listar comisiones",
        description: "SIN AUTH — retorna todas las comisiones",
        responses: {
          "200": {
            description: "Lista de comisiones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    commissions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Commission" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Commissions"],
        summary: "Crear comisión",
        description: "SIN AUTH — valida transacción de pago activa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommissionCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Comisión creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    commission: { $ref: "#/components/schemas/Commission" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/comisiones/{id}": {
      get: {
        tags: ["Commissions"],
        summary: "Obtener comisión por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Comisión encontrada" }, "404": { description: "No encontrada" } },
      },
      put: {
        tags: ["Commissions"],
        summary: "Actualizar comisión (reemplazo total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CommissionUpdate" } },
          },
        },
        responses: { "200": { description: "Comisión actualizada" } },
      },
      patch: {
        tags: ["Commissions"],
        summary: "Actualizar comisión (parcial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CommissionPatch" } },
          },
        },
        responses: { "200": { description: "Comisión actualizada parcialmente" } },
      },
      delete: {
        tags: ["Commissions"],
        summary: "Eliminar comisión físicamente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" } },
      },
    },
    "/api/comisiones/{id}/deactivate": {
      patch: {
        tags: ["Commissions"],
        summary: "Desactivar comisión (borrado lógico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" } },
      },
    },
  },
  components: {
    schemas: {
      Commission: {
        type: "object",
        properties: {
          id: { type: "integer" },
          percentage: { type: "number" },
          amount: { type: "number" },
          calculation_date: { type: "string", format: "date" },
          payment_transaction_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CommissionCreate: {
        type: "object",
        required: ["percentage", "amount", "calculation_date", "payment_transaction_id"],
        properties: {
          percentage: { type: "number" },
          amount: { type: "number" },
          calculation_date: { type: "string", format: "date" },
          payment_transaction_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CommissionUpdate: {
        type: "object",
        required: ["percentage", "amount", "calculation_date", "payment_transaction_id", "status"],
        properties: {
          percentage: { type: "number" },
          amount: { type: "number" },
          calculation_date: { type: "string", format: "date" },
          payment_transaction_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CommissionPatch: {
        type: "object",
        properties: {
          percentage: { type: "number" },
          amount: { type: "number" },
          calculation_date: { type: "string", format: "date" },
          payment_transaction_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
