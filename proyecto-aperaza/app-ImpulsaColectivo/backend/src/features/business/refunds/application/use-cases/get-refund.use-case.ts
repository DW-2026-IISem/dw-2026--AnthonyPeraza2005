import { Inject, Injectable } from '@nestjs/common';
import { RefundNotFoundException } from '../../domain/exceptions/refund-not-found.exception';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/interfaces/refund-repository.interface';
import { RefundMapper } from '../mappers/refund.mapper';

@Injectable()
export class GetRefundUseCase {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(id: number) {
    const refund = await this.refundRepository.findById(id);
    if (!refund) {
      throw new RefundNotFoundException(id);
    }

    return RefundMapper.toResponse(refund);
  }
}
