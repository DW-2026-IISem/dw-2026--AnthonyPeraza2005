import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectAuditResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Revisión de cambios post-lanzamiento' })
  name: string;

  @ApiPropertyOptional({ example: 'Registro de auditoría de cambios del proyecto' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
