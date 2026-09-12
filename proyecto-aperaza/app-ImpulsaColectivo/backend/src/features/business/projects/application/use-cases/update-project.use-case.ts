import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../domain/interfaces/project-repository.interface';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: number, dto: UpdateProjectDto) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundException(id);
    }

    project.update(dto);
    const updated = await this.projectRepository.update(project);
    return ProjectMapper.toResponse(updated);
  }
}
