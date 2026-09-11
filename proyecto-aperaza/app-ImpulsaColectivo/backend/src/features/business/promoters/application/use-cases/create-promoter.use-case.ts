import { Inject, Injectable } from '@nestjs/common';
import { Promoter } from '../../domain/entities/promoter.entity';
import {
  IPromoterRepository,
  PROMOTER_REPOSITORY,
} from '../../domain/interfaces/promoter-repository.interface';
import { CreatePromoterDto } from '../dto/create-promoter.dto';
import { PromoterMapper } from '../mappers/promoter.mapper';

@Injectable()
export class CreatePromoterUseCase {
  constructor(
    @Inject(PROMOTER_REPOSITORY)
    private readonly promoterRepository: IPromoterRepository,
  ) {}

  async execute(dto: CreatePromoterDto) {
    const promoter = Promoter.create(dto);
    const created = await this.promoterRepository.create(promoter);
    return PromoterMapper.toResponse(created);
  }
}
