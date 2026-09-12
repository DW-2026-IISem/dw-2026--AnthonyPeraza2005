export const createProjectsTableMigration = {
  name: 'create-projects-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE projects (id, name, description, is_active, promoter_id, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE projects
  },
};
