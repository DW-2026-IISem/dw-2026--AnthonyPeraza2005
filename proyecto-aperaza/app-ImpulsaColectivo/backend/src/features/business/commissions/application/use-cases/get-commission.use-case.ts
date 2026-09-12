import { Inject, Injectable } from '@nestjs/common';
import { CommissionNotFoundException } from '../../domain/exceptions/commission-not-found.exception';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domain/interfaces/commission-repository.interface';
import { CommissionMapper } from '../mappers/commission.mapper';

@Injectable()
export class GetCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(id: number) {
    const commission = await this.commissionRepository.findById(id);
    if (!commission) {
      throw new CommissionNotFoundException(id);
    }

    return CommissionMapper.toResponse(commission);
  }
}
