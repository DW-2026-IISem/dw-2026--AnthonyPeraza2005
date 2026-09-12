import { Project } from '../../../domain/entities/project.entity';
import { ProjectResponseDto } from '../../../application/dto/project-response.dto';
import { ProjectMapper } from '../../../application/mappers/project.mapper';

export class ProjectSerializer {
  static serialize(entity: Project): ProjectResponseDto {
    return ProjectMapper.toResponse(entity);
  }
}
