import { Inject, Injectable } from '@nestjs/common';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/interfaces/refund-repository.interface';
import { RefundFilterDto } from '../dto/refund-filter.dto';
import { RefundMapper } from '../mappers/refund.mapper';

@Injectable()
export class ListRefundsUseCase {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(filter: RefundFilterDto) {
    const result = await this.refundRepository.findAll(filter);
    return {
      items: result.items.map((item) => RefundMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
