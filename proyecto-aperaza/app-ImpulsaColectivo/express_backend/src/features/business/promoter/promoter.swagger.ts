/**
 * Documentación OpenAPI del feature Promoter.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const promoterSwagger = {
  tags: [
    {
      name: "Promotores",
      description: "CRUD de promotores — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/promotores": {
      get: {
        tags: ["Promotores"],
        summary: "Listar promotores activos",
        description: "SIN AUTH — retorna promotores con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de promotores",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    promoters: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Promoter" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Promotores"],
        summary: "Crear promotor",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PromoterCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Promotor creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    promoter: { $ref: "#/components/schemas/Promoter" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/promotores/{id}": {
      get: {
        tags: ["Promotores"],
        summary: "Obtener promotor por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "Promotor encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    promoter: { $ref: "#/components/schemas/Promoter" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Promotores"],
        summary: "Actualizar promotor (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PromoterUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Promotores"],
        summary: "Actualizar promotor (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PromoterPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Promotores"],
        summary: "Eliminar promotor (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/promotores/{id}/deactivate": {
      patch: {
        tags: ["Promotores"],
        summary: "Eliminar promotor (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Promoter: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Fundación ImpulsaColectivo" },
          description: { type: "string", example: "Organización que impulsa proyectos comunitarios" },
          contact_email: { type: "string", format: "email", example: "contacto@impulsacolectivo.org" },
          contact_phone: { type: "string", example: "3001234567" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PromoterCreate: {
        type: "object",
        required: ["name", "contact_email"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          contact_email: { type: "string", format: "email" },
          contact_phone: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      PromoterUpdate: {
        type: "object",
        required: ["name", "contact_email"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          contact_email: { type: "string", format: "email" },
          contact_phone: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PromoterPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          contact_email: { type: "string", format: "email" },
          contact_phone: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
