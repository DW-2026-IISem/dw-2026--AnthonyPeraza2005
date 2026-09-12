import { Inject, Injectable } from '@nestjs/common';
import { PromoterNotFoundException } from '../../domain/exceptions/promoter-not-found.exception';
import {
  IPromoterRepository,
  PROMOTER_REPOSITORY,
} from '../../domain/interfaces/promoter-repository.interface';
import { UpdatePromoterDto } from '../dto/update-promoter.dto';
import { PromoterMapper } from '../mappers/promoter.mapper';

@Injectable()
export class UpdatePromoterUseCase {
  constructor(
    @Inject(PROMOTER_REPOSITORY)
    private readonly promoterRepository: IPromoterRepository,
  ) {}

  async execute(id: number, dto: UpdatePromoterDto) {
    const promoter = await this.promoterRepository.findById(id);
    if (!promoter) {
      throw new PromoterNotFoundException(id);
    }

    promoter.update(dto);
    const updated = await this.promoterRepository.update(promoter);
    return PromoterMapper.toResponse(updated);
  }
}
