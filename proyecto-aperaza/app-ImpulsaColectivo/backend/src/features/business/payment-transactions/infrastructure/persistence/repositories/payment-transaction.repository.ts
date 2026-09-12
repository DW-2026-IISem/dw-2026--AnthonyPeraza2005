import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util';
import { PaymentTransaction } from '../../../domain/entities/payment-transaction.entity';
import {
  IPaymentTransactionRepository,
  PaymentTransactionFindAllParams,
} from '../../../domain/interfaces/payment-transaction-repository.interface';
import { PaymentTransactionMapper } from '../../../application/mappers/payment-transaction.mapper';
import { PaymentTransactionModel } from '../models/payment-transaction.model';

@Injectable()
export class PaymentTransactionRepository implements IPaymentTransactionRepository {
  async create(paymentTransaction: PaymentTransaction): Promise<PaymentTransaction> {
    const model = await PaymentTransactionModel.create(PaymentTransactionMapper.toPersistence(paymentTransaction));
    return PaymentTransactionMapper.toDomain(model);
  }

  async update(paymentTransaction: PaymentTransaction): Promise<PaymentTransaction> {
    await PaymentTransactionModel.update(PaymentTransactionMapper.toPersistence(paymentTransaction), {
      where: { id: paymentTransaction.id },
    });
    const updated = await PaymentTransactionModel.findByPk(paymentTransaction.id!);
    return PaymentTransactionMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await PaymentTransactionModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<PaymentTransaction | null> {
    const model = await PaymentTransactionModel.findByPk(id);
    return model ? PaymentTransactionMapper.toDomain(model) : null;
  }

  async findAll(params: PaymentTransactionFindAllParams) {
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

    const { rows, count } = await PaymentTransactionModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => PaymentTransactionMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
