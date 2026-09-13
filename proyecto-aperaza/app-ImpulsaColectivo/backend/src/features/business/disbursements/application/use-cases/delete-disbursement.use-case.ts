import { Inject, Injectable } from '@nestjs/common';
import { DisbursementNotFoundException } from '../../domain/exceptions/disbursement-not-found.exception';
import {
  IDisbursementRepository,
  DISBURSEMENT_REPOSITORY,
} from '../../domain/interfaces/disbursement-repository.interface';

@Injectable()
export class DeleteDisbursementUseCase {
  constructor(
    @Inject(DISBURSEMENT_REPOSITORY)
    private readonly disbursementRepository: IDisbursementRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const disbursement = await this.disbursementRepository.findById(id);
    if (!disbursement) {
      throw new DisbursementNotFoundException(id);
    }

    await this.disbursementRepository.delete(id);
  }
}
