import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Contributor } from '../../../domain/entities/contributor.entity';
import {
  IContributorRepository,
  ContributorFindAllParams,
} from '../../../domain/interfaces/contributor-repository.interface';
import { ContributorMapper } from '../../../application/mappers/contributor.mapper';
import { ContributorModel } from '../models/contributor.model';

@Injectable()
export class ContributorRepository implements IContributorRepository {
  async create(contributor: Contributor): Promise<Contributor> {
    const model = await ContributorModel.create(ContributorMapper.toPersistence(contributor));
    return ContributorMapper.toDomain(model);
  }

  async update(contributor: Contributor): Promise<Contributor> {
    await ContributorModel.update(ContributorMapper.toPersistence(contributor), {
      where: { id: contributor.id },
    });
    const updated = await ContributorModel.findByPk(contributor.id!);
    return ContributorMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ContributorModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Contributor | null> {
    const model = await ContributorModel.findByPk(id);
    return model ? ContributorMapper.toDomain(model) : null;
  }

  async findAll(params: ContributorFindAllParams) {
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

    const { rows, count } = await ContributorModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ContributorMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
