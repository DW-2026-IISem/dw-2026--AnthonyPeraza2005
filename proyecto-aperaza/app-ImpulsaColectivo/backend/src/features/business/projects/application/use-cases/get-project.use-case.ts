import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../domain/interfaces/project-repository.interface';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class GetProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: number) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundException(id);
    }

    return ProjectMapper.toResponse(project);
  }
}
