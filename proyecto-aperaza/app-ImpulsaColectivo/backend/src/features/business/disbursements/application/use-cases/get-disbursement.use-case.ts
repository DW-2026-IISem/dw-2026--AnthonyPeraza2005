import { Inject, Injectable } from '@nestjs/common';
import { DisbursementNotFoundException } from '../../domain/exceptions/disbursement-not-found.exception';
import {
  IDisbursementRepository,
  DISBURSEMENT_REPOSITORY,
} from '../../domain/interfaces/disbursement-repository.interface';
import { DisbursementMapper } from '../mappers/disbursement.mapper';

@Injectable()
export class GetDisbursementUseCase {
  constructor(
    @Inject(DISBURSEMENT_REPOSITORY)
    private readonly disbursementRepository: IDisbursementRepository,
  ) {}

  async execute(id: number) {
    const disbursement = await this.disbursementRepository.findById(id);
    if (!disbursement) {
      throw new DisbursementNotFoundException(id);
    }

    return DisbursementMapper.toResponse(disbursement);
  }
}
