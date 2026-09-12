import { Inject, Injectable } from '@nestjs/common';
import { GoalNotFoundException } from '../../domain/exceptions/goal-not-found.exception';
import {
  IGoalRepository,
  GOAL_REPOSITORY,
} from '../../domain/interfaces/goal-repository.interface';

@Injectable()
export class DeleteGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new GoalNotFoundException(id);
    }

    await this.goalRepository.delete(id);
  }
}
