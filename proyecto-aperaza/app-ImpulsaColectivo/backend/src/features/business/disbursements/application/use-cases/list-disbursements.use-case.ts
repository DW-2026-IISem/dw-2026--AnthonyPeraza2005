import { Inject, Injectable } from '@nestjs/common';
import {
  IDisbursementRepository,
  DISBURSEMENT_REPOSITORY,
} from '../../domain/interfaces/disbursement-repository.interface';
import { DisbursementFilterDto } from '../dto/disbursement-filter.dto';
import { DisbursementMapper } from '../mappers/disbursement.mapper';

@Injectable()
export class ListDisbursementsUseCase {
  constructor(
    @Inject(DISBURSEMENT_REPOSITORY)
    private readonly disbursementRepository: IDisbursementRepository,
  ) {}

  async execute(filter: DisbursementFilterDto) {
    const result = await this.disbursementRepository.findAll(filter);
    return {
      items: result.items.map((item) => DisbursementMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
