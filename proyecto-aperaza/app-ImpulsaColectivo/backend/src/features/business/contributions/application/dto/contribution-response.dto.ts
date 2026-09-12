import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContributionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Aporte inicial de lanzamiento' })
  name: string;

  @ApiPropertyOptional({ example: 'Aporte realizado por un aportante a un proyecto' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  projectId: number;

  @ApiProperty({ example: 1 })
  contributorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
