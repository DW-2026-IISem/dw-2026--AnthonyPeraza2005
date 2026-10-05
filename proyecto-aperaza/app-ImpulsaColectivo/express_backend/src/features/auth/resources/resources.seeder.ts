import { Resource } from "./resource.model";
import { RESOURCE_CATALOG } from "./resource-catalog";

/**
 * Seeder del catálogo de recursos (`resources`).
 *
 * No usa datos aleatorios: los 110 recursos son un catálogo determinista
 * definido en `resource-catalog.ts`. Es idempotente: `findOrCreate` por
 * `(method, path)` y reactivación de las filas que ya existían inactivas, de
 * modo que volver a ejecutarlo reconcilia el catálogo sin duplicar ni perder
 * concesiones.
 */
export async function seedResources(): Promise<number> {
  let created = 0;

  for (const item of RESOURCE_CATALOG) {
    const [resource, wasCreated] = await Resource.findOrCreate({
      where: { method: item.method, path: item.path },
      defaults: {
        method: item.method,
        path: item.path,
        description: item.description,
        status: "active",
      },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (resource.status !== "active") {
      await resource.update({ status: "active" });
    }
  }

  console.log(
    `Resources: catálogo reconciliado (${RESOURCE_CATALOG.length} recursos, ${created} nuevos).`
  );
  return created;
}
