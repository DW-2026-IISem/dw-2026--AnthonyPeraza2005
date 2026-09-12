import { Inject, Injectable } from '@nestjs/common';
import { PromoterNotFoundException } from '../../domain/exceptions/promoter-not-found.exception';
import {
  IPromoterRepository,
  PROMOTER_REPOSITORY,
} from '../../domain/interfaces/promoter-repository.interface';
import { PromoterMapper } from '../mappers/promoter.mapper';

@Injectable()
export class GetPromoterUseCase {
  constructor(
    @Inject(PROMOTER_REPOSITORY)
    private readonly promoterRepository: IPromoterRepository,
  ) {}

  async execute(id: number) {
    const promoter = await this.promoterRepository.findById(id);
    if (!promoter) {
      throw new PromoterNotFoundException(id);
    }

    return PromoterMapper.toResponse(promoter);
  }
}
