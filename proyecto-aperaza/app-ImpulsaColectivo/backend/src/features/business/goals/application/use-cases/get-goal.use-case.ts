import { Inject, Injectable } from '@nestjs/common';
import { GoalNotFoundException } from '../../domain/exceptions/goal-not-found.exception';
import {
  IGoalRepository,
  GOAL_REPOSITORY,
} from '../../domain/interfaces/goal-repository.interface';
import { GoalMapper } from '../mappers/goal.mapper';

@Injectable()
export class GetGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
  ) {}

  async execute(id: number) {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new GoalNotFoundException(id);
    }

    return GoalMapper.toResponse(goal);
  }
}
