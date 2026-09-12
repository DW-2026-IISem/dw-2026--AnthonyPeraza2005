import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { GOAL_REPOSITORY } from './domain/interfaces/goal-repository.interface';
import { GoalRepository } from './infrastructure/persistence/repositories/goal.repository';
import { CreateGoalUseCase } from './application/use-cases/create-goal.use-case';
import { UpdateGoalUseCase } from './application/use-cases/update-goal.use-case';
import { DeleteGoalUseCase } from './application/use-cases/delete-goal.use-case';
import { GetGoalUseCase } from './application/use-cases/get-goal.use-case';
import { ListGoalsUseCase } from './application/use-cases/list-goals.use-case';
import { GoalsController } from './presentation/http/controllers/goals.controller';

@Module({
  imports: [ProjectsModule],
  controllers: [GoalsController],
  providers: [
    GoalRepository,
    { provide: GOAL_REPOSITORY, useExisting: GoalRepository },
    CreateGoalUseCase,
    UpdateGoalUseCase,
    DeleteGoalUseCase,
    GetGoalUseCase,
    ListGoalsUseCase,
  ],
  exports: [GOAL_REPOSITORY],
})
export class GoalsModule {}
