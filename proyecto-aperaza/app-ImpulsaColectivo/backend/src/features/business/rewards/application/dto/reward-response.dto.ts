import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RewardResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Camiseta conmemorativa' })
  name: string;

  @ApiPropertyOptional({ example: 'Recompensa entregada a quienes aportan' })
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
