import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Contribution } from '../../../domain/entities/contribution.entity';
import {
  IContributionRepository,
  ContributionFindAllParams,
} from '../../../domain/interfaces/contribution-repository.interface';
import { ContributionMapper } from '../../../application/mappers/contribution.mapper';
import { ContributionModel } from '../models/contribution.model';

@Injectable()
export class ContributionRepository implements IContributionRepository {
  async create(contribution: Contribution): Promise<Contribution> {
    const model = await ContributionModel.create(ContributionMapper.toPersistence(contribution));
    return ContributionMapper.toDomain(model);
  }

  async update(contribution: Contribution): Promise<Contribution> {
    await ContributionModel.update(ContributionMapper.toPersistence(contribution), {
      where: { id: contribution.id },
    });
    const updated = await ContributionModel.findByPk(contribution.id!);
    return ContributionMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ContributionModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Contribution | null> {
    const model = await ContributionModel.findByPk(id);
    return model ? ContributionMapper.toDomain(model) : null;
  }

  async findAll(params: ContributionFindAllParams) {
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

    if (params.contributorId) {
      where.contributorId = params.contributorId;
    }

    const { rows, count } = await ContributionModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ContributionMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
