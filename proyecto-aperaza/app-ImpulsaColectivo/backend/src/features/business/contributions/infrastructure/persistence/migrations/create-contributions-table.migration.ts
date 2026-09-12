export const createContributionsTableMigration = {
  name: 'create-contributions-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE contributions (id, name, description, is_active, project_id, contributor_id, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE contributions
  },
};
