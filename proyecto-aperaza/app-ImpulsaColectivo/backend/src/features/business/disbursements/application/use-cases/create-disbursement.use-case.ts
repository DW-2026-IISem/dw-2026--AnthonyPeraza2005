import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../../projects/domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../projects/domain/interfaces/project-repository.interface';
import { Disbursement } from '../../domain/entities/disbursement.entity';
import {
  IDisbursementRepository,
  DISBURSEMENT_REPOSITORY,
} from '../../domain/interfaces/disbursement-repository.interface';
import { CreateDisbursementDto } from '../dto/create-disbursement.dto';
import { DisbursementMapper } from '../mappers/disbursement.mapper';

@Injectable()
export class CreateDisbursementUseCase {
  constructor(
    @Inject(DISBURSEMENT_REPOSITORY)
    private readonly disbursementRepository: IDisbursementRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(dto: CreateDisbursementDto) {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new ProjectNotFoundException(dto.projectId);
    }

    const disbursement = Disbursement.create(dto);
    const created = await this.disbursementRepository.create(disbursement);
    return DisbursementMapper.toResponse(created);
  }
}
