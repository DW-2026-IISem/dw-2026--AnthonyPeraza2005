import { Inject, Injectable } from '@nestjs/common';
import { DisbursementNotFoundException } from '../../domain/exceptions/disbursement-not-found.exception';
import {
  IDisbursementRepository,
  DISBURSEMENT_REPOSITORY,
} from '../../domain/interfaces/disbursement-repository.interface';
import { UpdateDisbursementDto } from '../dto/update-disbursement.dto';
import { DisbursementMapper } from '../mappers/disbursement.mapper';

@Injectable()
export class UpdateDisbursementUseCase {
  constructor(
    @Inject(DISBURSEMENT_REPOSITORY)
    private readonly disbursementRepository: IDisbursementRepository,
  ) {}

  async execute(id: number, dto: UpdateDisbursementDto) {
    const disbursement = await this.disbursementRepository.findById(id);
    if (!disbursement) {
      throw new DisbursementNotFoundException(id);
    }

    disbursement.update(dto);
    const updated = await this.disbursementRepository.update(disbursement);
    return DisbursementMapper.toResponse(updated);
  }
}
