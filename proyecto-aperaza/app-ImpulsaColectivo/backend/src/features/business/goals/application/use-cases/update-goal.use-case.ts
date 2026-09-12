import { Inject, Injectable } from '@nestjs/common';
import { GoalNotFoundException } from '../../domain/exceptions/goal-not-found.exception';
import {
  IGoalRepository,
  GOAL_REPOSITORY,
} from '../../domain/interfaces/goal-repository.interface';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { GoalMapper } from '../mappers/goal.mapper';

@Injectable()
export class UpdateGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
  ) {}

  async execute(id: number, dto: UpdateGoalDto) {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new GoalNotFoundException(id);
    }

    goal.update(dto);
    const updated = await this.goalRepository.update(goal);
    return GoalMapper.toResponse(updated);
  }
}
