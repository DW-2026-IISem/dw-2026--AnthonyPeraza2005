export const createPromotersTableMigration = {
  name: 'create-promoters-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE promoters (id, name, description, is_active, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE promoters
  },
};
