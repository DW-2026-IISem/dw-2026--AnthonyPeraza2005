export const createProjectAuditsTableMigration = {
  name: 'create-project_audits-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE project_audits (id, name, description, is_active, project_id, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE project_audits
  },
};
