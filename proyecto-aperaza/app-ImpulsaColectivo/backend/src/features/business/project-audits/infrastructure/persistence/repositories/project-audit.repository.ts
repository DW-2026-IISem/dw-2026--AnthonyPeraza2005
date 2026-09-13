import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { ProjectAudit } from '../../../domain/entities/project-audit.entity';
import {
  IProjectAuditRepository,
  ProjectAuditFindAllParams,
} from '../../../domain/interfaces/project-audit-repository.interface';
import { ProjectAuditMapper } from '../../../application/mappers/project-audit.mapper';
import { ProjectAuditModel } from '../models/project-audit.model';

@Injectable()
export class ProjectAuditRepository implements IProjectAuditRepository {
  async create(projectAudit: ProjectAudit): Promise<ProjectAudit> {
    const model = await ProjectAuditModel.create(ProjectAuditMapper.toPersistence(projectAudit));
    return ProjectAuditMapper.toDomain(model);
  }

  async update(projectAudit: ProjectAudit): Promise<ProjectAudit> {
    await ProjectAuditModel.update(ProjectAuditMapper.toPersistence(projectAudit), {
      where: { id: projectAudit.id },
    });
    const updated = await ProjectAuditModel.findByPk(projectAudit.id!);
    return ProjectAuditMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ProjectAuditModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<ProjectAudit | null> {
    const model = await ProjectAuditModel.findByPk(id);
    return model ? ProjectAuditMapper.toDomain(model) : null;
  }

  async findAll(params: ProjectAuditFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: WhereOptions = {};

    if (params.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.like]: `%${params.search}%` } },
          { description: { [Op.like]: `%${params.search}%` } },
        ],
      });
    }

    if (params.projectId) {
      where.projectId = params.projectId;
    }

    const { rows, count } = await ProjectAuditModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ProjectAuditMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
