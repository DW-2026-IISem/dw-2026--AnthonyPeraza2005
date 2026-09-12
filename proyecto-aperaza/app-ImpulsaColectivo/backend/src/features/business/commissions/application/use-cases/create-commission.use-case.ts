import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../../projects/domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../projects/domain/interfaces/project-repository.interface';
import { Commission } from '../../domain/entities/commission.entity';
import {
  ICommissionRepository,
  COMMISSION_REPOSITORY,
} from '../../domain/interfaces/commission-repository.interface';
import { CreateCommissionDto } from '../dto/create-commission.dto';
import { CommissionMapper } from '../mappers/commission.mapper';

@Injectable()
export class CreateCommissionUseCase {
  constructor(
    @Inject(COMMISSION_REPOSITORY)
    private readonly commissionRepository: ICommissionRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly referenceRepository: IProjectRepository,
  ) {}

  async execute(dto: CreateCommissionDto) {
    const reference = await this.referenceRepository.findById(dto.referenceId);
    if (!reference) {
      throw new ProjectNotFoundException(dto.referenceId);
    }

    const commission = Commission.create(dto);
    const created = await this.commissionRepository.create(commission);
    return CommissionMapper.toResponse(created);
  }
}
