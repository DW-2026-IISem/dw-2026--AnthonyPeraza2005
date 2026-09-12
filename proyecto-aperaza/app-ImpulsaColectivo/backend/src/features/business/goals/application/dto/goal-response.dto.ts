import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoalResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Recaudar $10.000.000 antes de diciembre' })
  name: string;

  @ApiPropertyOptional({ example: 'Meta de recaudación de la campaña' })
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
