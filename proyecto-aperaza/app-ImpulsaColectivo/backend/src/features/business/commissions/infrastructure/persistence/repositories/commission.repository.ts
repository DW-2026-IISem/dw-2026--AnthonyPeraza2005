import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Commission } from '../../../domain/entities/commission.entity';
import {
  ICommissionRepository,
  CommissionFindAllParams,
} from '../../../domain/interfaces/commission-repository.interface';
import { CommissionMapper } from '../../../application/mappers/commission.mapper';
import { CommissionModel } from '../models/commission.model';

@Injectable()
export class CommissionRepository implements ICommissionRepository {
  async create(commission: Commission): Promise<Commission> {
    const model = await CommissionModel.create(CommissionMapper.toPersistence(commission));
    return CommissionMapper.toDomain(model);
  }

  async update(commission: Commission): Promise<Commission> {
    await CommissionModel.update(CommissionMapper.toPersistence(commission), {
      where: { id: commission.id },
    });
    const updated = await CommissionModel.findByPk(commission.id!);
    return CommissionMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await CommissionModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Commission | null> {
    const model = await CommissionModel.findByPk(id);
    return model ? CommissionMapper.toDomain(model) : null;
  }

  async findAll(params: CommissionFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: WhereOptions = {};

    if (params.referenceId) {
      where.referenceId = params.referenceId;
    }

    if (params.status) {
      where.status = params.status;
    }

    const { rows, count } = await CommissionModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => CommissionMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
