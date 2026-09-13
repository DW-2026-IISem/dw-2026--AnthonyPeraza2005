import { ProjectAuditModel } from '../models/project-audit.model';
import { ProjectModel } from '../../../../projects/infrastructure/persistence/models/project.model';

export async function seedProjectAudits(): Promise<void> {
  const count = await ProjectAuditModel.count();
  if (count > 0) {
    return;
  }

  const project = await ProjectModel.findOne();
  if (!project) {
    return;
  }

  await ProjectAuditModel.bulkCreate([
    {
      name: 'Revisión de cambios post-lanzamiento',
      description: 'Auditoría de cambios del proyecto',
      isActive: true,
      projectId: project.id,
    },
    {
      name: 'Revisión de cierre de campaña',
      description: 'Auditoría de cierre',
      isActive: true,
      projectId: project.id,
    },
  ]);
}
