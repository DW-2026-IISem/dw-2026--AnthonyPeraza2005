import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Promoter } from '../../../domain/entities/promoter.entity';
import {
  IPromoterRepository,
  PromoterFindAllParams,
} from '../../../domain/interfaces/promoter-repository.interface';
import { PromoterMapper } from '../../../application/mappers/promoter.mapper';
import { PromoterModel } from '../models/promoter.model';

@Injectable()
export class PromoterRepository implements IPromoterRepository {
  async create(promoter: Promoter): Promise<Promoter> {
    const model = await PromoterModel.create(PromoterMapper.toPersistence(promoter));
    return PromoterMapper.toDomain(model);
  }

  async update(promoter: Promoter): Promise<Promoter> {
    await PromoterModel.update(PromoterMapper.toPersistence(promoter), {
      where: { id: promoter.id },
    });
    const updated = await PromoterModel.findByPk(promoter.id!);
    return PromoterMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await PromoterModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Promoter | null> {
    const model = await PromoterModel.findByPk(id);
    return model ? PromoterMapper.toDomain(model) : null;
  }

  async findAll(params: PromoterFindAllParams) {
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

    const { rows, count } = await PromoterModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => PromoterMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
