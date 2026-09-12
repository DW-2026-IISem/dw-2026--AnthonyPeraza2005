import { Inject, Injectable } from '@nestjs/common';
import { PromoterNotFoundException } from '../../domain/exceptions/promoter-not-found.exception';
import {
  IPromoterRepository,
  PROMOTER_REPOSITORY,
} from '../../domain/interfaces/promoter-repository.interface';

@Injectable()
export class DeletePromoterUseCase {
  constructor(
    @Inject(PROMOTER_REPOSITORY)
    private readonly promoterRepository: IPromoterRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const promoter = await this.promoterRepository.findById(id);
    if (!promoter) {
      throw new PromoterNotFoundException(id);
    }

    await this.promoterRepository.delete(id);
  }
}
