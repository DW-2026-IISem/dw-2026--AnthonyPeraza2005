import { Inject, Injectable } from '@nestjs/common';
import { PromoterNotFoundException } from '../../../promoters/domain/exceptions/promoter-not-found.exception';
import {
  IPromoterRepository,
  PROMOTER_REPOSITORY,
} from '../../../promoters/domain/interfaces/promoter-repository.interface';
import { Project } from '../../domain/entities/project.entity';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../domain/interfaces/project-repository.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
    @Inject(PROMOTER_REPOSITORY)
    private readonly promoterRepository: IPromoterRepository,
  ) {}

  async execute(dto: CreateProjectDto) {
    const promoter = await this.promoterRepository.findById(dto.promoterId);
    if (!promoter) {
      throw new PromoterNotFoundException(dto.promoterId);
    }

    const project = Project.create(dto);
    const created = await this.projectRepository.create(project);
    return ProjectMapper.toResponse(created);
  }
}
