/**
 * Documentación OpenAPI del feature PaymentTransaction (tabla payment_transactions).
 */
export const paymentTransactionSwagger = {
  tags: [{ name: "PaymentTransactions", description: "Transacciones de pago asociadas a contribuciones" }],
  paths: {
    "/api/transacciones-pago": {
      get: {
        tags: ["PaymentTransactions"],
        summary: "Listar transacciones de pago",
        description: "SIN AUTH — retorna todas las transacciones de pago",
        responses: {
          "200": {
            description: "Lista de transacciones de pago",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    payment_transactions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PaymentTransaction" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["PaymentTransactions"],
        summary: "Crear transacción de pago",
        description: "SIN AUTH — valida contribución activa",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaymentTransactionCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Transacción de pago creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    payment_transaction: { $ref: "#/components/schemas/PaymentTransaction" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/transacciones-pago/{id}": {
      get: {
        tags: ["PaymentTransactions"],
        summary: "Obtener transacción de pago por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Transacción encontrada" }, "404": { description: "No encontrada" } },
      },
      put: {
        tags: ["PaymentTransactions"],
        summary: "Actualizar transacción de pago (reemplazo total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PaymentTransactionUpdate" } },
          },
        },
        responses: { "200": { description: "Transacción actualizada" } },
      },
      patch: {
        tags: ["PaymentTransactions"],
        summary: "Actualizar transacción de pago (parcial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PaymentTransactionPatch" } },
          },
        },
        responses: { "200": { description: "Transacción actualizada parcialmente" } },
      },
      delete: {
        tags: ["PaymentTransactions"],
        summary: "Eliminar transacción de pago físicamente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" } },
      },
    },
    "/api/transacciones-pago/{id}/deactivate": {
      patch: {
        tags: ["PaymentTransactions"],
        summary: "Desactivar transacción de pago (borrado lógico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" } },
      },
    },
  },
  components: {
    schemas: {
      PaymentTransaction: {
        type: "object",
        properties: {
          id: { type: "integer" },
          reference: { type: "string" },
          payment_method: { type: "string" },
          amount: { type: "number" },
          transaction_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PaymentTransactionCreate: {
        type: "object",
        required: ["reference", "payment_method", "amount", "transaction_date", "contribution_id"],
        properties: {
          reference: { type: "string" },
          payment_method: { type: "string" },
          amount: { type: "number" },
          transaction_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PaymentTransactionUpdate: {
        type: "object",
        required: ["reference", "payment_method", "amount", "transaction_date", "contribution_id", "status"],
        properties: {
          reference: { type: "string" },
          payment_method: { type: "string" },
          amount: { type: "number" },
          transaction_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PaymentTransactionPatch: {
        type: "object",
        properties: {
          reference: { type: "string" },
          payment_method: { type: "string" },
          amount: { type: "number" },
          transaction_date: { type: "string", format: "date" },
          contribution_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
