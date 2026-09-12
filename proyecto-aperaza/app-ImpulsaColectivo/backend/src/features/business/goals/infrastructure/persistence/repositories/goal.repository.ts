import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Goal } from '../../../domain/entities/goal.entity';
import {
  IGoalRepository,
  GoalFindAllParams,
} from '../../../domain/interfaces/goal-repository.interface';
import { GoalMapper } from '../../../application/mappers/goal.mapper';
import { GoalModel } from '../models/goal.model';

@Injectable()
export class GoalRepository implements IGoalRepository {
  async create(goal: Goal): Promise<Goal> {
    const model = await GoalModel.create(GoalMapper.toPersistence(goal));
    return GoalMapper.toDomain(model);
  }

  async update(goal: Goal): Promise<Goal> {
    await GoalModel.update(GoalMapper.toPersistence(goal), {
      where: { id: goal.id },
    });
    const updated = await GoalModel.findByPk(goal.id!);
    return GoalMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await GoalModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Goal | null> {
    const model = await GoalModel.findByPk(id);
    return model ? GoalMapper.toDomain(model) : null;
  }

  async findAll(params: GoalFindAllParams) {
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

    const { rows, count } = await GoalModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => GoalMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
