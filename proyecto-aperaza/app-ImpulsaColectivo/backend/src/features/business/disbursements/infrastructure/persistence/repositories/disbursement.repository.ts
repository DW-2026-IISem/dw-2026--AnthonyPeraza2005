import { Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Disbursement } from '../../../domain/entities/disbursement.entity';
import {
  IDisbursementRepository,
  DisbursementFindAllParams,
} from '../../../domain/interfaces/disbursement-repository.interface';
import { DisbursementMapper } from '../../../application/mappers/disbursement.mapper';
import { DisbursementModel } from '../models/disbursement.model';

@Injectable()
export class DisbursementRepository implements IDisbursementRepository {
  async create(disbursement: Disbursement): Promise<Disbursement> {
    const model = await DisbursementModel.create(DisbursementMapper.toPersistence(disbursement));
    return DisbursementMapper.toDomain(model);
  }

  async update(disbursement: Disbursement): Promise<Disbursement> {
    await DisbursementModel.update(DisbursementMapper.toPersistence(disbursement), {
      where: { id: disbursement.id },
    });
    const updated = await DisbursementModel.findByPk(disbursement.id!);
    return DisbursementMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await DisbursementModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Disbursement | null> {
    const model = await DisbursementModel.findByPk(id);
    return model ? DisbursementMapper.toDomain(model) : null;
  }

  async findAll(params: DisbursementFindAllParams) {
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

    const { rows, count } = await DisbursementModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => DisbursementMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
