import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePromoterDto {
  @ApiProperty({ example: 'Fundación ImpulsaColectivo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Organización que publica campañas de financiación' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
