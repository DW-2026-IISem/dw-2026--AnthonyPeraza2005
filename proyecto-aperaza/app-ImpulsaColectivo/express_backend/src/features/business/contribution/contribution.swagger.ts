/**
 * Documentación OpenAPI del feature Contribution (tabla contributions).
 */
export const contributionSwagger = {
  tags: [{ name: "Contributions", description: "Aportes de contribuyentes a proyectos" }],
  paths: {
    "/api/contribuciones": {
      get: {
        tags: ["Contributions"],
        summary: "Listar contribuciones",
        description: "SIN AUTH — retorna todas las contribuciones",
        responses: {
          "200": {
            description: "Lista de contribuciones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contributions: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Contribution" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Contributions"],
        summary: "Crear contribución",
        description: "SIN AUTH — valida proyecto y contribuyente activos",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContributionCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Contribución creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contribution: { $ref: "#/components/schemas/Contribution" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/contribuciones/{id}": {
      get: {
        tags: ["Contributions"],
        summary: "Obtener contribución por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Contribución encontrada" }, "404": { description: "No encontrada" } },
      },
      put: {
        tags: ["Contributions"],
        summary: "Actualizar contribución (reemplazo total)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ContributionUpdate" } },
          },
        },
        responses: { "200": { description: "Contribución actualizada" } },
      },
      patch: {
        tags: ["Contributions"],
        summary: "Actualizar contribución (parcial)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ContributionPatch" } },
          },
        },
        responses: { "200": { description: "Contribución actualizada parcialmente" } },
      },
      delete: {
        tags: ["Contributions"],
        summary: "Eliminar contribución físicamente",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" } },
      },
    },
    "/api/contribuciones/{id}/deactivate": {
      patch: {
        tags: ["Contributions"],
        summary: "Desactivar contribución (borrado lógico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" } },
      },
    },
  },
  components: {
    schemas: {
      Contribution: {
        type: "object",
        properties: {
          id: { type: "integer" },
          amount: { type: "number" },
          contribution_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          contributor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ContributionCreate: {
        type: "object",
        required: ["amount", "contribution_date", "project_id", "contributor_id"],
        properties: {
          amount: { type: "number" },
          contribution_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          contributor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ContributionUpdate: {
        type: "object",
        required: ["amount", "contribution_date", "project_id", "contributor_id", "status"],
        properties: {
          amount: { type: "number" },
          contribution_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          contributor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ContributionPatch: {
        type: "object",
        properties: {
          amount: { type: "number" },
          contribution_date: { type: "string", format: "date" },
          project_id: { type: "integer" },
          contributor_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
