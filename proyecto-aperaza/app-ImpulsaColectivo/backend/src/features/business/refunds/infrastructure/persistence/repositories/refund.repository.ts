import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { Refund } from '../../../domain/entities/refund.entity';
import {
  IRefundRepository,
  RefundFindAllParams,
} from '../../../domain/interfaces/refund-repository.interface';
import { RefundMapper } from '../../../application/mappers/refund.mapper';
import { RefundModel } from '../models/refund.model';

@Injectable()
export class RefundRepository implements IRefundRepository {
  async create(refund: Refund): Promise<Refund> {
    const model = await RefundModel.create(RefundMapper.toPersistence(refund));
    return RefundMapper.toDomain(model);
  }

  async update(refund: Refund): Promise<Refund> {
    await RefundModel.update(RefundMapper.toPersistence(refund), {
      where: { id: refund.id },
    });
    const updated = await RefundModel.findByPk(refund.id!);
    return RefundMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await RefundModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Refund | null> {
    const model = await RefundModel.findByPk(id);
    return model ? RefundMapper.toDomain(model) : null;
  }

  async findAll(params: RefundFindAllParams) {
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

    const { rows, count } = await RefundModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => RefundMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
