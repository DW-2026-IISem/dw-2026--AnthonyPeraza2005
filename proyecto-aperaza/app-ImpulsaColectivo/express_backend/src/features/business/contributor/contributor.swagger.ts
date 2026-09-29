/**
 * Documentación OpenAPI del feature Contributor.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const contributorSwagger = {
  tags: [
    {
      name: "Contribuyentes",
      description: "CRUD de contribuyentes — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/contribuyentes": {
      get: {
        tags: ["Contribuyentes"],
        summary: "Listar contribuyentes activos",
        description: "SIN AUTH — retorna contribuyentes con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de contribuyentes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contributors: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Contributor" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Contribuyentes"],
        summary: "Crear contribuyente",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContributorCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Contribuyente creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contributor: { $ref: "#/components/schemas/Contributor" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/contribuyentes/{id}": {
      get: {
        tags: ["Contribuyentes"],
        summary: "Obtener contribuyente por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Contribuyente encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contributor: { $ref: "#/components/schemas/Contributor" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Contribuyentes"],
        summary: "Actualizar contribuyente (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContributorUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Contribuyentes"],
        summary: "Actualizar contribuyente (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContributorPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Contribuyentes"],
        summary: "Eliminar contribuyente (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/contribuyentes/{id}/deactivate": {
      patch: {
        tags: ["Contribuyentes"],
        summary: "Eliminar contribuyente (lógico)",
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
      Contributor: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Mariana Torres" },
          email: { type: "string", format: "email", example: "mariana.torres@example.com" },
          phone: { type: "string", example: "3007654321" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ContributorCreate: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ContributorUpdate: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ContributorPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
