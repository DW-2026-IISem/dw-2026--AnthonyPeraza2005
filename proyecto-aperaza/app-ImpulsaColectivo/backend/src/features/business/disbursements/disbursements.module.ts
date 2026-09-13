import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { DISBURSEMENT_REPOSITORY } from './domain/interfaces/disbursement-repository.interface';
import { DisbursementRepository } from './infrastructure/persistence/repositories/disbursement.repository';
import { CreateDisbursementUseCase } from './application/use-cases/create-disbursement.use-case';
import { UpdateDisbursementUseCase } from './application/use-cases/update-disbursement.use-case';
import { DeleteDisbursementUseCase } from './application/use-cases/delete-disbursement.use-case';
import { GetDisbursementUseCase } from './application/use-cases/get-disbursement.use-case';
import { ListDisbursementsUseCase } from './application/use-cases/list-disbursements.use-case';
import { DisbursementsController } from './presentation/http/controllers/disbursements.controller';

@Module({
  imports: [ProjectsModule],
  controllers: [DisbursementsController],
  providers: [
    DisbursementRepository,
    { provide: DISBURSEMENT_REPOSITORY, useExisting: DisbursementRepository },
    CreateDisbursementUseCase,
    UpdateDisbursementUseCase,
    DeleteDisbursementUseCase,
    GetDisbursementUseCase,
    ListDisbursementsUseCase,
  ],
  exports: [DISBURSEMENT_REPOSITORY],
})
export class DisbursementsModule {}
