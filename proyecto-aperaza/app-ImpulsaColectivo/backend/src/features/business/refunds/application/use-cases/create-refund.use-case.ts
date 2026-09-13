import { Inject, Injectable } from '@nestjs/common';
import { ContributionNotFoundException } from '../../../contributions/domain/exceptions/contribution-not-found.exception';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../../../contributions/domain/interfaces/contribution-repository.interface';
import { Refund } from '../../domain/entities/refund.entity';
import {
  IRefundRepository,
  REFUND_REPOSITORY,
} from '../../domain/interfaces/refund-repository.interface';
import { CreateRefundDto } from '../dto/create-refund.dto';
import { RefundMapper } from '../mappers/refund.mapper';

@Injectable()
export class CreateRefundUseCase {
  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly referenceRepository: IContributionRepository,
  ) {}

  async execute(dto: CreateRefundDto) {
    const reference = await this.referenceRepository.findById(dto.referenceId);
    if (!reference) {
      throw new ContributionNotFoundException(dto.referenceId);
    }

    const refund = Refund.create(dto);
    const created = await this.refundRepository.create(refund);
    return RefundMapper.toResponse(created);
  }
}
