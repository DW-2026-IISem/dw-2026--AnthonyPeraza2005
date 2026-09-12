import { Inject, Injectable } from '@nestjs/common';
import {
  IGoalRepository,
  GOAL_REPOSITORY,
} from '../../domain/interfaces/goal-repository.interface';
import { GoalFilterDto } from '../dto/goal-filter.dto';
import { GoalMapper } from '../mappers/goal.mapper';

@Injectable()
export class ListGoalsUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
  ) {}

  async execute(filter: GoalFilterDto) {
    const result = await this.goalRepository.findAll(filter);
    return {
      items: result.items.map((item) => GoalMapper.toResponse(item)),
      meta: result.meta,
    };
  }
}
