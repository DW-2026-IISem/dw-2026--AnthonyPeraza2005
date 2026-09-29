import { faker } from "@faker-js/faker";
import { Promoter } from "./promoter.model";

/**
 * Seeder del feature Promoter (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedPromoters(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  promoters: count=0, se omite");
    return 0;
  }

  const existing = await Promoter.count();
  if (existing > 0) {
    console.log(`⏭️  promoters: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: faker.company.name(),
    description: faker.company.catchPhrase(),
    contact_email: faker.internet.email().toLowerCase(),
    contact_phone: faker.phone.number({ style: "national" }),
    status: "active" as const,
  }));

  await Promoter.bulkCreate(rows);
  console.log(`✅ promoters: insertados ${count} registro(s) falsos`);
  return count;
}
