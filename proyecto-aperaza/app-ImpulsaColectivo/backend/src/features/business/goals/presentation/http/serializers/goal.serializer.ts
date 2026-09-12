import { Goal } from '../../../domain/entities/goal.entity';
import { GoalResponseDto } from '../../../application/dto/goal-response.dto';
import { GoalMapper } from '../../../application/mappers/goal.mapper';

export class GoalSerializer {
  static serialize(entity: Goal): GoalResponseDto {
    return GoalMapper.toResponse(entity);
  }
}
