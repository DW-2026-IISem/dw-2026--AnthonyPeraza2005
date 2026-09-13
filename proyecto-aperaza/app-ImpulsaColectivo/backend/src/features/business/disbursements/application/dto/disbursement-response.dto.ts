import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DisbursementResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Primer giro a la campaña' })
  name: string;

  @ApiPropertyOptional({ example: 'Giro de fondos hacia el promotor del proyecto' })
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
