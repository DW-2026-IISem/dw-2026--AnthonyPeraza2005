import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromoterResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Fundación ImpulsaColectivo' })
  name: string;

  @ApiPropertyOptional({ example: 'Organización que publica campañas de financiación' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
