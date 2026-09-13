import { Inject, Injectable } from '@nestjs/common';
import { RefundNotFoundException } from '../../domain/exceptions/refund-not-found.exception';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/interfaces/refund-repository.interface';
import { UpdateRefundDto } from '../dto/update-refund.dto';
import { RefundMapper } from '../mappers/refund.mapper';

@Injectable()
export class UpdateRefundUseCase {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(id: number, dto: UpdateRefundDto) {
    const refund = await this.refundRepository.findById(id);
    if (!refund) {
      throw new RefundNotFoundException(id);
    }

    refund.update(dto);
    const updated = await this.refundRepository.update(refund);
    return RefundMapper.toResponse(updated);
  }
}
