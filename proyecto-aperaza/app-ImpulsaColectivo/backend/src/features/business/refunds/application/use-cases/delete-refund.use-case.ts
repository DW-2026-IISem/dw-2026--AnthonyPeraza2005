import { Inject, Injectable } from '@nestjs/common';
import { RefundNotFoundException } from '../../domain/exceptions/refund-not-found.exception';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/interfaces/refund-repository.interface';

@Injectable()
export class DeleteRefundUseCase {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const refund = await this.refundRepository.findById(id);
    if (!refund) {
      throw new RefundNotFoundException(id);
    }

    await this.refundRepository.delete(id);
  }
}
