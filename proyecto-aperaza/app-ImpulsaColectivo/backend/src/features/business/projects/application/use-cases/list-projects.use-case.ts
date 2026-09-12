import { Inject, Injectable } from '@nestjs/common';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../domain/interfaces/project-repository.interface';
import { ProjectFilterDto } from '../dto/project-filter.dto';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class ListProjectsUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(filter: ProjectFilterDto) {
    const result = await this.projectRepository.findAll(filter);
    return {
      items: result.items.map((item) => ProjectMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
