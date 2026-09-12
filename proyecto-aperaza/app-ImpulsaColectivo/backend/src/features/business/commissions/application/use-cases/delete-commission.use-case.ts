import { Inject, Injectable } from '@nestjs/common';
import { CommissionNotFoundException } from '../../domain/exceptions/commission-not-found.exception';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domain/interfaces/commission-repository.interface';

@Injectable()
export class DeleteCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const commission = await this.commissionRepository.findById(id);
    if (!commission) {
      throw new CommissionNotFoundException(id);
    }

    await this.commissionRepository.delete(id);
  }
}
