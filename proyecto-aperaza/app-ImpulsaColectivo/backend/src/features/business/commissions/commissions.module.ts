import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { COMMISSION_REPOSITORY } from './domain/interfaces/commission-repository.interface';
import { CommissionRepository } from './infrastructure/persistence/repositories/commission.repository';
import { CreateCommissionUseCase } from './application/use-cases/create-commission.use-case';
import { UpdateCommissionUseCase } from './application/use-cases/update-commission.use-case';
import { DeleteCommissionUseCase } from './application/use-cases/delete-commission.use-case';
import { GetCommissionUseCase } from './application/use-cases/get-commission.use-case';
import { ListCommissionsUseCase } from './application/use-cases/list-commissions.use-case';
import { CommissionsController } from './presentation/http/controllers/commissions.controller';

@Module({
  imports: [ProjectsModule],
  controllers: [CommissionsController],
  providers: [
    CommissionRepository,
    { provide: COMMISSION_REPOSITORY, useExisting: CommissionRepository },
    CreateCommissionUseCase,
    UpdateCommissionUseCase,
    DeleteCommissionUseCase,
    GetCommissionUseCase,
    ListCommissionsUseCase,
  ],
  exports: [COMMISSION_REPOSITORY],
})
export class CommissionsModule {}
