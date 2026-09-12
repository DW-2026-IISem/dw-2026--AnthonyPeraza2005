import { Module } from '@nestjs/common';
import { PROMOTER_REPOSITORY } from './domain/interfaces/promoter-repository.interface';
import { PromoterRepository } from './infrastructure/persistence/repositories/promoter.repository';
import { CreatePromoterUseCase } from './application/use-cases/create-promoter.use-case';
import { UpdatePromoterUseCase } from './application/use-cases/update-promoter.use-case';
import { DeletePromoterUseCase } from './application/use-cases/delete-promoter.use-case';
import { GetPromoterUseCase } from './application/use-cases/get-promoter.use-case';
import { ListPromotersUseCase } from './application/use-cases/list-promoters.use-case';
import { PromotersController } from './presentation/http/controllers/promoters.controller';

@Module({
  controllers: [PromotersController],
  providers: [
    PromoterRepository,
    { provide: PROMOTER_REPOSITORY, useExisting: PromoterRepository },
    CreatePromoterUseCase,
    UpdatePromoterUseCase,
    DeletePromoterUseCase,
    GetPromoterUseCase,
    ListPromotersUseCase,
  ],
  exports: [PROMOTER_REPOSITORY],
})
export class PromotersModule {}
