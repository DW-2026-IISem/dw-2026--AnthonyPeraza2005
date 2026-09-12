import { Inject, Injectable } from '@nestjs/common';
import { CommissionNotFoundException } from '../../domain/exceptions/commission-not-found.exception';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domain/interfaces/commission-repository.interface';
import { UpdateCommissionDto } from '../dto/update-commission.dto';
import { CommissionMapper } from '../mappers/commission.mapper';

@Injectable()
export class UpdateCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(id: number, dto: UpdateCommissionDto) {
    const commission = await this.commissionRepository.findById(id);
    if (!commission) {
      throw new CommissionNotFoundException(id);
    }

    commission.update(dto);
    const updated = await this.commissionRepository.update(commission);
    return CommissionMapper.toResponse(updated);
  }
}
