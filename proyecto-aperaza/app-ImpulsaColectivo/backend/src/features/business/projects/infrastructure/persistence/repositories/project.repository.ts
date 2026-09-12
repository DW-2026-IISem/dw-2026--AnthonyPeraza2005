import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Project } from '../../../domain/entities/project.entity';
import {
  IProjectRepository,
  ProjectFindAllParams,
} from '../../../domain/interfaces/project-repository.interface';
import { ProjectMapper } from '../../../application/mappers/project.mapper';
import { ProjectModel } from '../models/project.model';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    const model = await ProjectModel.create(ProjectMapper.toPersistence(project));
    return ProjectMapper.toDomain(model);
  }

  async update(project: Project): Promise<Project> {
    await ProjectModel.update(ProjectMapper.toPersistence(project), {
      where: { id: project.id },
    });
    const updated = await ProjectModel.findByPk(project.id!);
    return ProjectMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ProjectModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Project | null> {
    const model = await ProjectModel.findByPk(id);
    return model ? ProjectMapper.toDomain(model) : null;
  }

  async findAll(params: ProjectFindAllParams) {
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

    if (params.promoterId) {
      where.promoterId = params.promoterId;
    }

    const { rows, count } = await ProjectModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ProjectMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
