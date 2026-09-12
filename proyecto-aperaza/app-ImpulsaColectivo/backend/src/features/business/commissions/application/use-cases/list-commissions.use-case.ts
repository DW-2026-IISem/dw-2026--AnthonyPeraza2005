import { Inject, Injectable } from '@nestjs/common';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domain/interfaces/commission-repository.interface';
import { CommissionFilterDto } from '../dto/commission-filter.dto';
import { CommissionMapper } from '../mappers/commission.mapper';

@Injectable()
export class ListCommissionsUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  async execute(filter: CommissionFilterDto) {
    const result = await this.commissionRepository.findAll(filter);
    return {
      items: result.items.map((item) => CommissionMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
