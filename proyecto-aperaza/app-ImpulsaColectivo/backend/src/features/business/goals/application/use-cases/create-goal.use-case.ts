import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '../../../projects/domain/exceptions/project-not-found.exception';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../projects/domain/interfaces/project-repository.interface';
import { Goal } from '../../domain/entities/goal.entity';
import {
  IGoalRepository,
  GOAL_REPOSITORY,
} from '../../domain/interfaces/goal-repository.interface';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { GoalMapper } from '../mappers/goal.mapper';

@Injectable()
export class CreateGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(dto: CreateGoalDto) {
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new ProjectNotFoundException(dto.projectId);
    }

    const goal = Goal.create(dto);
    const created = await this.goalRepository.create(goal);
    return GoalMapper.toResponse(created);
  }
}
