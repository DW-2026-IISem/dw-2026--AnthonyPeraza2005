export const createGoalsTableMigration = {
  name: 'create-goals-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE goals (id, name, description, is_active, project_id, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE goals
  },
};
