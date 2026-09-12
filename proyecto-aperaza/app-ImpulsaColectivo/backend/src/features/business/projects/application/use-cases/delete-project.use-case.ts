import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../domain/interfaces/project-repository.interface';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundException(id);
    }

    await this.projectRepository.delete(id);
  }
}
