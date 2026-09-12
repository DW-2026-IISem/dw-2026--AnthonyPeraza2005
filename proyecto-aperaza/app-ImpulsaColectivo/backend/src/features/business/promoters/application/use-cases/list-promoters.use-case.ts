import { Inject, Injectable } from '@nestjs/common';
import {
  IPromoterRepository,
  PROMOTER_REPOSITORY,
} from '../../domain/interfaces/promoter-repository.interface';
import { PromoterFilterDto } from '../dto/promoter-filter.dto';
import { PromoterMapper } from '../mappers/promoter.mapper';

@Injectable()
export class ListPromotersUseCase {
  constructor(
    @Inject(PROMOTER_REPOSITORY)
    private readonly promoterRepository: IPromoterRepository,
  ) {}

  async execute(filter: PromoterFilterDto) {
    const result = await this.promoterRepository.findAll(filter);
    return {
      items: result.items.map((item) => PromoterMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
