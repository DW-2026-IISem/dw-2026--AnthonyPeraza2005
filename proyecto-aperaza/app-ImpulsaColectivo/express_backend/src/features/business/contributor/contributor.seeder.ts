import { faker } from "@faker-js/faker";
import { Contributor } from "./contributor.model";

/**
 * Seeder del feature Contributor (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedContributors(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  contributors: count=0, se omite");
    return 0;
  }

  const existing = await Contributor.count();
  if (existing > 0) {
    console.log(`⏭️  contributors: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    name: faker.person.fullName(),
    email: `contributor.${i}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase(),
    phone: faker.phone.number({ style: "national" }),
    status: "active" as const,
  }));

  await Contributor.bulkCreate(rows);
  console.log(`✅ contributors: insertados ${count} registro(s) falsos`);
  return count;
}
