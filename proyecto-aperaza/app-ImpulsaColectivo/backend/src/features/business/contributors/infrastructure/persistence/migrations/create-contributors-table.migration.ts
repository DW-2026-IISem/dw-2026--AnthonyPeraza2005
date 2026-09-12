export const createContributorsTableMigration = {
  name: 'create-contributors-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE contributors (id, name, description, is_active, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE contributors
  },
};
